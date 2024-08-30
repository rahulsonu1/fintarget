const cluster = require('cluster');
const numCPUs = 2; // Two replica sets

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);

  // Fork workers
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died with code: ${code} and signal: ${signal}`);
    // Replace the dead worker
    cluster.fork();
  });
} else {
  // Workers can share any TCP connection
  process.on('uncaughtException', (err) => {
    console.error(`Uncaught Exception in worker ${process.pid}:`, err);
  });

  process.on('unhandledRejection', (reason, promise) => {
    console.error(`Unhandled Rejection in worker ${process.pid}:`, reason);
  });

  require('./server');
}