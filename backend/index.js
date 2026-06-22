import express from "express";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import chatbotRoutes from "./routes/chatbot.route.js";
import riskcalculateRoutes from "./routes/riskCalculator.route.js"
import cropReccomender from "./routes/cropRecommender.route.js"
import supplementRoutes from "./routes/supplement.routes.js";
import cropInfoRoutes from "./routes/cropInfo.route.js"
import cropStepRoutes from "./routes/cropStep.route.js";
import cropdiseaseRoutes from "./routes/cropdisease.route.js"
import AdminRoutes from "./routes/admin.routes.js";
import predictionRoutes from "./routes/prediction.route.js";
import weatherAiRoutes from "./routes/weatherai.route.js"
import cors from "cors";

dotenv.config();
const app = express();

app.use(express.json());

app.use(
  cors({
    origin: process.env.FRONTEND_URI,
    credentials: true,
  }),
);

app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/ai", chatbotRoutes);
app.use("/api/calculate", riskcalculateRoutes);
app.use("/api/predictions", predictionRoutes);
app.use("/api/reccomender", cropReccomender);
app.use("/api/supplements", supplementRoutes);
app.use("/api/cropinfo", cropInfoRoutes);
app.use("/api/cropsteps", cropStepRoutes);
app.use("/api/cropdiseases", cropdiseaseRoutes);
app.use("/api/admin", AdminRoutes);
app.use("/api/weather", weatherAiRoutes);


connectDB();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});






// import express from "express";
// import connectDB from "./config/db.js";
// import dotenv from "dotenv";
// import userRoutes from "./routes/user.route.js";
// import authRoutes from "./routes/auth.route.js";
// import chatbotRoutes from "./routes/chatbot.route.js";
// import riskcalculateRoutes from "./routes/riskCalculator.route.js"
// import cropReccomender from "./routes/cropRecommender.route.js"
// import supplementRoutes from "./routes/supplement.routes.js";
// import cropInfoRoutes from "./routes/cropInfo.route.js"
// import cropStepRoutes from "./routes/cropStep.route.js";
// import cropdiseaseRoutes from "./routes/cropdisease.route.js"
// import AdminRoutes from "./routes/admin.routes.js";
// import predictionRoutes from "./routes/prediction.route.js";
// import weatherAiRoutes from "./routes/weatherai.route.js"
// import cors from "cors";

// dotenv.config();
// const app = express();

// connectDB();
// app.use(express.json());

// app.use(
//   cors({
//     origin: process.env.FRONTEND_URI,
//     credentials: true,
//   }),
// );

// app.get("/", (req, res) => {
//   res.send("Backend is running");
// });

// app.use("/api/user", userRoutes);
// app.use("/api/auth", authRoutes);
// app.use("/api/ai", chatbotRoutes);
// app.use("/api/calculate", riskcalculateRoutes);
// app.use("/api/predictions", predictionRoutes);
// app.use("/api/reccomender", cropReccomender);
// app.use("/api/supplements", supplementRoutes);
// app.use("/api/cropinfo", cropInfoRoutes);
// app.use("/api/cropsteps", cropStepRoutes);
// app.use("/api/cropdiseases", cropdiseaseRoutes);
// app.use("/api/admin", AdminRoutes);
// app.use("/api/weather", weatherAiRoutes);


// export default app;
