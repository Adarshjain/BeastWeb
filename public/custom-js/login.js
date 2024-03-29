var provider;
//region
$('#goog').click(function() {
    provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
    auth();

});

$('#fb').click(function() {
    provider = new firebase.auth.FacebookAuthProvider();
    provider.addScope('user_birthday');
    auth();

});

$('#elogin').click(function(event) {
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    if(!validateEmail(email)) {
        alert('Please enter an email address.');
        return;
    }
    if(password.length < 4) {
        alert('Please enter atleast a 4 digit password.');
        return;
    }
    hideMe();
    firebase.auth().signInWithEmailAndPassword(email, password).then(function(argument) {
        setCookie(argument.email);
    }).catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        if(errorCode === 'auth/wrong-password') {
            alert('Wrong password.');
        } else {
            alert(errorMessage);
        }
        console.log(error);
    });
});

$('#ereg').click(function(event) {
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    if(!validateEmail(email)) {
        alert('Please enter an email address.');
        return;
    }
    if(password.length < 4) {
        alert('Please enter atleast a 4 digit password.');
        return;
    }
    hideMe();
    firebase.auth().createUserWithEmailAndPassword(email, password).then(function(argument) {
        setCookie(argument.email);
    }).catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        if(errorCode == 'auth/weak-password') {
            alert('The password is too weak.');
        } else {
            alert(errorMessage);
        }
        console.log(error);
    });
});

$('#guest').click(function(event) {
    hideMe();
    firebase.auth().signInAnonymously().then(function(argument) {
        console.log('anon');
        setCookie('anon');
    }).catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        alert(errorMessage);
        console.log(error);
    });
});

function auth() {
    hideMe();
    firebase.auth().signInWithPopup(provider).then(function(result) {
        var token = result.credential.accessToken;
        var user = result.user;
        var displayName = user.displayName;
        var email = user.email;
        var emailVerified = user.emailVerified;
        var photoURL = user.photoURL;
        var isAnonymous = user.isAnonymous;
        var uid = user.uid;
        var providerData = user.providerData;
        setCookie(email);
    }).catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        var email = error.email;
        var credential = error.credential;
        if(errorCode === 'auth/account-exists-with-different-credential') {
            alert('You have already signed up with a different auth provider for that email.');
        } else {
            console.error(error);
        }
    });
}

function validateEmail(email) {
    var re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    return re.test(email);
}
//endregion

$(document).ready(function() {
    $('.modal').modal();
});

function setCookie(email) {
    var myObj = {};
    myObj["token"] = email;
    var data = JSON.stringify(myObj);
    $.ajax({
        type: "POST",
        url: '/login',
        dataType: 'json',
        contentType: "application/json",
        data: JSON.stringify(myObj),
        success: function(data, status, jqXHR) {
            console.log('Success');
            window.location.replace("/main");
        },
        error: function(jqXHR, status) {
            console.log('Fail' + status);
        },
    });
}

function hideMe() {
    $('#load').removeClass('visi');
    $('#main').addClass('visi');
}
