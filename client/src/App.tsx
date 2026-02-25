import {BrowserRouter as Router,Routes,Route} from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Register from './pages/register'
import Login from './pages/Login'


export default function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Dashboard/>}></Route>
        <Route path='/registerUser' element={<Register/>}></Route>
        <Route path='/loginUser' element={<Login/>}></Route>
        <Route></Route>
      </Routes>
    </Router>
  )
}
