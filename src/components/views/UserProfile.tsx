import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "helpers/api";
import { Spinner } from "components/ui/Spinner";
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/UserProfile.scss";
import { User } from "types";
import { Button } from "../ui/Button";
// @ts-ignore
import shame_logo from "../../assets/tokens/shame_logo.svg";
// @ts-ignore
import victory_logo from "../../assets/tokens/victory_logo.svg";
// @ts-ignore
import champion_logo from "../../assets/tokens/champion_logo.svg";
// @ts-ignore
import Background from "../../assets/AltBackground2.svg";

const UserProfile = () => {
  console.log(localStorage.getItem("token"));
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await api.get(`/users/${id}`);
        console.log(response.data);
        setUser(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, [id]);

  let content = <Spinner />;

  if (!loading) {
    if (user) {
      content = (
          <div className="user outer-text-wrapper">
            <div className="user inner-text-wrapper">
              <p>Username</p>
              <p>{user.username}</p>
            </div>
            <div className="user inner-text-wrapper">
              <p>Games Completed</p>
              <p>{user.gamesPlayed || 0}</p>
            </div>
            <div className="user inner-text-wrapper">
              <p>Shame Tokens</p>
              <div className="stat-wrapper">
                <span className="icon-wrapper">
                  <img style={{ width: '30px'}} src={shame_logo} alt="Shame Token Logo"/>
                </span>
                <p className="number">{user.shame_tokens}</p>
              </div>
            </div>
            <div className="user inner-text-wrapper">
              <p>Rounds Won</p>
              <div className="stat-wrapper">
                <span className="icon-wrapper">
                  <img style={{ width: '30px'}} src={victory_logo} alt="Victory Logo" className="icon" />
                </span>
                <p className="number">{user.roundsWon || 0}</p>
              </div>
            </div>
            <div className="user inner-text-wrapper">
              <p>Flawless Wins</p>
              <div className="stat-wrapper">
                <span className="icon-wrapper" >
                  <img style={{ width: '35px'}} src={champion_logo} alt="Champion Logo" className="icon" />
                </span>
                <p className="number">{user.flawlessWins || 0}</p>
              </div>
            </div>
          </div>
      );
    } else {
      content = <div>User with ID: {parseInt(id, 10).toString()} was not found</div>;
    }
  }

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
    }}>
      <BaseContainer className="user container" >
        {user && user.token === localStorage.getItem("token") ? (
          <h2>My Profile</h2>
        ) : (
          <h2>{user?.username ?? "???"}</h2>
        )}
        <hr className="user divider" />
        {content}
        <Button className="secondary-button" width="40%" onClick={() => navigate("/overview")} style={{ marginTop: "20px" }}>
          Go Back
        </Button>
      </BaseContainer>
    </div>

  );
};

export default UserProfile;
