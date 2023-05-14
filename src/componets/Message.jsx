import axios from "axios";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchSendMessage } from "../store/message/messageSlice";

import style from "./Message.module.scss"

const Message = () => {
  const dispatch = useDispatch();
  const { id, token } = useSelector(state => state.auth);
  const { phone, messages } = useSelector(state => state.message);
  const [message, setMessage] = useState(``);
  const onChangeMessage = (value) => {
    setMessage(value);
  };
  const sendMessageHandler = () => {
    dispatch(fetchSendMessage({
      id,
      token,
      phone,
      message,
    }))
    setMessage('')
    getMasseges()
  };

  const getMasseges = async () => {
    try {

      // Receive WhatsApp notifications. Method waits for 20 sec and returns empty string if there were no sent messages
      console.log("Waiting incoming notifications...")
      let response;
      while (response = await axios.get(`https://api.green-api.com/waInstance1101819972/receiveNotification/62ad67c3a7b1482d9d302b7156a3dcbcabb8d99d73f74872b3`)) {
        const data = response.data;
        if (data === null) {
          console.log('no msg')
          response = false;
          setTimeout(() => {
            getMasseges()
          }, 5000)
          return
        };
        let webhookBody = data.body;
        switch (webhookBody.typeWebhook) {
          case 'incomingMessageReceived':
            console.log('incomingMessageReceived')
            console.log(webhookBody.messageData.textMessageData.textMessage)
            // Confirm WhatsApp message. Each received message must be confirmed to be able to consume next message
            await axios.delete(`https://api.green-api.com/waInstance1101819972/deleteNotification/62ad67c3a7b1482d9d302b7156a3dcbcabb8d99d73f74872b3/${response.data.receiptId}`);
            break;
          case 'stateInstanceChanged':
            console.log('stateInstanceChanged')
            console.log(`stateInstance=${webhookBody.stateInstance}`)
            break;
          case 'stateInstanceChanged':
            console.log('outgoingMessageStatus')
            console.log(`status=${webhookBody.status}`)
            await axios.delete(`https://api.green-api.com/waInstance1101819972/deleteNotification/62ad67c3a7b1482d9d302b7156a3dcbcabb8d99d73f74872b3/${response.data.receiptId}`);
            break;
          case 'deviceInfo':
            console.log('deviceInfo')
            console.log(`status=${webhookBody.deviceData}`)
            break;

          default:
            console.log(`type=${webhookBody.typeWebhook}`)
            await axios.delete(`https://api.green-api.com/waInstance1101819972/deleteNotification/62ad67c3a7b1482d9d302b7156a3dcbcabb8d99d73f74872b3/${response.data.receiptId}`);
            break;
        }
      }
    } catch (ex) {
      console.error(ex)
    }
  };

  return (
    <div className={style.wrapper}>
      <div className={style.messages}>
        {[...messages]
          .sort((a, b) => a.date - b.date)
          .map(it => {
            return (
              <div key={it.id} className={style.item}>
                <span>{it.message}</span>
              </div>
            )
          })
        }
      </div>
      <div>
        <input
          type="text"
          placeholder="Введите ваше сообщение"
          value={message}
          onChange={(e) => onChangeMessage(e.target.value)}
        />
        <button
          onClick={sendMessageHandler}
          disabled={message === ''}
        >
          Отправить сообщение
        </button>
      </div>
    </div>
  )
}

export default Message;
