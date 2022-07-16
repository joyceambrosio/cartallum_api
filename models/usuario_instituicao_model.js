const mongoose = require('mongoose');

const userInstituicaoSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
  },
  usuario: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  instituicao: {
    type: mongoose.Schema.ObjectId,
    ref: 'Instituicao',
  },
  active: {
    type: Boolean,
    default: true,
  },
  criadoEm: {
    type: Date,
    default: Date.now,
  },
});

userInstituicaoSchema.index({ instituicao: 1, usuario: 1 }, { unique: true });

const UserInstituicao = mongoose.model(
  'UserInstituicao',
  userInstituicaoSchema
);

module.exports = UserInstituicao;
