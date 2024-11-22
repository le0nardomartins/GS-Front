import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";

const SensoresDiv = () => {
  const [data, setData] = useState({
    temperatura: [{ name: "Início", valor: 25 }], // Temperatura começa em 25
    iluminacao: [], // Dados de iluminação
  });
  const [ocupacao, setOcupacao] = useState(1); // Valor do slider de ocupação
  const [lampadas, setLampadas] = useState(0); // Valor do slider de lâmpadas
  const [ultimaTemperatura, setUltimaTemperatura] = useState(25); // Última temperatura registrada

  // Atualiza a temperatura
  const atualizarTemperatura = async () => {
    console.log("Função atualizarTemperatura foi chamada.");
    try {
      const lampadasResponse = await fetch("http://localhost:4000/api/lampadas-ligadas/ultimo");
      const lampadasData = await lampadasResponse.json();
      const lampadasValor = lampadasData.sucesso ? lampadasData.dados : 0;

      const ocupacaoResponse = await fetch("http://localhost:4000/api/ocupacao/ultimo");
      const ocupacaoData = await ocupacaoResponse.json();
      const ocupacaoValor = ocupacaoData.sucesso ? ocupacaoData.dados : 1;

      let chanceSubir = 50; // Base de 50% para subir
      let chanceCair = 50;

      // Regras de ajuste de probabilidade
      if (lampadasValor > 2) {
        chanceSubir += 10;
        chanceCair -= 10;
      }

      if (ocupacaoValor > 3) {
        chanceSubir += 20;
        chanceCair -= 20;
      }

      if (lampadasValor === 0 && ocupacaoValor === 1) {
        chanceCair += 10; // Maior chance de cair
        chanceSubir -= 10;
      }

      console.log(`Probabilidades calculadas:`);
      console.log(`Chance de subir: ${chanceSubir}%`);
      console.log(`Chance de cair: ${chanceCair}%`);

      // Sorteio para determinar se a temperatura sobe ou cai
      const randomChance = Math.random() * 100;
      const variacao = Math.floor(Math.random() * 2) + 1; // Variação de 1 a 2

      let novaTemperatura = ultimaTemperatura;
      if (randomChance <= chanceSubir) {
        novaTemperatura += variacao; // Sobe
        console.log(`A temperatura subiu em ${variacao}.`);
      } else {
        novaTemperatura -= variacao; // Cai
        console.log(`A temperatura caiu em ${variacao}.`);
      }

      // Força os limites de temperatura
      if (novaTemperatura > 35) {
        const ajuste = Math.floor(Math.random() * 2) + 2; // Reduz entre 2 e 3
        novaTemperatura -= ajuste;
        console.log(`Temperatura acima do limite. Reduzindo ${ajuste} para ${novaTemperatura}.`);
      } else if (novaTemperatura < 20) {
        const ajuste = Math.floor(Math.random() * 2) + 2; // Aumenta entre 2 e 3
        novaTemperatura += ajuste;
        console.log(`Temperatura abaixo do limite. Aumentando ${ajuste} para ${novaTemperatura}.`);
      }

      // Atualiza o estado com a nova temperatura
      setUltimaTemperatura(novaTemperatura);
      setData((prevData) => ({
        ...prevData,
        temperatura: [
          ...prevData.temperatura,
          { name: `Leitura ${prevData.temperatura.length + 1}`, valor: novaTemperatura },
        ],
      }));

      // Salva a nova temperatura no banco de dados
      await fetch("http://localhost:4000/api/temperatura", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ valor: novaTemperatura }),
      });
    } catch (error) {
      console.error("Erro ao atualizar temperatura:", error.message);
    }
  };

  // Atualiza os dados de iluminação
  const atualizarIluminacao = async () => {
    try {
      // Calcula e salva iluminação com base no número de lâmpadas
      await fetch("http://localhost:4000/api/iluminacao", {
        method: "POST",
      });

      // Busca os dados atualizados de iluminação
      const response = await fetch("http://localhost:4000/api/iluminacao");
      const iluminacaoData = await response.json();

      setData((prevData) => ({
        ...prevData,
        iluminacao: iluminacaoData,
      }));
    } catch (error) {
      console.error("Erro ao atualizar iluminação:", error.message);
    }
  };

  useEffect(() => {
    // Atualiza a temperatura a cada 5 segundos
    const interval = setInterval(atualizarTemperatura, 5000);
    return () => clearInterval(interval);
  }, [ultimaTemperatura]);

  useEffect(() => {
    // Atualiza a iluminação a cada 1 segundo
    const interval = setInterval(atualizarIluminacao, 5000);
    return () => clearInterval(interval);
  }, [lampadas]);

  const renderChart = (title, dataKey, chartData, color) => (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 flex flex-col items-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <h2 className="text-lg font-medium mb-4 text-gray-100">{title}</h2>
      <div className="h-60 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
            <XAxis dataKey="name" stroke="#9ca3af" tick={{ fill: "#9ca3af" }} />
            <YAxis
              stroke="#9ca3af"
              tick={{ fill: "#9ca3af" }}
              domain={[0, 100]} // Ajuste o domínio conforme necessário
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(31, 41, 55, 0.8)",
                borderColor: "#4B5563",
              }}
              itemStyle={{ color: "#E5E7EB" }}
            />
            <Line
              type="monotone"
              dataKey={dataKey}
              stroke={color}
              strokeWidth={3}
              dot={{ fill: color, strokeWidth: 1, r: 3 }}
              activeDot={{ r: 4, strokeWidth: 1 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );

  const renderSlider = (title, value, setValue, handleEnviar) => (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 flex flex-col items-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <h2 className="text-lg font-medium mb-4 text-gray-100">{title}</h2>
      <div className="flex flex-col items-center w-full">
        <input
          type="range"
          min={title === "Lâmpadas Ligadas" ? 0 : 1}
          max="10"
          value={value}
          onChange={(e) => setValue(parseInt(e.target.value, 10))}
          className="w-full slider"
        />
        <span className="text-lg mt-2">Valor: {value}</span>
        <button
          onClick={handleEnviar}
          className="mt-4 bg-green-500 px-4 py-2 rounded-md text-white transition-colors duration-300 hover:bg-green-400"
        >
          Enviar
        </button>
      </div>
    </motion.div>
  );

  return (
    <div className="p-5 bg-gray-900 rounded-lg text-white grid grid-cols-2 gap-4">
      {renderChart("Temperatura", "valor", data.temperatura, "#FF6347")}
      {renderSlider("Ocupação", ocupacao, setOcupacao, async () => {
        await fetch("http://localhost:4000/api/ocupacao", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ valor: ocupacao }),
        });
      })}
      {renderChart("Iluminação", "valor", data.iluminacao, "#FFD700")}
      {renderSlider("Lâmpadas Ligadas", lampadas, setLampadas, async () => {
        await fetch("http://localhost:4000/api/lampadas-ligadas", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ valor: lampadas }),
        });
      })}
    </div>
  );
};

export default SensoresDiv;
