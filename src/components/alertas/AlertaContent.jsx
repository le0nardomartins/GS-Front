import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import axios from "axios";
import moment from "moment";

const AlertaContent = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [alertData, setAlertData] = useState([]);
    const [lastUpdated, setLastUpdated] = useState("");

    // Função para buscar os alertas do servidor
    const fetchAlertData = async () => {
        try {
            const response = await axios.get('http://localhost:4000/api/alert/Alert-data');
            const data = response.data;

            const alerts = [];

            // Verificar se os valores ultrapassam os limites para cada medição
            if (data.temperatura.length > 0) {
                data.temperatura.forEach(item => {
                    if (item.temperatura < 24 || item.temperatura > 26) {
                        alerts.push({
                            label: "Temperatura",
                            value: item.temperatura,
                            unit: "°C",
                            data: item.data ? moment(item.data).format("DD/MM HH:mm") : "N/A",
                            timestamp: item.data,
                            color: "bg-red-800 hover:bg-red-900"
                        });
                    }
                });
            }

            if (data.corrente.length > 0) {
                data.corrente.forEach(item => {
                    if (item.corrente < 0.8 || item.corrente > 1.7) {
                        alerts.push({
                            label: "Corrente",
                            value: item.corrente,
                            unit: "A",
                            data: item.data ? moment(item.data).format("DD/MM HH:mm") : "N/A",
                            timestamp: item.data,
                            color: "bg-yellow-800 hover:bg-yellow-900"
                        });
                    }
                });
            }

            if (data.umidade.length > 0) {
                data.umidade.forEach(item => {
                    if (item.umidade < 53 || item.umidade > 67) {
                        alerts.push({
                            label: "Umidade",
                            value: item.umidade,
                            unit: "%",
                            data: item.data ? moment(item.data).format("DD/MM HH:mm") : "N/A",
                            timestamp: item.data,
                            color: "bg-green-800 hover:bg-green-900"
                        });
                    }
                });
            }

            if (data.fluxo.length > 0) {
                data.fluxo.forEach(item => {
                    if (item.fluxo < 0.35 || item.fluxo > 1) {
                        alerts.push({
                            label: "Fluxo",
                            value: item.fluxo,
                            unit: "m³/h",
                            data: item.data ? moment(item.data).format("DD/MM HH:mm") : "N/A",
                            timestamp: item.data,
                            color: "bg-blue-800 hover:bg-blue-900"
                        });
                    }
                });
            }

            // Ordenar alertas por data (do mais recente para o mais antigo)
            alerts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

            setAlertData(alerts);
            setLastUpdated(moment().format("DD/MM HH:mm"));

        } catch (error) {
            console.error("Erro ao buscar dados de alerta:", error);
        }
    };

    useEffect(() => {
        fetchAlertData();
        const interval = setInterval(() => {
            fetchAlertData();
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
    };

    // Filtrar alertas com base na pesquisa por grandeza ou data
    const filteredAlerts = alertData.filter(alert =>
        alert.label.toLowerCase().includes(searchTerm) ||
        alert.data.toLowerCase().includes(searchTerm)
    );

    return (
        <motion.div
            className='w-full bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
        >
            <div className='flex justify-between items-center mb-6'>
                <h2 className='text-xl font-semibold text-gray-100'>
                    Alertas - Atualizado em {lastUpdated}
                </h2>
                <div className='relative'>
                    <input
                        type='text'
                        placeholder='Procurar por grandeza ou data'
                        className='bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                    <Search className='absolute left-3 top-2.5 text-gray-400' size={18} />
                </div>
            </div>

            {/* Exibir alerta se houver algum parâmetro fora dos limites */}
            {filteredAlerts.length > 0 ? (
                <div className='space-y-4'>
                    {filteredAlerts.map((alert, index) => (
                        <motion.div
                            key={index}
                            className={`${alert.color} text-white p-4 rounded-lg transition-colors duration-300`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <strong>ALERTA:</strong> {alert.label} está fora dos limites seguros:
                            <ul className='mt-2'>
                                <li>
                                    {alert.label}: {alert.value} {alert.unit} (Última atualização: {alert.data})
                                </li>
                            </ul>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-400">Nenhum alerta encontrado</p>
            )}
        </motion.div>
    );
};

export default AlertaContent;
