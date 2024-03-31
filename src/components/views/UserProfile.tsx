import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { useNavigate, useParams } from "react-router-dom";
import PropTypes from "prop-types";
import { Button } from "../ui/Button";

const UserProfile = () => {
  const { id } = useParams();
  const userid = parseInt(id, 10)
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const current = localStorage.getItem("token")
  const currentid = parseInt(current, 10)

  const openEdit = () => {
    navigate(`/game/userprofile/${id}/EditProfile`)
  }

  const openOverview = () => {
    navigate("/game")
  }

  const editButton  = () => {
    if(currentid === userid)  {
      return <Button width="100%" onClick={openEdit}>
        edit
      </Button>
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(`/guests/${id}`);
        console.log("getByID")
        console.log(response)
        setUserData(response.data); // Set the fetched data to state
      } catch (error) {
        alert(`Something went wrong: \n${handleError(error)}`);
      }
    };

    fetchData();
  }, [id]); // Depend on 'id', not 'userData'


  return (
    <div>
      <h2>User Profile</h2>
      {userData && (
        <div>
          <p>Username: {userData.guestname}</p>
          <p>Shame Tokens: {userData.shame_tokens}</p>
          <p>Games Played: {userData.gamesPlayed}</p>
          <p>Status: {userData.status}</p>
          <p>user id: {userData.isUser}</p>
          <p>id: {userData.id}</p>
          {editButton()}
          <Button width="100%" onClick={openOverview}>
            overview
          </Button>
        </div>
      )}
    </div>
  );
};

UserProfile.propTypes = {
  username: PropTypes.string,
  name: PropTypes.string
};

export default UserProfile;
