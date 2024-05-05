import React, { useState } from "react";
import { api, handleError } from "helpers/api";
import User from "models/User";
import Player from "models/Player";
import {useNavigate} from "react-router-dom";
import { Button } from "components/ui/Button";
import "styles/views/Login.scss";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
// @ts-ignore
import Background from "../../assets/AltBackground.svg";
// @ts-ignore
import Logo from "../../assets/Logo.svg";


const FormField = (props) => {
  return (
    <div className="login field">
      <label className="login label">{props.label}</label>
      <input
        type={props.type} // Added type prop
        className="login input"
        placeholder="enter here.."
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
      />
    </div>
  );
};

FormField.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  type: PropTypes.string, // Added type propType
  onChange: PropTypes.func,
};


const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>(null);
  const [password, setPassword] = useState<string>(null);

  const doLogin = async () => {
    try {
      const requestBody = JSON.stringify({ username, password });
      const response = await api.post("/login", requestBody);

      const user = new Player(response.data);

      localStorage.setItem("token", user.token);
      localStorage.setItem("id", user.id);


      navigate("/overview");
    } catch (error) {
      alert(
        `Something went wrong during the login: \n${handleError(error)}`
      );
    }
  };

  const doGuestLogin = async () => {
    try {
      const response = await api.post("/players")
      const playerData = response.data;
      const player = new Player(playerData);

      localStorage.setItem("token", player.token)
      localStorage.setItem("id", player.id)
      navigate("/overview");

    } catch (error) {
      alert(
        `Something went wrong during the login: \n${handleError(error)}`
      );
    }
  }

  return (
    <div className="login background" style={{
      backgroundImage: `url(${Background})`,
      backgroundSize: 'cover',
      backgroundPosition: '100%',
      height: '100vh',
      width: '100vw',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      zIndex: "-55",
    }}>
      <BaseContainer>
        <div className="login container">
          <div className="login form">
            <div className="login header">
              <h2>
                Login
              </h2>
              <img src={Logo} alt="" style={{ width: "65px", height: "65px" }} />
            </div>
            <FormField
              label="Username"
              type="text" // Specify type as text for username
              value={username}
              onChange={(un) => setUsername(un)}
            />
            <FormField
              label="Password"
              type="password" // Specify type as password for password
              value={password}
              onChange={(n) => setPassword(n)}
            />

            <div className="login button-container">
              <Button
                width="100%"
                onClick={() => navigate("/home")}
              >
                Cancel
              </Button>
              <Button
                disabled={!username || !password}
                width="100%"
                onClick={() => doLogin()}
              >
                Login
              </Button>
            </div>
            <div className="login hr-box">
              <hr className="login horizontal-line" />
              <p className="login hr-text">or</p>
              <hr className="login horizontal-line" />
            </div>
            <Button
              className="outlined"
              onClick={() => doGuestLogin()}>
              Guest Login
            </Button>
          </div>
        </div>
      </BaseContainer>
    </div>

  );
};

/**
 * You can get access to the history object's properties via the useLocation, useNavigate, useParams, ... hooks.
 */
export default Login;
