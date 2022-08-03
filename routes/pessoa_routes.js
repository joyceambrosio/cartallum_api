const express = require('express');
const pessoaController = require('./../controllers/pessoa_controller');
const authController = require('./../controllers/auth_controller');
const firebase = require('./../utils/firebase');

const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router
  .route('/')
  .get(pessoaController.getAllPessoas)
  .post(
    pessoaController.setForeingKeys,
    pessoaController.upload,
    pessoaController.injectPathToUpload,
    firebase.uploadImageToFirebase,
    pessoaController.injectComprovante,
    pessoaController.createPessoa
  );

router
  .route('/:id')
  .get(pessoaController.getPessoa)
  .patch(
    pessoaController.upload,
    pessoaController.injectPathToUpload,
    firebase.uploadImageToFirebase,
    pessoaController.injectComprovante,
    pessoaController.updatePessoa
  )
  .delete(pessoaController.deletePessoa);

module.exports = router;
