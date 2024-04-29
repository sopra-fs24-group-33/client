import React from "react";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import {LoginGuard} from "../routeProtectors/LoginGuard";
import Login from "../../views/Login";
import Home from "../../views/Home";
import Register from "../../views/Register";
import Overview from "../../views/Overview";
import Lobby from "../../views/Lobby";
import GamePin from "../../views/Join";
import GameDemoFromBackend from "../../views/GameDemoFromBackend";
import Design from "../../views/design";
import GameArena from "../../views/GameArena";
import WebSocket from "../../views/WebSocket";

const AppRouter = () => {
  return (
    <BrowserRouter>
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
        <Route path="/game" element={<GameArena />} />
        <Route path="/lobby" element={<Lobby />} />
        <Route path="/join" element={<GamePin />} />
        <Route path="/test" element={<GameDemoFromBackend />} />
        <Route path="/design" element={<Design />} />
        <Route path="/ws" element={<WebSocket />} />

        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/home" replace />} />

      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
