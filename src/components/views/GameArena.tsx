import React, { useEffect, useRef, useState } from "react";
import { api, handleError } from "helpers/api";
import { getWSPreFix } from "helpers/getDomain";
import { Spinner } from "components/ui/Spinner";
import { Button } from "components/ui/Button";
import {useNavigate} from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/Game.scss";
import { Game } from "types";
import GamePlayer from "models/GamePlayer";
import MateHand from "../ui/cards/MateHand";
import CardPile from "../ui/cards/CardPile";
import PlayerHand from "../ui/cards/PlayerHand";
import Popup from "../ui/PopUp";
import { createBufferSourceAudioTrack } from "agora-rtc-sdk-ng/esm";


const GameArena = () => {
  const prefix = getWSPreFix();
  const navigate = useNavigate();
  const lobbyPin = localStorage.getItem("pin");
  const gameId = localStorage.getItem("gameId")
  const playerId = Number(localStorage.getItem("id"))
  const [drawPhase, setDrawPhase] = useState<boolean>(true) // Set initial draw phase true
  const [game, setGame] = useState<Game>(null)
  const [players, setPlayers] = useState([]);
  const [player, setPlayer] = useState<GamePlayer>(null);
  const [playerHand, setPlayerHand] = useState<number[]>([]) // Own cards
  const [cardsPlayed, setCardsPlayed] = useState<number[]>([]); // Cards played
  const [teamMates, setTeamMates] = useState<GamePlayer[]>([])
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
  })
  const [drawButtonClicked, setDrawButtonClicked] = useState(false);

  useEffect(() => {
    console.log("Current lost state:", lost);
  }, [lost]);

  useEffect(() => {
    const lostStatus = localStorage.getItem('lost') === 'true';
    setLost(lostStatus);
  }, []);

  useEffect(() => {
    const socket = new WebSocket(`${prefix}/game?game=${gameId}`);

    socket.onopen = () => {
      console.log("Connected to WebSocket[Game]")
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Game event received:", data);
      setGame(data)
      setPlayers(data.players)
      setCardsPlayed(prev => [...prev, data.currentCard]);

      // COOLDOWNN
      const now = new Date().getTime();
      lastCardPlayTime.current = now;
      setTimeout(() => {
        // This timeout effectively ends the cooldown period
        lastCardPlayTime.current = 0;
      }, 500); // Set cooldown for 1 second

      // get current player
      const currentPlayer = new GamePlayer(data.players.find(p => p.id === playerId));
      setPlayer(currentPlayer)

      // get current level from local storage
      const currLvl = parseInt(localStorage.getItem("lvl"))

      // animates border, TODO: winning and loosing [pop-up]
      handleMove(data.successfulMove);

      if (data.level > currLvl) {
        setPopupType('levelUp')
        setShowTeamHand(false);
        localStorage.removeItem("inGame")
      }
      // TODO: maybe sort the game players in backend instead of sorting it always here
      const FilteredPlayers = data.players
        .filter(p => p.id !== playerId)

      setTeamMates(FilteredPlayers)
    }

    socket.onclose = () => {
      console.log("Game WebSocket disconnected")
    }

    socket.onerror = (error) => {
      console.error('Game WebSocket error:', error);
    };

    setWs(socket);

    async function fetchData() {
      console.log("haha....")
      try {
        const response = await api.get(`/game/${gameId}`);
        console.log("Received Data:", response.data)
        setGame(response.data);
        setPlayers(response.data.players)
        const player = new GamePlayer(response.data.players.find(p => p.id === playerId));
        setPlayerHand(player.cards);
        console.log("player hands:", player.cards);

        // set current level on local storage
        localStorage.setItem("lvl", response.data.level);

        setTeamMates(response.data.players.filter(p => p.id !== playerId))

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
      const data =  JSON.parse(event.data);
      console.log("Received Data from READY WEBSOCKET:", data);
      if (data.event) {
        handleDrawCards();
        setPlayersReady(0);
      } else {
        console.log("Set Players Ready:", data);
        console.log("Type of data:", typeof data);
        setPlayersReady(data)
      }
    }

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
    localStorage.setItem("lvl", game.level)// set new level to current level
    setPlayerHand(player.cards); // update current players hand
  };

  const revealCards = () => {
    console.log("setting reveal to true")
    setReveal(true);
    setPopupType(null);
    setDrawPhase(true);
    localStorage.removeItem("inGame")
  }

  const handleNewGame = async () => {
    try {
      await api.delete(`/endgame/${gameId}`)
    } catch (error) {
      console.error(error);
    }
    navigate("/lobby")
  }

  const handleLeaveGame = async () => {
    const requestBody = JSON.stringify(player)
    console.log("player in game.tsx:", requestBody)
    const response = await api.put(`/gamelobbies/${lobbyPin}`, requestBody)
    localStorage.removeItem("pin")
    localStorage.removeItem("adminId")
    navigate("/overview")
  }

  const handleMove = (successfulMove : number) => {
    console.log("hiasdasd")
    if (successfulMove === 1) {
      setMoveStatus('blink-success');
    } else if (successfulMove === 2) {
      setMoveStatus('blink-failure');
      setPopupType('lose')
      console.log("setting lost to true")
      setLost(true);
      localStorage.setItem('lost', 'true');
    } else if (successfulMove === 3) {
      console.log("hi")
      setPopupType('end')
    }
    setTimeout(() => {
      setMoveStatus('');
    }, 500); // Reset after 1 second
  }

  const readyDrawCards = async () => {
    setDrawButtonClicked(true);
    if (reveal === true) {
      console.log("reveal is true")
      if (parseInt(localStorage.getItem("adminId")) === playerId) {
        console.log("Admin updated the game.")
        const response = await api.put(`/move/${gameId}`, 100); // ensures that only one makes a put request to update the statews
      }
    }
    console.log("playersReady: ", playersReady);
    console.log("game players length: ", game.players.length);
    readyWS.send(game.players.length);
  }

  const handleDrawCards = async () => {
    setShowTeamHand(true);
    // TODO: RESET READY PARTICIPANTS
    console.log("lost:", localStorage.getItem('lost'))
    if (localStorage.getItem('lost')) {
      const response = await api.get(`/game/${gameId}`);
      console.log("HANDLE DRAW CARDS RESPONSE:", response.data)
      const player = new GamePlayer(response.data.players.find(p => p.id === playerId));
      setPlayerHand(player.cards)

      const FilteredPlayers = response.data.players
        .filter(p => p.id !== playerId)

      setTeamMates(FilteredPlayers)
      console.log("Setting lost to false")
      localStorage.removeItem('lost')

      if (response.data.successfulMove === 3) {
        handleMove(3);
      }
    } else {
      console.log("hä....")
    }
    console.log("setting reveal back to false")
    setReveal(false);
    setDrawPhase(false);
    localStorage.setItem("inGame", "1"); // TODO: LET ME COOK?
    setCardsPlayed([]) // clear cards played pile
    setDrawButtonClicked(false);
  }
  const isReady = () => {
    readyWS.send(game.players.length);
  }

  const handleCardClick = async (cardValue: number) => {
    const now = new Date().getTime();
    if (localStorage.getItem("lost")) {
      console.log("Can't play current card. Draw again...")
    }
    else if (!lastCardPlayTime.current || now - lastCardPlayTime.current > 500) {
      console.log("Card clicked with value:", cardValue);
      const response = await api.put(`/move/${gameId}`, cardValue)
      ws.send(gameId)
      // Add the card to the played cards pile
      // Remove card from players hand
      setPlayerHand(playerHand.filter(n => n !== cardValue))
    } else {
      console.log("Wait for cooldown to end")
    }
  };

  let teamContent = teamMates ? (
    teamMates.map((player) => (
      <div className="teammate-box" key={player.id}>
        <div className="webcam-container">{player.name}</div>
        <div className="matehand-container">
          {showTeamHand && <MateHand cardValues={player.cards} revealCards={reveal}/>}
        </div>
      </div>
    ))
  ) : <Spinner />;

  let mainContent = drawPhase && localStorage.getItem("inGame") === null ? (
    <div>
      <Button className="primary-button" onClick={readyDrawCards} disabled={drawButtonClicked}>
        Draw Cards {playersReady}/{players.length}
      </Button>
      <CardPile onCardPlayed={handleCardClick} cards={cardsPlayed} />
    </div>
  ) : <CardPile onCardPlayed={handleCardClick} cards={cardsPlayed} />;

  let tableClasses = `game-arena-container table ${moveStatus}`;

  return (
    <BaseContainer style={{
      margin: '0px',
      padding: '0px',
    }}>
      <div className="game container">

        <div className="teammates-container">
          {teamContent}
        </div>

        <div className="game-arena-container">
          <Button className="primary-button" onClick={handleNewGame}>
            New Game
          </Button>
          {popupType && (
            <Popup
              type={popupType}
              isVisible={!!popupType}
              onNext={closePopup}
              onReveal={revealCards}
              onNewGame={handleNewGame}
              onLeaveGame={handleLeaveGame}
            />
          )}
          <div className="game-arena-container table-border">
            <div className={tableClasses}>
              {mainContent}
            </div>
          </div>
        </div>

        <div className="pov-container">
          <div className="pov-container hand">
            {(localStorage.getItem("inGame") || reveal) && (
              <PlayerHand cardValues={playerHand} onClick={handleCardClick}/>
            )}
          </div>
          <div className="pov-container my-webcam">
            My Webcam
          </div>
        </div>

      </div>
    </BaseContainer>
  );
};

export default GameArena;
