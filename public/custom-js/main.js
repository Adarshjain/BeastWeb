var found = false;
var database = firebase.database();
var searchRef = database.ref('searching/modeNormal');
var uid;
firebase.auth().onAuthStateChanged(function(user) {
    if(user) {
        // var displayName = user.displayName;
        // var email = user.email;
        // var emailVerified = user.emailVerified;
        // var photoURL = user.photoURL;
        uid = user.uid;
        console.log('uid:' + uid);
        database.ref('/players/' + uid).on('value', snap => {
            if(snap.val() != null) {
                console.log(snap.val());
                window.location.replace("/");
            } else {
                database.ref('searching/modeNormal').once('value', searchSnap => {
                    if(searchSnap.val() != null) {
                        addClick();
                    }
                    searchSnap.forEach(csnap => {
                        if(csnap.val().uid == uid) {
                            $('#load-text').text('Finding a beast you could spar with!!');
                            found = true;
                        }
                    });
                    if(!found) {
                        addClick();
                    }
                });
            }
        });
    } else {
        console.log('User logged out!!');
        window.location.replace("/login");
    }
});

function addClick() {
    $('#main').removeClass('visi');
            $('#load').addClass('visi');
    $('#search').click(() => {
        $('#load-text').text('Finding a beast you could spar with!!');
        $('#load').removeClass('visi');
        $('#main').addClass('visi');
        var searchkey = searchRef.push().key;
        searchRef.child(searchkey).set({
            uid: uid
        });
    });
}
