import Crop from "../models/cropSteps.model.js";

export const getAllCrops = async (req, res) => {
    try {
        const crops = await Crop.find({});
        res.json(crops);
    } catch (error) {
        console.error(error);               
        res.status(500).json({ message: error.message });
    }
};


export const getCropById = async (req, res) => {
    try {
        const cropNum = Number(req.params.cropId);
        if (isNaN(cropNum)) {
            return res.status(400).json({ message: "Invalid crop number" });
        }

        const crop = await Crop.findOne({ num: cropNum });
        if (!crop) return res.status(404).json({ message: "Crop not found" });

        res.json(crop);
    } catch (error) {
        console.error("Error fetching crop:", error);
        res.status(500).json({ message: error.message });
    }
};