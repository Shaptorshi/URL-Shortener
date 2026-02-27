import { useState } from 'react'
import { useNavigate,Link } from 'react-router-dom'
import { api } from '../api/axios'
import { useAuth } from '../context/authContext';


const register = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    })
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const response = await api.post('/auth/registerUser', formData);

        try {
            login(response.data.token, response.data.user);
            navigate('/auth/loginUser');
        } catch (error: any) {
            alert(error.response?.data?.message);
        }
    }
    return (
        <div className='min-h-screen flex items-center justify-center bg-gray-900'>
            <form onSubmit={handleSubmit} className='bg-gray-800 p-8 rounded-xl w-96 space-y-4'>
                <h2 className='text-2xl text-white font-bold text-center'>Register</h2>
                <input
                    type="text"
                    name='name'
                    placeholder='Name'
                    onChange={handleChange}
                    className='w-full p-2 rounded bg-gray-700 text-white outline-0'
                />
                <input
                    type="email"
                    name='email'
                    placeholder='Email Address'
                    onChange={handleChange}
                    className='w-full p-2 rounded bg-gray-700 text-white outline-0'
                />
                <input
                    type="password"
                    name='password'
                    placeholder='Password'
                    onChange={handleChange}
                    className='w-full p-2 rounded bg-gray-700 text-white outline-0'
                />
                <button className='w-full bg-blue-600 p-2 rounded text-white hover:bg-blue-700 hover:cursor-pointer'>
                    Register
                </button>
                <p className='text-blue-500 '>If already registered?<Link to={'/loginUser'} className='hover:cursor-pointer '>Login here</Link></p>
            </form>
        </div>
    )
}

export default register

