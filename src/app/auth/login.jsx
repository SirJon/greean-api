import { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../../store/auth/authSlice";


const Login = () => {
  const dispatch = useDispatch();
  const DEFAULT_VALUE_INPUT = '';
  const [id, setId] = useState(DEFAULT_VALUE_INPUT);
  const [token, setToken] = useState(DEFAULT_VALUE_INPUT);
  const onChangeId = (value) => {
    setId(value);
  };
  const onChangetoken = (value) => {
    setToken(value);
  };
  const onClickButton = () => {
    dispatch(login({ id, token }));
    setId(DEFAULT_VALUE_INPUT);
    setToken(DEFAULT_VALUE_INPUT);
  };

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
        onChange={(e) => onChangetoken(e.target.value)}
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
