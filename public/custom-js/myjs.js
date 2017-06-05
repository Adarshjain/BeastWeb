var database = firebase.database();
var readRef = database.ref('curBoard/1324');
var player = 0;
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
var big = [ //Big Box win or lost or draw or nothing happened yet --> 0->Xwon, 1->Owon, 2-> Nothing yet, 3->Draw
    2, 2, 2,
    2, 2, 2,
    2, 2, 2
];
var minicount = [0, 0, 0, 0, 0, 0, 0, 0, 0]; //Maintianing number of spots played (Used to check 'Draw' condition)
var megacount = 0; //Used for checking 'Draw' condition for whole mega box
var pl, currCpos;
//matrix,player,big,minicount,megacount
$('#currplayx').click(function(event) {
    pl = 0;
});
$('#currplayo').click(function(event) {
    pl = 1;
});
$(function() {
    // $(".playstore").removeClass("right").addClass("center-page").removeClass('visi');
    // updateContainer();
    // $(window).resize(function() {
    //     updateContainer();
    // });

    $('.modal').modal(); //Materailizecss dialog box
});
$(".above").on('click', function() {
    Materialize.toast('You cannot play there!', 1500);
});

$(".box-small").on('click', function() {
    if(!$(this).hasClass('done')) {
        matrix[$(this).attr('id')] = player;
        var currPos = $(this).attr('id');
        var cBigPos = getBig(currPos);
        minicount[cBigPos] += 1;
        writeData(player, currPos);
        if(player == 0) {
            $(this).append('<img src="asset/x.jpg" class="xo-img"></img>');
            checkSmall(currPos, cBigPos);
            player = 1;
        } else if(player == 1) {
            $(this).append('<img src="asset/o.jpg" class="xo-img"></img>');
            checkSmall(currPos, cBigPos);
            player = 0;
        }
        block(nextBigPos(currPos));
        $(this).addClass('done');
    } else {
        Materialize.toast('Already Clicked', 1000);
    }
});


function checkSmall(currentSmall, currBigPos) {
    var min = getMinMax(currentSmall);
    if(matrix[min] == matrix[min + 1] && matrix[min + 1] == matrix[min + 2] && !(matrix[min] == 2)) {
        dispWin(min, min + 1, min + 2, currBigPos);
    } else if(matrix[min + 3] == matrix[min + 4] && matrix[min + 4] == matrix[min + 5] && !(matrix[min + 3] == 2)) {
        dispWin(min + 3, min + 4, min + 5, currBigPos);
    } else if(matrix[min + 6] == matrix[min + 7] && matrix[min + 7] == matrix[min + 8] && !(matrix[min + 6] == 2)) {
        dispWin(min + 6, min + 7, min + 8, currBigPos);
    } else if(matrix[min] == matrix[min + 3] && matrix[min + 3] == matrix[min + 6] && !(matrix[min] == 2)) {
        dispWin(min, min + 3, min + 6, currBigPos);
    } else if(matrix[min + 1] == matrix[min + 4] && matrix[min + 4] == matrix[min + 7] && !(matrix[min + 1] == 2)) {
        dispWin(min + 1, min + 4, min + 7, currBigPos);
    } else if(matrix[min + 2] == matrix[min + 5] && matrix[min + 5] == matrix[min + 8] && !(matrix[min + 2] == 2)) {
        dispWin(min + 2, min + 5, min + 8, currBigPos);
    } else if(matrix[min] == matrix[min + 4] && matrix[min + 4] == matrix[min + 8] && !(matrix[min] == 2)) {
        dispWin(min, min + 4, min + 8, currBigPos);
    } else if(matrix[min + 2] == matrix[min + 4] && matrix[min + 4] == matrix[min + 6] && !(matrix[min + 2] == 2)) {
        dispWin(min + 2, min + 4, min + 6, currBigPos);
    } else if(minicount[currBigPos] == 9) {
        $("#b" + currBigPos).empty().removeClass('visi').append('<img src="asset/draw.jpg" alt="" class="above xo-img-mega">');
        big[currBigPos] = 3;
        ++megacount;
    }
}

function dispWin(po1, po2, po3, cBPos) {
    if(player == 0) {
        img = "xwin";
        imgw = "x-mega";
    } else if(player == 1) {
        img = "owin";
        imgw = "o-mega";
    }
    $("#" + po1).empty().append('<img src="asset/' + img + '.jpg" class="xo-img"></img>');
    $("#" + po2).empty().append('<img src="asset/' + img + '.jpg" class="xo-img"></img>');
    $("#" + po3).empty().append('<img src="asset/' + img + '.jpg" class="xo-img"></img>');
    $("#b" + cBPos).empty().removeClass('visi').append('<img src="asset/' + imgw + '.jpg" alt="" class="above xo-img-mega">');
    big[cBPos] = player;
    ++megacount;
    checkBig();
}

