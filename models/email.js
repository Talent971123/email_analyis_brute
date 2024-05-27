import mongoose from "mongoose";

const EmailSchema = new mongoose.Schema({
  email: {
    type: String,
    default: "",
  },
});

const model = mongoose.model("email", EmailSchema);

export default model;
