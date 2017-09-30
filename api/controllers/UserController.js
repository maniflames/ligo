/**
 * UsersController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	index: function(req, res){

		return res.view('dashboard');

	},

	register: function(req, res){
			AuthService.register(req)
			.then(function(newUser){
				return res.redirect('/');
			})
			.catch(function(err){
				sails.log.error(err);
				return res.view(err);
			})
	},

	login: function(req, res){
      AuthService.login(req)
			.then(function(loggedInUser){
				return res.redirect('/');
			})
			.catch(function(err){
				sails.log.error(err);
				return res.view(err);
			})
	},

	settings: function(req, res){
		sails.log.debug(req.session.userId);
		return res.view('settings', {id: req.session.userId});
	},

	detail: function(req, res){
		User.findOne({username: req.params.username}).exec(function(err, foundUser){
			if(err){
				return res.view('error');
			}

			if(foundUser == undefined || foundUser == ''){
				//Change his into a 404 once I've made it
				return res.view('error');
			}

				return res.view('user-detail', {user: foundUser});
		});
	}
};
