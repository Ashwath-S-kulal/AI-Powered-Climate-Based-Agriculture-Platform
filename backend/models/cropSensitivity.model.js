import mongoose from 'mongoose';

const cropSensitivitySchema = new mongoose.Schema({
  crop: { type: String, required: true, unique: true },
  minRainfall: { type: Number, required: true },
  maxRainfall: { type: Number, required: true },
  maxComfortTemp: { type: Number, required: true }
}, { timestamps: true }); 

const CropSensitivity = mongoose.model('CropSensitivity', cropSensitivitySchema);

export default CropSensitivity;
