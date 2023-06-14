import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Auth } from './components/Auth';
import Cookies from 'universal-cookie';
import Home from './components/Home';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LoginGuard from './guards/LoginGuard';


const cookies = new Cookies();


function App() {
  const [isAuth, setIsAuth] = useState(cookies.get('auth-token'));

  return (
    <BrowserRouter>
      <div className='w-full'>
        <Routes>
          <Route element={<LoginGuard />}>
            <Route path='/' element={<Home />} />
            <Route path='/*' element={<Home />} />
          </Route>
          <Route path='/login' element={<Auth />} />
          
        </Routes>

      </div>

    </BrowserRouter>
  )
}

export default App
