var done = 0;
block(9);
var gaveup = false;
var database = firebase.database();
var leaderRef = database.ref('leaderboard');
var curUid, oppUid, readRef, big, minicount, megacount, player, currPos, cplayer, currCpos, currXpos = "",
    currOpos = "",
    oldScore = 0,
    oldWon = 0,
    oldLost = 0;
var matrix = [ //Player spot in every small box, whether X or O or not played --> 0->X, 1->O, 2->Nothing yet
        2, 2, 2, 2, 2, 2, 2, 2, 2,
        2, 2, 2, 2, 2, 2, 2, 2, 2,
        2, 2, 2, 2, 2, 2, 2, 2, 2,
        2, 2, 2, 2, 2, 2, 2, 2, 2,
        2, 2, 2, 2, 2, 2, 2, 2, 2,
        2, 2, 2, 2, 2, 2, 2, 2, 2,
        2, 2, 2, 2, 2, 2, 2, 2, 2,
        2, 2, 2, 2, 2, 2, 2, 2, 2,
        2, 2, 2, 2, 2, 2, 2, 2, 2,
    ];

big = [ //Big Box win or lost or draw or nothing happened yet --> 0->Xwon, 1->Owon, 2-> Nothing yet, 3->Draw
        2, 2, 2,
        2, 2, 2,
        2, 2, 2
    ];
minicount = [0, 0, 0, 0, 0, 0, 0, 0, 0]; //Maintianing number of spots played (Used to check 'Draw' condition)
megacount = 0;
currXpos = "";
currOpos = "";
currCpos = "";
$('.box-small').removeClass('done').empty();
$('.above').addClass('visi').empty();

$(function() {
    $('.modal').modal(); //Materailizecss dialog box
});

$(".above").on('click', function() {
    Materialize.toast('You cannot play there!', 1500);
});

function giveup(argument) {
    $('#giveup').click(e => {
        gaveup = true;
        readRef.set(null);
        database.ref('/players/' + curUid).set(null);
    });
}
$(window).blur(funk => {
    gaveup = true;
    var runaway = {};
    runaway['board/' + pushKey] = null;
    runaway['/players/' + curUid] = null;
    // if(oldScore != 0 || oldWon != 0 || oldLost != 0) {
    runaway['/leaderboard/' + curUid + '/normal'] = oldScore - 1;
    runaway['/leaderboard/' + curUid + '/lost'] = oldLost + 1;
    // runaway['/leaderboard/' + curUid + '/win'] = oldLost + 1;
    // }
    database.ref().update(runaway);
});
$(window).bind("unload", function(e) {
    gaveup = true;
    var runaway = {};
    runaway['board/' + pushKey] = null;
    runaway['/players/' + curUid] = null;
    // if(oldScore != 0 || oldWon != 0 || oldLost != 0) {
    runaway['/leaderboard/' + curUid + '/normal'] = oldScore - 1;
    runaway['/leaderboard/' + curUid + '/lost'] = oldLost + 1;
    // runaway['/leaderboard/' + curUid + '/win'] = oldLost + 1;
    // }
    database.ref().update(runaway);
    // database.ref().set(null);
});

// window.onbeforeunload = function(e) {
//     e = e || window.event;
//     // For IE and Firefox prior to version 4
//     if(e) {
//         e.returnValue = 'Sure?';
//     }
//     // For Safari
//     return 'Sure?';
// };
// window.unlod = function (e) {
// }

firebase.auth().onAuthStateChanged(function(user) {
    var displayName = user.displayName;
    var email = user.email;
    var emailVerified = user.emailVerified;
    var photoURL = user.photoURL;
    var isAnonymous = user.isAnonymous;
    curUid = user.uid;
    var providerData = user.providerData;
    database.ref('/players/' + curUid).once('value', playerSnap => {
        if(playerSnap.val() == null) {
            window.location.replace("/main");
            return;
        }
        pushKey = playerSnap.val().pushKey;
        readRef = database.ref('board/' + pushKey);
        getData();
    });
    giveup();
    leaderRef.child(curUid).once('value', lSnap => {
        if(lSnap.val() != null) {
            var leaderData = lSnap.val();
            if(leaderData.hasOwnProperty('normal')) {
                oldScore = parseInt(leaderData.normal);
            }
            if(leaderData.hasOwnProperty('won')) {
                oldWon = parseInt(leaderData.won);
            }
            if(leaderData.hasOwnProperty('lost')) {
                oldLost = parseInt(leaderData.lost);
            }
        }
    });
});

