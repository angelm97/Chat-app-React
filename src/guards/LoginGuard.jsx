import React, { useState } from 'react'
import Cookies from 'universal-cookie';

import { Auth } from '../components/Auth';
import { Outlet } from 'react-router-dom';
import { useNavigate, Navigate  } from 'react-router-dom';


const cookies = new Cookies();

const LoginGuard = () => {
    const navigate = useNavigate();

    const [isAuth, setIsAuth] = useState(cookies.get('auth-token'));
  return (isAuth ? <Outlet /> : <Navigate  to="/login" />  );
}

export default LoginGuard
