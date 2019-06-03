const grpcServer = {};
const {createServer} = require('grpc-kit');
const logger = require('./logger')();

let server;
grpcServer.start = () =>
{
    server = createServer();

    server.use({
        protoPath:  __dirname + '/banktocore.proto',
        packageName: 'com.isc.npsd.instantpayment.grpc',
        serviceName: 'IPCoreService',
        routes: {
          processMessage: (call, callback) => {
            logger.info(`message received : ${ JSON.stringify(call.request) }`);
            callback(null, { message : '1' });
          }
        },
        options: {
          keepCase: true,
          longs: String,
          enums: String,
          defaults: true,
          oneofs: true
        }
      });
      
      const port = process.env.GRPC_PORT;
      server.listen(`0.0.0.0:${port}`);
      logger.info(`gRPC server is now listening on port : ${port}`);
}

grpcServer.stop = () =>
{
  if (server)
  {
    server.stop();
    logger.info('gRPC Server stopped.');
  }
} 

module.exports = grpcServer;