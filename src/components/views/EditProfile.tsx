import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { useNavigate, useParams } from "react-router-dom";
import PropTypes from "prop-types";
import { Button } from "../ui/Button";
import BaseContainer from "../ui/BaseContainer";
import "styles/views/Login.scss";

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

const EditProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>(null);
  const [password, setPassword] = useState<string>(null);
  const saveChanges  = async () =>  {
    try {
      const requestBody = JSON.stringify({ username, password });
      await api.put(`/users/${id}`, requestBody);
      navigate(`/game/userprofile/${id}`);
    } catch (error) {
      alert(
        `Something went wrong during the login: \n${handleError(error)}`
      );
    }
  };

  const openProfile = () => {
    navigate(`/game/userprofile/${id}`);
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(`/users/${id}`);
        const userData = response.data
        setUsername(userData.username);
        setPassword(userData.password);
      } catch (error) {
        alert(`Something went wrong: \n${handleError(error)}`);
      }
    };

    fetchData();
  }, [id]);

  return (
    <BaseContainer>
      <div className="login container">
        <div className="login form">
          <FormField
            label="Username"
            value={username}
            onChange={(un: string) => setUsername(un)}
            placeholder={username}
          />
          <div className="login button-container">
            <Button
              width="100%"
              onClick={() => saveChanges()}
            >
              Save
            </Button>
          </div>
          <div className="login button-container">
            <Button
              width="100%"
              onClick={() => openProfile()}
            >
              Back to Profile
            </Button>
          </div>
        </div>
      </div>
    </BaseContainer>
  );

};

EditProfile.propTypes = {
  username: PropTypes.string,
};

export default EditProfile;