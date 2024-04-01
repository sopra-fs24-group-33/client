import React from "react";
import {useNavigate} from "react-router-dom";
// @ts-ignore
import Background from "../../assets/AltBackground.svg";
// @ts-ignore
import Deck_backside from "../../assets/Deck_backside.svg";
import { Button } from "../ui/Button";
import "styles/views/Home.scss";
import BaseContainer from "../ui/BaseContainer";


const Home = () => {

  const navigate = useNavigate();


  return (
    <div style={{
      backgroundSize: 'cover',
      backgroundPosition: '100%',
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
        <div className="home button-container">
          <Button className="primary-button large black"
                  width="100%"
                  onClick={() => navigate('/register')}>
            Register
          </Button>
          <Button className="primary-button large black"
                  width="100%" onClick={() => navigate('/login')}>
            Login
          </Button>
        </div>
      </div>


    </div>


  )
}

export default Home;
