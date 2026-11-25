import Prediction from "../models/prediction.model.js";
import FormData from "form-data";
import axios from "axios";
import { InferenceClient } from "@huggingface/inference";
import Groq from "groq-sdk";


const client = new InferenceClient(process.env.HF_TOKEN);


const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });



// //this controller for Localhost Environment
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

//     console.log("Model response:", response.data);

    
//     const prompt = `
//       You are a professional agronomist.

//       The AI identified this crop disease: "${response.prediction}".

//       Provide:
//       1. Brief explanation.
//       2. Three actionable treatment steps.
//       3. AI-generated advice disclaimer.

//       Return ONLY JSON:
//       {
//         "explanation": "",
//         "steps": [],
//         "disclaimer": ""
//       }
//     `;

//     const completion = await groq.chat.completions.create({
//       messages: [{ role: "user", content: prompt }],
//       model: "openai/gpt-oss-120b",
//       response_format: { type: "json_object" },
//     });

//     const advice = JSON.parse(
//       completion.choices[0].message.content
//     );

//     return res.json({
//       ...response.data,
//       advice,
//     });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: error.message });
//   }
// };





// this controller for Online hosted Environment
export const predictDisease = async (req, res) => {
  try {
    const { diseaseName, confidence } = req.body;

    if (!diseaseName) {
      return res.status(400).json({
        error: "Disease name is required",
      });
    }

    const prompt = `
      You are a professional agronomist.

      The AI identified this crop disease: "${diseaseName}".

      Provide:
      1. Brief explanation.
      2. Three actionable treatment steps.
      3. AI-generated advice disclaimer.

      Return ONLY JSON:
      {
        "explanation": "",
        "steps": [],
        "disclaimer": ""
      }
    `;

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "openai/gpt-oss-120b",
      response_format: { type: "json_object" },
    });

    const advice = JSON.parse(
      completion.choices[0].message.content
    );

    return res.json({
      prediction: diseaseName,
      confidence,
      advice,
    });

  } catch (error) {
    console.error("Prediction error:", error);

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
