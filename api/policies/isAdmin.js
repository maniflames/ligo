/**
 * isAdmin
 *
 * @module      :: Policy
 * @description :: Simple policy to allow any admin
 * @docs        :: http://sailsjs.org/#!/documentation/concepts/Policies
 *
 */
module.exports = function(req, res, next) {

    Chatroom.findOne({id: req.params.chatroom})
    .populate('admins', {id: req.session.userId})
    .exec(function(err, foundChat){

        if(! _.isEmpty(foundChat.admins) ){
            return next();
        }

        return res.forbidden({"errors": [{"error":"You have to be admin to perform this action"}]});
    })

};
