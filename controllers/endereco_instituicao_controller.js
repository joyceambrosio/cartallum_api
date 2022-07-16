const EnderecoInstituicao = require('../models/endereco_instituicao_model');
const factory = require('./handler_factory');

exports.setForeingKeys = (req, res, next) => {
  if (!req.body.instituicaoId) req.body.instituicao = req.params.instituicaoId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.getAllEnderecos = factory.getAll(EnderecoInstituicao);
exports.getEndereco = factory.getOne(EnderecoInstituicao);
exports.createEndereco = factory.createOneExclusive(EnderecoInstituicao);
exports.updateEndereco = factory.updateOne(EnderecoInstituicao);
exports.deleteEndereco = factory.deleteOne(EnderecoInstituicao);