$(".box-small").on('click', function() {
    if(!$(this).hasClass('done')) {
        var id = $(this).attr('id');
        matrix[id] = player;
        currPos = id;
        var cBigPos = getBig(currPos);
        minicount[cBigPos] += 1;
        if(player == 0) {
            $(this).empty().append('<img src="asset/x.jpg" class="xo-img"></img>');
        } else if(player == 1) {
            $(this).empty().append('<img src="asset/o.jpg" class="xo-img"></img>');
        }
        checkSmall(currPos, cBigPos, false, false);
        block(nextBigPos(currPos));
        writeData(player, currPos);
    } else {
        Materialize.toast('Already Clicked', 1000);
    }
});

function checkSmall(currentSmall, currBigPos, updateMega, updateWin) { //Check single big block win/lose/draw condition
    var min = getMinMax(currentSmall);
    if(matrix[min] == matrix[min + 1] && matrix[min + 1] == matrix[min + 2] && !(matrix[min] == 2)) {
        dispWin(min, min + 1, min + 2, currBigPos, updateMega, updateWin);
    } else if(matrix[min + 3] == matrix[min + 4] && matrix[min + 4] == matrix[min + 5] && !(matrix[min + 3] == 2)) {
        dispWin(min + 3, min + 4, min + 5, currBigPos, updateMega, updateWin);
    } else if(matrix[min + 6] == matrix[min + 7] && matrix[min + 7] == matrix[min + 8] && !(matrix[min + 6] == 2)) {
        dispWin(min + 6, min + 7, min + 8, currBigPos, updateMega, updateWin);
    } else if(matrix[min] == matrix[min + 3] && matrix[min + 3] == matrix[min + 6] && !(matrix[min] == 2)) {
        dispWin(min, min + 3, min + 6, currBigPos, updateMega, updateWin);
    } else if(matrix[min + 1] == matrix[min + 4] && matrix[min + 4] == matrix[min + 7] && !(matrix[min + 1] == 2)) {
        dispWin(min + 1, min + 4, min + 7, currBigPos, updateMega, updateWin);
    } else if(matrix[min + 2] == matrix[min + 5] && matrix[min + 5] == matrix[min + 8] && !(matrix[min + 2] == 2)) {
        dispWin(min + 2, min + 5, min + 8, currBigPos, updateMega, updateWin);
    } else if(matrix[min] == matrix[min + 4] && matrix[min + 4] == matrix[min + 8] && !(matrix[min] == 2)) {
        dispWin(min, min + 4, min + 8, currBigPos, updateMega, updateWin);
    } else if(matrix[min + 2] == matrix[min + 4] && matrix[min + 4] == matrix[min + 6] && !(matrix[min + 2] == 2)) {
        dispWin(min + 2, min + 4, min + 6, currBigPos, updateMega, updateWin);
    } else if(minicount[currBigPos] == 9) {
        $("#b" + currBigPos).empty().removeClass('visi').append('<img src="asset/draw.jpg" alt="" class="above xo-img-mega">');
        big[currBigPos] = 3;
        if(!update) {
            ++megacount;
        }
    }
}

function dispWin(po1, po2, po3, cBPos, updateMega, updateWin) { //Display single big block win/lose/draw condition
    if(big[cBPos] == 0) {
        img = "xwin";
        imgw = "x-mega";
    } else if(big[cBPos] == 1) {
        img = "owin";
        imgw = "o-mega";
    } else if(big[cBPos] == 2) {
        if(cplayer == 0) {
            img = "xwin";
            imgw = "x-mega";
        } else if(cplayer == 1) {
            img = "owin";
            imgw = "o-mega";
        }
        big[cBPos] = cplayer;
    }
    $("#" + po1).empty().append('<img src="asset/' + img + '.jpg" class="xo-img"></img>');
    $("#" + po2).empty().append('<img src="asset/' + img + '.jpg" class="xo-img"></img>');
    $("#" + po3).empty().append('<img src="asset/' + img + '.jpg" class="xo-img"></img>');
    $("#b" + cBPos).empty().removeClass('visi').append('<img src="asset/' + imgw + '.jpg" alt="" class="above xo-img-mega">');
    if(!updateMega) {
        ++megacount;
    }
    checkBig(updateWin);
}

