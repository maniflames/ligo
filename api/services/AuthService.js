const bcrypt = require('bcryptjs');

module.exports = {

  register: function(req){
    return new Promise(function(resolve, reject){

    let valid = true;
    let passMatch =  true;
    let errors = [];

    let notContains = ['<', '>', '\'', '\\', '/', '(', ')', '"', '}', '{', '[', ']', "*"];

    notContains.map(function(char){
        if(req.body.username.indexOf(char) != -1){
            valid = false;
            errors.push({error: 'You can\'t use ' + char + ' in your username'});
        }
    })

    if(req.body.username == undefined || req.body.username == ''){
        valid = false;
        errors.push({error: 'Username is required'});
    }

    if(req.body.password == undefined || req.body.password == ''){
        valid = false;
        errors.push({error: 'Password is required'});
    }

    if(req.body.repeat == undefined || req.body.repeat == ''){
        valid = false;
        errors.push({error: 'Repeated password is required'});
    }

    if(!valid){
        return reject(errors);
    }

    if(req.body.password != req.body.repeat){
        passMatch = false;
        errors.push({error: 'Given passwords do not match'});
    }

    if(!passMatch){
        return reject(errors);
    }

      User.findOne({username: req.body.username})
      .exec(function(err, user){
        if(err){
          return reject(err);
        }

        if(user != undefined){
          return reject([{error: 'Username Taken'}]);
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
        let valid = true;
        let errors = [];

        if(req.body.username == undefined || req.body.username == ''){
            valid = false;
            errors.push({error: 'Username is required'});
        }

        if(req.body.password == undefined || req.body.password == ''){
            valid = false;
            errors.push({error: 'Password is required'});
        }


        if(!valid){
            return reject(errors);
        }


      User.findOne({'username': req.body.username }).exec(function(err, user){
				if(err){
                    sails.log.error(err);
					return reject(err);
				}

                if(user == undefined || user == ''){
                    return reject([{error: 'User not found'}]);
                }

        bcrypt.compare(req.body.password, user.password, function(err, loggedInUser){
					if(err){
            sails.log.error(err);
						return reject(err);
					}

          if(loggedInUser.length < 1){
            return reject(err);
          }

          if(loggedInUser){
            req.session.userId = user.id;
			req.session.authenticated = true;

            return resolve(loggedInUser);
          }

		return reject([{error: 'Wrong password'}]);
        });
      });
    })
  },

}
