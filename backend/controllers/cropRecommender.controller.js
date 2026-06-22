import Crop from '../models/croprec.model.js'; 

export const getCropCatalog = async (req, res) => {
    try {
        const crops = await Crop.find({}).lean();

        res.status(200).json(crops);
    } catch (error) {
        console.error("Database fetch error:", error);
        res.status(500).json({ message: "Failed to fetch crop catalog data." });
    }
};
