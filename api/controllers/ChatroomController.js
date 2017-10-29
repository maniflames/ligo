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
        return res.serverError();
      }

      return res.view('chatroom', {chat: foundChat});

    })
  },

  add: function(req, res){
     let notContains = ['<', '>', '\'', '\\', '/', '(', ')', '"', '}', '{', '[', ']', "*"];
     let errors = [];

      notContains.map(function(char){
          if(req.body.chatname.indexOf(char) != -1){
              valid = false;
              errors.push({error: 'You can\'t use ' + char + ' in your username'});
          }
      })

      if(!valid){
          return res.view('addChatroom', {"errors": errors})
      }

      if(req.body.chatname = ''){
          return res.view('addChatroom', {"errors": [{"error": "Name of chatroom cannot be empty"}]})
      }

    Chatroom.create({name: req.body.chatname})
    .exec(function(err, newChat){
      if(err){
        sails.log.error(err);
        return res.serverError();
      }

      newChat.members.add(req.session.userId);
      newChat.admins.add(req.session.userId);

      newChat.save(function(err){
        if(err){
          sails.log.error(err);
         return res.serverError();
        }

        return res.redirect(sails.getUrlFor('UserController.index'));

      });
    })
  },

  settings: function(req, res){
    Chatroom.findOne({id: req.params.chatroom})
    .populate('admins')
    .populate('members')
    .populate('blocked')
    .exec(function(err, foundChat){
      if(err){
        sails.log.error(err);
        return res.serverError();
      }

      return res.view('chatroomSettings', {chat: foundChat});

    })
	},

    settingsEdit: function(req, res){
      Chatroom.findOne({id: req.params.chatroom})
      .populate('admins')
      .populate('members')
      .populate('blocked')
      .exec(function(err, foundChat){
        if(err){
          sails.log.error(err);
          return res.serverError();
        }

        return res.view('chatroomSettingsEdit', {chat: foundChat});

      })
      },


  leave: function(req, res){
    Chatroom.findOne({id: req.params.chatroom})
    .populate('members')
    .exec(function(err, foundChat){
      if(err){
        sails.log.error(err);
        return res.serverError();
      }

      if(foundChat === undefined){
          return res.notFound();
      }

      if(foundChat.members.length > 1){
        foundChat.members.remove(req.session.userId);
        foundChat.save(function(err){
          if(err){
            sails.log.error(err);
            return res.serverError();
          }

          return res.redirect(sails.getUrlFor('UserController.index'));

        });

      } else {

        Chatroom.destroy({id: req.params.chatroom})
        .exec(function(err, destroyedChat){
            if(err){
                sails.log.error(err);
                return res.serverError();
            }

             return res.redirect(sails.getUrlFor('UserController.index'));
        })
      }
    })
  },

  addChatMember: function(req, res){

      User.findOne({username: req.body.username})
      .populate('chats')
      .exec(function(err, foundUser){
          if(err){
              sails.log.error(err);
              return res.serverError();
          }

          if(foundUser === undefined){
              return res.json({"errors": [{"error": "User not found"}]});
          }

          foundUser.chats.add(req.params.chatroom);
          foundUser.save(function(err){
              if(err){
                  sails.log.error(err);
                  return res.serverError();
              }
          })

           return res.json({"username": foundUser.username});

      })
  },

  removeChatMember:  function(req, res){

      User.findOne({username: req.body.username})
      .populate('chats')
      .exec(function(err, foundUser){
          if(err){
              sails.log.error(err);
              return res.serverError();
          }

          if(foundUser === undefined){
              return res.notFound();
          }

          foundUser.chats.remove(req.params.chatroom);
          foundUser.save(function(err){
              if(err){
                  sails.log.error(err);
                  return res.serverError();
              }
          });

         return res.ok();
     })
    },

    blockChatMember: function(req, res){

        User.findOne({username: req.body.username})
        .populate('chats')
        .exec(function(err, foundUser){
            if(err){
                sails.log.error(err);
                return res.serverError();
            }

            if(foundUser === undefined){
                return res.notFound();
            }

            let unblock = true;

            foundUser.chats.map(function(chat){

                if(chat.id == req.params.chatroom){
                    unblock = false;
                }

                return;
            });

            if(unblock){

                foundUser.chats.add(req.params.chatroom);
                foundUser.blockedFrom.remove(req.params.chatroom);
                status = 'unblocked';

            } else {

                foundUser.chats.remove(req.params.chatroom);
                foundUser.blockedFrom.add(req.params.chatroom);
                status = 'blocked';
            }

            foundUser.save(function(err){
                if(err){
                    sails.log.error(err);
                    return res.serverError();
                }

            return res.ok();


            });
       })
      },

}
