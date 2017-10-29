/**
 * isChatMember
 *
 * @module      :: Policy
 * @description :: Simple policy to allow members from a chat
 * @docs        :: http://sailsjs.org/#!/documentation/concepts/Policies
 *
 */
module.exports = function(req, res, next) {

    Chatroom.findOne({id: req.params.chatroom})
    .populate('members', {id: req.session.userId})
    .exec(function(err, foundChat){
        if(err){
            sails.log.error(err);
            return res.serverError();
        }

        if(! _.isEmpty(foundChat.members)){
            return next();
        }

        return res.forbidden({"errors": [{"error":"You have to be admin to perform this action"}]});
    })

};
