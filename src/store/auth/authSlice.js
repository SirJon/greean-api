import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  id: null,
  token: null,
}

export const authrSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, { payload: { id, token } }) => {
      state.id = id;
      state.token = token;
    },
    logout: (state) => {
      state.id = null;
      state.token = null;
    },
  },
})

export const { login, logout } = authrSlice.actions

export default authrSlice.reducer