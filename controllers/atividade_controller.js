const Atividade = require('./../models/atividade_model');
const factory = require('./handler_factory');

exports.setForeingKeys = (req, res, next) => {
  if (!req.body.user) req.body.usuario = req.user.id;
  next();
};

exports.getAllAtividades = factory.getAll(Atividade, [
  { path: 'nomeInstituicao', select: 'nome' },
  { path: 'nomeUser', select: 'name' },
]);
exports.getAtividade = factory.getOne(Atividade);
exports.createAtividade = factory.createOne(Atividade);
