import mongoose from "mongoose";

const tourSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    location: {
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
    likes: {
        type: [String],
        default: []
    },
    listed: {
        type: Boolean,
        default: true
    },
    privacy: {
      type: String,
      enum: ['public', 'private'],
      default: 'public'
    }
},
 { timestamps: true })

const TourModel = mongoose.model('Tour', tourSchema);

export default TourModel;