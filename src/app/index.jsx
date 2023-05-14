import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../hooks/useAuth';
import { logout } from '../store/auth/authSlice';
import { setPhone } from '../store/message/messageSlice';

import Message from '../componets/message';


import './index.scss';

const Index = () => {
  const isAuth = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!isAuth) {
      navigate('/auth')
    }
  }, [isAuth]);

  const dispatch = useDispatch();

  const logoutHandler = () => {
    dispatch(logout());
  };

  const { phone } = useSelector(state => state.message);
  const [start, setStart] = useState(false);

  const onChangePhone = (e) => {
    if (typeof Number(e.target.value) !== 'number') return;
    if (e.target.value.includes('+') || e.target.value.includes('-')) return;
    dispatch(setPhone(e.target.value));
  };

  const startDialogHandler = () => {
    setStart(true);
  };

  if (!isAuth) return <></>;

  return (
    <>
      {!start &&
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label htmlFor="messagePhone">Введите номер собеседника</label>
          <input
            id="messagePhone"
            type="text"
            placeholder="79999999999"
            value={phone}
            onChange={(e) => onChangePhone(e)}

          />
          <button
            disabled={phone.length === 0}
            onClick={startDialogHandler}
          >
            Начать общение
          </button>
        </div>
      }
      {start && <Message />}

      <button
        style={{ position: "absolute", top: "2%", right: "2%" }}
        onClick={logoutHandler}
      >
        Выйти из аккаунта
      </button>
    </>
  )
}

export default Index;
