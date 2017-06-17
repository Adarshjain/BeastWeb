'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

exports.createTable = functions.database.ref('searching/modeNormal/{key}/uid').onWrite(event => {
    if(!event.data.exists()) {
        // console.log('Data Deleted!');
        return;
    }
    var cuid = event.data.val();
    // console.log('cuid : ' + cuid);
    var prev = {};
    var searchRef = admin.database().ref('searching/modeNormal');
    searchRef.once('value', snap => {
        if(Object.keys(snap.val()).length < 2) {
            // console.log('Only one user!!');
            return;
        }
        snap.forEach(csnap => {
            var fuid = csnap.val().uid;
            var fkey = csnap.key;
            // console.log('fuid : ' + fuid);
            if(fuid != cuid) {
                // console.log('Not Equal');
                prev['key'] = fkey;
                prev['uid'] = fuid;
            } else {
                //console.log('Match');
                if(Object.keys(prev).length == 0) {
                    //console.log('First match!... Returning!');
                    return; //This player has came first, next searching player will create the table!
                } else {
                    //console.log('Another match found');
                    var tableKey = admin.database().ref('/board').push().key;
                    var xuid = prev['uid'];
                    var ouid = fuid;

                    //console.log('prev key' + prev['key']);
                    //console.log('new key' + event.params.key);
                    var board = {
                        x: xuid,
                        o: ouid,
                        cplayer: 0,
                        xpos: "",
                        opos: "",
                        cpos: "",
                        minicount: "0,0,0,0,0,0,0,0,0",
                        megacount: 0,
                        big: "2,2,2,2,2,2,2,2,2",
                        first: true
                    };
                    var update = {};
                    update['/searching/modeNormal/' + prev['key']] = null;
                    update['/searching/modeNormal/' + event.params.key] = null;
                    update['/players/' + xuid + '/pushKey'] = tableKey;
                    update['/players/' + ouid + '/pushKey'] = tableKey;
                    update['/board/' + tableKey] = board;
                    return admin.database().ref().update(update);
                }
            }
        });
    });
});

exports.deleteData = functions.database.ref('/board/{key}/').onWrite(event => {
    if(!event.data.exists()) {
        var data = event.data.val();
        var deletePlayers = {};
        if(data.hasOwnProperty('x')) {
            deletePlayers[data.x] = null;
        }
        if(data.hasOwnProperty('o')) {
            deletePlayers[data.o] = null;
        }
        return admin.database().ref('/players/').update(deletePlayers);
    }
});

// exports.checkLeft = functions.database.ref('/result/{key}').onWrite(event => {
//     if(!event.data.exists()) {
//         // console.log('Data Deleted!');
//         return;
//     }
//     var resultData = event.data.val();
//     admin.database().ref('/players/' + uid.uid).once('value', pSnap => {
//         admin.database().ref('/board/' + snap.pushKey).once('value', bSnap => {
//             var leftUid;
//             if(bSnap.x == uid) {
//                 leftUid = bSnap.x;
//             } else if(bSnap.o == uid) {
//                 leftUid = bSnap.o;
//             }
//             admin.database().ref('/leaderboard/' + leftUid).once('value', snap => {

//             });
//         });
//     });
// });
//left -> true