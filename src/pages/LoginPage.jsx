import { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';

function LoginPage({ onLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch('http://localhost:4000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Erro ao fazer login');
            }

            // Salvar token no localStorage
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            onLogin();
            navigate('/overview');
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className='flex items-center justify-center h-screen w-full bg-gray-900'>
            <div className='bg-gray-800 p-8 rounded-lg shadow-lg w-96'>
                <h2 className='text-2xl mb-6 text-center font-bold text-white'>Login</h2>
                {error && <div className="text-red-500 mb-4 text-center">{error}</div>}
                <form onSubmit={handleSubmit} className='space-y-4'>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-white">Email</label>
                        <input 
                            type='email' 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder='Digite seu email' 
                            className='w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500' 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-white">Senha</label>
                        <input 
                            type='password' 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder='Digite sua senha' 
                            className='w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500' 
                        />
                    </div>
                    <button 
                        type='submit' 
                        className='w-full p-2 bg-blue-600 hover:bg-blue-700 rounded font-medium transition-colors text-white'
                    >
                        Entrar
                    </button>
                </form>
                <p className='mt-4 text-center text-sm text-white'>
                    Não tem uma conta?{' '}
                    <Link to="/register" className='text-blue-400 hover:text-blue-300'>
                        Registre-se
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default LoginPage;