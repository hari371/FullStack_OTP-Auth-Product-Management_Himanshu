import { useNavigate } from "react-router-dom";
import Products from "../components/Products";

const Home = () => {
	const navigate = useNavigate();

	const token = localStorage.getItem("token");

	if (!token) {
		navigate("/login");
		return null;
	}

	const handleLogout = () => {
		localStorage.removeItem("token");
		localStorage.removeItem("user");

		navigate("/login");
	};

	return (
		<div>
			<nav className="bg-zinc-900 border-b border-zinc-800 px-6 py-4">
				<div className="max-w-6xl mx-auto flex items-center justify-between">
					<h2 className="text-xl text-white font-bold">
						OTP Auth
					</h2>

					<button
						onClick={handleLogout}
						className="bg-white text-black px-4 py-2 rounded-lg font-medium hover:bg-zinc-200 transition"
					>
						Logout
					</button>
				</div>
			</nav>

			<Products />
		</div>
	);
};

export default Home;