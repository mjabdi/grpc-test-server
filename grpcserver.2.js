const grpcServer = {};
const logger = require('./logger')();
const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');

const PROTO_PATH = __dirname + '/banktocore.proto';

var server;
grpcServer.start = () =>
{
  var packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {keepCase: true,
     longs: String,
     enums: String,
     defaults: true,
     oneofs: true
    });

    var hello_proto = grpc.loadPackageDefinition(packageDefinition).banktocore;
    
    const max_connection_age_ms = process.env.MAX_CONNECTION_AGE_MS || 1000;
    server = new grpc.Server({'grpc.max_connection_age_ms' : max_connection_age_ms});
    server.addService(hello_proto.IPCoreService.service, {processMessage: (call, callback) => {
      logger.info(`message received : ${ JSON.stringify(call.request) }`);
      callback(null, { message : '1' });
    }});

    const port = process.env.GRPC_PORT;
 

    server.bind(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure());

    server.start();

    logger.info(`gRPC server is now listening on port : ${port}`);
}

grpcServer.stop = () =>
{
  if (server)
  {
    server.tryShutdown(() => {logger.info('gRPC Server stopped.')});
  }
} 


module.exports = grpcServer;