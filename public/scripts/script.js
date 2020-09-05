const videoWrapper = document.getElementById('video-wrapper');
let domVideo = document.createElement('video');
domVideo.muted = true;
let myStream;

const peer = new Peer({
    undefined,
    path: '/peerJs',
    host: '/',
    port: '443'
});

const addVideoStreamToDom = (video, stream) => {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
        video.play();
    });
    videoWrapper.append(video);
};

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {
    myStream = stream;
    addVideoStreamToDom(domVideo, stream);

    peer.on('call', call => {
        call.answer(stream);
        const newDomVideo = document.createElement('video');
        call.on('stream', userVideoStream => {
            addVideoStreamToDom(newDomVideo, userVideoStream);
        })
    });

    socket.on('user-connect', (peerId) => {
        connectToNewUser(peerId, stream);
    });

    socket.on('createMessage', (newMessage) => {
        addMsgToList(newMessage);
    });
});

peer.on('open', (peerId) => {
    socket.emit('join-room', roomId, peerId);
});

const socket = io('/');

const connectToNewUser = (peerId, stream) => {
    ///// Transfer *my* stream to all users on the room
    const call = peer.call(peerId, stream);
    ///// Getting *theirs* stream
    const newDomVideo = document.createElement('video');
    call.on('stream', userVideoStream => {
        addVideoStreamToDom(newDomVideo, userVideoStream);
    })
};
