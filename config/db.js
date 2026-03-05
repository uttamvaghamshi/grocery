import mongoose from "mongoose";

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Mongodb Connected");
  } catch (err) {
    console.log(err.message);
    process.exit(1);
  }
};

export default connectDb;
