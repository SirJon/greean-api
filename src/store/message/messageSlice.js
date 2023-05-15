import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import messageApi from '../../services/messageApi';

const initialState = {
  dialogs: [],
  phone: '',
  messages: [],
  error: null,
};

const sliceName = 'message';

export const fetchSendMessage = createAsyncThunk(
  `${sliceName}/fetchSendMessage`,
  async (data, thunkAPI) => {
    const response = await messageApi({ ...data }).fetchSendMessage();
    return response
  }
);

export const fetchReceiveNotification = createAsyncThunk(
  `${sliceName}/fetchReceiveNotification`,
  async (data, thunkAPI) => {
    const response = await messageApi({ ...data }).fetchReceiveNotification();
    return response
  }
);

export const fetchDeleteNotification = createAsyncThunk(
  `${sliceName}/fetchDeleteNotification`,
  async (data, thunkAPI) => {
    const response = await messageApi({ ...data }).fetchDeleteNotification();
    return response
  }
);

export const fetchReceiveNotificationLoop = createAsyncThunk(
  `${sliceName}/fetchReceiveNotificationLoop`,
  async (data, thunkAPI) => {
    try {
      let response;
      while (response = await messageApi({ ...data }).fetchReceiveNotification()) {
        console.log(`response`)
        if (response === null) {
          console.log('no msg')
          response = false;
          setTimeout(() => {
            fetchReceiveNotificationLoop(data)
          }, 1000)
          return
        };
        let webhookBody = response.body;
        switch (webhookBody.typeWebhook) {
          case 'incomingMessageReceived':
            console.log('incomingMessageReceived');
            if (webhookBody?.messageData?.typeMessage === 'textMessage') {
              thunkAPI.dispatch(getMessage(webhookBody));
              console.log(webhookBody?.messageData?.textMessageData?.textMessage);
            }
            await messageApi({ ...data }).fetchDeleteNotification(response.receiptId);
            break;
          case 'stateInstanceChanged':
            console.log('stateInstanceChanged')
            console.log(`stateInstance=${webhookBody?.stateInstance}`)
            break;
          case 'outgoingMessageStatus':
            console.log('outgoingMessageStatus')
            console.log(`status=${webhookBody.status}`)
            await messageApi({ ...data }).fetchDeleteNotification(response.receiptId);
            break;
          case 'deviceInfo':
            console.log('deviceInfo')
            console.log(`status=${webhookBody.deviceData}`)
            break;

          default:
            console.log(`type=${webhookBody.typeWebhook}`)
            await messageApi({ ...data }).fetchDeleteNotification(response.receiptId);
            break;
        }
      }
    } catch (err) {
      console.log(err)
    }
  }
);

export const messageSlice = createSlice({
  name: sliceName,
  initialState,
  reducers: {
    addDialog: (state, { payload }) => {
      state.dialogs.push(payload);
    },
    setPhone: (state, { payload }) => {
      state.phone = payload;
    },
    getMessage: (state, { payload }) => {
      if (state.phone === payload?.senderData?.chatId.split("@")[0]) {
        state.messages.push({
          message: payload?.messageData?.textMessageData?.textMessage,
          date: new Date(payload?.timestamp * 1000).toString(),
          type: 'get',
          id: payload.idMessage,
        });
      }
    },
    resetMessage: (state) => {
      state.dialogs = [];
      state.phone = '';
      state.messages = [];
      state.error = null;
    },
    initDialog: (state) => {
      state.messages = [];
      state.error = null;
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
        });
      })

      .addCase(fetchDeleteNotification.rejected, () => {
      })
      .addCase(fetchDeleteNotification.fulfilled, () => {
      })

      .addCase(fetchReceiveNotification.rejected, () => {
      })
      .addCase(fetchReceiveNotification.fulfilled, () => {
      })
  },
});

export const {
  setPhone,
  getMessage,
  addDialog,
  resetMessage,
  initDialog,
} = messageSlice.actions;

export default messageSlice.reducer;
