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

const CustoEnergiaChart = () => {
    const [custoData, setCustoData] = useState([]);
    const [error, setError] = useState(null); // Estado para erros

    useEffect(() => {
        const fetchCustoData = async () => {
            try {
                const response = await axios.get('http://localhost:4000/api/custos'); // URL correta da API
                if (response.data.success) {
                    // Formata os dados da API para o formato esperado pelo gráfico
                    const formattedData = response.data.data.map((item) => ({
                        name: new Date(item.data).toLocaleDateString('pt-BR'), // Formata a data para o padrão brasileiro
                        custo: parseFloat(item.dados) // Converte o custo para número
                    }));
                    setCustoData(formattedData);
                } else {
                    console.error("Nenhum dado encontrado:", response.data.message);
                    setError(response.data.message); // Define mensagem de erro
                }
            } catch (error) {
                console.error("Erro ao buscar dados da API:", error);
                setError("Erro ao conectar à API."); // Define mensagem de erro
            }
        };

        // Busca os dados ao carregar o componente
        fetchCustoData();

        // Atualiza os dados a cada 1 segundo
        const intervalId = setInterval(fetchCustoData, 1000);

        return () => clearInterval(intervalId); // Limpa o intervalo ao desmontar o componente
    }, []);

    return (
        <motion.div
            className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
        >
            <h2 className='text-lg font-medium mb-4 text-gray-100'>Custo da Energia (R$)</h2>

            {error ? ( // Exibe mensagem de erro, se existir
                <p className="text-red-500">{error}</p>
            ) : (
                <div className='h-80'>
                    <ResponsiveContainer width={"100%"} height={"100%"}>
                        <LineChart data={custoData}>
                            <CartesianGrid strokeDasharray='3 3' stroke='#4B5563' />
                            <XAxis dataKey={"name"} stroke='#9ca3af' />
                            <YAxis stroke='#9ca3af' domain={[0, 30]} /> {/* Ajuste o domínio conforme necessário */}
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "rgba(31, 41, 55, 0.8)",
                                    borderColor: "#4B5563",
                                }}
                                itemStyle={{ color: "#E5E7EB" }}
                            />
                            <Line
                                type='monotone'
                                dataKey='custo'
                                stroke='#32CD32' // Cor da linha em verde
                                strokeWidth={3}
                                dot={{ fill: '#32CD32', strokeWidth: 1, r: 3 }}
                                activeDot={{ r: 4, strokeWidth: 1 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            )}
        </motion.div>
    );
};

export default CustoEnergiaChart;