function nextBigPos(val) {
    return val - Math.floor(val / 9) * 9;
}

function block(position) {
    if(position == 9) {
        for(var i = 0; i < 9; i++) {
            $('#b' + i).removeClass('visi');
        }
        for(var i = 0; i < 81; i++) {
            $('#' + i).css("background-color", "#FFF");
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
                if(player == 0) {
                    $('#' + i).css("background-color", "#BBDEFB");
                } else if(player == 1) {
                    $('#' + i).css("background-color", "#FFCCBC");
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
                } else if(player == 1) {
                    $('#' + i).css("background-color", "#FFCCBC");
                }

            }
            $('#b' + position).addClass('visi');
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
    if(player == 1) {
        imgw = "xwin-mega";
        wonPlayer = "X won!";
    } else if(player == 0) {
        imgw = "owin-mega";
        wonPlayer = "O won!";
    }
    $("#b" + po1).empty().append('<img src="asset/' + imgw + '.jpg" alt="" class="above xo-img-mega">');
    $("#b" + po2).empty().append('<img src="asset/' + imgw + '.jpg" alt="" class="above xo-img-mega">');
    $("#b" + po3).empty().append('<img src="asset/' + imgw + '.jpg" alt="" class="above xo-img-mega">');
    block(9);
    $('#won-player').text(wonPlayer);
    $('#modal2').modal('open');
}

function getMinMax(val) {
    return Math.floor(val / 9) * 9;
}

function getBig(val) {
    return Math.floor(val / 9);
}

function updateContainer() {
    var $containerWidth = $(window).width();
    if($containerWidth < 1050) {

        if((screen.height > screen.width) || $containerWidth < 570) {
            $(".card-cust").addClass('visi');
            $(".playstore").removeClass("right").addClass("center-page").removeClass('visi');
        } else if($containerWidth >= 570) {
            $(".card-cust").removeClass('visi');
            $(".playstore").addClass("right").removeClass("center-page").addClass('visi');
        }
        $('.playstore').addClass('visi');
    } else {
        // if ($containerWidth >= 570) {
        //     $(".card-cust").removeClass('visi');
        $(".playstore").addClass("right").removeClass("center-page").addClass('visi');
        // }
        // $('.playstore').removeClass('visi');
    }
}

$('#logout').click(function(event) {
    firebase.auth().signOut();
    window.location.replace("/logout");
});

readRef.on('value', function(snap) {
    if(snap.val() == null) {
        console.log('Not yet played');
        currXpos = "";
        currOpos = "";
        currBpos = "";
    } else {
        currXpos = snap.val().xpos;
        currOpos = snap.val().opos;
        currCpos = snap.val().cpos;
        minicountString = snap.val().minicount;
        minicount = minicountString.split(',');
        megacount = snap.val().megacount;
        player = snap.val().cplayer;
        big = snap.val().big;
        xpStr = snap.val().xpos;
        opStr = snap.val().opos;
        setMatrix(xpStr.split(','), opStr.split(','));
        setimgs();
        sync();
        // console.log('X: ' + currXpos + ', O: ' + currOpos + ', B:' + currBpos);
        console.log(player);
    }
});


function writeData(play, cpos) {
    if(play == 0) {
        currXpos = currXpos + ',' + cpos;
        play = 1;
    } else {
        currOpos = currOpos + ',' + cpos;
        play = 0;
    }
    database.ref('curBoard/1324').set({
        cplayer: play,
        xpos: currXpos,
        opos: currOpos,
        cpos: cpos,
        minicount: minicount.toString(),
        megacount: megacount,
        big: big.toString()
    });
}


function setMatrix(xp, op) {
    matrix.fill(2);
    for(var i = 1; i < xp.length; i++) {
        matrix[xp[i]] = 0;
    }
    for(var i = 1; i < op.length; i++) {
        matrix[op[i]] = 1;
    }
    // console.log(matrix);
}

function setimgs() {
    for(var i = 0; i < matrix.length; i++) {
        if(matrix[i] == 0) {
            $('#' + i).empty().append('<img src="asset/x.jpg" class="xo-img"></img>');
        }
        if(matrix[i] == 1) {
            $('#' + i).empty().append('<img src="asset/o.jpg" class="xo-img"></img>');
        }
    }
}

function sync() {
    if(player != pl) {
        block(9);
    } else {
        block(nextBigPos(currCPos));
    }
}
