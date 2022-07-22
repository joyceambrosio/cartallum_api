const Instituicao = require('./../models/instituicao_model');
const UsuarioInstituicao = require('./../models/usuario_instituicao_model');
const Usuario = require('./../models/user_model');
const factory = require('./handler_factory');
const catchAsync = require('./../utils/catch_async');
const AppError = require('./../utils/app_error');

const APIFeatures = require('./../utils/api_features');

exports.setForeingKeys = (req, res, next) => {
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.getAllInstituicoes = factory.getAll(Instituicao);

exports.getAllInstituicoesRelatorio = factory.getAll(Instituicao, [
  {
    path: 'membros',
    populate: [{ path: 'user', model: 'user', select: '-__v' }],
  },
  {
    path: 'endereco',
    select: '-__v',
  },
  {
    path: 'cestas',
  },
  {
    path: 'cestasAno',
  },
  {
    path: 'cestasTotal',
  },
]);

exports.getInstituicao = factory.getOne(Instituicao, [
  {
    path: 'membros',
    populate: [{ path: 'user', model: 'user', select: '-__v' }],
  },
  {
    path: 'endereco',
    select: '-__v',
  },
  {
    path: 'cestasAno',
  },
  {
    path: 'cestasTotal',
  },
]);
//exports.createInstituicao = factory.createOne(Instituicao);
exports.updateInstituicao = factory.updateOne(Instituicao);
exports.deleteInstituicao = factory.deleteOne(Instituicao);

exports.createInstituicao = catchAsync(async (req, res, next) => {
  const doc = await Instituicao.create(req.body);

  const relacaoDoc = await UsuarioInstituicao.create({
    role: 'admin',
    instituicao: doc.id,
    usuario: req.user.id,
  });

  const full = await Instituicao.findById(doc.id).populate({
    path: 'membros',
    populate: [{ path: 'user', model: 'user', select: '-__v' }],
  });

  if (full.tipo === 'matriz') {
    await Usuario.findByIdAndUpdate(
      req.user.id,
      {
        role: 'admin',
      },
      {
        new: true,
        runValidators: false,
      }
    );
  }

  res.status(201).json({
    status: 'success',
    data: {
      data: full,
      adm: relacaoDoc,
    },
  });
});

exports.search = catchAsync(async (req, res, next) => {
  const field = req.query.search;
  const { searchValue } = req.query;

  let filter = {};

  if (field && searchValue) {
    const regexSearch = new RegExp(searchValue, 'ig');

    filter = {
      nome: { $regex: regexSearch },
    };
  }

  const features = new APIFeatures(Instituicao.find(filter), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const doc = await features.query;

  if (!doc || doc.length === 0) {
    return next(new AppError('Nenhum documento encontrado a busca.', 404));
  }
  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: doc.length,
    data: {
      data: doc,
    },
  });
});
