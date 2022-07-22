const mongoose = require('mongoose');

const atividadeSchema = new mongoose.Schema(
  {
    criadoEm: {
      type: Date,
      default: Date.now,
    },
    metodo: {
      type: String,
      enum: {
        values: ['GET', 'POST', 'PATCH', 'DELETE'],
      },
    },
    level: {
      type: String,
      enum: {
        values: [
          'Debug',
          'Information',
          'Warning',
          'Error',
          'Critical',
          'None',
        ],
      },
    },
    result: {
      type: String,
    },
    mensagem: {
      type: String,
    },
    mensagemAmigavel: {
      type: String,
    },
    familia: {
      type: mongoose.Schema.ObjectId,
      ref: 'Familia',
    },
    instituicao: {
      type: mongoose.Schema.ObjectId,
      ref: 'Instituicao',
    },
    usuario: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
    pessoa: {
      type: mongoose.Schema.ObjectId,
      ref: 'Pessoa',
    },
    cesta: {
      type: mongoose.Schema.ObjectId,
      ref: 'Cesta',
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
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

atividadeSchema.index({ local: '2dsphere' });

atividadeSchema.pre('save', function(next) {
  this.populate({
    path: 'familia',
    select: '-__v',
  });
  next();
});

atividadeSchema.pre('save', function(next) {
  this.populate({
    path: 'instituicao',
    select: '-__v',
  });
  next();
});

atividadeSchema.virtual('nomeInstituicao', {
  ref: 'Instituicao',
  foreignField: '_id',
  localField: 'instituicao',
  justOne: true,
});

atividadeSchema.virtual('nomeUser', {
  ref: 'User',
  foreignField: '_id',
  localField: 'usuario',
  justOne: true,
});

atividadeSchema.pre('save', function(next) {
  this.populate({
    path: 'user',
    select: '-__v',
  });
  next();
});

atividadeSchema.pre('save', function(next) {
  this.populate({
    path: 'pessoa',
    select: '-__v',
  });
  next();
});

atividadeSchema.pre('save', function(next) {
  this.populate({
    path: 'cesta',
    select: '-__v',
  });
  next();
});

const Atividade = mongoose.model('Atividade', atividadeSchema);

module.exports = Atividade;
