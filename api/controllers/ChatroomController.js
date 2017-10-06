/**
 * ChatroomsController
 *
 * @description :: Server-side logic for managing chatrooms
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  show: function(req, res){
    Chatroom.findOne({id: req.params.chatroom})
    .exec(function(err, foundChat){
      if(err){
        sails.log.error(err);
        return res.view('error');
      }

      return res.view('chatroom', {chat: foundChat});

    })
  },

  add: function(req, res){
    Chatroom.create({name: req.body.chatname})
    .exec(function(err, newChat){
      if(err){
        sails.log.error(err);
        return res.view('error');
      }

      newChat.members.add(req.session.userId);
      newChat.save(function(err){
        if(err){
          sails.log.error(err);
          return res.view('error');
        }

        return res.redirect('/');

      });
    })
  },

  settings: function(req, res){
    Chatroom.findOne({id: req.params.chatroom})
    .exec(function(err, foundChat){
      if(err){
        sails.log.error(err);
        return res.view('error');
      }

      return res.view('chatroomSettings', {chat: foundChat});

    })
	},

  leave: function(req, res){
    Chatroom.findOne({id: req.params.chatroom})
    .exec(function(err, foundChat){
      if(err){
        sails.log.error(err);
        return res.view('error');
      }

      foundChat.members.remove(req.session.userId);
      foundChat.save(function(err){
        if(err){
          sails.log.error(err);
          return res.view('error');
        }

        return res.redirect('/');

      });
    })
  },

  remove: function(req, res){
    //remove chatroom
  }
};
