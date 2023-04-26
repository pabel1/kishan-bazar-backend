// external import
const express = require("express");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const errorMiddleare = require("./src/middlewares/errorMiddleare");
const cloudinary = require("cloudinary").v2;

// internal import
const userRoute = require("./src/routes/userRoute");
const productRoute = require("./src/routes/productRoute");
const orderRoute = require("./src/routes/orderRoute");
const campaignRoute = require("./src/routes/campaignRoute");
const cuponRoute = require("./src/routes/cuponcodeRoute");
const clientRoute = require("./src/routes/clientsaysRoute");
const teamRoute = require("./src/routes/teamRoute");
const discountProductRoute = require("./src/routes/discountProductsRoute");
const aboutusContentRoute = require("./src/routes/aboutusContentRoute");
const shippingRoute = require("./src/routes/shippingRoute");
const visitorRoute = require("./src/routes/visitorRoute");

// environment variable setup
dotenv.config();

// Cloudinary connection
cloudinary.config({
  cloud_name: process.env.CLOUDNARY_CLOUD_NAME,
  api_key: process.env.CLOUDNARY_API_KEY,
  api_secret: process.env.CLOUDNARY_API_SECRET_KEY,
});

// for mongoose deprication warning
mongoose.set("strictQuery", true);
// database connection
mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((data) => {
    console.log(`Database connected with ${data.connection.host}`);
  });

// creating an app
const app = express();
const PORT = process.env.PORT || 4000;

// middlewares
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: true, limit: "100mb" }));
app.use(cookieParser());
app.use(fileUpload());
app.use(cors());

// Handeling Uncaught Exception
process.on("uncaughtException", (err) => {
  console.log(`Error : ${err.message}`);
  console.log("Sutting down the server due to Uncaught Exception");
  process.exit(1);
});

// route setup
app.use("/api/v1", userRoute);
app.use("/api/v1", productRoute);
app.use("/api/v1", orderRoute);
app.use("/api/v1", campaignRoute);
app.use("/api/v1", cuponRoute);
app.use("/api/v1", clientRoute);
app.use("/api/v1", teamRoute);
app.use("/api/v1", discountProductRoute);
app.use("/api/v1", aboutusContentRoute);
app.use("/api/v1", shippingRoute);
app.use("/api/v1", visitorRoute);

// error middleware
app.use(errorMiddleare);

// listening port
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Unhandeled Promise rejection
process.on("unhandledRejection", (err) => {
  console.log(`Error : ${err.message}`);
  console.log("Sutting down the server due to Unhandled Promise Rejection");

  server.close(() => {
    process.exit(1);
  });
});
