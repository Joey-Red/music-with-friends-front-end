/* global gapi */
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { gapi } from "gapi-script";
import { googleLogout } from "@react-oauth/google";

function CurrentlyPlaying(props) {
  let {
    setIsLoggedIn,
    isLoggedIn,
    setFirstName,
    setEmail,
    chatHidden,
    setChatHidden,
  } = props;
  let [songTitle, setSongTitle] = useState("");
  let [rplSrc, setRplSrc] = useState("");
  let [showPlaylist, setShowPlaylist] = useState(false);

  function logout() {
    googleLogout();
    localStorage.clear();
    document.location.reload();
  }
  let hidePlaylists = () => {
    setShowPlaylist(false);
  };
  let showPlaylists = () => {
    setShowPlaylist(!showPlaylist);
  };

  let choosePlaylist = (value) => {
    if (value === 0) {
      value = Math.floor(Math.random() * 9) + 1;
    }
    if (value === 1) {
      // Techno
      setRplSrc(
        "https://www.youtube.com/embed/cf7F7rst8tE?list=PL0hkHzVKpBMTprSwO0NiQtzoQpvCKi5nU"
      );
    } else if (value === 2) {
      // I dont know what to call this
      setRplSrc(
        "https://www.youtube.com/embed/nyMkLwSyOVQ?list=PL63F0C78739B09958"
      );
    } else if (value === 3) {
      // Trance
      setRplSrc(
        "https://www.youtube.com/embed/bmtwhPAR-zU?list=PL-kjiQPGAUEylKeBFYmJESgyjlNd2gjOg"
      );
    } else if (value === 4) {
      // Country
      setRplSrc(
        "https://www.youtube.com/embed/uXyxFMbqKYA?list=RDQM5VkBVRhOTFc"
      );
    } else if (value === 5) {
      // Classic Rock
      setRplSrc(
        "https://www.youtube.com/embed/fJ9rUzIMcZQ?list=PLNxOe-buLm6cz8UQ-hyG1nm3RTNBUBv3K"
      );
    } else if (value === 6) {
      // Metal
      setRplSrc(
        "https://www.youtube.com/embed/xnKhsTXoKCI?list=PLhQCJTkrHOwSX8LUnIMgaTq3chP1tiTut"
      );
    } else if (value === 7) {
      // Rap
      setRplSrc(
        "https://www.youtube.com/embed/PM2f835zx88?list=PLetgZKHHaF-Zq1Abh-ZGC4liPd_CV3Uo4"
      );
    } else if (value === 8) {
      // EDM
      setRplSrc(
        "https://www.youtube.com/embed/LJNzWtgfiVE?list=PLFk8JU5eKSFY9rW6s5JHIv4iuFtt5UE7C"
      );
    } else if (value === 9) {
      // Big room EDM
      setRplSrc(
        "https://www.youtube.com/embed/ocLD1FW0WKg?list=RDQMgmn115XiNog"
      );
    }
    setShowPlaylist(false);
  };

  let hideChat = () => {
    chatHidden ? setChatHidden(false) : setChatHidden(true);
  };

  useEffect(() => {
    choosePlaylist(0);
  }, []);

  function authenticate() {
    return gapi.auth2
      .getAuthInstance()
      .signIn({ scope: "https://www.googleapis.com/auth/youtube.readonly" })
      .then(
        function (res) {
          setFirstName(res.wt.rV);
          setEmail(res.wt.cu);
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
        function () {
          delayedLogInExecute();
        },
        function (err) {
          console.error("Error loading GAPI client for API", err);
        }
      );
  }

  function execute() {
    if (
      gapi.auth2.getAuthInstance().currentUser.get().xc.access_token.length <
        20 ||
      gapi.auth2.getAuthInstance().currentUser.get().xc.access_token === null ||
      gapi.auth2.getAuthInstance().currentUser.get().xc.access_token ===
        undefined
    ) {
      authenticate().then(loadClient);
    } else {
      loadClient();
      return gapi.client.youtube.search
        .list({
          part: ["snippet"],
          maxResults: 1,
          q: songTitle,
        })
        .then(
          function (response) {
            setRplSrc(
              "https://www.youtube.com/embed/" +
                response.result.items[0].id.videoId +
                "?autoPlay=1&origin=https://Joey-Red.github.io/music-with-friends-front-end"
            );
          },
          function (err) {
            console.error("Execute error", err);
          }
        );
    }
  }
  gapi.load("client:auth2", function () {
    gapi.auth2.init({ client_id: process.env.REACT_APP_YOUTUBE_CLIENT_ID });
  });

  function delayedLogInExecute() {
    return gapi.client.youtube.search
      .list({
        part: ["snippet"],
        maxResults: 1,
        q: songTitle,
      })
      .then(
        function (response) {
          setRplSrc(
            "https://www.youtube.com/embed/" +
              response.result.items[0].id.videoId +
              "?autoPlay=1&origin=https://Joey-Red.github.io/music-with-friends-front-end"
          );
        },
        function (err) {
          console.error("Execute error", err.result);
          if (err.result.error.code === 403) {
            alert("Sorry, Google API quota exceeded for the day 😭");
          }
        }
      );
  }
  gapi.load("client:auth2", function () {
    gapi.auth2.init({ client_id: process.env.REACT_APP_YOUTUBE_CLIENT_ID });
  });

  return (
    <>
      <div className="firstLayer">
        <div className="songInfoContainer">
          <div className="currentlyPlaying">
            <iframe
              id="ytplayer"
              type="text/html"
              title="youtube"
              src={rplSrc}
              frameBorder="0"
              autoPlay="1"
              allowFullScreen
            ></iframe>
            <div className="searchWrapper">
              <div className="songInfoExpMenu">
                {chatHidden ? (
                  <>
                    <button
                      className="showHideChatButton"
                      onClick={() => hideChat()}
                    >
                      Chat
                    </button>
                  </>
                ) : (
                  <></>
                )}
                {showPlaylist ? (
                  <>
                    <div className="playlistContainer">
                      <div className="playlistOuter">
                        <div className="playlistInner">
                          <button onClick={() => choosePlaylist(7)}>Rap</button>
                          <button onClick={() => choosePlaylist(1)}>
                            Techno
                          </button>
                          <button onClick={() => choosePlaylist(3)}>
                            Trance
                          </button>
                          <button onClick={() => choosePlaylist(4)}>
                            Country
                          </button>
                          <button onClick={() => choosePlaylist(6)}>
                            Metal
                          </button>
                          <button onClick={() => choosePlaylist(9)}>
                            Big Room EDM
                          </button>
                          <button onClick={() => choosePlaylist(5)}>
                            Classic Rock
                          </button>
                          <button onClick={() => choosePlaylist(8)}>EDM</button>
                          <button onClick={() => choosePlaylist(0)}>
                            Random
                          </button>
                        </div>
                        <button
                          className="closeButton"
                          onClick={() => hidePlaylists()}
                        >
                          <FontAwesomeIcon icon={faX} />
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <></>
                )}

                <button
                  className="choosePlaylist"
                  onClick={() => showPlaylists()}
                >
                  Select Playlist
                </button>
                <form onSubmit={execute} className="playlistForm">
                  {isLoggedIn ? (
                    <>
                      <input
                        id="songInput"
                        type="text"
                        placeholder="Search for a tune!"
                        onChange={(e) => {
                          setSongTitle(e.target.value);
                        }}
                      />
                    </>
                  ) : (
                    <>
                      <input
                        id="songInput"
                        type="text"
                        placeholder="Log in to search for a tune!"
                      />
                    </>
                  )}

                  <button
                    onClick={(e) => execute(e.preventDefault())}
                    id="sendButton2"
                  >
                    Search
                  </button>
                </form>
                {isLoggedIn ? (
                  <>
                    <button
                      className="showHideChatButtonAlt"
                      onClick={() => logout()}
                    >
                      Log out
                    </button>
                  </>
                ) : (
                  <></>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CurrentlyPlaying;
