import mongoose from "mongoose";

const supplementSchema = new mongoose.Schema({
  disease_name: { type: String, required: true },
  supplement_name: { type: String },
  supplement_image: { type: String },
  buy_link: { type: String },
  index: { type: Number }
});

export default mongoose.model("Supplement", supplementSchema);
