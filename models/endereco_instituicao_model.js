const mongoose = require('mongoose');

const enderecoInstituicaoSchema = new mongoose.Schema(
  {
    tipoEndereco: {
      type: String,
      required: [true, 'O endereço deve ter um tipo'],
      default: 'matriz',
      enum: {
        values: ['matriz', 'filial'],
        message: 'Por favor, insira um tpo válido: matriz ou filial',
      },
    },
    logradouro: {
      type: String,
      required: [true, 'O endereço deve conter um logradouro'],
      maxlength: [100, 'O endereço deve conter entre 5 e 100 caracteres'],
      minlength: [5, 'O endereço deve conter entre 5 e 100 caracteres'],
    },
    bairro: {
      type: String,
      required: [true, 'O endereço deve conter um bairro'],
    },
    numero: {
      type: String,
    },
    complemento: {
      type: String,
    },
    pontoReferencia: {
      type: String,
    },
    cep: {
      type: String,
      required: [true, 'O endereço deve conter um cep'],
    },
    pais: {
      type: String,
      default: 'Brasil',
    },
    estado: {
      type: String,
      required: [true, 'O endereço deve conter um estado'],
      enum: {
        values: [
          'AC',
          'AL',
          'AP',
          'AM',
          'BA',
          'CE',
          'DF',
          'ES',
          'GO',
          'MA',
          'MT',
          'MS',
          'MG',
          'PA',
          'PB',
          'PR',
          'PE',
          'PI',
          'RJ',
          'RN',
          'RS',
          'RO',
          'RR',
          'SC',
          'SP',
          'SE',
          'TO',
        ],
        message: 'Por favor, insira um estado válido',
      },
    },
    cidade: {
      type: String,
      required: [true, 'O endereço deve conter uma cidade'],
    },
    local: {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
    },
    instituicao: {
      type: mongoose.Schema.ObjectId,
      ref: 'Instituicao',
      required: [true, 'O endereço deve pertencer a uma instituição'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

enderecoInstituicaoSchema.index({ local: '2dsphere' });

enderecoInstituicaoSchema.pre('save', function(next) {
  this.populate({
    path: 'instituicao',
    select: '-__v',
  });
  next();
});

const Endereco = mongoose.model(
  'EnderecoInstituicao',
  enderecoInstituicaoSchema
);

module.exports = Endereco;
