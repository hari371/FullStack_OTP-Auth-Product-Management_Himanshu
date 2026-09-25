import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Register from "./pages/Register";
import VerifyOTP from "./pages/VerifyOTP";
import Login from "./pages/Login";

const App = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/register" element={<Register />} />
				<Route path="/verify-otp" element={<VerifyOTP />} />
				<Route path="/login" element={<Login />} />
			</Routes>
		</BrowserRouter>
	);
};

export default App;