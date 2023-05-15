import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../hooks/useAuth';
import { logout } from '../store/auth/authSlice';
import { setPhone, addDialog, resetMessage, initDialog } from '../store/message/messageSlice';

import Message from '../componets/Message';


import './global.scss';
import style from "./index.module.scss"

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
    dispatch(resetMessage())
  };


  const [dialog, setDialog] = useState('');
  const { dialogs } = useSelector(state => state.message);

  const onChangePhone = (e) => {
    if (typeof Number(e.target.value) !== 'number') return;
    if (e.target.value.includes('+') || e.target.value.includes('-')) return;
    setDialog(e.target.value)
  };

  const addDialogHandler = () => {
    dispatch(addDialog(dialog))
    setDialog('')
  };

  if (!isAuth) return <></>;

  return (
    <>
      <div className={style.wrapper}>
        <div className={style.users}>
          <label htmlFor="messagePhone">Введите номер собеседника</label>
          <input
            id="messagePhone"
            type="text"
            placeholder="79999999999"
            value={dialog}
            onChange={(e) => onChangePhone(e)}

          />
          <button
            disabled={dialog.length === 0}
            onClick={addDialogHandler}
          >
            Добавить
          </button>
          <div className={style.dialogs}>
            {dialogs.map(it => {
              return (
                <button
                  key={it}
                  onClick={() => {
                    dispatch(setPhone(it));
                    dispatch(initDialog());
                  }}
                >
                  {it}
                </button>
              )
            })}
          </div>
        </div>
        <div className={style.message}>
          <Message />
        </div>
      </div>
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