function nextBigPos(currPosVal) { //Get the position of next playable big block
    return currPosVal - Math.floor(currPosVal / 9) * 9;
}

function block(position) { //Blocking and releasing of playable position
    if(position == 9) { //Block all
        $('.above').removeClass('visi');
        $('.box-small').css("background-color", "#FFF");
    } else {
        minipos = position * 9;
        $('.box-small').css("background-color", "#FFF");
        if(big[position] != 2) { // Open choice condition
            //Block all - reset
            for(var i = 0; i < 9; i++) {
                if(big[i] == 2) {
                    $('#b' + i).addClass('visi');
                }
            }
            //Color setting for open choice
            var bigCount = 0;
            for(var i = 0; i < 81; i++) {
                if(big[bigCount] != 2) {
                    i += 8;
                    bigCount++;
                    continue;
                }
                if(player == 0) {
                    $('#' + i).css("background-color", "#BBDEFB");
                } else {
                    $('#' + i).css("background-color", "#FFCCBC");
                }
                if(player != cplayer) {
                    block(9);
                }
                if((i + 1) % 9 == 0) {
                    bigCount++;
                }
            }
        } else { //Closed specific big box
            for(var i = 0; i < 9; i++) {
                if(big[i] == 2) {
                    $('#b' + i).removeClass('visi');
                }
            }
            for(var i = minipos; i < minipos + 9; i++) {
                if(player == 0) {
                    $('#' + i).css("background-color", "#BBDEFB");
                } else {
                    $('#' + i).css("background-color", "#FFCCBC");
                }
                if(player != cplayer) {
                    block(9);
                }
                if((i + 1) % 9 == 0) {
                    bigCount++;
                }

            }
            if(cplayer == player) {
                $('#b' + position).addClass('visi');
            }
        }
    }
}

function checkBig(updateWin) { //Check big win condition
    if(big[0] == big[1] && big[1] == big[2] && !(big[0] == 2) && !(big[0] == 3)) {
        dispBig(0, 1, 2, updateWin);
    } else if(big[3] == big[4] && big[4] == big[5] && !(big[3] == 2) && !(big[3] == 3)) {
        dispBig(3, 4, 5, updateWin);
    } else if(big[6] == big[7] && big[7] == big[8] && !(big[6] == 2) && !(big[6] == 3)) {
        dispBig(6, 7, 8, updateWin);
    } else if(big[0] == big[3] && big[3] == big[6] && !(big[0] == 2) && !(big[0] == 3)) {
        dispBig(0, 3, 6, updateWin);
    } else if(big[1] == big[4] && big[4] == big[7] && !(big[1] == 2) && !(big[1] == 3)) {
        dispBig(1, 4, 7, updateWin);
    } else if(big[2] == big[5] && big[5] == big[8] && !(big[2] == 2) && !(big[2] == 3)) {
        dispBig(2, 5, 8, updateWin);
    } else if(big[0] == big[4] && big[4] == big[8] && !(big[0] == 2) && !(big[0] == 3)) {
        dispBig(0, 4, 8, updateWin);
    } else if(big[2] == big[4] && big[4] == big[6] && !(big[2] == 2) && !(big[2] == 3)) {
        dispBig(2, 4, 6, updateWin);
    } else if(megacount == 9) {
        block(9);
        $('#won-player').text("Game Draw!");
        $('#modal2').modal('open');
    }
}

function dispBig(po1, po2, po3, updateWin) { //Display Full win condition
    if(updateWin) {
        if(cplayer == 1) {
            imgw = "xwin-mega";
            if(player == 0) {
                wonPlayer = "You won!";
                leaderRef.child(curUid).update({
                    normal: oldScore + 2,
                    won: oldWon + 1
                });
            } else if(player == 1) {
                wonPlayer = "You Lost!";
                leaderRef.child(curUid).update({
                    lost: oldLost + 1
                });
            }
        } else if(cplayer == 0) {
            imgw = "owin-mega";
            if(player == 1) {
                wonPlayer = "You won!";
                leaderRef.child(curUid).update({
                    normal: oldScore + 2,
                    won: oldWon + 1
                });
            } else if(player == 0) {
                wonPlayer = "You Lost!";
                leaderRef.child(curUid).update({
                    lost: oldLost + 1
                });
            }
        }
        $("#b" + po1).empty().append('<img src="asset/' + imgw + '.jpg" alt="" class="above xo-img-mega">');
        $("#b" + po2).empty().append('<img src="asset/' + imgw + '.jpg" alt="" class="above xo-img-mega">');
        $("#b" + po3).empty().append('<img src="asset/' + imgw + '.jpg" alt="" class="above xo-img-mega">');
        block(9);
        $('#won-player').text(wonPlayer);
        $('#modal2').modal('open');
    }
}

