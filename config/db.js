const { default: mongoose } = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.lwbwczg.mongodb.net/?appName=Cluster0`,
    );
    console.log("MongoDB connecté");
  } catch (err) {
    console.error(err.message);
  }
}

module.exports = connectDB; 