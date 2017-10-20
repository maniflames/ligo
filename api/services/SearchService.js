module.exports = {

    chatName: function(req, searchChatQueue){
        return new Promise(function(resolve, reject){
            User.findOne({id: req.session.userId})
    		.populate('chats', { or: searchChatQueue })
    		.exec(function(err, result){
                if(err){
                    reject(err);
                }

    			return resolve(result.chats);
    		});
        })
    },

    chatMemberName: function(req, searchMemberQueue){
        return new Promise(function(resolve, reject){
            User.findOne({id: req.session.userId})
            .populate('chats')
            .exec(function(err, result){
                if(err){
                    reject(err);
                }

                const chats = result.chats.map(function(chat){
                    return { id: chat.id };
                });

                Chatroom.find({or: chats})
                .populate('members', {or: searchMemberQueue})
                .exec(function(err, rawResults){
                    if(err){
                        reject(err);
                    }

                    const results = rawResults.filter(function(chat){
                        if(chat.members.length > 0 && chat.members !== undefined){
                            return chat;
                        } else {
                            return;
                        }
                    });

                    return resolve(results);
                });
            });

        })
    },


}
