var myName = "";
var users = [""];
$(document).ready(function () {
    var socket = io.connect('http://localhost:3000')
    socket.emit("request_user", "REQUEST");
    var message = $("#message");
    var username = $("#username");
    var btnMessage = $("#btnMessage");
    var btnUsername = $("#btnUsername");
    var inbox = $("#inbox");
    var feedback = $("#feedback");
    var interval = 0;

    //close modal
    $(document).delegate('#btnUsername', 'click', function (e) {
        myName = $('#username').val();
        if (myName != "" && !users.includes(myName)) {
            users.push(myName);
            socket.emit("log_in", myName);
            $(this).closest('.modal').removeClass('active');
            e.preventDefault();
        } else {
            alert("Username already used!!!");
        }
    });
    socket.on('request_user', function (user) {
        socket.emit("log_in", myName);
    })

    socket.on('log_in', function (user) {
        if (!users.includes(user)) {
            users.push(user);
            $('#users').append('<p> 🔵 <i>' + user + '</p>');
        }
        // socket.emit("log_in", myName);
    })

    //Emit message
    btnMessage.click(function () {
        socket.emit('new_message', { username: myName, message: $('#message').val() });
        message.val('');
    });


    //Listen on new_message
    socket.on("new_message", (data) => {
        feedback.html('');
        if (data.username == myName) {
            $("#inbox").append("<p class='speech-bubble1 ownMessage' id=''>" + "Me : " + data.message + "</p><br clear='all'>")
        }else{
            $("#inbox").append("<p class='speech-bubble othersMessage' id=''>" + data.username + ": " + data.message + "</p><br clear='all'>")
        }
        // $("#inbox").scrollTop($("#inbox")[0].scrollHeight);
    })

    //Emit a username
    btnUsername.click(function () {
        socket.emit('change_username', { username: username.val() })
        $('#Name').append(username.val());
    })

    //Emit typing
    message.on("keydown", () => {
        socket.emit('typing', myName)
    })

    //Listen on typing
    socket.on('typing', (data) => {
        clearInterval(interval);
        feedback.html("<p><i>" + data + " is typing a message..." + "</i></p>");
        interval = setInterval(function(){
            feedback.html('');
        }, 2000);
    })
});