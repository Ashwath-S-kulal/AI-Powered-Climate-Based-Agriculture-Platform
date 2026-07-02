import axios from "axios";
import Crop from "../models/cropSensitivity.model.js";
import {
  calculateRisk,
  generateRecommendations,
} from "../utils/riskCalculator.js";

export const riskCalculater = async (req, res) => {
  try {
    const { crop, location } = req.body;

    if (!crop) {
      return res.status(400).json({ error: "crop is required" });
    }

    if (
      !location ||
      typeof location.latitude !== "number" ||
      typeof location.longitude !== "number"
    ) {
      return res.status(400).json({
        error: "Precise location with latitude and longitude is required",
      });
    }

    const { latitude, longitude, placeName = "Unknown location" } = location;

    const cropSensitivity = await Crop.find({}).lean();
    if (!cropSensitivity || cropSensitivity.length === 0) {
      return res.status(500).json({
        error: "Crop sensitivity data not available",
      });
    }

    const weatherRes = await axios.get(
      "https://api.open-meteo.com/v1/forecast",
      {
        params: {
          latitude,
          longitude,
          daily: "temperature_2m_max,precipitation_sum,windspeed_10m_max",
          hourly: "relativehumidity_2m", // Grab hourly humidity to average it
          timezone: "auto",
        },
      }
    );

    if (!weatherRes.data?.daily) {
      return res.status(502).json({ error: "Failed to fetch weather data" });
    }

    // Average the hourly humidity for a daily estimate
    const humArray = weatherRes.data.hourly.relativehumidity_2m;
    const avgHumidity = humArray ? Math.round(humArray.reduce((a, b) => a + b, 0) / humArray.length) : 50;

    const weatherData = {
      temperature: weatherRes.data.daily.temperature_2m_max?.[0] || 25,
      rainfall: weatherRes.data.daily.precipitation_sum?.[0] || 0,
      windSpeed: weatherRes.data.daily.windspeed_10m_max?.[0] || 10,
      humidity: avgHumidity
    };

    const normalizedCrop = crop.toLowerCase().trim();
    const riskData = calculateRisk(weatherData, normalizedCrop, cropSensitivity);
    const recommendations = await generateRecommendations(riskData, weatherData, normalizedCrop);

    return res.status(200).json({
      location: { place: placeName, latitude, longitude },
      weatherData,
      riskData,
      recommendations,
    });

  } catch (error) {
    console.error("Risk Calculator Error:", error.message);

    return res.status(500).json({
      error: "Internal server error while calculating climate risk",
    });
  }
};
