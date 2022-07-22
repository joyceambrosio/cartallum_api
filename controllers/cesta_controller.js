const Cesta = require('./../models/cesta_model');
const factory = require('./handler_factory');

exports.setForeingKeys = (req, res, next) => {
  if (!req.body.instituicao) req.body.instituicao = req.params.instituicaoId;
  if (!req.body.familia) req.body.familia = req.params.id;
  if (!req.body.user) req.body.usuario = req.user.id;
  next();
};

exports.getAllCestas = factory.getAll(Cesta);
exports.getCesta = factory.getOne(Cesta);
exports.createCesta = factory.createOne(Cesta);
exports.updateCesta = factory.updateOne(Cesta);
exports.deleteCesta = factory.deleteOne(Cesta);
