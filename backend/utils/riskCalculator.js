import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });



export function calculateRisk(
  weatherData,
  cropType,
  cropSensitivity,
  extras = {}
) {
  const { temperature, rainfall } = weatherData;
  const { soilType = "medium", irrigation = false } = extras;

  let limits;

  if (Array.isArray(cropSensitivity)) {
    const match = cropSensitivity.find(
      (c) => c.crop.trim().toLowerCase() === cropType.trim().toLowerCase()
    );

    if (match) {
      limits = {
        minRainfall: Number(match.minRainfall),
        maxRainfall: Number(match.maxRainfall),
        maxComfortTemp: Number(match.maxComfortTemp),
      };
    }
  }

  if (!limits) {
    const maize = cropSensitivity.find(
      (c) => c.crop.trim().toLowerCase() === "maize"
    );

    if (maize) {
      console.warn(
        ` Crop data not found for "${cropType}", using maize defaults.`
      );
      limits = {
        minRainfall: Number(maize.minRainfall),
        maxRainfall: Number(maize.maxRainfall),
        maxComfortTemp: Number(maize.maxComfortTemp),
      };
    } else {
      console.warn(
        `⚠️ Crop data missing for "${cropType}" and "maize". Using generic defaults.`
      );
      limits = {
        minRainfall: 50,
        maxRainfall: 200,
        maxComfortTemp: 30,
      };
    }
  }

  // Drought Risk 
  let droughtRisk = 1;
  const rainfallDeficit = limits.minRainfall - rainfall;
  if (rainfallDeficit > 0) droughtRisk = Math.min(5, 2 + rainfallDeficit / 20);
  if (temperature > limits.maxComfortTemp + 2) droughtRisk += 1;
  if (soilType === "sandy") droughtRisk += 1;
  if (irrigation) droughtRisk -= 1;
  droughtRisk = clamp(droughtRisk);

  //  Flood Risk 
  let floodRisk = 1;
  const rainfallExcess = rainfall - limits.maxRainfall;
  if (rainfallExcess > 0) floodRisk = Math.min(5, 2 + rainfallExcess / 30);
  if (soilType === "clay") floodRisk += 1;
  floodRisk = clamp(floodRisk);

  // Heat Risk 
  let heatRisk = 1;
  if (temperature > limits.maxComfortTemp) {
    heatRisk += (temperature - limits.maxComfortTemp) / 2;
  }
  heatRisk = clamp(heatRisk);

  return { droughtRisk, floodRisk, heatRisk };
}

export async function generateRecommendations(riskScores, crop) {
  const { droughtRisk, floodRisk, heatRisk } = riskScores;

  const prompt = `
  You are an expert agricultural consultant. 
  Analyze these risk scores for ${crop} (1-5 scale):
  - Drought Risk: ${droughtRisk}
  - Flood Risk: ${floodRisk}
  - Heat Risk: ${heatRisk}

  Generate 12 actionable, professional recommendations. 
  Return ONLY a valid JSON object with the following schema:
  {
    "recommendations": [
      {
        "category": "Drought" | "Flood" | "Heat" | "General",
        "title": "Short, punchy title",
        "suggestion": "Detailed action plan",
        "priority": "High" | "Medium" | "Low"
      }
    ]
  }
  Do not include any introductory text. Return only the JSON.
`;
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" },
    });

    // Extracting content
    const responseData = JSON.parse(chatCompletion.choices[0].message.content);
    // Assuming the AI returns { "recommendations": [...] }
    return responseData.recommendations || [responseData]; 
  } catch (error) {
    console.error("Groq AI Error:", error);
    // Fallback if AI fails
    return [`Risk analysis complete for ${crop}. Please monitor local weather daily.`];
  }
}

function clamp(num, min = 1, max = 5) {
  return Math.max(min, Math.min(num, max));
}
