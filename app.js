const express = require('express');
const swaggerUi = require('swagger-ui-express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const compression = require('compression');

const AppError = require('./utils/app_error');
const globalErrorHandler = require('./controllers/error_controller');
const userRouter = require('./routes/user_routes');
const enderecoInstituicaoRouter = require('./routes/endereco_instituicao_routes');
const pessoaRouter = require('./routes/pessoa_routes');
const instituicaoRouter = require('./routes/instituicao_routes');
const familiaRouter = require('./routes/familia_router');
const userInstituicaoRouter = require('./routes/user_instituicao_routes');
const atividadesRouter = require('./routes/atividade_routes');
const configuracaoRouter = require('./routes/configuracoes_routes');

const swaggerFile = require('./swagger/swagger_output.json');

const app = express();

// 1) GLOBAL MIDDLEWARES
// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests from same API
const limiter = rateLimit({
  max: 1000000,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

app.use(compression());
// Serving static files
app.use(express.static(`${__dirname}/public`));

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.headers);
  next();
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));
// 3) ROUTES
app.use('/api/v1/users', userRouter);
app.use('/api/v1/enderecosInstituicao', enderecoInstituicaoRouter);
app.use('/api/v1/pessoas', pessoaRouter);
app.use('/api/v1/familias', familiaRouter);
app.use('/api/v1/instituicoes', instituicaoRouter);
app.use('/api/v1/userInstituicao', userInstituicaoRouter);
app.use('/api/v1/atividades', atividadesRouter);
app.use('/api/v1/configuracao', configuracaoRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
