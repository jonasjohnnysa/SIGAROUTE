# SIGAROUTE - Sistema de Gerenciamento de Rotas

Backend Node.js com arquitetura limpa para gerenciar Rotas, Endereços e Destinatários com autenticação JWT.

## 🚀 Instalação

```bash
npm install
```

## 📋 Configuração

As variáveis de ambiente já estão configuradas no `.env`:

```env
PORT=3000
NODE_ENV=development
JWT_SECRET=sigaroute_secret_key_2024_very_secure_z9x8c7v6b5n4m3l2k1
JWT_EXPIRES_IN=24h
```

## ▶️ Executar

### Desenvolvimento (com auto-reload)
```bash
npm run dev
```

### Produção
```bash
npm start
```

O servidor estará disponível em `http://localhost:3000`

## 📚 Arquitetura

O projeto segue **Arquitetura Limpa** com as seguintes camadas:

```
src/
├── models/              - Entidades (Endereco, Rota, Destinatario)
├── repositories/        - Acesso aos dados (CRUD em memória)
├── services/            - Lógica de negócio e validações
├── controllers/         - Handlers de requisições HTTP
├── routes/              - Definição de endpoints
├── middlewares/         - Error handler, autenticação
├── utils/               - Utilitários e validadores
├── swagger/             - Configuração Swagger/OpenAPI
└── app.js               - Configuração do Express
```

## 🔐 Autenticação JWT

### 1. Login para obter Token

**Endpoint:** `POST /auth/login`

**Request:**
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "usuario": "admin",
    "senha": "admin@123"
  }'
```

**Usuários Pré-definidos:**
- `admin` / `admin@123` (role: admin)
- `jonas.arruda` / `user@123` (role: user)

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "usuario": {
      "id": 1,
      "usuario": "admin",
      "email": "admin@sigaroute.com",
      "role": "admin"
    },
    "expiresIn": "24h"
  },
  "message": "Login realizado com sucesso"
}
```

### 2. Usar Token nas Requisições Protegidas

Todas as rotas de API (exceto `/health` e `/auth/login`) requerem token JWT:

```bash
curl -X GET http://localhost:3000/api/enderecos \
  -H "Authorization: Bearer seu_token_jwt_aqui"
```

## 📡 Endpoints

### Autenticação (Público)
- `POST /auth/login` - Fazer login e obter token JWT
- `GET /auth/usuarios` - Listar usuários (admin apenas)
- `GET /auth/perfil` - Obter perfil do usuário logado

### Health Check (Público)
- `GET /health` - Status do servidor

### Endereços (Protegido)
- `POST /api/enderecos` - Criar endereço
- `GET /api/enderecos` - Listar todos
- `GET /api/enderecos/:id` - Obter por ID
- `GET /api/enderecos/cidade?cidade=` - Listar por cidade
- `PUT /api/enderecos/:id` - Atualizar
- `DELETE /api/enderecos/:id` - Deletar
- `PATCH /api/enderecos/:id/desativar` - Desativar

### Rotas (Protegido)
- `POST /api/rotas` - Criar rota
- `GET /api/rotas` - Listar todas
- `GET /api/rotas/:id` - Obter por ID
- `GET /api/rotas/status?status=` - Listar por status
- `PUT /api/rotas/:id` - Atualizar
- `DELETE /api/rotas/:id` - Deletar
- `PATCH /api/rotas/:id/desativar` - Desativar
- `POST /api/rotas/endereco/adicionar` - Adicionar endereço
- `POST /api/rotas/endereco/remover` - Remover endereço
- `POST /api/rotas/destinatario/adicionar` - Adicionar destinatário
- `POST /api/rotas/destinatario/remover` - Remover destinatário

### Destinatários (Protegido)
- `POST /api/destinatarios` - Criar destinatário
- `GET /api/destinatarios` - Listar todos
- `GET /api/destinatarios/:id` - Obter por ID
- `GET /api/destinatarios/email?email=` - Obter por email
- `GET /api/destinatarios/busca/nome?nome=` - Buscar por nome
- `PUT /api/destinatarios/:id` - Atualizar
- `DELETE /api/destinatarios/:id` - Deletar
- `PATCH /api/destinatarios/:id/desativar` - Desativar

## 📖 Documentação Swagger

Acesse a documentação interativa em:

```
http://localhost:3000/api-docs
```

A documentação Swagger inclui:
- Todos os endpoints detalhados
- Schemas de requisição/resposta
- Exemplos de uso
- Integração com autenticação JWT

## 🧪 Testes Automatizados

