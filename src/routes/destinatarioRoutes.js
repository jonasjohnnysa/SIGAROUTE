const express = require('express');
const router = express.Router();
const destinatarioController = require('../controllers/DestinatarioController');

/**
 * @swagger
 * /api/destinatarios:
 *   post:
 *     tags:
 *       - Destinatários
 *     summary: Criar um novo destinatário
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Destinatario'
 *     responses:
 *       201:
 *         description: Destinatário criado com sucesso
 *   get:
 *     tags:
 *       - Destinatários
 *     summary: Listar todos os destinatários
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de destinatários
 */
router.post('/', destinatarioController.criar.bind(destinatarioController));
router.get('/', destinatarioController.listar.bind(destinatarioController));

/**
 * @swagger
 * /api/destinatarios/email:
 *   get:
 *     tags:
 *       - Destinatários
 *     summary: Obter destinatário por email
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Destinatário encontrado
 */
router.get('/email', destinatarioController.obterPorEmail.bind(destinatarioController));

/**
 * @swagger
 * /api/destinatarios/busca/nome:
 *   get:
 *     tags:
 *       - Destinatários
 *     summary: Buscar destinatários por nome
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: nome
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de destinatários encontrados
 */
router.get('/busca/nome', destinatarioController.buscarPorNome.bind(destinatarioController));

/**
 * @swagger
 * /api/destinatarios/{id}:
 *   get:
 *     tags:
 *       - Destinatários
 *     summary: Obter destinatário por ID
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
 *         description: Destinatário encontrado
 *   put:
 *     tags:
 *       - Destinatários
 *     summary: Atualizar destinatário
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
 *             $ref: '#/components/schemas/Destinatario'
 *     responses:
 *       200:
 *         description: Destinatário atualizado
 *   delete:
 *     tags:
 *       - Destinatários
 *     summary: Deletar destinatário
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
 *         description: Destinatário deletado
 */
router.get('/:id', destinatarioController.obterPorId.bind(destinatarioController));
router.put('/:id', destinatarioController.atualizar.bind(destinatarioController));
router.delete('/:id', destinatarioController.deletar.bind(destinatarioController));

/**
 * @swagger
 * /api/destinatarios/{id}/desativar:
 *   patch:
 *     tags:
 *       - Destinatários
 *     summary: Desativar destinatário
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
 *         description: Destinatário desativado
 */
router.patch('/:id/desativar', destinatarioController.desativar.bind(destinatarioController));

module.exports = router;
