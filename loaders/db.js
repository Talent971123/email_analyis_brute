import mongoose from "mongoose";
import config from "../config/index.js";

let connection;

export default {
  async getConnection() {
    if (!connection) {
      connection = await mongoose
        .connect(config.databaseURL, { useNewUrlParser: true })
        .catch((e) => {
          console.log(e);
          process.exit(0);
        });
    }
    return connection;
  },
};
