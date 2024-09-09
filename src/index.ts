import express from "express";
import advertiseRoutes from "./modules/advertise/routes/advertise-routes";
import userRoutes from "./modules/user/routes/user-routes";
import eventRoutes from "./modules/event/routes/event-routes";
import subscriptionRoutes from "./modules/subscription/routes/subscription-routes";
import meetingRoutes from "./modules/meeting/routes/meeting-routes";
import expenditureTypeRoutes from "./modules/expenditureType/routes/expenditureType-routes";
import expenditureRoutes from "./modules/expenditure/routes/expenditure-routes";
import dependentsRoutes from "./modules/dependents/routes/dependents-routes";
import bookRoutes from "./modules/books/routes/book-routes";
import incomeRoutes from "./modules/income/routes/income-routes";
import cors from "cors";
import path from "path";

const application = express();

application.use(express.json());
application.use(
  cors({
    origin: "*",
  }),
);

application.use("/user", userRoutes);
application.use("/event", eventRoutes);
application.use("/subscription", subscriptionRoutes);
application.use("/meeting", meetingRoutes);
application.use("/advertise", advertiseRoutes);
application.use("/book", bookRoutes);
application.use(
  "/images",
  express.static(path.join(__dirname, "assets", "images")),
);
application.use("/expenditure", expenditureRoutes);
application.use("/expenditureType", expenditureTypeRoutes);
application.use("/dependents", dependentsRoutes);
application.use("/income", incomeRoutes);

application.get("/", (req, res) => {
  return res.send("Esta funcionando");
});


application.use((err: any, req: any, res: any, next: any) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Internal server error",
    message: err.message,
  });
});

application.listen(process.env.PORT ?? 3344, () => {
  console.log(`Server is running on port ${process.env.PORT ?? 3344}`);
});
