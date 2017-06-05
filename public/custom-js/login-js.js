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
    firebase.auth().signInAnonymously().then(function(argument) {
        setCookie('anon');
    }).catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        alert(errorMessage);
        console.log(error);
    });
});


function auth() {
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

$('#ph').click(function(event) {
    onSignInSubmit();
});

$(document).ready(function() {
    $('.modal').modal();
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recap', {
        'size': 'invisible',
        'callback': function(response) {
            onSignInSubmit();
        }
    });
});

function onSignInSubmit() {
    if(isPhoneNumberValid()) {
        var phoneNumber = $('#phno').val();
        var appVerifier = window.recaptchaVerifier;
        firebase.auth().signInWithPhoneNumber(phoneNumber, appVerifier)
            .then(function(confirmationResult) {
                var code = window.prompt('Enter the verification code you received by SMS');
                if(code) {
                    confirmationResult.confirm(code).then(function() {
                        console.log('success');
                        window.close();
                    }).catch(function(error) {
                        console.error('Error while checking the verification code', error);
                        window.alert('Error while checking the verification code:\n\n' + error.code + '\n\n' + error.message)
                    });
                }
            }).catch(function(error) {
                console.error('Error during signInWithPhoneNumber', error);
                window.alert('Error during signInWithPhoneNumber:\n\n' + error.code + '\n\n' + error.message);
            });
    }
}

function isPhoneNumberValid() {
    var pattern = /^\+[0-9\s\-\(\)]+$/;
    var phoneNumber = $('#phno').val();
    return phoneNumber.search(pattern) !== -1;
}

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
            window.location.replace("/");
        },
        error: function(jqXHR, status) {
            console.log('Fail' + status);
        },
    });
}
