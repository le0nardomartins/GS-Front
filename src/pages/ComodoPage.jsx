import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Header from '../components/common/Header';
import StatCard from '../components/common/StatCard';
import { CircleDollarSign, Lightbulb, Zap } from 'lucide-react';
import RoomContent from "../components/comodo/RoomContent";

const AnotacaoPage = () => {
  const [data, setData] = useState({
    luzesLigadas: 'Carregando...',
    consumo: 'Carregando...',
    custo: 'Carregando...',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/general/latest-data');
        if (response.ok) {
          const latestData = await response.json();
          setData({
            luzesLigadas: latestData.luzesLigadas !== null ? `${latestData.luzesLigadas} Luzes` : 'Sem dados',
            consumo: latestData.consumo !== null ? `${latestData.consumo} kWh` : 'Sem dados',
            custo: latestData.custo !== null ? `R$ ${latestData.custo.toFixed(2)}` : 'Sem dados',
          });
        } else {
          console.error('Erro ao buscar os dados:', response.statusText);
        }
      } catch (error) {
        console.error('Erro ao buscar os dados:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <Header title='Cômodos' />

      <div className="flex-1 overflow-y-auto">
        <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
          {/* STATS */}
          <motion.div
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <StatCard 
              name="Luzes Ligadas" 
              icon={Lightbulb} 
              value={data.luzesLigadas} 
              color="#6366F1" 
            />
            <StatCard 
              name="Consumo Total" 
              icon={Zap} 
              value={data.consumo} 
              color="#FACC15" 
            />
            <StatCard 
              name="Custo Total" 
              icon={CircleDollarSign} 
              value={data.custo} 
              color="#22C55E" 
            />
          </motion.div>
          
          {/* Container para o RoomContent */}
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <RoomContent />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AnotacaoPage;
