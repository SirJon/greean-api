import axios from "axios";

const messageApi = (data) => {
  const { id, token } = data;
  const URL = {
    MESSAGE: {
      POST: `https://api.green-api.com/waInstance${id}/sendMessage/${token}`,
      GET: `https://api.green-api.com/waInstance${id}/receiveNotification/${token}`,
      DELETE: `https://api.green-api.com/waInstance${id}/deleteNotification/${token}/`,
    },
  }

  return ({
    fetchSendMessage: async () => {
      const response = await axios.post(URL.MESSAGE.POST, {
        chatId: `${data?.phone}@c.us`,
        message: data?.message,
      });
      return response.data;
    },
    fetchReceiveNotification: async () => {
      const response = await axios.get(URL.MESSAGE.GET);
      return response.data;
    },
    fetchDeleteNotification: async (notificationId) => {
      const response = await axios.delete(URL.MESSAGE.DELETE + notificationId);
      return response.data;
    },
  })
};

export default messageApi;
