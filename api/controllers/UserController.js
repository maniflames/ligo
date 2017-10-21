/**
 * UsersController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	index: function(req, res){
		User.findOne({id: req.session.userId})
		.populate('chats')
		.exec(function(err, userAndChats){
			if(err){
				console.log(err);
				return res.view(err);
			}
			return res.view('dashboard', {chats: userAndChats.chats});
		})
	},

	register: function(req, res){
			AuthService.register(req)
			.then(function(newUser){
				return res.redirect('/');
			})
			.catch(function(err){
				sails.log.error(err);
				return res.view('register', {errors: err});
			})
	},

	login: function(req, res){
      AuthService.login(req)
			.then(function(loggedInUser){
				return res.redirect('/');
			})
			.catch(function(err){
				sails.log.error(err);
				return res.view('login',  {errors: err});
			})
	},

	logout: function(req, res){
		res.clearCookie('sid');
		return res.redirect('login');
	},

	settings: function(req, res){
		return res.view('userSettings',  {id: req.session.userId} );
	},

	dashboardSearch: function(req, res){

		if(req.body.search === ''){
			return res.redirect(sails.getUrlFor('UserController.index'));
		}

		SearchService.chatNameAndChatMember(req)
		.then(function(results){
			return res.view('dashboard', {chats: results});
		})
		.catch(function(err){
			return sails.log.error(err);
		});

	},

	detail: function(req, res){
		User.findOne({username: req.params.username}).exec(function(err, foundUser){
			if(err){
				sails.log.error(err)
				return res.view('error');
			}

			if(foundUser == undefined || foundUser == ''){
				//LIGO: Change his into a 404 once I've made it
				sails.log.error('Not a user');
				return res.view('error');
			}

				return res.view('userDetail', {user: foundUser});
		});
	},

	detailEdit: function(req, res){
		User.findOne({username: req.params.username}).exec(function(err, foundUser){
			if(err){
				sails.log.error(err)
				return res.view('error');
			}

			if(foundUser == undefined || foundUser == ''){
				//LIGO: Change his into a 404 once I've made it
				sails.log.error('Not a user');
				return res.view('error');
			}

				return res.view('userDetailEdit', {user: foundUser});
		});
	}
};
