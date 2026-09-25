const Product = require("../models/Product");
const cloudinary = require("../config/cloudinary");

const uploadToCloudinary = (fileBuffer) => {
	return new Promise((resolve, reject) => {
		const stream = cloudinary.uploader.upload_stream(
			{
				folder: "otp-auth-products",
			},
			(error, result) => {
				if (error) {
					reject(error);
				} else {
					resolve(result);
				}
			}
		);

		stream.end(fileBuffer);
	});
};

const addProduct = async (req, res) => {
	try {
		const { name, description, price, stock } = req.body;

		if (!name || !description || price === undefined || stock === undefined) {
			return res.status(400).json({
				message: "All fields are required",
			});
		}

		if (!req.file) {
			return res.status(400).json({
				message: "Product image is required",
			});
		}

		const result = await uploadToCloudinary(req.file.buffer);

		const product = await Product.create({
			name,
			description,
			price,
			stock,
			image: result.secure_url,
			createdBy: req.user.userId,
		});

		res.status(201).json({
			message: "Product added successfully",
			product,
		});
	} catch (error) {
		console.error(error);

		res.status(500).json({
			message: "Server error",
			error: error.message,
		});
	}
};

const getProducts = async (req, res) => {
	console.log("GET PRODUCTS HIT");

	try {
		const products = await Product.find().populate(
			"createdBy",
			"name email"
		);

		console.log("PRODUCTS:", products);

		res.json({
			products,
		});
	} catch (error) {
		console.error(error);

		res.status(500).json({
			message: "Server error",
			error: error.message,
		});
	}
};

const getProduct = async (req, res) => {
	try {
		const product = await Product.findById(req.params.id);

		if (!product) {
			return res.status(404).json({
				message: "Product not found",
			});
		}

		res.json({
			product,
		});
	} catch (error) {
		res.status(500).json({
			message: "Server error",
			error: error.message,
		});
	}
};

const updateProduct = async (req, res) => {
	try {
		const product = await Product.findById(req.params.id);

		if (!product) {
			return res.status(404).json({
				message: "Product not found",
			});
		}

		product.name = req.body.name || product.name;
		product.description = req.body.description || product.description;
		product.price = req.body.price ?? product.price;
		product.stock = req.body.stock ?? product.stock;

		if (req.file) {
			const result = await uploadToCloudinary(req.file.buffer);

			product.image = result.secure_url;
		}

		await product.save();

		res.json({
			message: "Product updated successfully",
			product,
		});
	} catch (error) {
		console.error(error);

		res.status(500).json({
			message: "Server error",
			error: error.message,
		});
	}
};

const deleteProduct = async (req, res) => {
	try {
		const product = await Product.findById(req.params.id);

		if (!product) {
			return res.status(404).json({
				message: "Product not found",
			});
		}

		const imageUrl = product.image;

		if (imageUrl) {
			const parts = imageUrl.split("/");
			const uploadIndex = parts.indexOf("upload");

			if (uploadIndex !== -1) {
				const publicIdWithExtension = parts
					.slice(uploadIndex + 2)
					.join("/");

				const publicId = publicIdWithExtension.replace(
					/\.[^/.]+$/,
					""
				);

				await cloudinary.uploader.destroy(publicId);
			}
		}

		await Product.findByIdAndDelete(req.params.id);

		res.json({
			message: "Product deleted successfully",
		});
	} catch (error) {
		console.error(error);

		res.status(500).json({
			message: "Server error",
			error: error.message,
		});
	}
};

module.exports = {
	addProduct,
	getProducts,
	getProduct,
	updateProduct,
	deleteProduct,
};