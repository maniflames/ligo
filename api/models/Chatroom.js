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

  /**
   * Cbatrooms.register
   * Put new users in the database
   * @param  {[type]} req [an object containing Chatroom info]
   * @param  {[type]} res [a response object]
   * @return {[type]} res [a response containing the status of the query result]
   */
  new: function(req, res){
    Chatroom.create(req).exec(function (err, newChatroom){
      if(err){
        return res.badRequest(err);
      }

      return res.created(newChatroom);

    });
  },


   /**
    * Chatroom.retrieve
    * Get users from the database
    * @param  {[type]} req [an object containing chatrrom info]
    * @param  {[type]} res [a response object]
    * @return {[type]} res [a response containing the json from the db]
    */
  retrieve: function(req, res){
    Chatroom.find(req).exec(function (err, records){
      if(err){
        return res.badRequest(err);
      }

      return res.json(records);

    });
  },

  /**
   * Chatroom.change
   * Update an existing user in the database
   * @param  {[type]} find   [an object containing chatroom data of the user that needs to be found]
   * @param  {[type]} update [an objetct containing the new user chatroom]
   * @param  {[type]} res [a response object]
   * @return {[type]} res [a response containing the status of the query result]
   */
  change: function(find, update, res){
    Chatroom.update(find, update).exec(function (err, result){
      if(err){
        return res.badRequest(err);
      }

      return res.ok();
    });
  },

/**
 * Chatroom.delete
 * @param  {[type]} req [an object containing Chatroom info]
 * @param  {[type]} res [a response object]
 * @return {[type]} res [a response containing the status of the query result]
 */
  delete: function(req, res){
    Chatroom.destroy(req).exec(function(err, result){
      if(err){
        return res.badRequest(err);
      }

      return res.ok();
    })
  }

  //retrieveMembers:


};
