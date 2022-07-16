const express = require('express');
const instituicaoController = require('./../controllers/instituicao_controller');
const authController = require('./../controllers/auth_controller');
const enderecoInstituicaoRouter = require('./../routes/endereco_instituicao_routes');
const userInstituicaoRouter = require('./../routes/user_instituicao_routes');
const cestaRouter = require('./../routes/cesta_routes');

const router = express.Router();

router.use(authController.protect);

router.use('/:instituicaoId/endereco', enderecoInstituicaoRouter);
router.use('/:instituicaoId/membros', userInstituicaoRouter);
router.use('/:instituicaoId/cestas', cestaRouter);

router.route('/search').get(instituicaoController.search);

router
  .route('/')
  .get(instituicaoController.getAllInstituicoes)
  .post(instituicaoController.createInstituicao);

router
  .route('/:id')
  .get(instituicaoController.getInstituicao)
  .patch(instituicaoController.updateInstituicao)
  .delete(instituicaoController.deleteInstituicao);

module.exports = router;
