import React from "react";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import {LoginGuard} from "../routeProtectors/LoginGuard";
import Login from "../../views/Login";
import Home from "../../views/Home";
import Register from "../../views/Register";
import Overview from "../../views/Overview";
import Lobby from "../../views/Lobby";
import GameArena from "../../views/GameArena";
import { AgoraServiceProvider } from '../../../helpers/agoracontext';
import { GameGuard } from "../routeProtectors/GameGuard";
import { LobbyGuard } from "../routeProtectors/LobbyGuard";
import UserProfile from "../../views/UserProfile";
import { UserGuard } from "../routeProtectors/UserGuard";


const AppRouter = () => {
  return (
    <BrowserRouter>
      <AgoraServiceProvider>
        <Routes>

          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<LoginGuard />}>
            <Route index element={<Home />} />
          </Route>

          <Route path="/login" element={<LoginGuard />}>
            <Route index element={<Login />} />
          </Route>

          <Route path="/register" element={<LoginGuard />}>
            <Route index element={<Register />} />
          </Route>

          <Route path="/overview" element={<Overview />} />

          <Route path="/game" element={<GameGuard />}>
            <Route index element={<GameArena />} />
          </Route>

          <Route path="/lobby" element={<LobbyGuard />}>
            <Route index element={<Lobby />} />
          </Route>

          <Route path="/users/:id" element={<UserGuard />}>
            <Route index element={<UserProfile />} />
          </Route>

          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/home" replace />} />

        </Routes>
      </AgoraServiceProvider>
    </BrowserRouter>
  );
};

export default AppRouter;
