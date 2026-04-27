const errorHandler = (error, req, res, next) => {
  console.error('❌ Erro:', error.message);

  const statusCode = error.statusCode || 500;
  const message = error.message || 'Erro interno do servidor';

  return res.status(statusCode).json({
    success: false,
    error: message,
    details: process.env.NODE_ENV === 'development' ? error.stack : undefined
  });
};

module.exports = errorHandler;
