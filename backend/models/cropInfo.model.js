import mongoose from "mongoose";

const CropSchema = new mongoose.Schema({
  Crop_Name: { type: String, required: true },
  Image_Description: { type: String },
  Information: { type: String },
  Scientific_Name: { type: String },
  Family_Name: { type: String },
  Major_Global_Producer: { type: String },
  Typical_Height_m: { type: String },
  Yield_Tons_Hectare: { type: String },
  Soil_pH_Range: { type: String },
  Photosynthesis_Type: { type: String },
  Type: { type: String },
  Soil_Needed: { type: String },
  Climate: { type: String },
  Water_Requirement: { type: String },
  Optimal_Temp_C: { type: String },
  Fertilizer_Needed: { type: String },
  Harvest_Time_Days: { type: String },
  Planting_Season: { type: String },
  Harvest_Method: { type: String },
  Market_Value: { type: String },
  Common_Pests: { type: String },
  Disease_Resistance: { type: String },

  Ideal_pH: { type: String },
  Water_Needs: { type: String },
  Sunlight_Requirements: { type: String },
  Soil_Type: { type: String },
}, { strict: false });

export default mongoose.model("CropInfo", CropSchema);
