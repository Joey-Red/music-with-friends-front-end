import React, { useState, useEffect } from "react";
import CurrentlyPlaying from "./components/CurrentlyPlaying";
import Chat from "./components/Chat";
import "./styles/styles.css";
import { Helmet } from "react-helmet";

function App() {
  let [isLoggedIn, setIsLoggedIn] = useState(false);
  let [firstName, setFirstName] = useState("");
  let [email, setEmail] = useState("");
  let [userId, setUserId] = useState("");
  let [chatHidden, setChatHidden] = useState(false);
  let [anonMode, setAnonMode] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("myUserEntity") == null) {
    } else {
      //User already logged in
      var userEntity = {};
      userEntity = JSON.parse(localStorage.getItem("myUserEntity"));
      setEmail(userEntity.Email);
      setFirstName(userEntity.Name);
      setUserId(userEntity.Id);
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <div className="App">
      <Helmet>
        <script src="https://apis.google.com/js/api.js"></script>
      </Helmet>
      <div className="layoutContainer">
        <div className="mainContent">
          {chatHidden ? (
            <></>
          ) : (
            <>
              <div className="chatWrapper">
                <Chat
                  setIsLoggedIn={setIsLoggedIn}
                  isLoggedIn={isLoggedIn}
                  firstName={firstName}
                  setFirstName={setFirstName}
                  email={email}
                  setEmail={setEmail}
                  userId={userId}
                  setUserId={setUserId}
                  chatHidden={chatHidden}
                  setChatHidden={setChatHidden}
                  anonMode={anonMode}
                  setAnonMode={setAnonMode}
                />
              </div>
            </>
          )}

          <div className="playerWrapper">
            <CurrentlyPlaying
              setIsLoggedIn={setIsLoggedIn}
              isLoggedIn={isLoggedIn}
              firstName={firstName}
              setFirstName={setFirstName}
              email={email}
              setEmail={setEmail}
              userId={userId}
              setUserId={setUserId}
              chatHidden={chatHidden}
              setChatHidden={setChatHidden}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
