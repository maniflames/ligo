/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    id: {
      type: 'integer',
      unique: true,
      primaryKey: true
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

    chats: {
      collection: 'chatroom',
      via: 'members'
    },

    adminOf:{
      collection: 'chatroom',
      via: 'admins'
    },

    blockedFrom: {
        collection: 'chatroom',
        via: 'blocked'
    }

  },
}
