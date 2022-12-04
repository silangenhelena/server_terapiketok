import mongoose from 'mongoose';

const announcementSchema = mongoose.Schema({
    message: String,
    duration: Number,
    timestamp: Date,
    status: {
        type: Boolean,
        default: false
    }
})

const AnnouncementForm = mongoose.model('AnnouncementForm', announcementSchema);

export default AnnouncementForm;