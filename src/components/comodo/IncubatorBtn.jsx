import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const NewIncubatorButton = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [childName, setChildName] = useState(''); // Nome da criança (nome)
  const [sector, setSector] = useState(''); // Setor (setor)
  const [incubatorModel, setIncubatorModel] = useState(''); // Modelo da incubadora (modelo)
  const [responsiblePerson, setResponsiblePerson] = useState(''); // Responsável (responsavel)
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Função para redefinir os valores padrão do formulário
  const resetForm = () => {
    setChildName(''); // Resetar Nome da criança
    setSector(''); // Resetar Setor
    setIncubatorModel(''); // Resetar Modelo da incubadora
    setResponsiblePerson(''); // Resetar Responsável
  };

  // Função para lidar com o envio das informações
  const handleSubmit = async () => {
    if (!childName || !sector || !incubatorModel || !responsiblePerson) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        nome: childName, // Nome da criança
        setor: sector, // Setor
        modelo: incubatorModel, // Modelo da incubadora
        responsavel: responsiblePerson, // Responsável
      };

      // Enviando os dados para a API
      const response = await axios.post("http://localhost:4000/api/user/add-incubator", payload);

      setSuccessMessage(response.data.message || "Incubadora adicionada com sucesso!");
      setShowPopup(false);
      resetForm(); // Resetar o formulário após o envio
    } catch (error) {
      console.error("Erro ao adicionar a incubadora:", error);
      alert("Erro ao adicionar a incubadora. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <motion.button
        className="bg-gray-800 text-white font-bold py-2 px-4 rounded-xl border border-gray-700 transition duration-300 ease-in-out hover:bg-gray-700 w-full"
        onClick={() => setShowPopup(true)}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        style={{ margin: '20px 0' }} // Adicionando margem de 20px ao botão
      >
        + Nova Incubadora
      </motion.button>

      {showPopup && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 backdrop-blur-md flex items-center justify-center z-50">
          <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-xl p-6 max-w-md w-full border border-gray-700">
            <h2 className="text-lg font-bold text-gray-100 mb-4">
              Adicionar Incubadora
            </h2>

            {/* Campo para o Nome da criança */}
            <input
              type="text"
              value={childName}
              onChange={(e) => setChildName(e.target.value)}
              className="bg-gray-200 text-gray-600 py-2 px-4 mb-4 w-full rounded-lg"
              placeholder="Nome da Criança"
              autoComplete="off"
              style={{ color: "#4A5568" }} // Texto cinza escuro
            />

            {/* Campo para o Setor */}
            <input
              type="text"
              value={sector}
              onChange={(e) => setSector(e.target.value)}
              className="bg-gray-200 text-gray-600 py-2 px-4 mb-4 w-full rounded-lg"
              placeholder="Setor"
              autoComplete="off"
              style={{ color: "#4A5568" }} // Texto cinza escuro
            />

            {/* Campo para o Modelo da incubadora */}
            <input
              type="text"
              value={incubatorModel}
              onChange={(e) => setIncubatorModel(e.target.value)}
              className="bg-gray-200 text-gray-600 py-2 px-4 mb-4 w-full rounded-lg"
              placeholder="Modelo da Incubadora"
              autoComplete="off"
              style={{ color: "#4A5568" }} // Texto cinza escuro
            />

            {/* Campo para o Responsável */}
            <input
              type="text"
              value={responsiblePerson}
              onChange={(e) => setResponsiblePerson(e.target.value)}
              className="bg-gray-200 text-gray-600 py-2 px-4 mb-4 w-full rounded-lg"
              placeholder="Responsável"
              autoComplete="off"
              style={{ color: "#4A5568" }} // Texto cinza escuro
            />

            {loading ? (
              <div className="flex justify-center items-center">
                <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4"></div>
              </div>
            ) : (
              <div className="flex justify-end space-x-4">
                <button
                  className="bg-gray-400 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out hover:bg-gray-500"
                  onClick={() => {
                    setShowPopup(false);
                    resetForm(); // Resetar o formulário ao fechar o popup
                  }}
                >
                  Cancelar
                </button>
                <button
                  className="bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out hover:bg-gray-500"
                  onClick={handleSubmit}
                >
                  Adicionar
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {successMessage && (
        <div className="mt-4 text-white font-bold flex justify-center">
          {successMessage}
        </div>
      )}

      {/* Adicionando margem abaixo da mensagem de sucesso */}
      <div style={{ marginBottom: '10px' }}></div>

      {/* Estilos CSS adicionais */}
      <style>{`
        input::placeholder {
          color: #4A5568; /* Placeholder e texto cinza escuro */
        }

        input {
          color: #4A5568; /* Texto dentro da caixa de texto em cinza escuro */
        }

        .loader {
          border-top-color: #3498db;
          animation: spin 1s ease-in-out infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </>
  );
};

export default NewIncubatorButton;
