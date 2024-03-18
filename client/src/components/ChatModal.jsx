import React, { useEffect, useState, useRef } from "react";
import Modal from "react-bootstrap/Modal";
import { BsSend } from "react-icons/bs";
import { messageApi } from "../config/axiosUtils";
import { imgBasePath } from "../utils/Helper";
import { useForm } from "react-hook-form";

const ChatModal = ({
  showChatModal,
  setshowChatModal,
  selectedChatActivity,
  setSelectedChatActivity,
  user,
  token,
  socket,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm();
  const handleCloseSurpriceModal = () => {
    setSelectedChatActivity(null);
    setshowChatModal(false);
  };

  // console.log("selected chat activity", selectedChatActivity);
  const [messagees, setMessages] = useState([]);
  const [chatModalLoading, setChatModalLoading] = useState(false);

  const messagesEndRef = useRef(null); // Ref for the messages container

  // function to fetch the chatmessage by their transaction id
  async function fetchedMessages() {
    try {
      setChatModalLoading(true);
      const res = await messageApi.FetchChatData(token, selectedChatActivity);
      console.log("message data", res);
      if (res.data.length > 0) {
        setMessages(res.data);
        socket.emit("join chat", res.data[0].chatId._id);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setChatModalLoading(false);
    }
  }

  // function to send message
  async function handleSendMessages(formData) {
    try {
      formData["chatId"] = messagees[0].chatId?._id;
      setChatModalLoading(true);
      const res = await messageApi.SendMessage(token, formData);
      if (res.status === 200) {
        setMessages([...messagees, res.data]);
        socket.emit("new message", res.data);
      }
      reset();
    } catch (e) {
      console.log(e);
    } finally {
      setChatModalLoading(false);
    }
  }

  useEffect(() => {
    fetchedMessages();
  }, []);

  useEffect(() => {
    // Scroll to the last message whenever messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messagees]);

  useEffect(() => {
    socket.on("message received", (newMessageReceived) => {
      setMessages((prevMessages) => [...prevMessages, newMessageReceived]);
    });

    return () => {
      socket.off("message received");
    };
  }, [socket]);

  return (
    <div>
      <Modal
        show={showChatModal}
        onHide={handleCloseSurpriceModal}
        id="chat-modal-container"
        centered
      >
        <div className="row">
          <div className="col-md-12">
            <div className="tile messanger-modal-body">
              <h3 className="tile-title">Chat</h3>
              <div className="messanger">
                <div className="messages">
                  {messagees?.map((message) => (
                    <div
                      className={`message ${
                        message.messageSender._id === user._id ? "me" : ""
                      }`}
                      key={message._id}
                    >
                      <img
                        src={`${imgBasePath}/${message?.messageSender?.profileImage}`}
                        alt="loading"
                      />
                      <p className="info">{message?.content}</p>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />{" "}
                  {/* Ref for the messages container */}
                </div>
                <form
                  className="sender"
                  onSubmit={handleSubmit(handleSendMessages)}
                >
                  <input
                    type="text"
                    placeholder="Send Message"
                    autoComplete="off"
                    {...register("message", {
                      required: {
                        value: true,
                        message: "Please Enter Message",
                      },
                    })}
                  />
                  <button
                    className="btn btn-primary"
                    type="submit"
                    disabled={chatModalLoading}
                  >
                    <BsSend />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ChatModal;
