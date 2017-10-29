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
				return res.serverError();
			}

			if(_.isEmpty(userAndChats.chats)){
					return res.view('dashboard', {username: userAndChats.username});
			}

			let countQuery = 'SELECT chatroom_members__user_chats.chatroom_members AS chatroom, COUNT(chatroom_members__user_chats.chatroom_members) AS count FROM `user` INNER JOIN chatroom_members__user_chats ON user.id = chatroom_members__user_chats.user_chats GROUP BY chatroom_members__user_chats.chatroom_members';
			User.query(countQuery, [], function(err, rawResult){

			let chatsWithCount = [];

				userAndChats.chats.map(function(chat){
					rawResult.map(function(result){
						if (result.chatroom == chat.id){
							chat.count = result.count;
							chatsWithCount.push(chat);
						}
					})
				});

				return res.view('dashboard', {chats: chatsWithCount, username: userAndChats.username});

			})

		})
	},

	register: function(req, res){
		AuthService.register(req)
		.then(function(newUser){
			return res.redirect(sails.getUrlFor('UserController.login'));
		})
		.catch(function(err){
			sails.log.error(err);
			return res.view('register', {errors: err});
		})
	},

	login: function(req, res){
      AuthService.login(req)
			.then(function(loggedInUser){
				return res.redirect(sails.getUrlFor('UserController.index'));
			})
			.catch(function(err){
				sails.log.error(err);
				return res.view('login',  {errors: err});
			})
	},

	logout: function(req, res){
		res.clearCookie('sid');
		return res.redirect(sails.getUrlFor('UserController.login'));
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
		 	sails.log.error(err);
			return res.serverError();
		});

	},

	detail: function(req, res){
		User.findOne({username: req.params.username}).exec(function(err, foundUser){
			if(err){
				sails.log.error(err)
				return res.serverError();
			}

			if(foundUser == undefined || foundUser == ''){
				return res.notFound();
			}

				return res.view('userDetail', {user: foundUser});
		});
	},

	detailEdit: function(req, res){
		User.findOne({username: req.params.username}).exec(function(err, foundUser){
			if(err){
				sails.log.error(err)
				return res.serverError();
			}

			if(foundUser == undefined || foundUser == ''){
				return res.notFound();
			}

				return res.view('userDetailEdit', {user: foundUser});
		});
	},

	detailEditSave: function(req, res){
		sails.log.debug(req.body.bio);
		User.update({username: req.params.username}, {bio: req.body.bio}).exec(function(err, updatedUser){
			if(err){
				sails.log.error(err)
				return res.serverError();
			}

			return res.redirect(sails.getUrlFor('UserController.detailEdit').replace(':username', req.params.username));
		})
	}

};
