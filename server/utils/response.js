/**
 * Send a success response
 */
const sendSuccess = (res, { statusCode = 200, message, data = null, meta = null }) => {
  const response = { success: true, message };
  if (data !== null) response.data = data;
  if (meta !== null) response.meta = meta;
  return res.status(statusCode).json(response);
};

/**
 * Send an error response
 */
const sendError = (res, { statusCode = 500, message, code = 'SERVER_ERROR', details = null }) => {
  const response = {
    success: false,
    message,
    error: { code },
  };
  if (details !== null) response.error.details = details;
  return res.status(statusCode).json(response);
};

module.exports = { sendSuccess, sendError };