const dotenv = require("dotenv");

dotenv.config({
	path: require("path").join(__dirname, "../.env"),
});

const express = require("express");
const cors = require("cors");
const path = require("path");

const connectDB = require("./config/db");

console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS exists:", !!process.env.EMAIL_PASS);

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
	res.json({
		message: "OTP Auth API is running",
	});
});

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});