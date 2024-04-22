import React from "react";
import PropTypes from "prop-types";
import "../../styles/ui/Button.scss";

export const Button = props => (
  <button
    {...props}
    style={{width: props.width, ...props.style}}
    className={`primary-button ${props.className}`}>
    {props.children}
  </button>
);


Button.propTypes = {
  width: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string
  ]), // Accept both number and string
  style: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node,
};