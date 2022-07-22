const mongoose = require('mongoose');

const familiaSchema = new mongoose.Schema(
  {
    renda: {
      type: Number,
      required: [true, 'Uma família deve conter uma renda'],
      trim: true,
    },
    criadoEm: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: Boolean,
      default: false,
    },
    motivoStatus: {
      type: String,
      enum: {
        values: ['novocadastro', 'limiteexcedido', 'fraude', 'ok'],
        message: 'O motivo deve ser: novocadastro, limiteexcedido, fraude',
      },
      default: 'novocadastro',
    },
    statusEm: {
      type: Date,
      default: Date.now,
    },
    responsavelStatus: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
    comprovanteRenda: {
      type: String,
    },
    dataComprovanteRenda: {
      type: Date,
    },
    comprovanteEndereco: {
      type: String,
    },
    dataComprovanteEndereco: {
      type: Date,
    },
    endereco: {
      logradouro: {
        type: String,

        maxlength: [100, 'O endereço deve conter entre 5 e 100 caracteres'],
        minlength: [5, 'O endereço deve conter entre 5 e 100 caracteres'],
      },
      bairro: {
        type: String,
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
      },
      pais: {
        type: String,
        default: 'Brasil',
      },
      estado: {
        type: String,

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
      },
      criadoEm: {
        type: Date,
        default: Date.now,
      },
      local: {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
      },
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual populate
familiaSchema.virtual('pessoas', {
  ref: 'Pessoa',
  foreignField: 'familia',
  localField: '_id',
});

familiaSchema.virtual('pessoasCount', {
  ref: 'Pessoa',
  foreignField: 'familia',
  localField: '_id',
  count: true,
});

familiaSchema.virtual('criancasCount', {
  ref: 'Pessoa',
  foreignField: 'familia',
  localField: '_id',
  match: {
    dataNascimento: {
      $gte: new Date(new Date().setFullYear(new Date().getFullYear() - 18)),
    },
  },
  count: true,
});

familiaSchema.virtual('cestas', {
  ref: 'Cesta',
  foreignField: 'familia',
  localField: '_id',
  match: {
    criadoEm: {
      $gte: new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
    },
  },
});

familiaSchema.virtual('cestasCount', {
  ref: 'Cesta',
  foreignField: 'familia',
  localField: '_id',
  match: {
    criadoEm: {
      $gte: new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
    },
  },
  count: true,
});

familiaSchema.methods.atualizarStatus = function(usuario, status, motivo) {
  this.status = status;
  this.motivoStatus = motivo;
  this.statusEm = Date.now();
  this.responsavelStatus = usuario;
};

const Familia = mongoose.model('Familia', familiaSchema);

module.exports = Familia;
