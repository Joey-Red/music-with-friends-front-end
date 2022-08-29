import React, { useState, useEffect, useRef } from "react";
import LoginButton from "./LoginButton";
import io from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
import ScrollToBottom from "react-scroll-to-bottom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faCode } from "@fortawesome/free-solid-svg-icons";
const socket = io.connect("http://localhost:3001");

function Chat(props) {
  let {
    setIsLoggedIn,
    isLoggedIn,
    firstName,
    setFirstName,
    email,
    setEmail,
    userId,
    setUserId,
    chatHidden,
    setChatHidden,
    anonMode,
    setAnonMode,
  } = props;
  const [message, setMessage] = useState("");
  const [messagesRecieved, setMessagesRecieved] = useState([]);
  const [chatHeight, setChatHeight] = useState("519px");
  const chatActiveRef = useRef(null);

  useEffect(() => {
    socket.on("recieve_message", (data) => {
      setMessagesRecieved((list) => [...list, data]);
    });
  }, [socket]);

  useEffect(() => {
    if (messagesRecieved.length > 0) {
      autoScroll();
    }
  }, [messagesRecieved]);

  useEffect(() => {
    if (document.activeElement === chatActiveRef.current) {
      const listener = (event) => {
        if (event.code === "Enter" || event.code === "NumpadEnter") {
          event.preventDefault();
          sendMessage();
        }
      };
      document.addEventListener("keydown", listener);
      return () => {
        document.removeEventListener("keydown", listener);
      };
    } else {
    }
  }, [message]);

  let hideChat = () => {
    chatHidden ? setChatHidden(false) : setChatHidden(true);
  };

  const autoScrollRef = useRef(null);
  const autoScroll = () => {
    autoScrollRef.current.scrollIntoView({
      behavior: "smooth",
    });
  };

  let tstyles = {
    position: "relative",
    outline: "none",
    whiteSpace: "pre-wrap",
    overflowWrap: "break-word",
    minHeight: "2rem",
    maxHeight: "4rem",
    width: "calc(100% - 33.84px)",
  };
  const sendMessage = async (e) => {
    // e.preventDefault();
    if (message !== "") {
      const messageData = {
        author: firstName,
        message: message,
        isLoggedIn: isLoggedIn,
      };
      await socket.emit("send_message", messageData);
      setMessagesRecieved((list) => [...list, messageData]);
      setMessage("");
    }
  };

  return (
    <div className="chatContainer">
      <div className="showHideChat">
        {chatHidden ? (
          <></>
        ) : (
          <div className="showHideChatButtonAlt2" onClick={() => hideChat()}>
            Hide Chat
          </div>
        )}

        {chatHidden ? (
          <></>
        ) : (
          <>
            <div
              className="msgFeed"
              id="msgFeed"
              style={{ height: chatHeight }}
            >
              {messagesRecieved.length === 0 ? (
                <>
                  <div
                    className="chatMsgContainer"
                    key={uuidv4()}
                    style={{ opacity: "0.7" }}
                  >
                    <div className="chatUser">
                      Fish <FontAwesomeIcon icon={faCode} />
                    </div>
                    <div className="chatMsg">
                      It seems no one has sent a message since you've arrived,
                      say Hello!
                    </div>
                  </div>
                </>
              ) : (
                <></>
              )}
              <ScrollToBottom>
                {messagesRecieved.map((message) => {
                  return (
                    <div
                      className="chatMsgContainer"
                      key={uuidv4()}
                      ref={autoScrollRef}
                    >
                      {message.isLoggedIn ? (
                        <div className="chatUser">
                          {message.author} <FontAwesomeIcon icon={faCheck} />
                        </div>
                      ) : (
                        <div className="chatUser">{message.author}</div>
                      )}
                      <div className="chatMsg">{message.message}</div>
                    </div>
                  );
                })}
              </ScrollToBottom>
            </div>
            <div className="logIO">
              {isLoggedIn || anonMode ? (
                <div className="logOutButtonContainer">
                  <div className="writeMessages">
                    <ul id="messages"></ul>
                    <form id="form" action="">
                      <textarea
                        type="text"
                        className="sendMsgs"
                        style={tstyles}
                        id="input"
                        autoComplete="off"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        maxLength="500"
                        ref={chatActiveRef}
                      />
                      <button
                        onClick={(e) => sendMessage(e.preventDefault())}
                        id="sendButton"
                      >
                        Send
                      </button>
                    </form>
                  </div>
                </div>
              ) : (
                <div className="googleLogInContainer">
                  <LoginButton
                    isLoggedIn={isLoggedIn}
                    setIsLoggedIn={setIsLoggedIn}
                    firstName={firstName}
                    setFirstName={setFirstName}
                    email={email}
                    setEmail={setEmail}
                    userId={userId}
                    setUserId={setUserId}
                    anonMode={anonMode}
                    setAnonMode={setAnonMode}
                  />
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Chat;
