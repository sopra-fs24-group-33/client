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
              textAlign: "left",
              width: "100%",

            }}>
              Welcome to
            </h3>
            <h1>
              DE GAME
            </h1>
            <h3 style={{
              textAlign: "right",
              width: "100%",

            }}>
              A collaborative card game
            </h3>
          </div>
          <img src={Deck_backside} alt="" style={{ marginLeft: "20px" }} />
        </div>
        <div className="home button-container">
          <Button className="large outlined"
                  width="100%"
                  onClick={() => navigate('/register')}>
            Register
          </Button>
          <Button className="large"
                  width="100%" onClick={() => navigate('/login')}>
            Login
          </Button>
        </div>
      </div>


    </div>


  )
}

export default Home;
