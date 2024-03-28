import React from "react";
import {useNavigate} from "react-router-dom";
// @ts-ignore
import Background from "../../assets/FlyingCards.svg";
// @ts-ignore
import Deck_backside from "../../assets/Deck_backside.svg";
import { Button } from "../ui/Button";
import "styles/views/Home.scss";
import BaseContainer from "../ui/BaseContainer";


const Home = () => {

  const navigate = useNavigate();


  return (
    <div className="home main-container">
      <div className="home content">
        <div className="home heading-image-box">
          <div className="home heading-box ">
            <h3>Welcome to</h3>
            <h1>De Game</h1>
          </div>
          <img src={Deck_backside} alt="Deck Backside" />
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