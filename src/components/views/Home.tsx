import React from "react";
import {useNavigate} from "react-router-dom";
// @ts-ignore
import Background from "../../assets/AltBackground.svg";
// @ts-ignore
import Deck_backside from "../../assets/Deck_backside.svg";
import { Button } from "../ui/Button";
import PlayerBox from "../ui/PlayerBox"

const Home = () => {

  const navigate = useNavigate();

  // @ts-ignore
  return (
    <div style={{
      backgroundImage: `url(${Background})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      height: '100vh',
      width: '100vw',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
    }}>
      <div>
        <h3>Welcome to</h3>
        <div style={{
          display: 'flex',
          alignItems: 'center',
        }}>
          <h1>De Game</h1>
          <img src={Deck_backside} alt="" style={{ marginLeft: "20px" }} />
        </div>
      </div >
      <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <Button
          className="primary-button black"
          onClick={() => navigate("/login")}>
          Login
        </Button>
        <Button  className="primary-button black"
                 onClick={() => navigate("/register")}>
          Register
        </Button>
      </div>


    </div>
  )
}

export default Home;