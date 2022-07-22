const express = require('express');
const atividadeController = require('../controllers/atividade_controller');
const authController = require('../controllers/auth_controller');

const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router
  .route('/')
  .get(atividadeController.getAllAtividades)
  .post(
    atividadeController.setForeingKeys,
    atividadeController.createAtividade
  );

router
  .route('/:id')
  .post(atividadeController.setForeingKeys, atividadeController.createAtividade)
  .get(atividadeController.setForeingKeys, atividadeController.getAtividade);

module.exports = router;
