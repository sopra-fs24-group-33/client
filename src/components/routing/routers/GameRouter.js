import React from "react";
import {Navigate, Route, Routes} from "react-router-dom";
import PropTypes from "prop-types";
import Overview from "../../views/Overview";

const GameRouter = () => {
  return (
    <div style={{display: "flex", flexDirection: "column"}}>
      <Routes>

        <Route path="" element={<Overview />} />

        <Route path="dashboard" element={<Overview />} />

        <Route path="*" element={<Navigate to="dashboard" replace />} />

      </Routes>
   
    </div>
  );
};
/*
* Don't forget to export your component!
 */

GameRouter.propTypes = {
  base: PropTypes.string
}

export default GameRouter;
