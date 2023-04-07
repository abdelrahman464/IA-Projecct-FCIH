const express = require("express");
//middleware
const morgan = require("morgan");
//database
// const dbConnection = require("./config/database");

const mountRoutes = require("./routes");

//error class that i made in utils to handle operational error
const ApiError = require("./utils/apiError");
//GLobal error handling middleware for express
const globalError = require("./middlewares/errorMiddleware");

//env file
const dotenv = require("dotenv");
dotenv.config({ path: "config.env" });

//express app
const app = express();
//middlewares
app.use(express.json());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(process.env.NODE_ENV);
}
// Mount Routes
mountRoutes(app);

//if there is a problem with routes
// catch the wrong routes that i never Mount
app.all("*", (req, res, next) => {
  //create error and send it to error handling middleware
  next(new ApiError(`Cant Find This Route ${req.originalUrl}`, 400));
});

app.use(globalError);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`app running on ${PORT}`);
});
