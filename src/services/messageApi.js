import axios from "axios";

const messageApi = ({ id, token, phone, message }) => {
  const URL = `https://api.green-api.com/waInstance${id}/SendMessage/${token}`;

  return ({
    fetchSendMessage: async () => {
      const response = await axios.post(URL, {
        chatId: `${phone}@c.us`,
        message,
      });
      return response.data;
    },
  })
};

export default messageApi;
