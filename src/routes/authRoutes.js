const express = require('express');
const router = express.Router();
const authController = require('../controllers/AuthController');
const { authMiddleware, adminMiddleware } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags:
 *       - Autenticação
 *     summary: Realiza login e retorna JWT token
 *     description: Autentica um usuário e retorna um token JWT para acessar as APIs protegidas
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/LoginResponse'
 *                 message:
 *                   type: string
 *       400:
 *         description: Usuário ou senha não fornecidos
 *       401:
 *         description: Credenciais inválidas
 */
router.post('/login', authController.login.bind(authController));

/**
 * @swagger
 * /auth/usuarios:
 *   get:
 *     tags:
 *       - Autenticação
 *     summary: Lista todos os usuários
 *     description: Retorna lista de usuários (apenas para admin)
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuários
 *       401:
 *         description: Token não fornecido ou inválido
 *       403:
 *         description: Acesso negado (permissão de admin necessária)
 */
router.get('/usuarios', authMiddleware, adminMiddleware, authController.listarUsuarios.bind(authController));

/**
 * @swagger
 * /auth/perfil:
 *   get:
 *     tags:
 *       - Autenticação
 *     summary: Obtém perfil do usuário logado
 *     description: Retorna informações do usuário autenticado
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil do usuário
 *       401:
 *         description: Token não fornecido ou inválido
 */
router.get('/perfil', authMiddleware, authController.obterMeuPerfil.bind(authController));

module.exports = router;
