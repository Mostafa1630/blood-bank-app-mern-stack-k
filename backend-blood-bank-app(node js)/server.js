const express = require("express");
const app = express();
require("dotenv").config();
const colors = require("colors");
const cors = require("cors");
const morgan = require("morgan");
const port = process.env.PORT || 5000;
const dbConnection = require("./config/dbConnection");
const authRoute = require("./routes/authRoute");
const inventoryRoute = require("./routes/inventoryRoute");
const analyticsRoute = require("./routes/analyticsRoute");
const adminRoute = require("./routes/adminRoute");
const globalError = require("./middleware/errorMidllware");

dbConnection();
// Meddleware
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

// Routes
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/inventory", inventoryRoute);
app.use("/api/v1/analytics", analyticsRoute);
app.use("/api/v1/admin", adminRoute);

app.all("*", (req, res, next) => {
  next(new ApiError(`Can't find this route: ${req.originalUrl}`, 400));
});
app.use(globalError);

app.listen(port, () =>
  console.log(`Server is up and running on port : ${port}`.bgBlue.white)
);
