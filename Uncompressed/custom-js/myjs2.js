block(9);
firebase.auth().signInAnonymously().then(function(argument) {
        // setCookie('anon');
        console.log('logged in');
    }).catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        alert(errorMessage);
        console.log(error);
    });
var database = firebase.database();
var readRef = database.ref('curBoard/1324');
var big, minicount, megacount, player, currPos, cplayer, currXpos = "",
    currOpos = "",
    currCpos;
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

function init() {
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
}
$('#currplayx').click(function(event) {
    player = 0;
});
$('#currplayo').click(function(event) {
    player = 1;
});
$(function() {
    $('.modal').modal(); //Materailizecss dialog box
    $('#modal2').modal('open');
});
$(".above").on('click', function() {
    Materialize.toast('You cannot play there!', 1500);
});

$(".box-small").on('click', function() {
    if(!$(this).hasClass('done')) {
        matrix[$(this).attr('id')] = player;
        currPos = $(this).attr('id');
        var cBigPos = getBig(currPos);
        minicount[cBigPos] += 1;
        writeData(player, currPos);
        if(player == 0) {
            $(this).append('<img src="asset/x.jpg" class="xo-img"></img>');
            checkSmall(currPos, cBigPos, false);
        } else if(player == 1) {
            $(this).append('<img src="asset/o.jpg" class="xo-img"></img>');
            checkSmall(currPos, cBigPos, false);
        }
        block(nextBigPos(currPos));
        $(this).addClass('done');
    } else {
        Materialize.toast('Already Clicked', 1000);
    }
});

function checkSmall(currentSmall, currBigPos, update) {
    var min = getMinMax(currentSmall);
    if(matrix[min] == matrix[min + 1] && matrix[min + 1] == matrix[min + 2] && !(matrix[min] == 2)) {
        dispWin(min, min + 1, min + 2, currBigPos, update);
    } else if(matrix[min + 3] == matrix[min + 4] && matrix[min + 4] == matrix[min + 5] && !(matrix[min + 3] == 2)) {
        dispWin(min + 3, min + 4, min + 5, currBigPos, update);
    } else if(matrix[min + 6] == matrix[min + 7] && matrix[min + 7] == matrix[min + 8] && !(matrix[min + 6] == 2)) {
        dispWin(min + 6, min + 7, min + 8, currBigPos, update);
    } else if(matrix[min] == matrix[min + 3] && matrix[min + 3] == matrix[min + 6] && !(matrix[min] == 2)) {
        dispWin(min, min + 3, min + 6, currBigPos, update);
    } else if(matrix[min + 1] == matrix[min + 4] && matrix[min + 4] == matrix[min + 7] && !(matrix[min + 1] == 2)) {
        dispWin(min + 1, min + 4, min + 7, currBigPos, update);
    } else if(matrix[min + 2] == matrix[min + 5] && matrix[min + 5] == matrix[min + 8] && !(matrix[min + 2] == 2)) {
        dispWin(min + 2, min + 5, min + 8, currBigPos, update);
    } else if(matrix[min] == matrix[min + 4] && matrix[min + 4] == matrix[min + 8] && !(matrix[min] == 2)) {
        dispWin(min, min + 4, min + 8, currBigPos, update);
    } else if(matrix[min + 2] == matrix[min + 4] && matrix[min + 4] == matrix[min + 6] && !(matrix[min + 2] == 2)) {
        dispWin(min + 2, min + 4, min + 6, currBigPos, update);
    } else if(minicount[currBigPos] == 9) {
        $("#b" + currBigPos).empty().removeClass('visi').append('<img src="asset/draw.jpg" alt="" class="above xo-img-mega">');
        big[currBigPos] = 3;
        if(!update) {
            ++megacount;
        }
    }
}

function dispWin(po1, po2, po3, cBPos, update) {
    var pl;
    if(cplayer == 1) {
        img = "xwin";
        imgw = "x-mega";
        pl = 1;
    } else if(cplayer == 0) {
        img = "owin";
        imgw = "o-mega";
        pl = 1;
    }
    $("#" + po1).empty().append('<img src="asset/' + img + '.jpg" class="xo-img"></img>');
    $("#" + po2).empty().append('<img src="asset/' + img + '.jpg" class="xo-img"></img>');
    $("#" + po3).empty().append('<img src="asset/' + img + '.jpg" class="xo-img"></img>');
    $("#b" + cBPos).empty().removeClass('visi').append('<img src="asset/' + imgw + '.jpg" alt="" class="above xo-img-mega">');
    big[cBPos] = pl;
    if(!update) {
        ++megacount;
    }
    checkBig();
}

function nextBigPos(currPosVal) {
    return currPosVal - Math.floor(currPosVal / 9) * 9;
}

