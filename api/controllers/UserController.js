/**
 * UsersController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

const bcrypt = require('bcrypt');

module.exports = {
	index: function(req, res){
		
	},

	//TODO: write service controller lean
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
	}
};
