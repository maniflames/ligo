/**
 * UsersController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
//A lot in this controller is still for testing!
	register: function(req, res){
		if(!req.password){
			return res.badRequest('The user needs to have a valid pasword');
		}

		return User.register({'name': 'imani', 'password': 'tired'}, res);
	},

	test: function(req, res){
		return User.change({'name': 'budi'}, {'name': 'brandon'}, res);
	}


};
