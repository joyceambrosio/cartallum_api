const Configuracao = require('../models/configuracao_model');
const factory = require('./handler_factory');

exports.getAllConfiguracoes = factory.getAll(Configuracao);
exports.getConfiguracao = factory.getOne(Configuracao);
exports.createConfiguracao = factory.createOne(Configuracao);
exports.updateConfiguracao = factory.updateOne(Configuracao);
exports.deleteConfiguracao = factory.deleteOne(Configuracao);
