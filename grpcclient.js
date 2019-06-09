const grpcClient = {};
const {createClient} = require("grpc-kit");
const logger = require('./logger')();

grpcClient.sendToBank= (bank, payload) => {
   
    const client = createClient({
        protoPath: __dirname + '/coretobank.proto',
        packageName: 'coretobank',
        serviceName: 'CoreToBank',
        options: {
          keepCase: true,
          longs: String,
          enums: String,
          defaults: true,
          oneofs: true
        }
      }
      , process.env.GRPC_ENDPOINT);
      
      client.SendMessage({ bank, payload }, (err, result) => {
        if (err)
        {
          //logger.error(err);
        }
        if(!err)
          logger.info({result});
      });
}

module.exports = grpcClient;

