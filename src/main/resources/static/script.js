function connect() {
    var socket = new SockJS('/chat-messaging');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function(frame) {
        console.log("connected: " + frame);
        setConnected(true);
        stompClient.subscribe('/chat/messages', function(response) {
            console.log("Response: " + response.body)
            var message = JSON.parse(response.body);
            draw(message);
        });
    });
}

function draw(data) {
    console.log("drawing...");
    var side = chooseSide(data);
    var $message;
    $message = $($('.message_template').clone().html());
    $message.addClass(side).find('.text').html(data.message);
    $message.addClass(side).find('.avatar').html(data.from);
    $('.messages').append($message);
    return setTimeout(function () {
        return $message.addClass('appeared');
    }, 0);

}

function chooseSide(message){
    switch (message.participant) {
        case 1:
            console.log("left")
            return "left";
        case 2:
            return "right";
    }
}

function disconnect(){
    stompClient.disconnect();
    setConnected(false)
}
function sendMessage(){
    var from = document.getElementById('from').value;
    var text = document.getElementById('message_input_value').value;
    stompClient.send("/app/message", {},
        JSON.stringify({'from': from ,'message': text }));
}

function setConnected(connected) {
    document.getElementById('connect').disabled = connected;
    document.getElementById('disconnect').disabled = !connected;
    document.getElementById('conversationDiv').style.visibility
        = connected ? 'visible' : 'hidden';
    document.getElementById('message_input_value').innerHTML = '';
}
