const UserInstituicao = require('./../models/usuario_instituicao_model');
const factory = require('./handler_factory');
const catchAsync = require('./../utils/catch_async');
const AppError = require('./../utils/app_error');
const ObjectId = require('mongodb').ObjectID;

exports.setForeingKeys = (req, res, next) => {
  if (!req.body.instituicao) req.body.instituicao = req.params.instituicaoId;
  if (!req.body.user)
    req.body.usuario = req.params.id ? req.params.id : req.user.id;
  next();
};

exports.removeFields = (req, res, next) => {
  if (!req.body.instituicao) delete req.body.instituicao;
  if (!req.body.usuario) delete req.body.usuario;
  next();
};

exports.getRelationshipId = catchAsync(async (req, res, next) => {
  const doc = await UserInstituicao.find({
    usuario: ObjectId(req.params.id),
  });

  if (!doc) {
    return next(
      new AppError('Nenhum documento encontrado para o id fornecido.', 404)
    );
  }
  req.params.id = doc.map(r => r._id);
  next();
});

exports.getAllUsersInstituicao = factory.getAll(UserInstituicao);
exports.getUserInstituicao = factory.getOne(UserInstituicao);
exports.createUserInstituicao = factory.createOne(UserInstituicao);
exports.updateUserInstituicao = factory.updateOne(UserInstituicao);
exports.deleteUserInstituicao = factory.deleteOne(UserInstituicao);
