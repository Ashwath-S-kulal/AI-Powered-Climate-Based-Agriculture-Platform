import Crop from "../models/cropInfo.model.js";

export const getAllCrops = async (req, res) => {
  try {
    const crops = await Crop.find({});
    res.json(crops);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getCropByName = async (req, res) => {
  try {
    const name = req.params.name.toLowerCase();

    const crop = await Crop.findOne({
      "Crop Name": { $regex: new RegExp(`^${name}$`, "i") }
    });

    if (!crop) {
      return res.status(404).json({ message: "Crop not found" });
    }

    res.json(crop);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
