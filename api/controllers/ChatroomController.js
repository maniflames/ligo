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
      newChat.admins.add(req.session.userId);

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
    .populate('admins')
    .populate('members')
    .exec(function(err, foundChat){
      if(err){
        sails.log.error(err);
        return res.view('error');
      }

      return res.view('chatroomSettings', {chat: foundChat});

    })
	},

//LIGO: !! functionality preferably in ONE Query, send the amount of chatroom members in request
//Smartest thing to do would be to add a policy
//Look into sum and stuff it could really slim this thing.
  leave: function(req, res){
    Chatroom.findOne({id: req.params.chatroom})
    .populate('members')
    .exec(function(err, foundChat){
      if(err){
        sails.log.error(err);
        return res.view('error');
      }

      if(foundChat === undefined){
          return res.view('error');
      }

      if(foundChat.members.length > 1){
        foundChat.members.remove(req.session.userId);
        foundChat.save(function(err){
          if(err){
            sails.log.error(err);
            return res.view('error');
          }

          return res.json({"location":"/"});

        });

      } else {

        Chatroom.destroy({id: req.params.chatroom})
        .exec(function(err, destroyedChat){
            if(err){
                sails.log.error(err);
                return res.view('error');
            }

            return res.json({"location":"/"});
        })
      }
    })
  },

  //LIGO: write chatMember service

  addChatMember: function(req, res){

      User.findOne({username: req.body.username})
      .populate('chats')
      .exec(function(err, foundUser){
          if(err){
              sails.log.error(err);
              return res.view('error');
          }

          if(foundUser === undefined){
              return res.redirect('/');
          }

          foundUser.chats.add(req.params.chatroom);
          foundUser.save(function(err){
              if(err){
                  sails.log.error(err);
                  return res.view('error');
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
              return res.json({"location":"/"});
          }

          if(foundUser === undefined){
              return res.json({"location":"/"});
          }

          foundUser.chats.remove(req.params.chatroom);
          foundUser.save(function(err){
              if(err){
                  sails.log.error(err);
                  return res.json({"location":"/"});
              }
          });

         return res.json({"location": req.body.origin});
     })
    },

    blockChatMember: function(req, res){

        User.findOne({username: req.body.username})
        .populate('chats')
        .exec(function(err, foundUser){
            if(err){
                sails.log.error(err);
                return res.json({"location":"/"});
            }

            if(foundUser === undefined){
                return res.json({"location":"/"});
            }

            foundUser.chats.remove(req.params.chatroom);
            foundUser.bannedFrom.add(req.params.chatroom);
            foundUser.save(function(err){
                if(err){
                    sails.log.error(err);
                    return res.json({"location":"/"});
                }
            });

           return res.json({"location": req.body.origin});
       })
      },
}
