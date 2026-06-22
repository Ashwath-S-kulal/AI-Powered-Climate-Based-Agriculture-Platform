import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const getWeatherAdvice = async (req, res) => {
  const { weatherData } = req.body;
 
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { 
          role: "system", 
          content: `You are an expert agricultural consultant. Analyze the micro-climate data and provide actionable advice.
          You MUST respond with a valid JSON object using exactly this structure:
          {
            "title": "Agronomist Weather Insights",
            "explanation": "A clean, one or two-sentence summary of how the current weather affects crop conditions.",
            "steps": [
              { "action": "Clear actionable instruction step", "type": "Irrigation" },
              { "action": "Another clean structural instruction", "type": "Pest Management" }
            ],
            "disclaimer": "Standard localized disclaimer text about monitoring microclimates."
          }`
        },
        { role: "user", content: JSON.stringify(weatherData) }
      ],
      model: "llama-3.3-70b-versatile",
      // Enforces clean JSON output
      response_format: { type: "json_object" }
    });
    
    // Parse response content safely back to the client
    const rawData = JSON.parse(chatCompletion.choices[0]?.message?.content || "{}");
    res.json(rawData);
  } catch (error) {
    res.status(500).json({ error: "Failed to generate AI insights" });
  }
};