// const express = require('express');
// const enderecoController = require('./../controllers/endereco_controller');
// const authController = require('./../controllers/auth_controller');
// const firebase = require('./../utils/firebase');

// const router = express.Router({ mergeParams: true });

// router.use(authController.protect);

// router
//   .route('/')
//   .get(enderecoController.getAllEnderecos)
//   .post(enderecoController.setForeingKeys, enderecoController.createEndereco);

// router
//   .route('/:id')
//   .get(enderecoController.getEndereco)
//   .patch(
//     enderecoController.upload,
//     enderecoController.injectPathToUpload,
//     firebase.uploadImageToFirebase,
//     enderecoController.injectComprovante,
//     enderecoController.updateEndereco
//   )
//   .delete(enderecoController.deleteEndereco);

// module.exports = router;
