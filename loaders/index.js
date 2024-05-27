import mongooseLoader from "./db.js";

export default async () => {
  //try to create connection
  await mongooseLoader.getConnection();
  console.log("MongoDB Intialized");
};
