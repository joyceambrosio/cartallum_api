const multer = require('multer');
const Endereco = require('../models/endereco_model');
const factory = require('./handler_factory');
const AppError = require('./../utils/app_error');

exports.setForeingKeys = (req, res, next) => {
  if (!req.body.familia) req.body.familia = req.params.familiaId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('O arquivo da imagem não é válido.', 400), false);
  }
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

exports.upload = upload.single('comprovante');

exports.injectPathToUpload = (req, res, next) => {
  if (!req.file) return next();
  req.file.filename = `familia-${req.params.familiaId}.jpeg`;
  req.folder = 'comprovante_endereco';
  next();
};

exports.injectComprovante = (req, res, next) => {
  if (!req.file) return next();
  if (req.firebaseUrl) req.body.comprovante = req.firebaseUrl;
  if (req.firebaseUrl) req.body.dataComprovante = Date.now();
  next();
};

exports.createEndereco = factory.createOneExclusive(Endereco);
exports.updateEndereco = factory.updateOne(Endereco);
exports.deleteEndereco = factory.deleteOne(Endereco);
