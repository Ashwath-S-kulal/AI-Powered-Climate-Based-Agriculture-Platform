import mongoose from 'mongoose';

const cropSchema = new mongoose.Schema({
    name: { type: String, required: true },
    tMin: { type: Number },
    tMax: { type: Number },
    pMin: { type: Number },
    pMax: { type: Number },
    water: { type: String },     
    notes: { type: String },
    imageUrl: { type: String }
}, { timestamps: true }); 

const Crop = mongoose.model('Crop', cropSchema);

export default Crop;
