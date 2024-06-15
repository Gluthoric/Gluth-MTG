// src/utils/logger.js

const logToFile = (message) => {
  const logMessage = new Date().toISOString() + ' - ' + message;
  console.log(logMessage);
};

export default logToFile;
