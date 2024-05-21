import React, { useEffect, useRef, useState } from "react";
import { api, handleError } from "helpers/api";
import { getWSPreFix } from "helpers/getDomain";
import { Spinner } from "components/ui/Spinner";
import { Button } from "components/ui/Button";
import { useNavigate } from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/Game.scss";
import { Game } from "types";
import GamePlayer from "models/GamePlayer";
import MateHand from "../ui/cards/MateHand";
import CardPile from "../ui/cards/CardPile";
import PlayerHand from "../ui/cards/PlayerHand";
import Popup from "../ui/popUps/PopUp";
import { useAgoraService } from 'helpers/agoracontext';
// @ts-ignore
import ButtonMute from "../../assets/ButtonMute.svg";
// @ts-ignore
import ButtonUnmute from "../../assets/ButtonUnmute.svg";
import Rules from "../ui/popUps/Rules";
// @ts-ignore
import ButtonExit from "../../assets/Exit.svg";
// @ts-ignore
import ButtonInfo from "../../assets/Info.svg";
// @ts-ignore
import ButtonSettings from "../../assets/Settings.svg";
import Deck from "components/ui/cards/Deck";
import Settings from "components/ui/popUps/Settings";
import ExitPopUp from "../ui/popUps/ExitPopUp";
// @ts-ignore
import shame_logo from "../../assets/shame_logo.svg";







