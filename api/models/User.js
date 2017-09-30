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

  listChats: function() {
    return new Promise(function(resolve, reject){
        User.native(function(err, collection){

          collection.aggregate([
            {
              "$lookup": {
                "from":"chatroom",
                "localField": "joinedChatrooms",
                "foreignField": "_id",
                "as": "Chat" }
              },
              {
                "$project": {
                  "Chat.name": 1,
                  "Chat.members": 1
                }
              },
              {
                "$unwind": "$Chat"
              }
            ],

            function(err, results){

              if(err){
                reject(err);
              }

              sails.log.debug(results);
              resolve(results);
            });
          });
      });
    }
  }
