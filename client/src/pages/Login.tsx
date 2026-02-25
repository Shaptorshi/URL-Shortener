import { useState } from 'react'
import { api } from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await api.post('/auth/loginUser', formData);

    try {
      login(response.data.token, response.data.user);
      navigate('/');
    } catch (error: any) {
      alert(error.response?.data?.message);
    }
  }
  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-900'>
      <form action="" onSubmit={handleSubmit} className='bg-gray-800 p-8 rounded-xl w-96 space-y-4'>
        <h2 className='text-2xl text-white font-bold text-center'>
          Login
        </h2>
        <input
          type="email"
          name="email"
          placeholder='Email Address'
          onChange={handleChange}
          className='w-full p-2 rounded bg-gray-700 text-white'
        />
        <input
          type="password"
          name='password'
          placeholder='Password'
          onChange={handleChange}
          className='w-full p-2 rounded bg-gray-700 text-white'
        />
        <button className='w-full bg-blue-600 p-2 rounded text-white hover:bg-blue-700 hover:cursor-pointer'>
          Login
        </button>
      </form>
    </div>
  )
}

export default Login

