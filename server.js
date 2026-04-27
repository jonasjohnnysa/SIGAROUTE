require('dotenv').config();
const app = require('./src/app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`\n🚀 Servidor SIGAROUTE está rodando na porta ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV}`);
  console.log(`\nEndpoints disponíveis:`);
  console.log(`  - Health Check: http://localhost:${PORT}/health\n`);
});
