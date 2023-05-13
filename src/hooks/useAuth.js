import { useSelector } from "react-redux";

export const useAuth = () => {
  const { id, token } = useSelector(state => state.auth);
  return !!id && !!token;
}