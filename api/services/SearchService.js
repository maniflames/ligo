module.exports = {

    chatNameAndChatMember: function(req){
        return new Promise(function(resolve, reject){
            const rawSearch = req.body.search.toLowerCase();
            const splitQueries = rawSearch.split(' ');

            let searchMemberQueue = [{}];
            let searchChatQueue = [{}];

            splitQueries.map(function(taggedQuery){
                if(taggedQuery == ''){
                    return;
                }

                if(taggedQuery.indexOf('member:') === 0){
                    if(searchMemberQueue.length === 1 && _.isEmpty(searchMemberQueue[0])){
                        searchMemberQueue.splice(0, 1);
                    }

                    let query = taggedQuery.replace('member:', '');
                    return searchMemberQueue.push({username: {'like': '%' + query + '%'}});
                }

                if(taggedQuery.indexOf('chat:') === 0){
                    if(searchChatQueue.length === 1 && _.isEmpty(searchChatQueue[0])){
                        searchChatQueue.splice(0, 1);
                    }

                    let query = taggedQuery.replace('chat:', '');
                    return searchChatQueue.push({name: {'like': '%' + query + '%'}});
                }

                if(searchMemberQueue.length === 1 && _.isEmpty(searchMemberQueue[0])){
                    searchMemberQueue.splice(0, 1);
                }

                if(searchChatQueue.length === 1 && _.isEmpty(searchChatQueue[0])){
                    searchChatQueue.splice(0, 1);
                }
                let query = taggedQuery;
                searchMemberQueue.push({username: {'like': '%' + query + '%'}});
                searchChatQueue.push({name: {'like': '%' + query + '%'}});
                return;
            });

            let finalResults = [];

            module.exports.chatName(req, searchChatQueue)
            .then(function(chatResults){
                finalResults = _.union(finalResults, chatResults);
                return module.exports.chatMemberName(req, searchMemberQueue);
            })
            .then(function(memberResults){
                finalResults = _.union(finalResults, memberResults);
                return resolve(finalResults);
            })
            .catch(function(err){
                sails.log.error(err);
                return reject(err);
            });

        })
    },

    chatName: function(req, searchChatQueue){
        return new Promise(function(resolve, reject){
            User.findOne({id: req.session.userId})
    		.populate('chats', { or: searchChatQueue })
    		.exec(function(err, result){
                if(err){
                    return reject(err);
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
                    return reject(err);
                }

                const chats = result.chats.map(function(chat){
                    return { id: chat.id };
                });

                Chatroom.find({or: chats})
                .populate('members', {or: searchMemberQueue})
                .exec(function(err, rawResults){
                    if(err){
                        return reject(err);
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
