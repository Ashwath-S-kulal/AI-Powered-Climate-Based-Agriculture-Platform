// controllers/supplementController.js
import Supplement from "../models/supplement.model.js";

export const getSupplements = async (req, res) => {
  try {
    const { disease } = req.query;

    let filters = {};
    if (disease && disease !== "") filters.disease_name = disease;

    const supplements = await Supplement.find(filters);
    res.status(200).json({ success: true, data: supplements });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
