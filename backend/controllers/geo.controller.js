import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });



export const explainChartData = async (req, res) => {
    console.log("Received telemetry data for analysis:", req.body);
    try {
        const { chartTitle, telemetryData } = req.body;

        if (!chartTitle || !telemetryData || !Array.isArray(telemetryData)) {
            return res.status(400).json({ error: "Missing required telemetry map payloads." });
        }

        // Limit data payload vectors to 24 hours to prevent token bloating
        const processedTrend = telemetryData.slice(0, 24);

        const systemPrompt = `You are an expert AI Agronomist and Geospatial Analyst integrated into the SmartAgri climate-resilient farming system.
Your job is to interpret 24-hour time-series data from microclimate charts.
Analyze the patterns, identify risks (e.g., water stress, frost, crop burning, transpirational lock), and provide short, direct agricultural recommendations.
Keep your analysis actionable, concise, and formatted in clear bullet points using clean markdown. Do not include introductory filler text.`;

        const userPrompt = `Chart Name: ${chartTitle}
Raw 24-Hour Dataset:
${JSON.stringify(processedTrend, null, 2)}

Provide a quick assessment of what this trend means for crop production and list any immediate preventative measures the farmer should consider.`;

        const response = await groq.chat.completions.create({
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt }
            ],
            model: "llama-3.3-70b-versatile", 
            temperature: 0.3,
            max_tokens: 512,
        });

        return res.status(200).json({ 
            explanation: response.choices[0].message.content 
        });

    } catch (error) {
        console.error("Groq API Execution Error:", error);
        return res.status(500).json({ error: "Failed to generate AI insights from telemetry data." });
    }
};