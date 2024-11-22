import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

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

const RoomContent = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [roomsData, setRoomsData] = useState([]);
    const [filteredRooms, setFilteredRooms] = useState([]);

    // Função para buscar os cômodos do servidor
    const fetchRooms = async () => {
        try {
            const response = await axios.get('http://localhost:4000/api/rooms/get-rooms');
            const data = response.data.data.map((room) => ({
                nome: room.nome || "Cômodo Sem Nome",
                temperatureData: generateRandomData(18, 26),
                humidityData: generateRandomData(30, 60),
                airQualityData: generateRandomData(0, 100),
                lightData: generateRandomData(0, 1000),
            }));

            setRoomsData(data);
            setFilteredRooms(data);
        } catch (error) {
            console.error("Erro ao buscar cômodos:", error);
        }
    };

    useEffect(() => {
        fetchRooms();
        // Atualiza a lista de cômodos a cada 30 segundos sem recarregar a página
        const interval = setInterval(fetchRooms, 30000);

        return () => clearInterval(interval);
    }, []);

    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        const filtered = roomsData.filter((room) =>
            room.nome.toLowerCase().includes(term)
        );
        setFilteredRooms(filtered);
    };

    return (
        <motion.div
            className='w-full bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
        >
            <div className='flex justify-between items-center mb-6'>
                <h2 className='text-xl font-semibold text-gray-100'>Cômodos Monitorados</h2>
                <div className='relative'>
                    <input
                        type='text'
                        placeholder='Procurar Cômodo'
                        className='bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                    <Search className='absolute left-3 top-2.5 text-gray-400' size={18} />
                </div>
            </div>

            <div className='grid grid-cols-1 gap-6'>
                {filteredRooms.map((room, index) => {
                    return (
                        <motion.div
                            key={index}
                            className='bg-gray-700 text-white p-6 rounded-xl shadow-lg transition duration-300 ease-in-out hover:bg-gray-600'
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                        >
                            {/* Nome do cômodo */}
                            <h3 className='text-lg font-bold text-gray-100 mb-6'>
                                {room.nome}
                            </h3>

                            {/* Gráficos */}
                            <div className='grid grid-cols-2 gap-4 mt-4'>
                                <MiniChart
                                    title='Temperatura (°C)'
                                    color='#FF6347'
                                    data={room.temperatureData}
                                    domain={[18, 26]}
                                />
                                <MiniChart
                                    title='Umidade (%)'
                                    color='#1E90FF'
                                    data={room.humidityData}
                                    domain={[30, 60]}
                                />
                                <MiniChart
                                    title='Qualidade do Ar (%)'
                                    color='#FFD700'
                                    data={room.airQualityData}
                                    domain={[0, 100]}
                                />
                                <MiniChart
                                    title='Luminosidade (lx)'
                                    color='#A020F0'
                                    data={room.lightData}
                                    domain={[0, 1000]}
                                />
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </motion.div>
    );
};

export default RoomContent;
