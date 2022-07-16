const express = require('express');
const cestaController = require('../controllers/cesta_controller');
const authController = require('../controllers/auth_controller');

const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router
  .route('/')
  .get(cestaController.getAllCestas)
  .post(cestaController.setForeingKeys, cestaController.createCesta);

router
  .route('/:id')
  .post(cestaController.setForeingKeys, cestaController.createCesta)
  .get(cestaController.setForeingKeys, cestaController.getCesta)
  .patch(cestaController.updateCesta)
  .delete(cestaController.deleteCesta);

module.exports = router;
