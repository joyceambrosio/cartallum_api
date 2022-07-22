const mongoose = require('mongoose');

const instituicaoSchema = new mongoose.Schema(
  {
    nome: {
      type: String,
      required: [true, 'Uma instituição deve conter um nome'],
      unique: true,
      trim: true,
    },
    sigla: {
      type: String,
      trim: true,
    },
    tipo: {
      type: String,
      required: [true, 'Uma instituição deve conter um tipo'],
      default: 'instituicao',
      enum: {
        values: ['matriz', 'instituicao'],
        message: 'O tipo deve ser: matriz, instituicao',
      },
    },
    telefone: {
      type: String,
      required: [true, 'Uma instituição deve conter um telefone'],
    },
    criadoEm: {
      type: Date,
      default: Date.now,
      select: false,
    },
    verificado: {
      type: Boolean,
      default: false,
    },
    verificadoEm: {
      type: Date,
    },
    verificador: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

instituicaoSchema.virtual('membros', {
  ref: 'UserInstituicao',
  foreignField: 'instituicao',
  localField: '_id',
});

instituicaoSchema.virtual('endereco', {
  ref: 'EnderecoInstituicao',
  foreignField: 'instituicao',
  localField: '_id',
});

instituicaoSchema.virtual('cestas', {
  ref: 'Cesta',
  foreignField: 'instituicao',
  localField: '_id',
});

instituicaoSchema.virtual('cestasAno', {
  ref: 'Cesta',
  foreignField: 'instituicao',
  localField: '_id',
  match: {
    criadoEm: {
      $gte: new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
    },
  },
  count: true,
});

instituicaoSchema.virtual('cestasTotal', {
  ref: 'Cesta',
  foreignField: 'instituicao',
  localField: '_id',
  count: true,
});

instituicaoSchema.pre('save', function(next) {
  if (!this.sigla) {
    const matches = this.nome.match(/\b(\w)/g);
    const acronym = matches.join('');
    this.sigla = acronym;
  }
  next();
});

instituicaoSchema.statics.determinarTipo = async function(instituicaoId) {
  const numeroMatriz = await this.aggregate([
    { $match: { tipo: 'matriz' } },
    {
      $group: {
        _id: '$instituicao',
      },
    },
  ]);

  if (numeroMatriz.length === 0) {
    await Instituicao.findByIdAndUpdate(instituicaoId, {
      tipo: 'matriz',
      verificado: true,
      verificadoEm: Date.now(),
    });
  } else {
    await Instituicao.findByIdAndUpdate(instituicaoId, {
      tipo: 'instituicao',
      verificado: false,
      verificadoEm: Date.now(),
    });
  }
};

instituicaoSchema.post('save', function() {
  this.constructor.determinarTipo(this.id);
});

const Instituicao = mongoose.model('Instituicao', instituicaoSchema);

module.exports = Instituicao;
