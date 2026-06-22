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
          daily: "temperature_2m_max,precipitation_sum",
          timezone: "auto",
        },
      }
    );

    if (!weatherRes.data?.daily) {
      return res.status(502).json({
        error: "Failed to fetch weather data",
      });
    }

    const weatherData = {
      temperature: weatherRes.data.daily.temperature_2m_max?.[0],
      rainfall: weatherRes.data.daily.precipitation_sum?.[0],
    };

    const normalizedCrop = crop.toLowerCase().trim();

 const riskScores = calculateRisk(weatherData, normalizedCrop, cropSensitivity);

const recommendations = await generateRecommendations(riskScores, normalizedCrop);

return res.status(200).json({
  location: { place: placeName, latitude, longitude },
  weatherData,
  riskScores,
  recommendations, // This will now contain AI-generated text
});

  } catch (error) {
    console.error("Risk Calculator Error:", error.message);

    return res.status(500).json({
      error: "Internal server error while calculating climate risk",
    });
  }
};
