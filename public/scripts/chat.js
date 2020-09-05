const addMsgToList = (msg) => {
    const msgContainer = document.getElementById('messages_list');
    const newListItem = document.createElement('li');
    newListItem.innerText = msg;

    msgContainer.append(newListItem);
};

const input = document.getElementById('chat_message');
input.addEventListener('keydown', (e) => {
    if (e.keyCode === 13 && input.value.length > 0) {
        socket.emit('message', input.value);
        addMsgToList(input.value);
        input.value = '';
    }
});
