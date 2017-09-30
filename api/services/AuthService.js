const bcrypt = require('bcrypt');

module.exports = {

  register: function(req){
    return new Promise(function(resolve, reject){
      User.findOne({username: req.body.username})
      .exec(function(err, user){
        if(err){
          return reject(err);
        }

        if(user != undefined){
          sails.log.debug('found a user');
          return res.view('register', {
            error: 'username taken'
          });
        }

        bcrypt.hash(req.body.password, 10, function(err, hash) {
          if(err){
            return reject(err);
          }

          req.body.password = hash;

          User.create(req.body).exec(function (err, newUser){
            if(err){
              return reject(err);
            }

            req.session.userId = newUser.id;
            req.session.authenticated = true;

            return resolve(newUser);
          });
        });
      });
    })
  },

  login: function(req){
    return new Promise(function(resolve, reject){
      User.findOne({'username': req.body.username }).exec(function(err, user){
				if(err){
					return reject(err);
				}

        bcrypt.compare(req.body.password, user.password, function(err, loggedInUser){
					if(err){
						return reject(err);
					}

          if(loggedInUser == undefined){
            return reject({error: 'Username does\'t exist'})
          }

          if(loggedInUser){
						req.session.userId = user.id;
						req.session.authenticated = true;
            return resolve(loggedInUser);
          }

					return reject({error: 'Wrong password'});
        });
      });
    })
  }

}
