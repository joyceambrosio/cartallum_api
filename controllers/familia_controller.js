const multer = require('multer');
const moment = require('moment');
const Familia = require('./../models/familia_model');
const Pessoa = require('../models/pessoa_model');
const Cesta = require('../models/cesta_model');
const factory = require('./handler_factory');
const catchAsync = require('./../utils/catch_async');
const AppError = require('./../utils/app_error');

exports.getAllFamilias = factory.getAll(Familia, [
  {
    path: 'pessoas',
    options: { sort: { responsavel: -1, idade: -1 } },
  },
  {
    path: 'pessoasCount',
  },
  {
    path: 'criancasCount',
  },

  {
    path: 'cestas',
    options: { sort: { criadoEm: -1 } },
    populate: {
      path: 'nomeInstituicao',
      select: 'nome -_id',
    },
  },
  {
    path: 'cestasCount',
  },
]);
exports.getFamilia = factory.getOne(Familia, [
  {
    path: 'pessoas',
    options: { sort: { responsavel: -1, idade: -1 } },
  },
  {
    path: 'pessoasCount',
  },
  {
    path: 'criancasCount',
  },

  {
    path: 'cestas',
    options: { sort: { criadoEm: -1 } },
    populate: {
      path: 'nomeInstituicao',
      select: 'nome -_id',
    },
  },
  {
    path: 'cestasCount',
  },
]);
exports.createFamilia = factory.createOne(Familia);
exports.updateFamilia = factory.updateOne(Familia);
exports.deleteFamilia = factory.deleteOne(Familia);

function intersectArrays(arr, array) {
  const intersect = [];

  for (let i = 0; i < arr.length; i += 1) {
    for (let j = 0; j < array.length; j += 1) {
      if (`${arr[i]}` === `${array[j]}`) {
        intersect.push(arr[i]);
      }
    }
  }
  return intersect;
}

exports.search = catchAsync(async (req, res, next) => {
  const familiaQuery = {};

  // if (req.query.sort) familiaQuery.sort = req.query.sort;

  // console.log(familiaQuery);

  if (req.query.bairro)
    familiaQuery['endereco.bairro'] = {
      $regex: req.query.bairro,
      $options: 'i',
    };

  if (req.query.cep)
    familiaQuery['endereco.cep'] = {
      $regex: req.query.cep,
      $options: 'i',
    };

  console.log(familiaQuery);

  if (req.query.renda)
    familiaQuery.renda = {
      $gte: req.query.renda.gte,
      $lte: req.query.renda.lte,
    };

  const pessoasQuery = {};
  if (req.query.idade) {
    pessoasQuery.dataNascimento = {
      $gte: req.query.idade.gte,
      $lte: req.query.idade.lte,
    };
  }

  if (req.query.searchValue)
    pessoasQuery.$or = [
      { nome: { $regex: req.query.searchValue, $options: 'i' } },
      { cpf: { $regex: req.query.searchValue, $options: 'i' } },
    ];

  const cestasQuery = {};
  if (req.query.cestasComDisparidade) cestasQuery.divergente = true;

  const familiasFiltered = await Familia.find(familiaQuery).distinct('_id');
  const pessoasFiltered = await Pessoa.find(pessoasQuery).distinct('familia');
  const cestasFiltered = await Cesta.find(cestasQuery).distinct('familia');

  let intersect = familiasFiltered;
  if (Object.keys(pessoasQuery).length !== 0)
    intersect = intersectArrays(familiasFiltered, pessoasFiltered);
  if (Object.keys(cestasQuery).length !== 0)
    intersect = intersectArrays(intersect, cestasFiltered);

  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 100;
  const skip = (page - 1) * limit;

  const result = await Familia.find({ _id: { $in: intersect } })

    .populate([
      {
        path: 'pessoas',
        options: { sort: { responsavel: -1, idade: -1 } },
      },
      {
        path: 'pessoasCount',
      },
      {
        path: 'criancasCount',
      },

      {
        path: 'cestas',
        options: { sort: { criadoEm: -1 } },
        populate: {
          path: 'nomeInstituicao',
          select: 'nome -_id',
        },
      },
      {
        path: 'cestasCount',
      },
    ])
    .sort(req.query.sort)
    .skip(skip)
    .limit(limit);
  let finalResult = {};
  finalResult = result.filter(value => {
    let insert = true;

    if (value.pessoasCount == 0) {
      insert = false;
    }

    if (req.query.pessoasCount) {
      if (value.pessoasCount > req.query.pessoasCount.lte) {
        insert = false;
      }
    }

    if (req.query.numeroCriancas) {
      if (value.criancasCount > req.query.numeroCriancas.lte) {
        insert = false;
      }
    }

    if (req.query.mesesSemReceberCestas) {
      if (value.cestasCount > 0) {
        const meses = moment(Date.now()).diff(moment(value.cestas[0].criadoEm));

        if (meses < req.query.mesesSemReceberCestas.gte) {
          insert = false;
        }
      }
    }

    if (req.query.cestasCount) {
      if (
        !(value.cestasCount >= req.query.cestasCount.gte) &&
        !(value.cestasCount <= req.query.cestasCount.lte)
      ) {
        insert = false;
      }
    }

    return insert;
  });

  res.status(200).json({
    status: 'success',
    results: finalResult.length,
    data: {
      data: finalResult,
    },
  });
});

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

  if (req.file.originalname.includes('comprovanteRenda'))
    req.folder = 'comprovante_renda';
  if (req.file.originalname.includes('comprovanteEndereco'))
    req.folder = 'comprovante_endereco';

  req.file.filename = `familia-${req.params.id}.jpeg`;

  next();
};

exports.injectComprovante = (req, res, next) => {
  if (!req.file) return next();

  if (req.file.originalname.includes('comprovanteRenda')) {
    if (req.firebaseUrl) req.body.comprovanteRenda = req.firebaseUrl;
    if (req.firebaseUrl) req.body.dataComprovanteRenda = Date.now();
  }
  if (req.file.originalname.includes('comprovanteEndereco')) {
    if (req.firebaseUrl) req.body.comprovanteEndereco = req.firebaseUrl;
    if (req.firebaseUrl) req.body.dataComprovanteEndereco = Date.now();
  }

  next();
};

exports.reqCheck = (req, res, next) => {
  console.log(req.body);
  console.log(req.query);

  next();
};