function block(position) {
    if(position == 9) { //Block all
        for(var i = 0; i < 9; i++) {
            $('#b' + i).removeClass('visi');
        }
        for(var i = 0; i < 81; i++) {
            $('#' + i).css("background-color", "#FFF");
        }
    } else if(position == 10) { // open all for initial condition
        for(var i = 0; i < 9; i++) {
            if(big[i] == 2) {
                $('#b' + i).addClass('visi');
            }
        }
    } else {
        minipos = position * 9;
        for(var i = 0; i < 81; i++) {
            $('#' + i).css("background-color", "#FFF");
        }
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
                if(player == cplayer) {
                    if(player == 0) {
                        $('#' + i).css("background-color", "#BBDEFB");
                    } else {
                        $('#' + i).css("background-color", "#FFCCBC");
                    }
                } else {
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
                if(player == cplayer) {
                    if(player == 0) {
                        $('#' + i).css("background-color", "#BBDEFB");
                    } else {
                        $('#' + i).css("background-color", "#FFCCBC");
                    }
                } else {
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

function checkBig() {
    if(big[0] == big[1] && big[1] == big[2] && !(big[0] == 2) && !(big[0] == 3)) {
        dispBig(0, 1, 2);
    } else if(big[3] == big[4] && big[4] == big[5] && !(big[3] == 2) && !(big[3] == 3)) {
        dispBig(3, 4, 5);
    } else if(big[6] == big[7] && big[7] == big[8] && !(big[6] == 2) && !(big[6] == 3)) {
        dispBig(6, 7, 8);
    } else if(big[0] == big[3] && big[3] == big[6] && !(big[0] == 2) && !(big[0] == 3)) {
        dispBig(0, 3, 6);
    } else if(big[1] == big[4] && big[4] == big[7] && !(big[1] == 2) && !(big[1] == 3)) {
        dispBig(1, 4, 7);
    } else if(big[2] == big[5] && big[5] == big[8] && !(big[2] == 2) && !(big[2] == 3)) {
        dispBig(2, 5, 8);
    } else if(big[0] == big[4] && big[4] == big[8] && !(big[0] == 2) && !(big[0] == 3)) {
        dispBig(0, 4, 8);
    } else if(big[2] == big[4] && big[4] == big[6] && !(big[2] == 2) && !(big[2] == 3)) {
        dispBig(2, 4, 6);
    } else if(megacount == 9) {
        block(9);
        $('#won-player').text("Game Draw!");
        $('#modal2').modal('open');
    }
}

function dispBig(po1, po2, po3) {
    if(cplayer == 1) {
        imgw = "xwin-mega";
        wonPlayer = "X won!";
    } else if(cplayer == 0) {
        imgw = "owin-mega";
        wonPlayer = "O won!";
    }
    $("#b" + po1).empty().append('<img src="asset/' + imgw + '.jpg" alt="" class="above xo-img-mega">');
    $("#b" + po2).empty().append('<img src="asset/' + imgw + '.jpg" alt="" class="above xo-img-mega">');
    $("#b" + po3).empty().append('<img src="asset/' + imgw + '.jpg" alt="" class="above xo-img-mega">');
    block(9);
    $('#won-player').text(wonPlayer);
    $('#modal2').modal('open');
    //FInal win draw condition
}

function getMinMax(val) {
    return Math.floor(val / 9) * 9;
}

function getBig(val) {
    return Math.floor(val / 9);
}

$('#logout').click(function(event) {
    firebase.auth().signOut();
    console.log('logged out');
    // window.location.replace("/logout");
});

function writeData(play, cpos) {
    if(play == 0) {
        // if(currXpos == "") {
        //     currXpos = "" + cpos;
        // } else {
        currXpos = currXpos + ',' + cpos;
        // }
        play = 1;
        database.ref('curBoard/1324').update({
            cplayer: play,
            xpos: currXpos,
            cpos: cpos,
            minicount: minicount.toString(),
            megacount: megacount,
            big: big.toString()
        });
    } else {
        // if(currOpos == "") {
        //     currOpos = "" + cpos;
        // } else {
        currOpos = currOpos + ',' + cpos;
        // }
        play = 0;
        database.ref('curBoard/1324').update({
            cplayer: play,
            opos: currOpos,
            cpos: cpos,
            minicount: minicount.toString(),
            megacount: megacount,
            big: big.toString()
        });
    }
}

readRef.on('value', function(snap) {
    if(snap.val() == null) {
        init();
        if(player == 0) {
            block(10);
        } else {
            block(9);
        }
        database.ref('curBoard/1324').set({
            cplayer: 0,
            xpos: "",
            opos: "",
            cpos: "",
            minicount: minicount.toString(),
            megacount: megacount,
            big: big.toString()
        });
        alert('Start');
    } else {
        cplayer = snap.val().cplayer;
        totXpos = snap.val().xpos;
        totOpos = snap.val().opos;
        console.log(player);
        currCpos = snap.val().cpos;
        minicountString = snap.val().minicount;
        minicount = minicountString.split(',').map(Number);
        megacount = snap.val().megacount;
        bigStr = snap.val().big;
        big = bigStr.split(',').map(Number);
        xpStr = snap.val().xpos;
        opStr = snap.val().opos;
        setMatrix(xpStr.split(',').map(Number), opStr.split(',').map(Number));
        sync();
    }
});

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
    if(currCpos != "") {
        console.log('checking small');
        checkSmall(currCpos, getBig(currCpos), true);
    }
}

//add class done
