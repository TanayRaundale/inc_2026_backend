import server from './config/server.js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.dev' });

server.listen(process.env.PORT || '3001', '0.0.0.0', () => {
  console.log('Server listening on port ', process.env.PORT || '3001')
})

process.on('uncaughtException', err => {
  // // console.log('UNCAUGHT EXCEPTION!!! shutting down...')
  // // console.log(err.name, err)
  process.exit(1)
})

process.on('unhandledRejection', err => {
  // // console.log('UNHANDLED REJECTION!!!  shutting down ...')
  // // console.log(err.name, err)
  process.exit(1)
})