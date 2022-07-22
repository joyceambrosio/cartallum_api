const mongoose = require('mongoose');

const cestaSchema = new mongoose.Schema(
  {
    criadoEm: {
      type: Date,
      default: Date.now,
    },
    divergente: {
      type: Boolean,
      default: false,
    },
    motivoDivergencia: {
      type: String,
    },
    familia: {
      type: mongoose.Schema.ObjectId,
      ref: 'Familia',
      required: [true, 'Uma cesta deve percenter a uma família'],
    },
    instituicao: {
      type: mongoose.Schema.ObjectId,
      ref: 'Instituicao',
      required: [true, 'Uma cesta deve estar relacionada a uma instituição'],
    },
    usuario: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
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

cestaSchema.index({ local: '2dsphere' });

cestaSchema.virtual('nomeInstituicao', {
  ref: 'Instituicao',
  foreignField: '_id',
  localField: 'instituicao',
  justOne: true,
});

cestaSchema.virtual('nomeUsuario', {
  ref: 'User',
  foreignField: '_id',
  localField: 'usuario',
  justOne: true,
});

cestaSchema.pre('save', function(next) {
  this.populate({
    path: 'familia',
    select: '-__v',
  });
  next();
});

cestaSchema.pre('save', function(next) {
  this.populate({
    path: 'instituicao',
    select: '-__v',
  });
  next();
});

cestaSchema.pre('save', function(next) {
  this.populate({
    path: 'user',
    select: '-__v',
  });
  next();
});

const Cesta = mongoose.model('Cesta', cestaSchema);

module.exports = Cesta;
