const mongoose = require('mongoose');
const moment = require('moment');

const pessoaSchema = new mongoose.Schema(
  {
    nome: {
      type: String,
      required: [true, 'Uma pessoa deve conter um nome'],
      trim: true,
    },
    cpf: {
      type: String,
      index: true,
      unique: true,
      sparse: true,
      trim: true,
    },
    dataNascimento: {
      type: Date,
      required: [true, 'Uma pessoa deve conter uma data de nascimento'],
    },
    sexo: {
      type: String,
      enum: {
        values: ['f', 'm', 'o'],
        message: 'O sexo deve ser feminino, masculino ou outro',
      },
    },
    responsavel: {
      type: Boolean,
      default: false,
    },
    telefone: {
      type: String,
    },
    comprovante: {
      type: String,
    },
    dataComprovante: {
      type: Date,
    },
    criadoEm: {
      type: Date,
      default: Date.now,
    },
    familia: {
      type: mongoose.Schema.ObjectId,
      ref: 'Familia',
      required: [true, 'Uma pessoa deve pertencer a uma família'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

pessoaSchema.virtual('idade').get(function() {
  return Math.floor(moment().diff(this.dataNascimento, 'years', true));
});

// pessoaSchema.index({ cpf: 1 }, { unique: true, sparse: true });

pessoaSchema.index({
  nome: 'text',
  cpf: 'text',
});

pessoaSchema.pre('save', function(next) {
  this.populate({
    path: 'familia',
    select: '-__v',
  });

  next();
});
// pessoaSchema.pre(/^find/, function(next) {
//   this.populate({
//     path: 'familia',
//     select: '-__v',
//   });

//   next();
// });

const Pessoa = mongoose.model('Pessoa', pessoaSchema);

module.exports = Pessoa;
