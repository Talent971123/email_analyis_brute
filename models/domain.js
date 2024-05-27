import mongoose from "mongoose";

const DomainSchema = new mongoose.Schema({
  url: {
    type: String,
    default: 0,
  },
  login: {
    type: String,
    default: "",
  },
  password: {
    type: String,
    default: "",
  },
});

const model = mongoose.model("domain", DomainSchema);

export default model;
