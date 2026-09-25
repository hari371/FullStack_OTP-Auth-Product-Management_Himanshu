const express = require("express");

const {
	addProduct,
	getProducts,
	getProduct,
	updateProduct,
	deleteProduct,
} = require("../controllers/productController");

const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.use(authMiddleware);

router.post("/", upload.single("image"), addProduct);
router.get("/", getProducts);
router.get("/:id", getProduct);
router.put("/:id", upload.single("image"), updateProduct);
router.delete("/:id", deleteProduct);

module.exports = router;