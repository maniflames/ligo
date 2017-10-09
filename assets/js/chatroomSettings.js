window.addEventListener('load', init);
const originURL = document.getElementById('origin').getAttribute('data-url');

function init(){
    const content = document.getElementById('content');
    content.addEventListener('click', optionsClickHandler);
}

function optionsClickHandler(e){
    const target = e.target;

    if(target.nodeName != 'BUTTON'){
        return;
    }

    const options = ['leave', 'addChatMember', 'removeChatMember', 'blockChatMember'];
    const functions = [leave, addChatMember, removeChatMember, blockChatMember];
    var selected = '';

    if(target.id != undefined && target.id != ''){
        selected = options.indexOf(target.id);
    } else {
        selected = options.indexOf(target.classList[0]);
    }

    if(selected === -1){
        return;
    }

    functions[selected](target);

}

//Leaving chatroom
function leave(req) {
    sendPostReq(req, false, redirectHandler);
}

function addChatMember(req){
    const data = {
        username: document.getElementById('addChatMemberUsername').innerHTML,
        origin: originURL
    }

    sendPostReq(req, data);
}

//removing chatroom member
function removeChatMember(req){
    sendPostReqStandardFormat(req);
}

function blockChatMember(req){
    sendPostReqStandardFormat(req);
}

function redirectHandler(res){
    window.location.href = window.location.origin + res.location;
}

//sending ajax request

function sendPostReqStandardFormat(req){
    const data = {
        username: req.getAttribute('data-username'),
        origin: originURL
    }

    sendPostReq(req, data, redirectHandler);
}

function sendPostReq(req, data = false, cb ){
    let request = {
        url: req.getAttribute('data-action'),
        method: 'post',
        error: function(err){
            console.log(err);
        },
        success: function(res){
            console.log(res);
        }
    };

    if(data){
        request.data = data;
    }

    if(cb){
        request.success = cb;
    }

    reqwest(request);
}
