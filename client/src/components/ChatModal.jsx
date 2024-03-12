import React from "react";
import Modal from "react-bootstrap/Modal";
import { BsSend } from "react-icons/bs";

const ChatModal = ({ showChatModal, setshowChatModal }) => {
  const handleCloseSurpriceModal = () => {
    setshowChatModal(false);
  };

  return (
    <>
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
                    <div className="message">
                      <img
                        src="https://randomuser.me/api/portraits/men/4.jpg"
                        alt="loading"
                      />
                      <p className="info">
                        Hello there!
                        <br />
                        Good Morning
                      </p>
                    </div>
                    <div className="message me">
                      <img
                        src="https://randomuser.me/api/portraits/men/1.jpg"
                        alt="loading"
                      />
                      <p className="info">
                        Hi
                        <br />
                        Good Morning
                      </p>
                    </div>
                    <div className="message">
                      <img
                        src="https://randomuser.me/api/portraits/men/4.jpg"
                        alt="loading"
                      />
                      <p className="info">How are you?</p>
                    </div>
                    <div className="message me">
                      <img
                        src="https://randomuser.me/api/portraits/men/1.jpg"
                        alt="loading"
                      />
                      <p className="info">I'm Fine.</p>
                    </div>
                  </div>
                  <div className="sender">
                    <input type="text" placeholder="Send Message" />
                    <button className="btn btn-primary" type="button">
                      <BsSend />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
};

export default ChatModal;
