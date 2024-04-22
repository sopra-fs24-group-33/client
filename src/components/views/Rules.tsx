import React from "react";
import {useNavigate} from "react-router-dom";
// @ts-ignore
import Background from "../../assets/AltBackground.svg";
// @ts-ignore
import Deck_backside from "../../assets/Deck_backside.svg";
import { Button } from "../ui/Button";
import "styles/views/Home.scss";
import BaseContainer from "../ui/BaseContainer";

const Rules = () => {

    const navigate = useNavigate();

    return (
        <div style={{
                backgroundImage: `url(${Background})`,
                backgroundSize: "cover",
                backgroundPosition: "100%",
                height: "100vh",
                width: "100vw",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                }} href="../../styles/_theme.scss">
            <div style={{backgroundColor: "rgba(0, 0, 0, 0.5)", textAlign: "center" }}>
                <h2>De Game - Rules</h2>
                <p style={{ color: "white", lineHeight: "1.4", padding: "70px", maxWidth: "1000px", margin: "0 auto", textAlign: "left" }}>
                    The rules of De Game are easy: simply lay down the cards drawn in ascending order.<br/>
                    As doing this is not difficult, try doing it without talking numbers. Communicate with each other and figure out who has the lowest number in their hands. Remember: all players are one team and play against De Game.<br/>
                    When all drawn cards are played in the correct order, the players level up and each players gets as many cards as the level their in: level 1 = everyone has 1 card; level 2 = everyone has 2 cards; etc.<br/>
                    In the case where the card that has been played is not the lowest card, all players must draw new cards without leveling up.<br/>
                    De Game ends when there are no longer enough cards on the stack to start a new round.
                </p>
                <h2>Good Luck!</h2>
                <Button onClick={() => navigate("/overview")}>Close Rules</Button>
            </div>
        </div>
    )
}

export default Rules;