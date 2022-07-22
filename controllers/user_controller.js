const multer = require('multer');
const User = require('./../models/user_model');
const catchAsync = require('./../utils/catch_async');
const AppError = require('./../utils/app_error');
const factory = require('./handler_factory');

exports.setFieldsForAutoCompete = (req, res, next) => {
  req.query.fields = 'id,name,photo,miniatura,role,email';
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

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

exports.upload = upload.single('photo');

exports.injectPathToUpload = (req, res, next) => {
  req.file.filename = `user-${req.user.id}.jpeg`;
  req.folder = 'users';
  next();
};

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

//https://www.npmjs.com/package/multer-firebase-storage

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'Update de senha não permitido nesta rota. Utilize /updateMyPassword.',
        400
      )
    );
  }

  // 2) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(req.body, 'name', 'email');

  if (req.file) filteredBody.photo = req.firebaseUrl;
  if (req.miniatura) filteredBody.miniatura = req.miniatura;

  // 3) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Rota não definida. Utilize /signup',
  });
};

exports.getUser = factory.getOne(User, {
  path: 'instituicoes',
});

exports.getAllUsers = factory.getAll(User);

// Do NOT update passwords with this!
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);
