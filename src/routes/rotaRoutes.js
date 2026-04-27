const express = require('express');
const router = express.Router();
const rotaController = require('../controllers/RotaController');

/**
 * @swagger
 * /api/rotas:
 *   post:
 *     tags:
 *       - Rotas
 *     summary: Criar uma nova rota
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Rota'
 *     responses:
 *       201:
 *         description: Rota criada com sucesso
 *   get:
 *     tags:
 *       - Rotas
 *     summary: Listar todas as rotas
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de rotas
 */
router.post('/', rotaController.criar.bind(rotaController));
router.get('/', rotaController.listar.bind(rotaController));

/**
 * @swagger
 * /api/rotas/status:
 *   get:
 *     tags:
 *       - Rotas
 *     summary: Listar rotas por status
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         required: true
 *         schema:
 *           type: string
 *           enum: [ativa, inativa, pausada]
 *     responses:
 *       200:
 *         description: Lista de rotas com status informado
 */
router.get('/status', rotaController.listarPorStatus.bind(rotaController));

/**
 * @swagger
 * /api/rotas/{id}:
 *   get:
 *     tags:
 *       - Rotas
 *     summary: Obter rota por ID
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Rota encontrada
 *   put:
 *     tags:
 *       - Rotas
 *     summary: Atualizar rota
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Rota'
 *     responses:
 *       200:
 *         description: Rota atualizada
 *   delete:
 *     tags:
 *       - Rotas
 *     summary: Deletar rota
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Rota deletada
 */
router.get('/:id', rotaController.obterPorId.bind(rotaController));
router.put('/:id', rotaController.atualizar.bind(rotaController));
router.delete('/:id', rotaController.deletar.bind(rotaController));

/**
 * @swagger
 * /api/rotas/{id}/desativar:
 *   patch:
 *     tags:
 *       - Rotas
 *     summary: Desativar rota
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Rota desativada
 */
router.patch('/:id/desativar', rotaController.desativar.bind(rotaController));

/**
 * @swagger
 * /api/rotas/endereco/adicionar:
 *   post:
 *     tags:
 *       - Rotas
 *     summary: Adicionar endereço à rota
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rotaId:
 *                 type: string
 *               enderecoId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Endereço adicionado à rota
 */
router.post('/endereco/adicionar', rotaController.adicionarEndereco.bind(rotaController));

/**
 * @swagger
 * /api/rotas/endereco/remover:
 *   post:
 *     tags:
 *       - Rotas
 *     summary: Remover endereço da rota
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rotaId:
 *                 type: string
 *               enderecoId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Endereço removido da rota
 */
router.post('/endereco/remover', rotaController.removerEndereco.bind(rotaController));

/**
 * @swagger
 * /api/rotas/destinatario/adicionar:
 *   post:
 *     tags:
 *       - Rotas
 *     summary: Adicionar destinatário à rota
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rotaId:
 *                 type: string
 *               destinatarioId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Destinatário adicionado à rota
 */
router.post('/destinatario/adicionar', rotaController.adicionarDestinatario.bind(rotaController));

/**
 * @swagger
 * /api/rotas/destinatario/remover:
 *   post:
 *     tags:
 *       - Rotas
 *     summary: Remover destinatário da rota
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rotaId:
 *                 type: string
 *               destinatarioId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Destinatário removido da rota
 */
router.post('/destinatario/remover', rotaController.removerDestinatario.bind(rotaController));

module.exports = router;
