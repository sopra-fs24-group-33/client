import React, { createContext, useContext } from 'react';
import PropTypes from 'prop-types';  // Import PropTypes
import { agoraService } from './agora';

const AgoraServiceContext = createContext(null);

export const useAgoraService = () => useContext(AgoraServiceContext);

export const AgoraServiceProvider = ({ children }) => {
  return (
    <AgoraServiceContext.Provider value={agoraService}>
      {children}
    </AgoraServiceContext.Provider>
  );
};

AgoraServiceProvider.propTypes = {
  children: PropTypes.node.isRequired  // 'node' covers anything that can be rendered: numbers, strings, elements or an array containing these types
};
