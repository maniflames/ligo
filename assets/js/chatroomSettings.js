window.addEventListener('load', init);

function init(){
    const content = document.getElementById('content');
    content.addEventListener('click', optionsClickHandler);
}

function optionsClickHandler(e){
    const target = e.target;
    const options = [addChatMember()];
    const selected = options.indexOf(target.id);

    console.log(target);

    if(selected === -1){
        return;
    }

    options[selected];
}

function addChatMember() {
    let button = document.getElementById('addChatMember');
    button.innerHTML = 'lol';
}
