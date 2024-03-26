import React from "react";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import Home from "../../views/Home";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={
          <Navigate to="/home" replace />
        }/>

        <Route path="/home" element={<Home />} />



      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;