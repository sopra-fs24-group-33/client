import React, { useState } from "react";
import { api, handleError } from "helpers/api";
import User from "models/User";
import {useNavigate} from "react-router-dom";
import { Button } from "components/ui/Button";
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/Login.scss";
import PropTypes from "prop-types";
// @ts-ignore
import Background from "../../assets/AltBackground.svg";

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

const Register = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>(null);
  const [password, setPassword] = useState<string>(null);

  const doRegister = async () => {
    try {
      const requestBody = JSON.stringify({username, password})
      const response = await api.post("/users", requestBody);

      const user = new User(response.data);
      localStorage.setItem("token", user.token);
      localStorage.setItem("id", user.id);

      navigate("/overview");
    }
    catch (error) {
      alert(
        `Something went wrong during the registration: \n${handleError(error)}`
      )
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
            <h2>
              Register
            </h2>
            <FormField
              label="Username"
              value={username}
              onChange={(un: string) => setUsername(un)}
            />

            <FormField
              label="Password"
              value={password}
              onChange={(un: string) => setPassword(un)}
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
                onClick={() => doRegister()}
              >
                Register
              </Button>
            </div>
          </div>
        </div>
      </BaseContainer>
    </div>
  );

};
export default Register;
