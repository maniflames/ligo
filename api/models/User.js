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
      type: 'string'
    },

    name: {
      type: 'string'
    },

    password: {
      type: 'string'
    },

    joinedChatrooms: {
      type: 'array'
    }
  },

  /**
   * User.register
   * Put new users in the database
   * @param  {[type]} req [an object containing user info]
   * @param  {[type]} res [a response object]
   * @return {[type]} res [a response containing the status of the query result]
   */
  register: function(req, res){

    bcrypt.hash(req.password, saltRounds, function(err, hash) {
      if(err){
        return res.serverError(err);
      }

      req.password = hash;

      User.create(req).exec(function (err, newUser){
        if(err){
          return res.badRequest(err);
        }

        return res.created(newUser);

      });

    });
  },

/**
 * User.retrieve
 * Get users from the database
 * @param  {[type]} req [an object containing user info]
 * @param  {[type]} res [a response object]
 * @return {[type]} res [a response containing the json from the db]
 */
  retrieve: function(req, res){
    User.find(req).exec(function (err, result){
      if(err){
        return res.badRequest(err);
      }

      return res.json(result);

    });
  },

/**
 * User.change
 * Update an existing user in the database
 * @param  {[type]} find   [an object containing user data of the user that needs to be found]
 * @param  {[type]} update [an objetct containing the new user data]
 * @param  {[type]} res [a response object]
 * @return {[type]} res [a response containing the status of the query result]
 */
  change: function(find, update, res){
    User.update(find, update).exec(function (err, result){
      if(err){
        return res.badRequest(err);
      }

      return res.ok();
    });
  }

  //retrieveJoinedChatrooms:
  //use naitive $lookup and I guess unwind


  //TODO: learn about sessions to complete the two below
  //Login

  //Logout



};
