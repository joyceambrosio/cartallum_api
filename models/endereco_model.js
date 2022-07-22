// const mongoose = require('mongoose');

// const enderecoSchema = new mongoose.Schema(
//   {
//     logradouro: {
//       type: String,
//       required: [true, 'O endereço deve conter um logradouro'],
//       maxlength: [100, 'O endereço deve conter entre 5 e 100 caracteres'],
//       minlength: [5, 'O endereço deve conter entre 5 e 100 caracteres'],
//     },
//     bairro: {
//       type: String,
//       required: [true, 'O endereço deve conter um bairro'],
//     },
//     numero: {
//       type: String,
//     },
//     complemento: {
//       type: String,
//     },
//     pontoReferencia: {
//       type: String,
//     },
//     cep: {
//       type: String,
//       required: [true, 'O endereço deve conter um cep'],
//     },
//     pais: {
//       type: String,
//       default: 'Brasil',
//     },
//     estado: {
//       type: String,
//       required: [true, 'O endereço deve conter um estado'],
//       enum: {
//         values: [
//           'AC',
//           'AL',
//           'AP',
//           'AM',
//           'BA',
//           'CE',
//           'DF',
//           'ES',
//           'GO',
//           'MA',
//           'MT',
//           'MS',
//           'MG',
//           'PA',
//           'PB',
//           'PR',
//           'PE',
//           'PI',
//           'RJ',
//           'RN',
//           'RS',
//           'RO',
//           'RR',
//           'SC',
//           'SP',
//           'SE',
//           'TO',
//         ],
//         message: 'Por favor, insira um estado válido',
//       },
//     },
//     cidade: {
//       type: String,
//       required: [true, 'O endereço deve conter uma cidade'],
//     },
//     criadoEm: {
//       type: Date,
//       default: Date.now,
//     },
//     local: {
//       type: {
//         type: String,
//         default: 'Point',
//         enum: ['Point'],
//       },
//       coordinates: [Number],
//     },
//     familia: {
//       type: mongoose.Schema.ObjectId,
//       ref: 'Familia',
//       required: [true, 'O endereço deve pertencer a uma família'],
//     },
//     comprovante: {
//       type: String,
//     },
//     dataComprovante: {
//       type: Date,
//     },
//   },
//   {
//     toJSON: { virtuals: true },
//     toObject: { virtuals: true },
//   }
// );

// enderecoSchema.index({ local: '2dsphere' });

// enderecoSchema.pre('save', function(next) {
//   this.populate({
//     path: 'familia',
//     select: '-__v',
//   });
//   next();
// });

// const Endereco = mongoose.model('Endereco', enderecoSchema);

// module.exports = Endereco;
