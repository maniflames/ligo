/**
 * UsersController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

const bcrypt = require('bcrypt');

module.exports = {
	index: function(req, res){
		//Find all chatrooms that have member 'current'
		sails.log.debug("Activated the index action");

		//MongoDB JOIN !!!!!
		//Ask antwan aboutsails populate
		User.native(function(err, collection){
			sails.log.debug("performing a naitive query");
			const test = collection.aggregate([{ "$lookup": {
				"from":"chatroom",
				"localField": "joinedChatrooms",
				"foreignField": "_id",
				"as": "Chat" }

		}], function(err, results){

			sails.log.debug("done performing naitive query");


			if(err){
				sails.log.error("Something went wrong");
				sails.log.error(err);
				return res.serverError();
			}

			sails.log.debug("it worked");
			sails.log.debug(results);
			return res.view('dashboard');

		});
		});

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
