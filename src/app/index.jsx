import { useEffect } from 'react';
import { redirect, useNavigate } from 'react-router-dom';

import './index.scss';
import { useAuth } from '../hooks/useAuth';

const Index = () => {
  const isAuth = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!isAuth) {
      navigate('/auth')
    }
  }, [isAuth]);

  if (!isAuth) return <></>;
  
  return (
    <div>Home page</div>
  )
}

export default Index;
