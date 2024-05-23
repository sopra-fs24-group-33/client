import React, { useState, useEffect } from "react";
import { api, handleError } from "helpers/api";
import User from "models/User";
import { useNavigate } from "react-router-dom";
import { Button } from "components/ui/Button";
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/Login.scss";
import PropTypes from "prop-types";
import {
  RegExpMatcher,
  englishDataset,
  englishRecommendedTransformers,
} from 'obscenity'; // @ts-ignore
import Background from "../../assets/AltBackground.svg";
// @ts-ignore
import Logo from "../../assets/Logo.svg";

const matcher = new RegExpMatcher({
  ...englishDataset.build(),
  ...englishRecommendedTransformers,
});

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

const Register = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>(null);
  const [password, setPassword] = useState<string>(null);
  const [error, setError] = useState("");
  const [error2, setError2] = useState("");

  const validateUsername = (un) => {
    if (matcher.hasMatch(un) || /[^a-zA-Z0-9]/.test(un)) {
      setError("Invalid username");
      return false;
    } else {
      return true;
    }
  };

  const doRegister = async () => {
    if (!validateUsername(username)) {
      return;
    }

    try {
      const requestBody = JSON.stringify({ username, password });
      const response = await api.post("/users", requestBody);

      const user = new User(response.data);
      localStorage.setItem("token", user.token);
      localStorage.setItem("id", user.id);

      navigate("/overview");
    } catch (error) {
      if (error.toJSON().message === 'Network Error') {
        setError2("Server is not running");
      } else {
        setError("Username already exists");
      }
    }
  };

  const doGuestLogin = async () => {
    try {
      const response = await api.post("/players");
      const guest = new User(response.data);

      localStorage.setItem("token", guest.token);
      localStorage.setItem("id", guest.id);
      navigate("/overview");
    } catch (error) {
      if (error.toJSON().message === 'Network Error') {
        setError2("Server is not running");
      } else {
        setError2("Something went wrong");
      }
    }
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Enter") {
        doRegister();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [username, password]); // Add dependencies

  return (
    <div
      style={{
        backgroundImage: `url(${Background})`,
        backgroundSize: 'cover',
        backgroundPosition: '100%',
        height: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
      }}
    >
      <BaseContainer>
        <div className="login container">
          <div className="login form">
            <div className="login header">
              <h2>Register</h2>
              <img src={Logo} alt="" style={{ width: "65px", height: "65px" }} />
            </div>
            <FormField
              label="Username"
              value={username}
              type="text"
              onChange={(un: string) => setUsername(un)}
            />
            <div className="login error-text">{error}</div>

            <FormField
              label="Password"
              value={password}
              type="password"
              onChange={(un: string) => setPassword(un)}
            />
            <div className="login error-text">{error2}</div>

            <div className="login button-container">
              <Button width="100%" onClick={() => navigate("/home")}>
                Cancel
              </Button>
              <Button
                disabled={!username || !password}
                width="100%"
                onClick={() => doRegister()}
              >
                Register
              </Button>
            </div>
            <div className="login hr-box">
              <hr className="login horizontal-line" />
              <p className="login hr-text">or</p>
              <hr className="login horizontal-line" />
            </div>
            <Button className="outlined" onClick={() => doGuestLogin()}>
              Guest Login
            </Button>
          </div>
        </div>
      </BaseContainer>
    </div>
  );
};

export default Register;
