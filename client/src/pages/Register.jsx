import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

const Register = () => {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
	});

	const [message, setMessage] = useState("");
	const [error, setError] = useState("");

	const navigate = useNavigate();

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		setMessage("");
		setError("");

		try {
			const response = await api.post(
				"/auth/register",
				formData
			);

			setMessage(response.data.message);

			navigate("/verify-otp", {
				state: {
					email: formData.email,
				},
			});
		} catch (error) {
			setError(
				error.response?.data?.message ||
				"Registration failed"
			);
		}
	};

	return (
		<div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center px-4">
			<div className="w-full max-w-md">
				<h1 className="text-3xl font-bold text-center mb-2">
					Create Account
				</h1>

				<p className="text-zinc-400 text-center mb-8">
					Register to continue
				</p>

				<form
					onSubmit={handleSubmit}
					className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-5"
				>
					<div>
						<label className="block text-sm mb-2">
							Name
						</label>

						<input
							type="text"
							name="name"
							value={formData.name}
							onChange={handleChange}
							required
							className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 outline-none focus:border-white"
						/>
					</div>

					<div>
						<label className="block text-sm mb-2">
							Email
						</label>

						<input
							type="email"
							name="email"
							value={formData.email}
							onChange={handleChange}
							required
							className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 outline-none focus:border-white"
						/>
					</div>

					<div>
						<label className="block text-sm mb-2">
							Password
						</label>

						<input
							type="password"
							name="password"
							value={formData.password}
							onChange={handleChange}
							required
							className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 outline-none focus:border-white"
						/>
					</div>

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

					<button
						type="submit"
						className="w-full bg-white text-black font-semibold py-3 rounded-lg hover:bg-zinc-200 transition"
					>
						Register
					</button>
                    <p className="text-center text-sm text-zinc-400">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="text-white hover:underline"
                        >
                            Login
                        </Link>
                    </p>
				</form>
			</div>
		</div>
	);
};

export default Register;