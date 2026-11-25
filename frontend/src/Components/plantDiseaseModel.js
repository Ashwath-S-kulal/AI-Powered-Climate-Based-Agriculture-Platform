

import { pipeline } from "@huggingface/transformers";

const MODEL_ID =
  "onnx-community/mobilenet_v2_1.0_224-plant-disease-identification-ONNX";

let classifier = null;

export const predictPlantDisease = async (imageFile) => {
  try {
    if (!classifier) {
      classifier = await pipeline(
        "image-classification",
        MODEL_ID
      );
    }

    const imageUrl = URL.createObjectURL(imageFile);

    try {
      const results = await classifier(imageUrl);

      return {
        prediction: results[0].label,
        confidence: results[0].score,
      };
    } finally {
      URL.revokeObjectURL(imageUrl);
    }

  } catch (error) {
    console.error("Model prediction error:", error);
    throw error;
  }
};
