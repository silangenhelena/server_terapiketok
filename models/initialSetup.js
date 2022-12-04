import mongoose from "mongoose";

const initialSetupSchema = mongoose.Schema({
    max: { type: Number, required: true, default: 20 },
    maxbooking: { type: Number, required: true, default: 1 },
    shifts: { type: Number, default: 3, required: true },
    schedules: [{
        shiftName: String, 
        schedule: String,
        status: { type: Boolean, default: true},
    }],
    id: String
});

export default mongoose.model('InitialSetup', initialSetupSchema);