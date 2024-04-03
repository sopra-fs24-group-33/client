import React, { useState } from "react";
import { api, handleError } from "helpers/api";
import User from "models/User";
import {useNavigate} from "react-router-dom";
import { Button } from "components/ui/Button";
import "styles/views/Login.scss";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
// @ts-ignore
import Background from "../../assets/AltBackground.svg";

/*
It is possible to add multiple components inside a single file,
however be sure not to clutter your files with an endless amount!
As a rule of thumb, use one file per component and only add small,
specific components that belong to the main one in the same file.
 */
const FormField = (props) => {
  return (
    <div className="login field">
      <label className="login label">{props.label}</label>
      <input
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

      // Get the returned user and update a new object.
      const user = new User(response.data);

      // Store the token into the local storage.
      localStorage.setItem("token", user.token);
      localStorage.setItem("id", user.id);

      // Login successfully worked --> navigate to the route /game in the GameRouter
      navigate("/game");
    } catch (error) {
      alert(
        `Something went wrong during the login: \n${handleError(error)}`
      );
    }
  };

  const doGuestLogin = async () => {
    try {
      const response = await api.post("/guests")
      const guest = new User(response.data)

      localStorage.setItem("token", guest.token)
      localStorage.setItem("id", guest.id)

    } catch (error) {
      alert(
        `Something went wrong during the login: \n${handleError(error)}`
      );
    }
  }

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
      <BaseContainer>
        <div className="login container">
          <div className="login form">
            <h2>Login</h2>
            <FormField
              label="Username"
              value={username}
              onChange={(un: string) => setUsername(un)}
            />
            <FormField
              label="Password"
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
