import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../hooks/useAuth";
import { login } from "../../store/auth/authSlice";

import style from "./login.module.scss"


const Login = () => {
  const isAuth = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (isAuth) {
      navigate('/')
    }
  }, [isAuth]);
  const dispatch = useDispatch();
  const DEFAULT_VALUE_INPUT = '';
  const [id, setId] = useState(DEFAULT_VALUE_INPUT);
  const [token, setToken] = useState(DEFAULT_VALUE_INPUT);
  const onChangeId = (value) => {
    setId(value);
  };
  const onChangeToken = (value) => {
    setToken(value);
  };
  const onClickButton = () => {
    dispatch(login({ id, token }));
    setId(DEFAULT_VALUE_INPUT);
    setToken(DEFAULT_VALUE_INPUT);
  };

  if (isAuth) return <></>;

  return (
    <div className={style.wrapper}>
      <input
        type="text"
        placeholder="Введите ваш id"
        value={id}
        onChange={(e) => onChangeId(e.target.value)}
      />
      <input
        type="text"
        placeholder="Введите ваш token"
        value={token}
        onChange={(e) => onChangeToken(e.target.value)}
      />
      <button
        onClick={onClickButton}
        disabled={id === DEFAULT_VALUE_INPUT || token === DEFAULT_VALUE_INPUT}
      >
        Авторизоваться
      </button>
    </div>
  )
};

export default Login;
