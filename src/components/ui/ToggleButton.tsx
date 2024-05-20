import React, { useState } from 'react';
import PropTypes from 'prop-types';
import '../../styles/ui/ToggleButton.scss';

export const ToggleButton = ({ option1, option2, onToggle, size, defaultToggled, ...props }) => {
  const [isToggled, setIsToggled] = useState(defaultToggled);

  const handleToggle = () => {
    setIsToggled(!isToggled);
    if (onToggle) {
      onToggle(!isToggled);
    }
  };

  return (
    <div className="toggle-wrapper" onClick={handleToggle}>
      <input
        type="checkbox"
        className="toggleCheckbox"
        checked={isToggled}
        readOnly
        {...props}
      />
      <div className={`toggleContainer ${size === 'small' ? 'small' : ''}`}>
        <div>{option1}</div>
        <div>{option2}</div>
      </div>
    </div>
  );
};

ToggleButton.propTypes = {
  option1: PropTypes.string.isRequired,
  option2: PropTypes.string.isRequired,
  onToggle: PropTypes.func,
  size: PropTypes.oneOf(['small', 'default']),
  defaultToggled: PropTypes.bool,
};

ToggleButton.defaultProps = {
  size: 'default',
  defaultToggled: false,
};
