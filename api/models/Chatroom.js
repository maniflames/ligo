/**
 * Chatroom.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  connection:'MongoDB',
  autoCreatedAt: false,
  autoUpdatedAt: false,
  schema: true,

  attributes: {
    name: {
      type: 'string'
    },

    members: {
      type: 'array'
    }
  },

};
