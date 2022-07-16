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
    path: 'endereco',
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
    path: 'endereco',
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

  const result = await Familia.find({ _id: { $in: intersect } }).populate([
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
      path: 'endereco',
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

  // console.log(req.query);
  let finalResult = {};
  //console.log(req.query.cestasCount);
  finalResult = result.filter(value => {
    let insert = true;

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
      //console.log(value.cestasCount);
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
    // finalResult: finalResult.length,
    data: {
      cestasFiltered: cestasFiltered,
      pessoasFiltered: pessoasFiltered,
      familiasFiltered: familiasFiltered,
      intersect: intersect,
      data: finalResult,

      // data: result,
    },
  });

  // let filter = {};

  // if (req.params.familiaId)
  //   filter = {
  //     familia: req.params.familiaId,
  //   };

  // const features = new APIFeatures(Familia.find(filter), familiaQuery)
  //   .filter()
  //   .sort()
  //   .limitFields()
  //   .paginate();

  // const doc = await features.query;

  // const cursor = await Familia.find(features.query)
  //   .populate({
  //     path: 'pessoas',
  //   })
  //   .cursor();

  // const regexSearch = new RegExp(searchValue, 'i');

  // const docs = [];
  // for (
  //   let child = await cursor.next();
  //   child != null;
  //   child = await cursor.next()
  // ) {
  //   for (let i = 0; i < child.pessoas.length; i++) {
  //     if (searchValue) {
  //       if (
  //         child.pessoas[i].nome.match(regexSearch) ||
  //         child.pessoas[i].cpf.match(regexSearch)
  //       ) {
  //         docs.push(child);

  //         break;
  //       }
  //     } else {
  //     }
  //   }
  // }

  // if (!docs || docs.length == 0) {
  //   return next(new AppError('Nenhum documento encontrado a busca.', 404));
  // }

  // res.status(200).json({
  //   status: 'success',
  //   results: doc.length,
  //   data: {
  //     data: docs,
  //   },
  // });
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
  req.file.filename = `familia-${req.params.id}.jpeg`;
  req.folder = 'comprovante_renda';

  next();
};

exports.injectComprovante = (req, res, next) => {
  if (!req.file) return next();
  if (req.firebaseUrl) req.body.comprovanteRenda = req.firebaseUrl;
  if (req.firebaseUrl) req.body.dataComprovante = Date.now();
  next();
};
