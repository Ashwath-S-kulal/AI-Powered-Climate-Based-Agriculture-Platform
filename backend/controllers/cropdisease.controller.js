import Disease from "../models/cropdisease.model.js";

// GET all diseases
export const getAllDiseases = async (req, res) => {
  try {
    const diseases = await Disease.find();
    res.status(200).json(diseases);
  } catch (error) {
    console.error("Error fetching diseases:", error);
    res.status(500).json({ message: "Server error while fetching diseases." });
  }
};

