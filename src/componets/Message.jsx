import clsx from "clsx";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchSendMessage, getMessage } from "../store/message/messageSlice";
import messageApi from "../services/messageApi";

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
  };
  

  const getMasseges = async () => {
    try {
      console.log("Waiting incoming notifications...")
      let response;
      while (response = await axios.get(`https://api.green-api.com/waInstance${id}/receiveNotification/${token}`)) {
        const data = response.data;
        if (data === null) {
          console.log('no msg')
          response = false;
          setTimeout(() => {
            getMasseges()
          }, 1000)
          return
        };
        let webhookBody = data.body;
        switch (webhookBody.typeWebhook) {
          case 'incomingMessageReceived':
            console.log('incomingMessageReceived')
            console.log(webhookBody?.messageData?.textMessageData?.textMessage)
            if (webhookBody?.messageData?.typeMessage === 'textMessage') {
              dispatch(getMessage(webhookBody));
              console.log(webhookBody?.messageData?.textMessageData?.textMessage);
            }
            await axios.delete(`https://api.green-api.com/waInstance${id}/deleteNotification/${token}/${response.data.receiptId}`);
            break;
          case 'stateInstanceChanged':
            console.log('stateInstanceChanged')
            console.log(`stateInstance=${webhookBody.stateInstance}`)
            if (webhookBody?.stateInstance === 'notAuthorized') {
              response = false;
              alert('Необходимо авторизоваться в личном кабинете Green Api');
              return;
            }
            break;
          case 'deviceInfo':
            console.log('deviceInfo')
            console.log(`status=${webhookBody.deviceData}`)
            await axios.delete(`https://api.green-api.com/waInstance${id}/deleteNotification/${token}/${response.data.receiptId}`);
            break;

          default:
            console.log(`type=${webhookBody.typeWebhook}`)
            await axios.delete(`https://api.green-api.com/waInstance${id}/deleteNotification/${token}/${response.data.receiptId}`);
            break;
        }
      }
    } catch (ex) {
      console.error(ex)
    }
  };

  // const receiveNotificationLoop = async () => {
  //   try {
  //     console.log("Waiting incoming notifications...")
  //     let response;
  //     while (response = await messageApi({ id, token }).fetchReceiveNotification()) {
  //       if (response === null) {
  //         console.log('no msg')
  //         response = false;
  //         setTimeout(() => {
  //           receiveNotificationLoop()
  //         }, 1000)
  //         return
  //       };
  //       let webhookBody = response.body;
  //       switch (webhookBody.typeWebhook) {
  //         case 'incomingMessageReceived':
  //           console.log('incomingMessageReceived');
  //           if (webhookBody?.messageData?.typeMessage === 'textMessage') {
  //             dispatch(getMessage(webhookBody));
  //             console.log(webhookBody?.messageData?.textMessageData?.textMessage);
  //           }
  //           await messageApi({ id, token }).fetchDeleteNotification(response.receiptId);
  //           break;
  //         case 'stateInstanceChanged':
  //           console.log('stateInstanceChanged')
  //           console.log(`stateInstance=${webhookBody?.stateInstance}`)
  //           if (webhookBody?.stateInstance) {
  //             response = false;
  //             alert('Необходимо авторизоваться в личном кабинете Green Api')
  //           }
  //           await messageApi({ id, token }).fetchDeleteNotification(response.receiptId);
  //           break;
  //         case 'outgoingMessageStatus':
  //           console.log('outgoingMessageStatus')
  //           console.log(`status=${webhookBody.status}`)
  //           await messageApi({ id, token }).fetchDeleteNotification(response.receiptId);
  //           break;
  //         case 'deviceInfo':
  //           console.log('deviceInfo')
  //           console.log(`status=${webhookBody.deviceData}`)
  //           await messageApi({ id, token }).fetchDeleteNotification(response.receiptId);
  //           break;

  //         default:
  //           console.log(`type=${webhookBody.typeWebhook}`)
  //           await messageApi({ id, token }).fetchDeleteNotification(response.receiptId);
  //           break;
  //       }
  //     }
  //   } catch (err) {
  //     console.log(err)
  //   }
  // };


  useEffect(() => {
    if (phone === '') return
    getMasseges();
  }, [phone])

  if (phone === '') return <span>Выберите чат</span>
  return (
    <div className={style.wrapper}>
      <span>Чат с {phone}</span>
      <div className={style.messages}>
        {[...messages]
          .sort((a, b) => a.date - b.date)
          .map((it, i) => {
            return (
              <div
                key={it.id + i}
                className={clsx({
                  [style["item"]]: true,
                  [style["item--post"]]: it.type === 'post',
                  [style["item--get"]]: it.type === 'get',
                })}
              >
                <span className={style.span}>{it.message}</span>
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
