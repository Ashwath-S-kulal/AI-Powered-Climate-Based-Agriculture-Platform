import mongoose from "mongoose";

const diseaseSchema = new mongoose.Schema({
  index: { type: Number },
  disease_name: { type: String, required: true },
  description: { type: String },
  possible_steps: { type: String }, 
  image_url: { type: String },
}, { timestamps: true }); 

const Disease = mongoose.model("cropDisease", diseaseSchema);

export default Disease;