const GameArena = () => {
  const prefix = getWSPreFix();
  const navigate = useNavigate();
  const lobbyPin = localStorage.getItem("pin");
  const gameId = localStorage.getItem("gameId");
  const playerId = Number(localStorage.getItem("id"));
  const [drawPhase, setDrawPhase] = useState<boolean>(true); // Set initial draw phase true
  const [game, setGame] = useState<Game>();
  const [players, setPlayers] = useState([]);
  const [player, setPlayer] = useState<GamePlayer>(null);
  const [playerHand, setPlayerHand] = useState<number[]>([]); // Own cards
  const [cardsPlayed, setCardsPlayed] = useState<number[]>([]); // Cards played
  const [teamMates, setTeamMates] = useState<GamePlayer[]>([]);
  const [cardStack, setCardStack] = useState<number[]>([]);
  const [ws, setWs] = useState(null);
  const [moveStatus, setMoveStatus] = useState('');
  const [popupType, setPopupType] = useState<'win' | 'lose' | 'levelUp' | 'end' | null>(null);
  const lastCardPlayTime = useRef(0);
  const [reveal, setReveal] = useState<boolean>(false);
  const [readyWS, setReadyWS] = useState(null);
  const [playersReady, setPlayersReady] = useState<number>(0);
  const [showTeamHand, setShowTeamHand] = useState<boolean>(false);
  const [lost, setLost] = useState(() => {
    return localStorage.getItem('lost') === 'true';
  });
  const [drawButtonClicked, setDrawButtonClicked] = useState(false);
  const agoraService = useAgoraService();
  const [isMuted, setIsMuted] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [altStyle, setAltStyle] = useState(() => localStorage.getItem('altStyle') === 'true');
  const [help, setHelp] = useState(() => localStorage.getItem('help') === 'true');
  const [winColor, setWinColor] = useState(() => localStorage.getItem('winColor') || "#8F5BFFFF");
  const [loseColor, setLoseColor] = useState(() => localStorage.getItem('loseColor') || "#FC3A87FF");

  const toggleMute = () => {
    if (isMuted) {
      agoraService.unmuteselfe();
    } else {
      agoraService.muteselfe();
    }
    setIsMuted(!isMuted);
  };

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = ''; // Required for Chrome to display the confirmation dialog
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await api.get(`/game/${gameId}`);
        setGame(response.data);
        setPlayers(response.data.players);
        const player = new GamePlayer(response.data.players.find(p => p.id === playerId));
        setPlayerHand(player.cards);
        setCardStack(response.data.cardStack);

        // set current level on local storage
        localStorage.setItem("lvl", response.data.level);

        setTeamMates(response.data.players.filter(p => p.id !== playerId));

        if (localStorage.getItem("inGame")) {
          setShowTeamHand(true);
          setCardsPlayed(prev => [...prev, 0, response.data.currentCard]);
        }

      } catch (error) {
        console.error(
          `Something went wrong while fetching the users: \n${handleError(
            error
          )}`
        );
        console.error("Details:", error);
        alert(
          "Something went wrong while fetching the users! See the console for details."
        );
      }
    }
    fetchData();
  }, []);



  useEffect(() => {
    const socket = new WebSocket(`${prefix}/game?game=${gameId}`);

    socket.onopen = () => {
      console.log("Connected to WebSocket[Game]");
    };

    socket.onmessage = (event) => {

      if (event.data === "return") {
        navigate("/lobby")
        return;
      }

      if (event.data === "leave") {
        agoraService.cleanup();
        if (localStorage.getItem('end') !== 'true') {
          localStorage.removeItem("pin");
          removeAllGameTokens();
          navigate("/overview");
        }
        return;
      }


      const data = JSON.parse(event.data);
      console.log("+++Game event received:", data);
      setCardStack(data.cardStack);
      setGame(data);
      setPlayers(data.players);
      setCardsPlayed(prev => [...prev, data.currentCard]);

      // COOLDOWN
      const now = new Date().getTime();
      lastCardPlayTime.current = now;
      setTimeout(() => {
        // This timeout effectively ends the cooldown period
        lastCardPlayTime.current = 0;
      }, 500); // Set cooldown for 1 second

      // get current player
      const currentPlayer = new GamePlayer(data.players.find(p => p.id === playerId));
      setPlayer(currentPlayer);

      // get current level from local storage
      const currLvl = parseInt(localStorage.getItem("lvl"));

      // animates border, TODO: winning and losing [pop-up]
      handleMove(data.successfulMove);

      if (data.level > currLvl) {
        setPopupType('levelUp');
        setShowTeamHand(false);
        localStorage.removeItem("inGame");
      }
      // TODO: maybe sort the game players in backend instead of sorting it always here
      const FilteredPlayers = data.players
        .filter(p => p.id !== playerId);

      setTeamMates(FilteredPlayers);
    };

    socket.onclose = () => {
      console.log("Game WebSocket disconnected");
    };

    socket.onerror = (error) => {
      console.error('Game WebSocket error:', error);
    };

    setWs(socket);

    return () => {
      socket.close();
    };
  }, []);

  useEffect(() => {
    const socket = new WebSocket(`${prefix}/ready?lobbyPin=${lobbyPin}`);

    socket.onopen = () => {
      console.log('Connected to WebSocket[ReadyStatus]');
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.event) {
        handleDrawCards();
        setPlayersReady(0);
      } else {
        setPlayersReady(data);
      }
    };

    socket.onclose = () => {
      console.log('WebSocket disconnected');
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    setReadyWS(socket);
  }, []);

  const closePopup = () => {
    setPopupType(null);
    setDrawPhase(true);
    localStorage.setItem("lvl", game.level); // set new level to current level
    setPlayerHand(player.cards); // update current players hand
  };

  const revealCards = async () => {
    setReveal(true);
    setPopupType(null);
    setDrawPhase(true);
    localStorage.removeItem("inGame");
  };

  const handleNewGame = async () => {
    try {
      await api.delete(`/endgame/${gameId}`);
    } catch (error) {
      console.error(error);
    }
    if (playerId === Number(localStorage.getItem('adminId'))) {
      ws.send("returnToLobby")
    }
    navigate("/lobby");
  };

  const removeAllGameTokens = () => {
    localStorage.removeItem('flawlessWin')
    localStorage.removeItem("adminId");
    localStorage.removeItem("lost");
    localStorage.removeItem("inGame");
    localStorage.removeItem("gameId");
    localStorage.removeItem("lvl");
  };

  const handleLeaveGame = async () => {
    let currentPlayer
    try {
      const response = await api.get(`/game/${gameId}`);
      currentPlayer = response.data.players.find(p => p.id.toString() === playerId.toString());
    } catch (error) {
      currentPlayer = player;
    }
    if (localStorage.getItem('end') === 'true') {
      const requestBody = JSON.stringify(currentPlayer);
      await api.put(`/gamelobbies/${lobbyPin}`, requestBody)
    }
    try {
      await api.delete(`/endgame/${gameId}`);
    } catch (error) {
      console.log("Game already deleted.")
    }
    localStorage.removeItem("pin");
    removeAllGameTokens();
    agoraService.cleanup();
    navigate("/overview");
  };

  const handleMove = (successfulMove: number) => {
    if (successfulMove === 1) {
      setMoveStatus('blink-success');
      setTimeout(() => {
        setMoveStatus('');
      }, 500); // Reset after 1 second
    } else if (successfulMove === 2) {
      localStorage.setItem('flawlessWin', 'false');
      setMoveStatus('blink-failure');
      setPopupType('lose');
      console.log("setting lost to true");
      setLost(true);
      localStorage.setItem('lost', 'true');
      setTimeout(() => {
        setMoveStatus('');
      }, 500); // Reset after 1 second
    } else if (successfulMove === 3) {
      setMoveStatus('end')
      if (localStorage.getItem('flawlessWin') === 'false') {
        setPopupType('end');
      } else {
        setMoveStatus('end-flawless');
        setPopupType('win');
      }
      localStorage.setItem('end', 'true');
    }
  };

  const readyDrawCards = async () => {
    setDrawButtonClicked(true);
    if (reveal === true) {
      console.log("reveal is true");
      if (parseInt(localStorage.getItem("adminId")) === playerId) {
        console.log("Admin updated the game.");
        const response = await api.put(`/move/${gameId}`, 100); // ensures that only one makes a put request to update the statews
      }
    }
    console.log("playersReady: ", playersReady);
    readyWS.send(game.players.length);
  };

  const handleDrawCards = async () => {
    setShowTeamHand(true);
    try {
      const response = await api.get(`/game/${gameId}`);
      if (localStorage.getItem('lost')) {
        const player = new GamePlayer(response.data.players.find(p => p.id === playerId));
        setPlayerHand(player.cards);
        setCardStack(response.data.cardStack);

        const FilteredPlayers = response.data.players
          .filter(p => p.id !== playerId);

        setTeamMates(FilteredPlayers);
        localStorage.removeItem('lost');
      }
      if (response.data.successfulMove === 3) {
        handleMove(3);
      }
      setReveal(false);
      setDrawPhase(false);
      localStorage.setItem("inGame", "1");
      setCardsPlayed([]); // clear cards played pile
      setDrawButtonClicked(false);
    } catch (error) {
      console.error(error)
    }
  };

  const handleLoseColorChange = (color) => {
    setLoseColor(color);
    localStorage.setItem("loseColor", color); // Save to localStorage
  };

  const handleWinColorChange = (color) => {
    setWinColor(color);
    localStorage.setItem("winColor", color); // Save to localStorage
  };

  const changeCardStyle = () => {
    const newAltStyle = !altStyle;
    setAltStyle(newAltStyle);
    localStorage.setItem('altStyle', newAltStyle.toString()); // Save to localStorage
  };

  const changeHelp = () => {
    const newHelp = !help;
    setHelp(newHelp);
    localStorage.setItem('help', newHelp.toString()); // Save to localStorage
  };

  const handleCardClick = async (cardValue: number) => {
    const now = new Date().getTime();
    if (localStorage.getItem("lost")) {
      console.log("Can't play current card. Draw again...");
    }
    else if (!lastCardPlayTime.current || now - lastCardPlayTime.current > 500) {
      console.log("Card clicked with value:", cardValue);
      const response = await api.put(`/move/${gameId}`, cardValue);
      ws.send(gameId);
      setPlayerHand(playerHand.filter(n => n !== cardValue));
    } else {
      console.log("Wait for cooldown to end");
    }
  };

  console.log("# agoraService.getVideoTracks() game", agoraService.getVideoTracks());

  let teamContent = teamMates.length > 0 ? (
    teamMates.map(player => {
      const videoTrack = agoraService.getVideoTracks().get(player.id.toString());

      return (
        <div className="teammate-box" key={player.id}>
          <div className="webcam-container" ref={el => {
            if (el && videoTrack) {
              videoTrack.play(el);
            }
          }}></div>
          <div className="shametoken-counter">
            <img src={shame_logo} alt="" style={{ width: "30px", height: "30px" }} />
            <h3>{player? player.shame_tokens : 0}</h3>
          </div>

          <div className="matehand-container">
            {showTeamHand && <MateHand cardValues={player.cards} revealCards={reveal} alt={altStyle} />}
          </div>
        </div>
      );
    })
  ) : <Spinner />;

  let mainContent = drawPhase && localStorage.getItem("inGame") === null ? (
    <div>
      <CardPile onCardPlayed={handleCardClick} cards={cardsPlayed} alt={altStyle} />
    </div>
  ) : <CardPile onCardPlayed={handleCardClick} cards={cardsPlayed} alt={altStyle} />;

  let tableClasses = `game-arena-container table ${moveStatus}`;

  useEffect(() => {
    document.documentElement.style.setProperty('--win-color', winColor);
    document.documentElement.style.setProperty('--lose-color', loseColor);
  }, [winColor, loseColor]);

  return (
    <BaseContainer style={{ margin: '0px', padding: '0px' }}>
      <div className="game container">
        <div className="teammates-container">
          {teamContent}
        </div>

        <div className="game-arena-container">
          {popupType && (
            <Popup
              type={popupType}
              isVisible={!!popupType}
              onNext={closePopup}
              onReveal={revealCards}
              onNewGame={handleNewGame}
              onLeaveGame={handleLeaveGame}
              isAdmin={playerId.toString() === localStorage.getItem("adminId")}
            />
          )}
          <div className="game-arena-container table-border">
            <div className="deck">
              <Deck numCards={cardStack.length} />
            </div>
            <div className="draw-button">
              {drawPhase && localStorage.getItem("inGame") === null && (
                <>
                  <p className="players-ready"> {playersReady}/{players.length} players are ready</p>
                  <Button className="animated-gradient extra-large" onClick={readyDrawCards}
                          disabled={drawButtonClicked}>
                    {localStorage.getItem('end') === 'true' ? 'Finish Game' : 'Draw Cards'}
                  </Button>
                </>
              )}

            </div>
            <div className={tableClasses}>
              {mainContent}
            </div>
          </div>
        </div>

        <div className="pov-container">
          <div className="pov-container hand">
            {(localStorage.getItem("inGame") || reveal) && (
              <PlayerHand cardValues={playerHand} onClick={handleCardClick} alt={altStyle} help={help} />
            )}
          </div>

          <div className="my-webcam-and-control-box">
            <div className="pov-container my-webcam" ref={el => {
              if (el && agoraService.getVideoTracks().get(playerId.toString())) {
                agoraService.getVideoTracks().get(playerId.toString()).play(el);
              }
            }}>
            </div>
            <div className="shametoken-counter">
              <img src={shame_logo} alt="" style={{ width: "30px", height: "30px" }} />
              <h3>{player ? player.shame_tokens : 0}</h3>
            </div>
            <div className="control-box">
              {isMuted ? (
                <img className="button-mute" src={ButtonUnmute} alt="" onClick={toggleMute} />
              ) : (
                <img className="button-unmute" src={ButtonMute} alt="" onClick={toggleMute} />
              )}
            </div>
          </div>
        </div>

        <div className="cockpit">
          <h3 className={"button-level"}>Lv. {game && game.level}</h3>
          <img className="button-cockpit" src={ButtonInfo} alt="" onClick={() => setShowRules(true)} />
          <img className="button-cockpit" src={ButtonSettings} alt="" onClick={() => setShowSettings(true)} />
          <img className="button-cockpit" src={ButtonExit} alt="" onClick={() => setShowWarning(true)} />
        </div>
      </div>
      {showRules && <Rules onClose={() => setShowRules(false)} />}
      {showSettings && <Settings
        onClose={() => setShowSettings(false)}
        onCardStyle={changeCardStyle}
        onHelp={changeHelp}
        onWinColorChange={handleWinColorChange}
        onLoseColorChange={handleLoseColorChange}
        altStyle={altStyle} // Pass altStyle boolean
        help={help} // Pass help boolean
      />}
      {showWarning && <ExitPopUp onCancel={() => setShowWarning(false)} onConfirm={handleLeaveGame} />}
    </BaseContainer>
  );
};

export default GameArena;
