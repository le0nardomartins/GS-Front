import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";

// Função para gerar dados aleatórios
const generateRandomData = (min, max) => {
    return Array.from({ length: 10 }, () => ({
        name: new Date().toLocaleTimeString(),
        value: Math.random() * (max - min) + min
    }));
};

// Componente de gráfico para cada métrica
const MiniChart = ({ title, color, data, domain }) => {
    return (
        <motion.div
            className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-4 border border-gray-700'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
        >
            <h2 className='text-sm font-medium mb-2 text-gray-100'>{title}</h2>
            <div className='h-40'>
                <ResponsiveContainer width={"100%"} height={"100%"}>
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray='3 3' stroke='#4B5563' />
                        <XAxis dataKey={"name"} stroke='#9ca3af' />
                        <YAxis stroke='#9ca3af' domain={domain} />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "rgba(31, 41, 55, 0.8)",
                                borderColor: "#4B5563",
                            }}
                            itemStyle={{ color: "#E5E7EB" }}
                        />
                        <Line
                            type='monotone'
                            dataKey='value'
                            stroke={color}
                            strokeWidth={2}
                            dot={{ fill: color, strokeWidth: 1, r: 3 }}
                            activeDot={{ r: 4, strokeWidth: 1 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
};

const IncubatorMiniCharts = () => {
    const [temperatureData, setTemperatureData] = useState([]);
    const [humidityData, setHumidityData] = useState([]);
    const [currentData, setCurrentData] = useState([]);
    const [oxygenData, setOxygenData] = useState([]);

    useEffect(() => {
        // Atualiza os dados a cada 1 segundo
        const intervalId = setInterval(() => {
            setTemperatureData(generateRandomData(36, 38)); // Temperatura (°C)
            setHumidityData(generateRandomData(50, 60));    // Umidade (%)
            setCurrentData(generateRandomData(0.5, 1.5));   // Corrente (A)
            setOxygenData(generateRandomData(1, 3));        // Fluxo de O² (L/min)
        }, 1000);

        // Limpa o intervalo ao desmontar o componente
        return () => clearInterval(intervalId);
    }, []);

    return (
        <motion.div
            className='grid grid-cols-2 gap-4 mt-4'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
        >
            {/* Gráfico de Temperatura */}
            <MiniChart
                title="Temperatura (°C)"
                color="#FF6347" // Tom alaranjado para temperatura
                data={temperatureData}
                domain={[36, 38]} // Domínio adequado para temperatura
            />

            {/* Gráfico de Umidade */}
            <MiniChart
                title="Umidade (%)"
                color="#1E90FF" // Azul para umidade
                data={humidityData}
                domain={[50, 60]} // Domínio para umidade
            />

            {/* Gráfico de Corrente */}
            <MiniChart
                title="Corrente (A)"
                color="#32CD32" // Verde para corrente
                data={currentData}
                domain={[0.5, 1.5]} // Domínio para corrente
            />

            {/* Gráfico de Fluxo de O² */}
            <MiniChart
                title="Fluxo de O² (L/min)"
                color="#A020F0" // Roxo para fluxo de O²
                data={oxygenData}
                domain={[1, 3]} // Domínio para fluxo de O²
            />
        </motion.div>
    );
};

export default IncubatorMiniCharts;
