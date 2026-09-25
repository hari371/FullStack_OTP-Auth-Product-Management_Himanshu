import { useEffect, useState } from "react";
import api from "../services/api";

const Products = () => {
	const [products, setProducts] = useState([]);

	const [formData, setFormData] = useState({
		name: "",
		description: "",
		price: "",
		stock: "",
	});

	const [image, setImage] = useState(null);
	const [editingId, setEditingId] = useState(null);
	const [error, setError] = useState("");
	const [message, setMessage] = useState("");

	const token = localStorage.getItem("token");

	const fetchProducts = async () => {
		try {
			const response = await api.get("/products", {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			setProducts(response.data.products);
		} catch (error) {
			setError(
				error.response?.data?.message ||
				"Failed to fetch products"
			);
		}
	};

	useEffect(() => {
		fetchProducts();
	}, []);

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handleImageChange = (e) => {
		setImage(e.target.files[0]);
	};

	const resetForm = () => {
		setFormData({
			name: "",
			description: "",
			price: "",
			stock: "",
		});

		setImage(null);
		setEditingId(null);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		setError("");
		setMessage("");

		const data = new FormData();

		data.append("name", formData.name);
		data.append("description", formData.description);
		data.append("price", formData.price);
		data.append("stock", formData.stock);

		if (image) {
			data.append("image", image);
		}

		try {
			if (editingId) {
				await api.put(
					`/products/${editingId}`,
					data,
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				);

				setMessage("Product updated successfully");
			} else {
				if (!image) {
					setError("Product image is required");
					return;
				}

				await api.post(
					"/products",
					data,
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				);

				setMessage("Product added successfully");
			}

			resetForm();
			fetchProducts();
		} catch (error) {
			setError(
				error.response?.data?.message ||
				"Something went wrong"
			);
		}
	};

	const handleEdit = (product) => {
		setEditingId(product._id);

		setFormData({
			name: product.name,
			description: product.description,
			price: product.price,
			stock: product.stock,
		});

		setImage(null);

		window.scrollTo({
			top: 0,
			behavior: "smooth",
		});
	};

	const handleDelete = async (id) => {
		try {
			await api.delete(`/products/${id}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			setMessage("Product deleted successfully");

			fetchProducts();
		} catch (error) {
			setError(
				error.response?.data?.message ||
				"Failed to delete product"
			);
		}
	};

	return (
		<div className="min-h-screen bg-zinc-950 text-white px-4 py-10">
			<div className="max-w-6xl mx-auto">
				<h1 className="text-4xl font-bold text-center mb-10">
					Product Management
				</h1>

				<form
					onSubmit={handleSubmit}
					className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-w-xl mx-auto mb-12 space-y-5"
				>
					<h2 className="text-2xl font-semibold">
						{editingId ? "Edit Product" : "Add Product"}
					</h2>

					<input
						type="text"
						name="name"
						placeholder="Product name"
						value={formData.name}
						onChange={handleChange}
						required
						className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 outline-none"
					/>

					<textarea
						name="description"
						placeholder="Description"
						value={formData.description}
						onChange={handleChange}
						required
						className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 outline-none"
						rows="3"
					/>

					<input
						type="number"
						name="price"
						placeholder="Price"
						value={formData.price}
						onChange={handleChange}
						required
						className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 outline-none"
					/>

					<input
						type="number"
						name="stock"
						placeholder="Stock"
						value={formData.stock}
						onChange={handleChange}
						required
						className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 outline-none"
					/>

					<input
						type="file"
						accept="image/jpeg,image/jpg,image/png,image/webp"
						onChange={handleImageChange}
						className="w-full text-sm"
					/>

					{error && (
						<p className="text-red-400 text-sm">
							{error}
						</p>
					)}

					{message && (
						<p className="text-green-400 text-sm">
							{message}
						</p>
					)}

					<div className="flex gap-3">
						<button
							type="submit"
							className="flex-1 bg-white text-black font-semibold py-3 rounded-lg hover:bg-zinc-200 transition"
						>
							{editingId ? "Update Product" : "Add Product"}
						</button>

						{editingId && (
							<button
								type="button"
								onClick={resetForm}
								className="px-5 bg-zinc-700 rounded-lg hover:bg-zinc-600 transition"
							>
								Cancel
							</button>
						)}
					</div>
				</form>

				{products.length === 0 ? (
					<p className="text-center text-zinc-400">
						No products found.
					</p>
				) : (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
						{products.map((product) => (
							<div
								key={product._id}
								className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden"
							>
								<img
									src={product.image}
									alt={product.name}
									className="w-full h-56 object-cover"
								/>

								<div className="p-5">
									<h3 className="text-xl font-semibold">
										{product.name}
									</h3>

									<p className="text-zinc-400 mt-2">
										{product.description}
									</p>

									<p className="text-lg font-semibold mt-4">
										₹{product.price}
									</p>

									<p className="text-zinc-400">
										Stock: {product.stock}
									</p>

									<div className="flex gap-3 mt-5">
										<button
											onClick={() =>
												handleEdit(product)
											}
											className="flex-1 bg-white text-black py-2 rounded-lg font-medium hover:bg-zinc-200 transition"
										>
											Edit
										</button>

										<button
											onClick={() =>
												handleDelete(product._id)
											}
											className="flex-1 bg-red-600 py-2 rounded-lg font-medium hover:bg-red-700 transition"
										>
											Delete
										</button>
									</div>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default Products;