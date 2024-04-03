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
      backgroundImage: `url(${Background})`,
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
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '15px'
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
          }}>
            <h3 style={{
              paddingRight: '400px',
              textShadow: '5px 5px 5px black',
            }}>
              Welcome to
            </h3>
            <h1 style={{
              textShadow: '10px 10px 15px black'
            }}>
              DE GAME
            </h1>
            <h3 style={{
              paddingLeft: '300px',
              textShadow: '5px 5px 5px black'
            }}>
              A collaborative card game
            </h3>

          </div>
          <img src={Deck_backside} alt="" style={{ marginLeft: "20px" }} />
        </div>
        <div className="home button-container">
          <Button className="primary-button large white"
                  width="100%"
                  onClick={() => navigate('/register')}>
            Register
          </Button>
          <Button className="primary-button large white"
                  width="100%" onClick={() => navigate('/login')}>
            Login
          </Button>
        </div>
      </div>


    </div>


  )
}

export default Home;
