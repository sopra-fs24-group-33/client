import React, { useState } from "react";
import { api, handleError } from "helpers/api";
import { useNavigate } from "react-router-dom";
import { Button } from "components/ui/Button";
import "styles/views/Login.scss";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";

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

const FormField2 = (props) => {
  return (
    <div className="login field">
      <label className="login label">{props.label}</label>
      <input
        className="login input"
        placeholder="enter here.."
        value={props.value}
        type="password"
        onChange={(e) => props.onChange(e.target.value)}
      />
    </div>
  );
};

FormField2.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
};

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const openRegister = () => {
    navigate("/register");
  };

  const doGuestLogin = async () => {
    try {
      const response = await api.post("/guests");
      const guest = response.data;
      localStorage.setItem("token", guest.id);
      navigate("/game");
    } catch (error) {
      alert(`Something went wrong during the login: \n${handleError(error)}`);
    }
  };

  const doLogin = async () => {
    try {
      const requestBody = JSON.stringify({ username, password });
      const response = await api.post("/login", requestBody);
      const token = response.data;
      localStorage.setItem("token", token.id);
      navigate("/game");
    } catch (error) {
      alert(`Something went wrong during the login: \n${handleError(error)}`);
    }
  };

  return (
    <BaseContainer>
      <div className="login container">
        <div className="login form">
          <FormField
            label="Username"
            value={username}
            onChange={(un) => setUsername(un)}
          />
          <FormField2
            label="Password"
            value={password}
            onChange={(pw) => setPassword(pw)}
          />
          <div className="login button-container">
            <Button
              disabled={!username || !password}
              width="100%"
              onClick={doLogin}
            >
              Login
            </Button>
            <Button width="100%" onClick={doGuestLogin}>
              Play as guest
            </Button>
          </div>
          <div className="register button-container">
            <Button width="100%" onClick={openRegister}>
              Register
            </Button>
          </div>
        </div>
      </div>
    </BaseContainer>
  );
};

export default Login;

