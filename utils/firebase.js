const admin = require('firebase-admin');
const AppError = require('./../utils/app_error');

const serviceAccount = require('./../firebase_key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.FIREBASE_BUCKET,
});

const bucket = admin.storage().bucket();

exports.uploadImageToFirebase = (req, res, next) => {
  if (!req.file) return next();

  const blob = bucket.file(`${req.folder}/${req.file.filename}`);

  if (!req.folder) req.folder = '/o%2F';
  if (req.folder) req.folder = `/o/${req.folder}%2F`;

  blob
    .createWriteStream({
      metadata: {
        contentType: req.file.mimetype,
      },
    })
    .on('error', function() {
      next(new AppError('Houve um erro no upload do arquivo', 500));
    })
    .on('finish', () => {
      blob.makePublic().then(function() {
        req.firebaseUrl = `https://firebasestorage.googleapis.com/v0/b/${
          bucket.name
        }${req.folder}${req.file.filename}?alt=media`;
        next();
      });
    })
    .end(req.file.buffer);
};
