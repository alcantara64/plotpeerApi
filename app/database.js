import mongoose from 'mongoose';
import Constants from './config/constants';

// Use native promises
// mongoose.Promise = global.Promise;

// Connect to our mongo database;
// mongoose.connect(Constants.mongo.uri);
// mongoose.connection.on('error', (err) => {
 // throw err;
// });
 const options = {

  useNewUrlParser: true,
  // useCreateIndex: true,
  // useFindAndModify: false,
  autoIndex: false, // Don't build indexes
  reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
  reconnectInterval: 500, // Reconnect every 500ms
  poolSize: 10, // Maintain up to 10 socket connections
  // If not connected, return errors immediately rather than waiting for reconnect
  bufferMaxEntries: 0,
  connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  family: 4, // Use IPv4, skip trying IPv6
};
mongoose.Promise = global.Promise;
const db = mongoose.connect(Constants.mongo.uri, options, (err) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log('Connected to database sucessfully');
});