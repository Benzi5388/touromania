import mongoose from "mongoose";

const tourSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    name: {
        type: String
    },
    creator: String,
    tags: [String],
    image: {
        type: String
    },
    videoUrl: String,
    likeCount: {
        type: Number,
        default: 0
    },
    listed: {
        type: Boolean,
        default: true
    }
},
 { timestamps: true })

const TourModel = mongoose.model('Tour', tourSchema);

export default TourModel;