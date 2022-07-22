const express = require('express');
const configuracaoController = require('../controllers/configuracao_controller');
const authController = require('../controllers/auth_controller');

const router = express.Router();

router
  .route('/')
  .get(configuracaoController.getAllConfiguracoes)
  .post(configuracaoController.createConfiguracao);

router
  .route('/:id')
  .get(configuracaoController.getConfiguracao)
  .patch(configuracaoController.updateConfiguracao)
  .delete(configuracaoController.deleteConfiguracao);

module.exports = router;
