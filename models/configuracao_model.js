const mongoose = require('mongoose');

const configuracaoSchema = new mongoose.Schema(
  {
    descricao: {
      type: String,
    },
    mensagemErro: {
      type: String,
    },
    usa: {
      type: Boolean,
      default: false,
    },
    restringe: {
      type: Boolean,
      default: false,
    },
    limite: {
      type: Number,
      default: 3,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Configuracao = mongoose.model('Configuracao', configuracaoSchema);

module.exports = Configuracao;
