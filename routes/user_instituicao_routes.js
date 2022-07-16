const express = require('express');
const userInstituicaoController = require('../controllers/user_instituicao_controller');
const authController = require('../controllers/auth_controller');

const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router.route('/').get(userInstituicaoController.getAllUsersInstituicao);
// .post(
//   userInstituicaoController.setForeingKeys,
//   userInstituicaoController.createUserInstituicao
// );

router
  .route('/:id')
  .post(
    userInstituicaoController.setForeingKeys,
    userInstituicaoController.createUserInstituicao
  )
  .get(
    userInstituicaoController.setForeingKeys,
    userInstituicaoController.getRelationshipId,
    userInstituicaoController.getUserInstituicao
  )
  .patch(
    userInstituicaoController.getRelationshipId,
    userInstituicaoController.removeFields,
    userInstituicaoController.updateUserInstituicao
  )
  .delete(
    userInstituicaoController.getRelationshipId,
    userInstituicaoController.deleteUserInstituicao
  );

module.exports = router;
