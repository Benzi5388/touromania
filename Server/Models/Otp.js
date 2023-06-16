import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  users: {
    type: Number,
    required: true
  }
});

export default mongoose.model("Otp", otpSchema);
