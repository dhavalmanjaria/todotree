"use strict";

let mongoose = require('mongoose');

const server = '127.0.0.1';
const database = 'tasksdb';

class Database {
  constructor() {
    this._connect();
  }

  _connect() {
    mongoose.connect(`mongodb://${server}/${database}`)
      .then(() => {
        console.log('Database connection successful');
      })
      .catch(err => {
        console.error(err);
      });
  }
}

module.exports = new Database();