function getMinMax(val) { // returns first index of big block
    return Math.floor(val / 9) * 9;
}

function getBig(val) { // returns current big block
    return Math.floor(val / 9);
}

$('#logout').click(function(event) {
    firebase.auth().signOut();
    window.location.replace("/logout");
});

function writeData(play, cpos) {
    if(play == 0) {
        currXpos = currXpos + ',' + cpos;
        readRef.update({
            cplayer: 1,
            xpos: currXpos,
            cpos: cpos,
            minicount: minicount.toString(),
            megacount: megacount,
            big: big.toString(),
            first: false
        });
    } else {
        currOpos = currOpos + ',' + cpos;
        readRef.update({
            cplayer: 0,
            opos: currOpos,
            cpos: cpos,
            minicount: minicount.toString(),
            megacount: megacount,
            big: big.toString(),
            first: false
        });
    }
}

function getData() {
    readRef.on('value', function(snap) {
        if(snap.val() == null) {
            database.ref('/players/' + curUid).set(null);
            if(gaveup == true) {
                alert('You lost a point!');
                // leaderRef.child(curUid).update({
                //     normal: oldScore - 1,
                //     lost: oldLost + 1
                // });
            } else {
                // database.ref('players/' + curUid).set(null);
                alert('Your opponent left the game!! You won!! Your score will be updated soon!!');
                //add leaderboard update
            }
            window.location.replace("/main");
        } else {
            var snapVal = snap.val();
            var xplayer = snapVal.x;
            var oplayer = snapVal.o;
            $('#main').removeClass('visi');
            $('#load').addClass('visi');
            if(snapVal.first) {
                if(xplayer == curUid) {
                    Materialize.toast('You are X!', 2000);
                } else if(oplayer == curUid) {
                    Materialize.toast('You are O!', 2000);
                } else {
                    alert('Self Destruct in 3.3s!');
                }
            }
            if(xplayer == curUid) {
                player = 0;
                oppUid = oplayer;
            } else if(oplayer == curUid) {
                player = 1;
                oppUid = xplayer;
            } else {
                alert('Self Destruct in 9s!');
            }
            cplayer = snapVal.cplayer;
            currXpos = snapVal.xpos;
            currOpos = snapVal.opos;
            currCpos = snapVal.cpos;
            minicountString = snapVal.minicount;
            minicount = minicountString.split(',').map(Number);
            megacount = snapVal.megacount;
            bigStr = snapVal.big;
            big = bigStr.split(',').map(Number);
            xpStr = snapVal.xpos;
            opStr = snapVal.opos;
            setMatrix(xpStr.split(',').map(Number), opStr.split(',').map(Number));
            sync();
        }
    });
}

function setMatrix(xp, op) {
    matrix.fill(2);
    for(var i = 1; i < xp.length; i++) {
        matrix[xp[i]] = 0;
        $('#' + xp[i]).removeClass('done').addClass('done');
        $('#' + xp[i]).empty().append('<img src="asset/x.jpg" class="xo-img"></img>');
    }
    for(var i = 1; i < op.length; i++) {
        matrix[op[i]] = 1;
        $('#' + op[i]).removeClass('done').addClass('done');
        $('#' + op[i]).empty().append('<img src="asset/o.jpg" class="xo-img"></img>');
    }
}

function sync() {
    if(cplayer != player) {
        block(9);
    } else {
        if(currCpos != "") {
            block(nextBigPos(currCpos));
        }
    }
    for(var i = 0; i < 9; i++) {
        var temp = i * 9;
        checkSmall(temp, getBig(temp), true, true);
    }
    adjustStyle();
}
