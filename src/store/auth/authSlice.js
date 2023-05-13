import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  id: null,
  token: null,
}

export const counterSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, { payload: { id, token } }) => {
      state.id = id;
      state.token = token;
    },
  },
})

export const { login } = counterSlice.actions

export default counterSlice.reducer