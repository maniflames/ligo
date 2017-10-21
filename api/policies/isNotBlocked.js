/**
 * isNotBanned
 *
 * @module      :: Policy
 * @description :: Simple policy that stops blocked users
 * @docs        :: http://sailsjs.org/#!/documentation/concepts/Policies
 *
 */
module.exports = function(req, res, next) {

    Chatroom.findOne({id: req.params.chatroom})
    .populate('blocked', {id: req.session.userId})
    .exec(function(err, foundChat){

        if(! _.isEmpty(foundChat.blocked) ){
            return res.forbidden({"errors": [{"error":"You are not allowed to enter this chatroom"}]});
        }

        return next();
    })

};
