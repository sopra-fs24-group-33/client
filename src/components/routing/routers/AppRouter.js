import React from "react";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import {LoginGuard} from "../routeProtectors/LoginGuard";
import Login from "../../views/Login";
import Home from "../../views/Home";
import Register from "../../views/Register";
import Overview from "../../views/Overview";
import Lobby from "../../views/Lobby";
import GamePin from "../../views/Join";
import GameArena from "../../views/GameArena";

/**
 * Main router of your application.
 * In the following class, different routes are rendered. In our case, there is a Login Route with matches the path "/login"
 * and another Router that matches the route "/game".
 * The main difference between these two routes is the following:
 * /login renders another component without any sub-route
 * /game renders a Router that contains other sub-routes that render in turn other react components
 * Documentation about routing in React: https://reactrouter.com/en/main/start/tutorial 
 */
const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={
          <Navigate to="/home" replace />
        }/>

        <Route path="/home" element={<Home/>} />

        <Route path="/login" element={<LoginGuard />}>
          <Route path="/login" element={<Login/>} />
        </Route>

        <Route path="/register" element={<Register />}> </Route>

        <Route path="/overview" element={<Overview />}> </Route>

        <Route path="/game" element={<GameArena />}> </Route>

        <Route path="/lobby" element={<Lobby />}> </Route>

        <Route path="/join" element={<GamePin />}> </Route>

      </Routes>
    </BrowserRouter>
  );
};

/*
* Don't forget to export your component!
 */
export default AppRouter;
