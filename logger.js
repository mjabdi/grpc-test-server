const pino = require('pino')({
  level : 'info'
});

module.exports = () =>
{
  return pino;
} 