### Executar Testes
```bash
npm test
```

### Executar Testes com Watch
```bash
npm run test:watch
```

### Gerar Relatório de Coverage
```bash
npm run test:coverage
```

### Visualizar Relatório HTML
Após executar os testes, abra:
```
mochawesome-report/report.html
```

### Cobertura de Testes

Os testes cobrem:
- ✅ **Services:** Validações, operações CRUD, tratamento de erros
- ✅ **Autenticação:** Login, token verification, credenciais inválidas
- ✅ **Repositories:** Operações em memória
- ✅ **Edge Cases:** Dados duplicados, campos inválidos, recursos não encontrados

**Stack de Testes:**
- Mocha - Test Runner
- Chai - Assertion Library
- Mochawesome - HTML Report Generator
- NYC - Code Coverage

## 📋 Formato de Resposta

### Sucesso (200/201)
```json
{
  "success": true,
  "data": { ... },
  "message": "Operação realizada com sucesso"
}
```

### Erro (4xx/5xx)
```json
{
  "success": false,
  "error": "Mensagem de erro",
  "details": "... (apenas em development)"
}
```

## 📝 Exemplos de Requisições

### 1. Login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "usuario": "admin",
    "senha": "admin@123"
  }'
```

### 2. Criar Endereço
```bash
curl -X POST http://localhost:3000/api/enderecos \
  -H "Authorization: Bearer TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "rua": "Rua das Flores",
    "numero": "123",
    "bairro": "Centro",
    "cidade": "São Paulo",
    "estado": "SP",
    "cep": "01234-567"
  }'
```

### 3. Criar Destinatário
```bash
curl -X POST http://localhost:3000/api/destinatarios \
  -H "Authorization: Bearer TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Silva",
    "email": "joao@example.com",
    "telefone": "11987654321",
    "endereco": "Rua das Flores, 123"
  }'
```

### 4. Criar Rota
```bash
curl -X POST http://localhost:3000/api/rotas \
  -H "Authorization: Bearer TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Rota Zona Sul",
    "descricao": "Entrega para região da Zona Sul de São Paulo"
  }'
```

## 🔍 Validações

### Endereço
- CEP: Formato XXXXX-XXX ou XXXXXXXX
- Estado: Sigla válida (SP, RJ, MG, etc)
- Todos os campos obrigatórios

### Destinatário
- Email: Formato válido e único
- Telefone: 10 ou 11 dígitos
- Todos os campos obrigatórios

### Rota
- Nome e descrição obrigatórios
- Status: ativa, inativa ou pausada
- Apenas endereços e destinatários existentes

## 📊 Estrutura de Dados

### Endereço
```javascript
{
  id: string,
  rua: string,
  numero: string,
  bairro: string,
  cidade: string,
  estado: string,  // Sigla (SP, RJ, etc)
  cep: string,     // XXXXX-XXX
  ativo: boolean,
  dataCriacao: Date,
  dataAtualizacao: Date
}
```

### Destinatário
```javascript
{
  id: string,
  nome: string,
  email: string,   // Único
  telefone: string,
  endereco: string,
  ativo: boolean,
  dataCriacao: Date,
  dataAtualizacao: Date
}
```

### Rota
```javascript
{
  id: string,
  nome: string,
  descricao: string,
  enderecosIds: [string],
  destinatariosIds: [string],
  status: 'ativa' | 'inativa' | 'pausada',
  dataCriacao: Date,
  dataAtualizacao: Date
}
```

## ⚠️ Importante

- **Dados em Memória**: Todos os dados são armazenados em memória. Ao reiniciar o servidor, os dados serão perdidos.
- **Autenticação JWT**: Tokens expiram em 24 horas. Faça login novamente para renovar.
- **Ambientes**: Use variáveis `.env` diferentes para development e production.

## 🔄 Próximos Passos (Planejado)

### 1️⃣ **Integração com Banco de Dados** (Futuro)
- Migrar de memória para MongoDB ou PostgreSQL
- Implementar migrations
- Adicionar índices de performance

### 2️⃣ **Segurança Avançada**
- Refresh Tokens
- Rate Limiting
- CORS configurável
- Validação de CSRF

### 3️⃣ **Logging e Monitoring**
- Winston para logging estruturado
- Prometheus para métricas
- ELK Stack para agregação

### 4️⃣ **CI/CD e Deploy**
- GitHub Actions
- Docker e Docker Compose
- Kubernetes ready
- Environment-specific configs

## 📄 Licença

ISC

---

**Desenvolvido com ❤️ | SIGAROUTE v1.0.0**
