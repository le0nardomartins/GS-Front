import Header from "../components/common/Header";
import ConnectedAccounts from "../components/settings/ConnectedAccounts";
import Notifications from "../components/settings/Notifications";
import Profile from "../components/settings/Profile";
import Security from "../components/settings/Security";

const SettingsPage = () => {
	return (
		<div className="flex flex-col h-screen">
			<Header title='Configurações' />

			<div className="flex-1 overflow-y-auto bg-gray-900">
				<main className='max-w-4xl mx-auto py-6 px-4 lg:px-8'>
					<div className="space-y-6">
						<div className="bg-gray-800 rounded-lg p-6 shadow-lg">
							<Profile />
						</div>
						<div className="bg-gray-800 rounded-lg p-6 shadow-lg">
							<Notifications />
						</div>
						<div className="bg-gray-800 rounded-lg p-6 shadow-lg">
							<Security />
						</div>
						<div className="bg-gray-800 rounded-lg p-6 shadow-lg">
							<ConnectedAccounts />
						</div>
					</div>
				</main>
			</div>
		</div>
	);
};

export default SettingsPage;
