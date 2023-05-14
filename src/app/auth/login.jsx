import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../hooks/useAuth";
import { login } from "../../store/auth/authSlice";


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
  const [id, setId] = useState(`1101819972`);
  const [token, setToken] = useState(`62ad67c3a7b1482d9d302b7156a3dcbcabb8d99d73f74872b3`);
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
    <>
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
    </>
  )
};

export default Login;
