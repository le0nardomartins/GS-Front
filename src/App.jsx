import { Route, Routes, Navigate } from "react-router-dom";
import { useState } from "react";
import Sidebar from "./components/common/Sidebar";

import OverviewPage from "./pages/OverviewPage";
import ProductsPage from "./pages/ComodoPage";
import UsersPage from "./pages/UsersPage";
import SalesPage from "./pages/SensoresPage";
import AlertaPage from "./pages/AlertaPage";
import SettingsPage from "./pages/SettingsPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

function App() {
	const [isLoggedIn, setIsLoggedIn] = useState(false);

	const handleLogin = () => {
		setIsLoggedIn(true);
	};

	const handleLogout = () => {
		setIsLoggedIn(false);
	};

	return (
		<div className='flex h-screen bg-gray-900 text-gray-100'>
			{isLoggedIn && <Sidebar onLogout={handleLogout} />}
			<div className="flex-1">
				<Routes>
					<Route 
						path="/" 
						element={isLoggedIn ? <Navigate to="/overview" /> : <LoginPage onLogin={handleLogin} />} 
					/>
					<Route 
						path="/login" 
						element={isLoggedIn ? <Navigate to="/overview" /> : <LoginPage onLogin={handleLogin} />} 
					/>
					<Route 
						path="/register" 
						element={isLoggedIn ? <Navigate to="/overview" /> : <RegisterPage />} 
					/>
					
					{/* Rotas protegidas */}
					<Route 
						path="/overview" 
						element={isLoggedIn ? <OverviewPage /> : <Navigate to="/login" />} 
					/>
					<Route 
						path="/comodo" 
						element={isLoggedIn ? <ProductsPage /> : <Navigate to="/login" />} 
					/>
					<Route 
						path="/users" 
						element={isLoggedIn ? <UsersPage /> : <Navigate to="/login" />} 
					/>
					<Route 
						path="/sensores" 
						element={isLoggedIn ? <SalesPage /> : <Navigate to="/login" />} 
					/>
					<Route 
						path="/settings" 
						element={isLoggedIn ? <SettingsPage /> : <Navigate to="/login" />} 
					/>
					<Route 
						path="/alertas" 
						element={isLoggedIn ? <AlertaPage /> : <Navigate to="/login" />} 
					/>
				</Routes>
			</div>
		</div>
	);
}

export default App;
