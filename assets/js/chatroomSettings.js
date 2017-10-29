window.addEventListener('load', init);
const chatMembers = document.getElementById('chatMembers');

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
    sendPostReq(req, false);
}

function addChatMember(req){

    const data = {
        username: document.getElementById('addChatMemberUsername').value,
    }

    sendPostReq(req, data, pageReload);
}

function pageReload(){
    window.location.reload(true);
}

//removing chatroom member
function removeChatMember(req){
    console.log(req);
    sendPostReqStandardFormat(req);
}

function blockChatMember(req){

    const data = {
        username: req.getAttribute('data-username')
    }

    sendPostReqStandardFormat(req); 

    //sendPostReq(req, data, blockChatMemberSucces(req));
}

function blockChatMemberSucces(button){

    if(button.innerHTML == 'block'){
        button.innerHTML = 'unblock';
    } else {
        button.innerHTML = 'block';
    }
}

//sending ajax request
function sendPostReqStandardFormat(req){
    const data = {
        username: req.getAttribute('data-username')
    }

    sendPostReq(req, data, pageReload);
}

function sendPostReq( req, data = false, cb = false){
    reqwest({
        url: '/csrfToken',
        method: 'get',
        success: function(token){
                let request = {
                        url: req.getAttribute('data-action'),
                        method: 'post',
                        data: {},
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

                request.data._csrf = token._csrf;


                if(cb){
                    request.success = cb;
                }

                reqwest(request);
        }
    });
}
