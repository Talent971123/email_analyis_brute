import mongoose from "mongoose";

const CryptoSchema = new mongoose.Schema({
  url: {
    type: String,
    default: "",
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

const model = mongoose.model("crypto", CryptoSchema);

export default model;
