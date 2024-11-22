import { CircuitBoard, BedSingle, Menu, ChartColumnIncreasing, OctagonAlert, Settings, Users } from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

const SIDEBAR_ITEMS = [
	{
		name: "Dashboard",
		icon:  ChartColumnIncreasing,
		color: "#6366f1",
		href: "/",
	},
	{ name: "Sensores", icon: CircuitBoard, color: "#10B981", href: "/sensores" },
	{ name: "Cômodos", icon: BedSingle, color: "#F97316", href: "/comodo" },
	{ name: "Técnicos", icon: Users, color: "#EC4899", href: "/users" },
	{ name: "Alertas", icon: OctagonAlert, color: "#EF4444", href: "/alertas" },
	{ name: "Settings", icon: Settings, color: "#FFFF", href: "/settings" },

];

const Sidebar = ({ onLogout }) => {
	const navigate = useNavigate();
	const [isSidebarOpen, setIsSidebarOpen] = useState(true);

	const handleLogout = () => {
		onLogout();
		navigate('/');
	};

	return (
		<motion.div
			className={`relative z-10 transition-all duration-300 ease-in-out flex-shrink-0 ${isSidebarOpen ? "w-64" : "w-20"
				}`}
			animate={{ width: isSidebarOpen ? 256 : 80 }}
		>
			<div className='h-full bg-gray-800 bg-opacity-50 backdrop-blur-md p-4 flex flex-col border-r border-gray-700'>
				<motion.button
					whileHover={{ scale: 1.1 }}
					whileTap={{ scale: 0.9 }}
					onClick={() => setIsSidebarOpen(!isSidebarOpen)}
					className='p-2 rounded-full hover:bg-gray-700 transition-colors max-w-fit'
				>
					<Menu size={24} />
				</motion.button>

				<nav className='mt-8 flex-grow'>
					{SIDEBAR_ITEMS.map((item) => (
						<Link key={item.href} to={item.href}>
							<motion.div className='flex items-center p-4 text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors mb-2'>
								<item.icon size={20} style={{ color: item.color, minWidth: "20px" }} />
								<AnimatePresence>
									{isSidebarOpen && (
										<motion.span
											className='ml-4 whitespace-nowrap'
											initial={{ opacity: 0, width: 0 }}
											animate={{ opacity: 1, width: "auto" }}
											exit={{ opacity: 0, width: 0 }}
											transition={{ duration: 0.2, delay: 0.3 }}
										>
											{item.name}
										</motion.span>
									)}
								</AnimatePresence>
							</motion.div>
						</Link>
					))}
				</nav>

				<button
					onClick={handleLogout}
					className="w-full mt-auto p-2 text-left flex items-center gap-2 rounded-lg hover:bg-gray-700 text-red-500"
				>
					<svg 
						xmlns="http://www.w3.org/2000/svg" 
						className="h-5 w-5" 
						viewBox="0 0 20 20" 
						fill="currentColor"
					>
						<path 
							fillRule="evenodd" 
							d="M3 3a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H3zm11 4.414l-4.293 4.293a1 1 0 0 1-1.414-1.414L12.586 6H9a1 1 0 1 1 0-2h6a1 1 0 0 1 1 1v6a1 1 0 1 1-2 0V7.414z" 
							clipRule="evenodd" 
						/>
					</svg>
					Sair
				</button>
			</div>
		</motion.div>
	);
};
export default Sidebar;
