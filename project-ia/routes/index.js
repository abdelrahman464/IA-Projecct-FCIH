const userRoute = require("./userRoute");
const jobRoute = require("./jobRoute");
const applicationRoute = require("./applicationRoute");
const qualificationRoute = require("./qualificationRoute");
const authRoute = require("./authRoute");

const mountRoutes = (app) => {
  // Mount Routes
  app.use("/api/v1/users", userRoute);
  app.use("/api/v1/jobs", jobRoute);
  app.use("/api/v1/applications", applicationRoute);
  app.use("/api/v1/qualifications", qualificationRoute);
  app.use("/api/v1/auth", authRoute);
};
module.exports = mountRoutes;
