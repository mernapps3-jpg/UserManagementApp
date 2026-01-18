// Central error handler to keep controller code simple.
function errorHandler(err, req, res, next) {
  console.error('Error handler caught:', err.message);
  console.error('Error stack:', err.stack);
  console.error('Request URL:', req.originalUrl);
  console.error('Request method:', req.method);

  const status = err.status || 500;
  res.status(status).json({
    success: false,
    message: err.message || 'Internal server error'
  });
}

module.exports = errorHandler;
