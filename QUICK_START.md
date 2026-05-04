# 🚀 GUIA RÁPIDO DE USO - SIGAROUTE

## 1️⃣ Instalação e Startup

```bash
# Instalar dependências
npm install

# Iniciar servidor em desenvolvimento
npm run dev
```

Você verá:
```
🚀 Servidor SIGAROUTE está rodando na porta 3000
📍 Environment: development

Endpoints disponíveis:
  - Health Check: http://localhost:3000/health
```

---

## 2️⃣ Testar Autenticação

### 🔓 Login (obter token)
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "usuario": "admin",
    "senha": "SUA_SENHA_AQUI"
  }'
```

**Resposta:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXN1YXJpbyI6ImFkbWluIiwiZW1haWwiOiJhZG1pbkBzaWdhcm91dGUuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNjcxNTk2MTIzLCJleHAiOjE2NzE2ODI1MjN9.xxx",
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

**Copie o token e use nos próximos passos!**

---

## 3️⃣ Testar Endpoints Protegidos

### 📍 Criar Endereço
```bash
curl -X POST http://localhost:3000/api/enderecos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "rua": "Rua das Flores",
    "numero": "123",
    "bairro": "Centro",
    "cidade": "São Paulo",
    "estado": "SP",
    "cep": "01234-567"
  }'
```

### 👤 Criar Destinatário
```bash
curl -X POST http://localhost:3000/api/destinatarios \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "nome": "João Silva",
    "email": "joao@example.com",
    "telefone": "11987654321",
    "endereco": "Rua das Flores, 123"
  }'
```

### 🚗 Criar Rota
```bash
curl -X POST http://localhost:3000/api/rotas \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "nome": "Rota Zona Sul",
    "descricao": "Entrega para região da Zona Sul de São Paulo"
  }'
```

### 📋 Listar Endereços
```bash
curl -X GET http://localhost:3000/api/enderecos \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

---

## 4️⃣ Acessar Swagger (Documentação Interativa)

Abra no navegador:
```
http://localhost:3000/api-docs
```

Lá você pode:
- ✅ Ver todos os endpoints
- ✅ Testar requisições diretamente
- ✅ Ver schemas e modelos
- ✅ Copiar exemplos de curl

---

## 5️⃣ Executar Testes

### Rodar todos os testes
```bash
npm test
```

**Saída:**
```
✓ AuthService - 9 testes passando
✓ EnderecoService - 11 testes passando
✓ DestinatarioService - 13 testes passando
✓ RotaService - 12 testes passando

Total: 45 testes passando
```

### Ver relatório HTML dos testes
Após rodar os testes, abra:
```
./mochawesome-report/report.html
```

### Rodar testes em modo watch (reload automático)
```bash
npm run test:watch
```

### Gerar relatório de coverage
```bash
npm run test:coverage
```

---

## 6️⃣ Usuários Pré-definidos

| Usuário | Senha | Role |
|---------|-------|------|
| `admin` | *(definida no .env como ADMIN_PASSWORD)* | admin |
| `jonas.arruda` | *(definida no .env como USER_PASSWORD)* | user |

---

## 7️⃣ Testar Sem Token (deve falhar)

```bash
# Isso vai retornar 401 Unauthorized
curl -X GET http://localhost:3000/api/enderecos
```

**Resposta:**
```json
{
  "success": false,
  "error": "Token não fornecido"
}
```

---

## 8️⃣ Health Check (Público - sem token)

```bash
curl -X GET http://localhost:3000/health
```

**Resposta:**
```json
{
  "status": "ok",
  "message": "Servidor SIGAROUTE está rodando"
}
```

---

## 🎯 Checklist de Validação

### Autenticação ✓
- [ ] Fazer login retorna token JWT
- [ ] Token permite acessar rotas protegidas
- [ ] Sem token retorna 401
- [ ] Token inválido retorna 401

### CRUD Endereços ✓
- [ ] Criar endereço
- [ ] Listar endereços
- [ ] Obter endereço por ID
- [ ] Atualizar endereço
- [ ] Deletar endereço
- [ ] Listar por cidade

### CRUD Destinatários ✓
- [ ] Criar destinatário
- [ ] Listar destinatários
- [ ] Obter por ID
- [ ] Obter por email
- [ ] Buscar por nome
- [ ] Atualizar destinatário
- [ ] Deletar destinatário

### CRUD Rotas ✓
- [ ] Criar rota
- [ ] Listar rotas
- [ ] Obter por ID
- [ ] Listar por status
- [ ] Atualizar rota
- [ ] Deletar rota
- [ ] Adicionar endereço à rota
- [ ] Adicionar destinatário à rota

### Testes ✓
- [ ] npm test executa sem erros
- [ ] Gera relatório em mochawesome-report/report.html
- [ ] Testes cobrem services

### Swagger ✓
- [ ] GET /api-docs abre UI
- [ ] Todos endpoints documentados
- [ ] Schemas aparecem corretamente
- [ ] Autenticação JWT documentada

---

## 🛠️ Troubleshooting

### Erro: "Cannot find module"
```bash
rm -rf node_modules package-lock.json
npm install
```

### Erro: "Port 3000 already in use"
```bash
# Mudar porta no .env
PORT=3001
npm run dev
```

### Token expirado
```bash
# Fazer login novamente para obter novo token
curl -X POST http://localhost:3000/auth/login ...
```

### Testes falhando
```bash
# Verificar se há testes antigos rodando
npm run test:watch
# Pressione Ctrl+C para parar

# Rodar testes novamente
npm test
```

---

## 📚 Estrutura de Pastas

```
SIGAROUTE/
├── src/                 # Código-fonte
│   ├── controllers/     # Handlers HTTP
│   ├── services/        # Lógica de negócio
│   ├── repositories/    # Acesso a dados
│   ├── routes/          # Definição de rotas
│   ├── middlewares/     # Middlewares
│   ├── models/          # Modelos/Entidades
│   ├── utils/           # Utilitários
│   ├── swagger/         # Configuração Swagger
│   └── app.js           # Configuração Express
│
├── test/                # Testes
│   ├── services/        # Testes de services
│   └── auth/            # Testes de autenticação
│
├── package.json         # Dependências
├── .env                 # Variáveis de ambiente
├── .mocharc.json        # Configuração Mocha
└── README.md            # Documentação
```

---

## 🎓 Próximas Expansões

1. **Banco de Dados** - Migrar de memória para MongoDB/PostgreSQL
2. **Segurança** - Refresh tokens, rate limiting
3. **Logging** - Winston, logs estruturados
4. **Deploy** - Docker, CI/CD, Kubernetes

---

## 💡 Dicas

1. Use o Swagger (`/api-docs`) para testar visualmente
2. Salve o token em uma variável para facilitar
3. Leia os testes para entender como usar as APIs
4. Verifique o arquivo README.md para documentação completa

---

**🎉 Você está pronto para usar SIGAROUTE!**

Dúvidas? Consulte:
- `README.md` - Documentação completa
- `IMPLEMENTATION_SUMMARY.md` - Resumo das implementações
- `http://localhost:3000/api-docs` - Swagger interativo
