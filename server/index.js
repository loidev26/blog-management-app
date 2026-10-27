const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const userRoutes = require("./routes/user");
const postRoutes = require("./routes/post");

require("dotenv").config();

const app = express();

mongoose.connect(process.env.MONGODB_STRING);

mongoose.connection.once("open", () => {
  console.log("Now connected to MongoDB Atlas");
  console.log("Database:", mongoose.connection.name);
});

const corsOptions = {
  origin: [
    "http://localhost:8000",
    "http://localhost:5173",
    "https://client-two-orcin-61.vercel.app"
  ],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(cors(corsOption));

app.use("/users", userRoutes);
app.use("/posts", postRoutes);

if (require.main === module) {
  app.listen(process.env.PORT, () =>
    console.log(`Server running at port ${process.env.PORT}`)
  );
}

module.exports = { app, mongoose };
