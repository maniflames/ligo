/**
 * isSpecifiedUser
 *
 * @module      :: Policy
 * @description :: Simple policy that only allows users that are referenced in the URL
 * @docs        :: http://sailsjs.org/#!/documentation/concepts/Policies
 *
 */
module.exports = function(req, res, next) {

    User.findOne({id: req.session.userId}).exec(function(err, foundUser){
        if(err){
            sails.log.error(err);
            return res.serverError();
        }

        if(foundUser.username === req.params.username){
            return next();
        }

        return res.forbidden([{"errors": [{"error": "Only the user that owns this page can perform this action"}]}])
    })

};
