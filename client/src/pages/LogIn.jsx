import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

const Login = () => {
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});

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

		setError("");

		try {
			const response = await api.post(
				"/auth/login",
				formData
			);

			localStorage.setItem(
				"token",
				response.data.token
			);

			localStorage.setItem(
				"user",
				JSON.stringify(response.data.user)
			);

			navigate("/");
		} catch (error) {
			setError(
				error.response?.data?.message ||
				"Login failed"
			);
		}
	};

	return (
		<div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center px-4">
			<div className="w-full max-w-md">
				<h1 className="text-3xl font-bold text-center mb-2">
					Welcome Back
				</h1>

				<p className="text-zinc-400 text-center mb-8">
					Login to your account
				</p>

				<form
					onSubmit={handleSubmit}
					className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-5"
				>
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

					<button
						type="submit"
						className="w-full bg-white text-black font-semibold py-3 rounded-lg hover:bg-zinc-200 transition"
					>
						Login
					</button>
                    <p className="text-center text-sm text-zinc-400">
                        Don't have an account?{" "}
                        <Link
                            to="/register"
                            className="text-white hover:underline"
                        >
                            Register
                        </Link>
                    </p>
				</form>
			</div>
		</div>
	);
};

export default Login;