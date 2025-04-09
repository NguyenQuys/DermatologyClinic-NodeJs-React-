import express from "express";
import connectDB from "./config/database.js";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
import route from "./imports/routes.js";
import session from "express-session";
import speakeasy from "speakeasy";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 5000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "src/uploads/"); // lưu trong thư mục uploads/
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_" + file.originalname); // đặt tên file
  },
});

const upload = multer({ storage });

// API upload file
app.post("/upload", upload.single("file"), (req, res) => {
  const filePath = `http://localhost:5000/uploads/${req.file.filename}`;
  res.json({ url: filePath }); // Trả về URL cho FE hiển thị
});

// Cho phép truy cập ảnh tĩnh
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

connectDB();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Session
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }, // 60s
  })
);

// Cookies
app.use(cookieParser());

// Routes
app.use("/api/users", route.userRoutes);
app.use("/api/auth", route.authRoutes);
app.use("/api/comestic", route.comesticRoutes);
app.use("/api/appointment", route.appointmentRoutes);
app.use("/api/medicine", route.medicineRoutes);
app.use("/api/medical_record", route.medical_recordRoutes);
app.use("/api/cart", route.cart);
app.use("/api/treatment", route.treatment);
app.use("/api/order", route.order);
app.use("/api/transaction", route.transaction);
app.use("/api/statistic", route.statistic);
app.use("/api/schedule", route.schedule);
app.use("/api/otp", route.otp);

app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});
