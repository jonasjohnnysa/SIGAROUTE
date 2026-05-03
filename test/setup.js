// Setup global para os testes
require('dotenv').config();

// Configurar variáveis de ambiente padrão para testes se não estiverem definidas
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'test_secret_key_sigaroute_2024';
}

if (!process.env.JWT_EXPIRES_IN) {
  process.env.JWT_EXPIRES_IN = '24h';
}

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'test';
}

// Configurações globais do Mocha
global.expect = require('chai').expect;

console.log('\n🧪 Iniciando testes do SIGAROUTE...\n');
