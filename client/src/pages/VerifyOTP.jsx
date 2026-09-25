import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";

const VerifyOTP = () => {
	const [otp, setOtp] = useState("");
	const [message, setMessage] = useState("");
	const [error, setError] = useState("");

	const location = useLocation();
	const navigate = useNavigate();

	const email = location.state?.email;

	const handleSubmit = async (e) => {
		e.preventDefault();

		setMessage("");
		setError("");

		try {
			const response = await api.post(
				"/auth/verify-otp",
				{
					email,
					otp,
				}
			);

			setMessage(response.data.message);

			setTimeout(() => {
				navigate("/login");
			}, 1000);
		} catch (error) {
			setError(
				error.response?.data?.message ||
				"OTP verification failed"
			);
		}
	};

	return (
		<div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center px-4">
			<div className="w-full max-w-md">
				<h1 className="text-3xl font-bold text-center mb-2">
					Verify Email
				</h1>

				<p className="text-zinc-400 text-center mb-8">
					Enter the OTP sent to your email
				</p>

				<form
					onSubmit={handleSubmit}
					className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-5"
				>
					<div>
						<label className="block text-sm mb-2">
							OTP
						</label>

						<input
							type="text"
							inputMode="numeric"
							maxLength="6"
							value={otp}
							onChange={(e) => setOtp(e.target.value)}
							required
							className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-center text-2xl tracking-[0.5em] outline-none focus:border-white"
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
						Verify OTP
					</button>
				</form>
			</div>
		</div>
	);
};

export default VerifyOTP;