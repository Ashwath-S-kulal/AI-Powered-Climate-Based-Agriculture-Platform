import Groq from "groq-sdk";
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export function calculateRisk(weatherData, cropType, cropSensitivity, extras = {}) {
  const { temperature = 25, rainfall = 0, humidity = 50, windSpeed = 10 } = weatherData;
  const { soilMoisture = 40, soilType = "medium", cropStage = "Vegetative" } = extras;

  let limits = getCropLimits(cropType, cropSensitivity);

  // --- Step 2: Risk Modules (0-100 Scale) ---

  // Heat Risk
  let heatRisk = 0;
  if (temperature > limits.maxComfortTemp) {
    heatRisk = Math.min(100, (temperature - limits.maxComfortTemp) * 15);
  }

  // Rain/Flood Risk
  let floodRisk = 0;
  const rainExcess = rainfall - limits.maxRainfall;
  if (rainExcess > 0) floodRisk = Math.min(100, (rainExcess / limits.maxRainfall) * 100);

  // Drought Risk (combines low rain and low soil moisture)
  let droughtRisk = 0;
  const rainDeficit = limits.minRainfall - rainfall;
  if (rainDeficit > 0 || soilMoisture < 30) {
    droughtRisk = Math.min(100, ((rainDeficit > 0 ? 40 : 0) + (30 - soilMoisture) * 2));
  }

  // Pest Risk (High temp + High humidity creates breeding grounds)
  let pestRisk = (temperature > 25 && humidity > 70) ? Math.min(100, humidity) : 20;

  // Disease Risk
  let diseaseRisk = (humidity > 80 && rainfall > 10) ? 85 : 30;

  // Soil Stress
  let soilStress = soilMoisture < 20 ? 90 : (soilMoisture > 80 ? 70 : 10);

  // --- Step 3: Weighted Score ---
  const weights = {
    heat: 0.20,
    rain: 0.20,
    flood: 0.10,
    drought: 0.20,
    pest: 0.10,
    disease: 0.10,
    soil: 0.10,
  };

  const overallScore = Math.round(
    (heatRisk * weights.heat) +
    (floodRisk * weights.flood) + // Using flood risk for rain/flood factors
    (floodRisk * weights.rain) +
    (droughtRisk * weights.drought) +
    (pestRisk * weights.pest) +
    (diseaseRisk * weights.disease) +
    (soilStress * weights.soil)
  );

  // --- Step 4: Risk Levels ---
  let riskLevel = "Very Low";
  if (overallScore > 80) riskLevel = "Extreme";
  else if (overallScore > 60) riskLevel = "High";
  else if (overallScore > 40) riskLevel = "Moderate";
  else if (overallScore > 20) riskLevel = "Low";

  // --- Find Top 3 Causes ---
  const allRisks = [
    { name: "Heat", value: heatRisk, trigger: "High temperatures" },
    { name: "Drought", value: droughtRisk, trigger: "Low moisture/rainfall" },
    { name: "Flood", value: floodRisk, trigger: "Excessive rainfall" },
    { name: "Pests", value: pestRisk, trigger: "Favorable pest conditions" },
    { name: "Disease", value: diseaseRisk, trigger: "High humidity/moisture" },
    { name: "Soil Stress", value: soilStress, trigger: "Poor soil conditions" }
  ];

  const topCauses = allRisks
    .sort((a, b) => b.value - a.value)
    .slice(0, 3)
    .filter(risk => risk.value > 30); // Only include if it's actually a risk

  return {
    overallScore,
    riskLevel,
    details: allRisks.reduce((acc, curr) => ({ ...acc, [curr.name]: Math.round(curr.value) }), {}),
    topCauses
  };
}

// Helper to find limits
function getCropLimits(cropType, cropSensitivity) {
  if (Array.isArray(cropSensitivity)) {
    const match = cropSensitivity.find(c => c.crop.trim().toLowerCase() === cropType.trim().toLowerCase());
    if (match) return { minRainfall: Number(match.minRainfall), maxRainfall: Number(match.maxRainfall), maxComfortTemp: Number(match.maxComfortTemp) };
  }
  // Default fallback
  return { minRainfall: 50, maxRainfall: 200, maxComfortTemp: 30 };
}

// --- Step 6: Refined Groq Prompt ---
// --- Step 6: Refined Groq Prompt ---
export async function generateRecommendations(riskData, weatherData, crop, extras = {}) {
  const { overallScore, riskLevel, topCauses } = riskData;
  const { temperature, humidity, rainfall, windSpeed } = weatherData;

  const topRisksList = topCauses.map(c => `- ${c.name}`).join("\n");

  const prompt = `
You are an expert agronomist providing actionable advice to farmers. Keep the response highly practical, detailed, and comprehensive.

Today's data:
Crop: ${crop}
Stage: ${extras.cropStage || "Vegetative"}

Weather:
Temperature: ${temperature}°C
Humidity: ${humidity}%
Rainfall: ${rainfall} mm
Wind: ${windSpeed} km/h

Risk Score: ${overallScore}/100
Risk Level: ${riskLevel}

Top Risks:
${topRisksList}

Return ONLY a valid JSON object matching this exact schema:
{
  "summary": "A detailed 3 to 4 sentence summary explaining the current risk environment, the specific impact of today's weather on the crop at its current stage, and the overall urgency for the farmer.",
  "actions": [
    "Short immediate action 1",
    "Short immediate action 2",
    "Short immediate action 3",
    "Short immediate action 4"
  ],
  "detailedRecommendations": [
    // YOU MUST GENERATE AT LEAST 4 TO 6 DETAILED RECOMMENDATIONS covering different categories (e.g., Water Management, Pest Control, Disease Management, Fertilizer/Nutrient, Soil Health).
    {
      "title": "Short action title (e.g., Adjust Irrigation)",
      "suggestion": "Highly detailed, step-by-step instruction for what the farmer must do today based on the weather and risks. Explain both WHY this is necessary and HOW to do it.",
      "category": "Water Management", 
      "priority": "High" 
    },
    {
      "title": "Pest & Disease Monitoring",
      "suggestion": "Specific pests or diseases to look out for given the current humidity and temperature, and specific preventative measures or sprays to use.",
      "category": "Pest Control",
      "priority": "Medium"
    }
  ]
}`;

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" },
    });
    return JSON.parse(chatCompletion.choices[0].message.content);
  } catch (error) {
    console.error("Groq AI Error:", error);
    return {
      summary: "Risk analysis complete but detailed AI recommendations could not be fetched at this time. Please closely monitor local weather daily and inspect crops for early signs of stress.",
      actions: ["Monitor local weather forecasts", "Perform visual crop inspection"],
      detailedRecommendations: []
    };
  }
}