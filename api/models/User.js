/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

var bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports = {

  connection:'MongoDB',
  autoCreatedAt: false,
  autoUpdatedAt: false,
  schema: true,

  attributes: {
    email: {
      type: 'string',
      unique: true
    },

    username: {
      type: 'string',
      required: true,
      unique: true
    },

    password: {
      type: 'string',
      required: true
    },

    joinedChatrooms: {
      type: 'array'
    }
  },

};
