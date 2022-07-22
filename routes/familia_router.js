const express = require('express');
const familiaController = require('./../controllers/familia_controller');
const pessoaRouter = require('./../routes/pessoa_routes');
const firebase = require('./../utils/firebase');

const router = express.Router();

router.use('/:familiaId/pessoas', pessoaRouter);
router.route('/search').get(familiaController.search);

router
  .route('/')
  .get(familiaController.getAllFamilias)
  .post(familiaController.createFamilia);

router
  .route('/:id')
  .get(familiaController.getFamilia)
  .patch(
    familiaController.reqCheck,
    familiaController.upload,
    familiaController.injectPathToUpload,
    firebase.uploadImageToFirebase,
    familiaController.injectComprovante,
    familiaController.updateFamilia
  )
  .delete(familiaController.deleteFamilia);

module.exports = router;
