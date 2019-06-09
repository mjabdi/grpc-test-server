const grpcServer = {};
const {createServer} = require('grpc-kit');
const logger = require('./logger')();
const grpc = require('grpc');

let server;
grpcServer.start = () =>
{
    server = createServer();

    server.use({
        protoPath:  __dirname + '/banktocore.proto',
        packageName: 'com.isc.npsd.instantpayment.grpc',
        serviceName: 'IPCoreService',
        routes: {
          processMessage:  (call, callback) => {
            logger.info(`message received : ${ JSON.stringify(call.request) }`);
            callback(null, { message : '1' });
          }
        },
        options: {
          keepCase: true,
          longs: String,
          enums: String,
          defaults: true,
          oneofs: true,
          
        }
      });
      
      const port = process.env.GRPC_PORT;
      const max_connection_age_ms = process.env.MAX_CONNECTION_AGE_MS || 1000;
      server.listen(`0.0.0.0:${port}`,grpc.ServerCredentials.createInsecure(),{'grpc.max_connection_age_ms' : max_connection_age_ms});

      setInterval(() => {
        server.server.forceShutdown();
        server.listen(`0.0.0.0:${port}`,grpc.ServerCredentials.createInsecure(),{'grpc.max_connection_age_ms' : max_connection_age_ms});
      }, max_connection_age_ms);

      //server.listen(`0.0.0.0:${port}`,grpc.ServerCredentials.createInsecure());
      
      logger.info(`gRPC server is now listening on port : ${port}`);
}

grpcServer.stop = () =>
{
  if (server)
  {
    server.close(() => {logger.info('gRPC Server stopped.')});
  }
} 

module.exports = grpcServer;