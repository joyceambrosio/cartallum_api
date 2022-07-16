const express = require('express');
const enderecoInstituicaoController = require('../controllers/endereco_instituicao_controller');
const authController = require('../controllers/auth_controller');

const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router
  .route('/')
  .get(enderecoInstituicaoController.getAllEnderecos)
  .post(
    enderecoInstituicaoController.setForeingKeys,
    enderecoInstituicaoController.createEndereco
  );

router
  .route('/:id')
  .get(enderecoInstituicaoController.getEndereco)
  .patch(enderecoInstituicaoController.updateEndereco)
  .delete(enderecoInstituicaoController.deleteEndereco);

module.exports = router;
