const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config();

const app = express();
const { authMiddleware } = require('./middlewares/authMiddleware');
const swaggerSpec = require('./swagger/swaggerConfig');

// Middlewares globais
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check (público)
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Servidor SIGAROUTE está rodando' });
});

// Swagger Documentation (público)
app.use('/api-docs', swaggerUi.serve);
app.get('/api-docs', swaggerUi.setup(swaggerSpec, {
  swaggerOptions: {
    url: '/swagger.json'
  }
}));
app.get('/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// Rotas de autenticação (público)
app.use('/auth', require('./routes/authRoutes'));

// Rotas protegidas por JWT
app.use('/api/enderecos', authMiddleware, require('./routes/enderecoRoutes'));
app.use('/api/rotas', authMiddleware, require('./routes/rotaRoutes'));
app.use('/api/destinatarios', authMiddleware, require('./routes/destinatarioRoutes'));

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Rota não encontrada',
    path: req.originalUrl
  });
});

// Error Handler
app.use(require('./middlewares/errorHandler'));

module.exports = app;
