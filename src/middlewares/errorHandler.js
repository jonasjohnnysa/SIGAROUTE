const errorHandler = (error, req, res, next) => {
  console.error('❌ Erro:', error.message);

  let statusCode = error.statusCode || 500;
  const message = error.message || 'Erro interno do servidor';

  if (statusCode === 500) {
    if (message.toLowerCase().includes('não encontrad')) {
      statusCode = 404;
    } else if (
      message.toLowerCase().includes('obrigatório') ||
      message.toLowerCase().includes('inválido') ||
      message.toLowerCase().includes('já cadastrado') ||
      message.toLowerCase().includes('ausente') ||
      message.toLowerCase().includes('não definido') ||
      message.toLowerCase().includes('expirado')
    ) {
      statusCode = 400;
    }
  }

  return res.status(statusCode).json({
    success: false,
    error: message,
    details: process.env.NODE_ENV === 'development' ? error.stack : undefined
  });
};

module.exports = errorHandler;
