import { useEffect, useState } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts";
import { motion } from "framer-motion";
import axios from 'axios';

const ConsumoEnergiaChart = () => {
    const [consumoData, setConsumoData] = useState([]);
    const [error, setError] = useState(null); // Estado para erros

    useEffect(() => {
        const fetchConsumoData = async () => {
            try {
                const response = await axios.get('http://localhost:4000/api/consumo'); // URL da API
                if (response.data.success) {
                    setConsumoData(response.data.data); // Define os dados do gráfico
                } else {
                    console.error("Nenhum dado encontrado:", response.data.message);
                    setError(response.data.message); // Define mensagem de erro
                }
            } catch (err) {
                console.error("Erro ao buscar dados da API:", err);
                setError("Erro ao conectar à API."); // Define mensagem de erro
            }
        };

        // Busca os dados ao carregar o componente
        fetchConsumoData();

        // Atualiza os dados a cada 1 segundo
        const intervalId = setInterval(fetchConsumoData, 1000);

        return () => clearInterval(intervalId); // Limpa o intervalo ao desmontar o componente
    }, []);

    return (
        <motion.div
            className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
        >
            <h2 className='text-lg font-medium mb-4 text-gray-100'>Energia Consumida (kWh)</h2>

            {error ? ( // Exibe mensagem de erro, se existir
                <p className="text-red-500">{error}</p>
            ) : (
                <div className='h-80'>
                    <ResponsiveContainer width={"100%"} height={"100%"}>
                        <LineChart data={consumoData}>
                            <CartesianGrid strokeDasharray='3 3' stroke='#4B5563' />
                            <XAxis dataKey={"name"} stroke='#9ca3af' />
                            <YAxis stroke='#9ca3af' domain={[0, 60]} /> {/* Ajuste o domínio conforme necessário */}
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "rgba(31, 41, 55, 0.8)",
                                    borderColor: "#4B5563",
                                }}
                                itemStyle={{ color: "#E5E7EB" }}
                            />
                            <Line
                                type='monotone'
                                dataKey='consumo'
                                stroke='#4B9CD3' // Cor da linha em azul claro
                                strokeWidth={3}
                                dot={{ fill: '#4B9CD3', strokeWidth: 1, r: 3 }}
                                activeDot={{ r: 4, strokeWidth: 1 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            )}
        </motion.div>
    );
};

export default ConsumoEnergiaChart;
