const express = require('express');
const router = express.Router();
const enderecoController = require('../controllers/EnderecoController');

/**
 * @swagger
 * /api/enderecos:
 *   post:
 *     tags:
 *       - Endereços
 *     summary: Criar um novo endereço
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Endereco'
 *     responses:
 *       201:
 *         description: Endereço criado com sucesso
 *   get:
 *     tags:
 *       - Endereços
 *     summary: Listar todos os endereços
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de endereços
 */
router.post('/', enderecoController.criar.bind(enderecoController));
router.get('/', enderecoController.listar.bind(enderecoController));

/**
 * @swagger
 * /api/enderecos/cidade:
 *   get:
 *     tags:
 *       - Endereços
 *     summary: Listar endereços por cidade
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: cidade
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de endereços da cidade
 */
router.get('/cidade', enderecoController.listarPorCidade.bind(enderecoController));

/**
 * @swagger
 * /api/enderecos/{id}:
 *   get:
 *     tags:
 *       - Endereços
 *     summary: Obter endereço por ID
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
 *         description: Endereço encontrado
 *       404:
 *         description: Endereço não encontrado
 *   put:
 *     tags:
 *       - Endereços
 *     summary: Atualizar endereço
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
 *             $ref: '#/components/schemas/Endereco'
 *     responses:
 *       200:
 *         description: Endereço atualizado
 *   delete:
 *     tags:
 *       - Endereços
 *     summary: Deletar endereço
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
 *         description: Endereço deletado
 */
router.get('/:id', enderecoController.obterPorId.bind(enderecoController));
router.put('/:id', enderecoController.atualizar.bind(enderecoController));
router.delete('/:id', enderecoController.deletar.bind(enderecoController));

/**
 * @swagger
 * /api/enderecos/{id}/desativar:
 *   patch:
 *     tags:
 *       - Endereços
 *     summary: Desativar endereço
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
 *         description: Endereço desativado
 */
router.patch('/:id/desativar', enderecoController.desativar.bind(enderecoController));

module.exports = router;
