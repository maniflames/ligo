/**
 * UsersController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

const bcrypt = require('bcrypt');

module.exports = {
	index: function(req, res){

		// User.listChats()
		// .then(function(results){
		// 	return res.view('dashboard');
		// })
		// .catch(function(err){
		// 	return res.serverError();
		// })


		Chatroom.find({
			members: "59be874b4b608c4c60a36b75"
		})
		.exec(function(err, chatrooms){
			if(err){
				sails.error.log(err);
				return res.serverError();
			}

			sails.log.debug(chatrooms);
			return res.view('dashboard');
		})

	},

	//TODO: write service/middelware to keep controller lean
	register: function(req, res){

		User.findOne({username: req.body.username})
		.exec(function(err, user){
			if(err){
				return res.view('error');
			}

			if(user != undefined){
				sails.log.debug('found a user');
				return res.view('register', {
					error: 'username taken'
				});
			}

			bcrypt.hash(req.body.password, 10, function(err, hash) {
				if(err){
					return res.view('error');
				}

				req.body.password = hash;

				User.create(req.body).exec(function (err, newUser){
					if(err){
						return res.view('error');
					}

					req.session.userId = newUser.id;
					req.session.authenticated = true;

					sails.log.debug('about to redirect');
					return res.redirect('/dashboard');
				});
			});
		});
	},

	//TODO: write service/middelware to keep controller lean
	login: function(req, res){
      User.findOne({'username': req.body.username }).exec(function(err, user){
				if(err){
					return res.view('error');
				}

        bcrypt.compare(req.body.password, user.password, function(err, loggedInUser){
					if(err){
						return res.view('error');
					}

          if(loggedInUser){
						req.session.userId = user.id;
						req.session.authenticated = true;
            return res.redirect('/dashboard');
          }

					return res.view('login', {
						error: 'Wrong username or password'
					});
        });
      });
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
