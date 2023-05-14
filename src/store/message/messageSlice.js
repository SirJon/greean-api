import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import messageApi from '../../services/messageApi';

const initialState = {
  phone: '',
  messages: [],
  error: null,
};

export const fetchSendMessage = createAsyncThunk(
  'users/fetchByIdStatus',
  async (data, thunkAPI) => {
    const response = await messageApi({ ...data }).fetchSendMessage();
    return response
  }
);

// export const fetchGetMessage = createAsyncThunk(
//   'users/fetchByIdStatus',
//   async (data, thunkAPI) => {
//     const response = await messageApi({ ...data }).fetchSendMessage();
//     return response
//   }
// );

export const messageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    setPhone: (state, { payload }) => {
      state.phone = payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSendMessage.rejected, (state, action) => {
        state.error = action?.error?.message;
      })
      .addCase(fetchSendMessage.fulfilled, (state, { payload, meta: { arg: { message } } }) => {
        state.error = null;
        state.messages.push({
          message,
          date: new Date().toString(),
          type: 'post',
          id: payload.idMessage,
          read: false
        });
      })
  },
});

export const { setPhone } = messageSlice.actions;

export default messageSlice.reducer;
