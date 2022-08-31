/* global gapi */
import React, { useEffect } from "react";
import { gapi } from "gapi-script";
import { googleLogout } from "@react-oauth/google";
import { Helmet } from "react-helmet";
function LoginButton(props) {
  let {
    isLoggedIn,
    setIsLoggedIn,
    setFirstName,
    setEmail,
    setUserId,
    anonMode,
    setAnonMode,
  } = props;

  // Check if the user is logged in
  useEffect(() => {
    if (localStorage.getItem("myUserEntity") == null) {
    } else {
      //User already logged in
      var userEntity = {};
      userEntity = JSON.parse(localStorage.getItem("myUserEntity"));
      userEntity = JSON.parse(localStorage.getItem("myUserEntity"));
      setEmail(userEntity.Email);
      setFirstName(userEntity.Name);
      setUserId(userEntity.Id);
      setIsLoggedIn(true);
      // loadClient();
    }
  }, [setEmail, setFirstName, setUserId, setIsLoggedIn]);

  function logout() {
    googleLogout();
    localStorage.clear();
  }

  let chooseAnon = () => {
    setAnonMode(true);
    setEmail(null);
    setFirstName("Anon");
    setUserId(null);
  };

  function authenticate() {
    return gapi.auth2
      .getAuthInstance()
      .signIn({ scope: "https://www.googleapis.com/auth/youtube.force-ssl" })
      .then(
        function (googleUser) {
          var profile = googleUser.getBasicProfile();
          var myUserEntity = {};
          myUserEntity.Id = profile.getId();
          myUserEntity.Name = profile.getName();
          myUserEntity.Email = profile.getEmail();
          setEmail(myUserEntity.Email);
          setFirstName(myUserEntity.Name);
          setUserId(myUserEntity.Id);
          setIsLoggedIn(true);
          localStorage.setItem("myUserEntity", JSON.stringify(myUserEntity));
          setIsLoggedIn(true);
        },
        function (err) {
          console.error("Error signing in", err);
        }
      );
  }

  function loadClient() {
    gapi.client.setApiKey(process.env.REACT_APP_YOUTUBE_API_KEY);
    return gapi.client
      .load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest")
      .then(
        function () {},
        function (err) {}
      );
  }

  gapi.load("client:auth2", function () {
    gapi.auth2.init({ client_id: process.env.REACT_APP_YOUTUBE_CLIENT_ID });
  });

  return (
    <div className="logInButton">
      <Helmet>
        <script src="https://apis.google.com/js/api.js"></script>
      </Helmet>
      {isLoggedIn ? (
        <>
          <button className="logoutButton" onClick={() => logout()}>
            Log out
          </button>
        </>
      ) : (
        <>
          <button
            onClick={() => authenticate().then(loadClient)}
            className="logIObuttons"
            id="officialButton"
          >
            Log in
            {/* User needs to authenticate */}
          </button>
        </>
      )}
      {!isLoggedIn && !anonMode ? (
        <>
          <div className="inbtw"></div>
          <button
            className="logIObuttons"
            id="anonButton"
            onClick={() => chooseAnon()}
          >
            Chat as Anon
          </button>
        </>
      ) : (
        <></>
      )}
    </div>
  );
}

export default LoginButton;
