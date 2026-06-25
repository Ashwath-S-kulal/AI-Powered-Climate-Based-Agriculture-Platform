import Prediction from "../models/prediction.model.js";
import FormData from "form-data";
import axios from "axios";
import { InferenceClient } from "@huggingface/inference";
import Groq from "groq-sdk";


const client = new InferenceClient(process.env.HF_TOKEN);


const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });


// export const predictDisease =async (req, res) => {
//   try {
//     console.log("Received file:", req.file);
//     if (!req.file) {
//       return res.status(400).json({ error: "No file uploaded" });
//     }

//     const formData = new FormData();
//     formData.append("image", req.file.buffer, {
//       filename: "image.jpg",
//       contentType: req.file.mimetype
//     });
//     const response = await axios.post("http://localhost:5001/predict", formData, {
//       headers: formData.getHeaders(),
//     });

//     res.json(response.data);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: error.message });
//   }
// };

export const predictDisease = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: "No file uploaded",
      });
    }

    const imageBlob = new Blob(
      [req.file.buffer],
      { type: req.file.mimetype }
    );

    const output = await client.imageClassification({
      data: imageBlob,
      model:
        "linkanjarad/mobilenet_v2_1.0_224-plant-disease-identification",
      provider: "hf-inference",
    });

    console.log(output);

    const getDiseaseAdvice = async (diseaseName) => {
      const prompt = `
    You are a professional agronomist. 
    The AI identified the following crop disease: "${diseaseName}".
    Provide a professional response with:
    1. A brief explanation of the disease.
    2. 3 actionable steps to control it (Organic or Chemical).
    3. A clear safety disclaimer that this is AI-generated advice.
    Return ONLY a JSON object: { "explanation": "", "steps": [], "disclaimer": "" }
  `;

      const completion = await groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "llama-3.3-70b-versatile",
        response_format: { type: "json_object" },
      });
      return JSON.parse(completion.choices[0].message.content);
    };

    const advice = await getDiseaseAdvice(output[0]?.label);
    console.log(advice)
    return res.json({
      prediction: output[0]?.label,
      confidence: output[0]?.score,
      advice: advice 
    });

  } catch (error) {
    console.error("HF Error:", error);

    return res.status(500).json({
      error: error.message,
    });
  }
};



export const createPrediction = async (req, res) => {
  try {
    const { id } = req.params;
    const { prediction, confidence, advice } = req.body;

    if (!id) {
      return res.status(400).json({ error: "ID parameter is required" });
    }

    if (!prediction || confidence === undefined) {
      return res.status(400).json({ error: "Prediction and confidence required" });
    }

    const newPrediction = new Prediction({
      userId: id,
      prediction,
      confidence,
      advice
    });

    await newPrediction.save();

    res.status(201).json({
      message: "Prediction saved successfully",
      data: newPrediction
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const getPredictions = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "ID parameter is required" });
    }

    const predictions = await Prediction.find({ userId: id }).sort({ date: -1 });

    res.json(predictions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const deletePrediction = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Prediction.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ error: "Prediction not found" });
    }
    res.json({ message: "Prediction deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const clearPredictionHistory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "User ID is required" });
    }

    // Delete all predictions for this user
    const deleted = await Prediction.deleteMany({ userId: id });

    res.status(200).json({
      message: "Prediction history cleared successfully",
      deletedCount: deleted.deletedCount
    });

  } catch (err) {
    console.error("Clear history error:", err);
    res.status(500).json({ error: err.message });
  }
};
