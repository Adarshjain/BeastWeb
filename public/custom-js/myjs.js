$(function() {
    // updateContainer();
    // $(window).resize(function() {
    //     updateContainer();
    // });
    $(".above").on('click', function() {
        Materialize.toast('You cannot play there!', 1500);
    });
    $('.modal').modal();
    playGame();
});
var player = 0;
var matrix = [
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
var big = [2, 2, 2,
    2, 2, 2,
    2, 2, 2
];
var minicount = [0, 0, 0, 0, 0, 0, 0, 0, 0];
var megacount = 0;

function playGame() {
    $(".box-small").on('click', function() {
        if (!$(this).hasClass('done')) {
            matrix[$(this).attr('id')] = player;
            var currPos = $(this).attr('id');
            var cBigPos = getBig(currPos);
            minicount[cBigPos] += 1;
            if (player == 0) {
                $(this).append('<img src="asset/x.jpg" class="xo-img"></img>');
                checkSmall(currPos, cBigPos);
                player = 1;
                $('#curr-player').text("O's Turn");
            } else if (player == 1) {
                $(this).append('<img src="asset/o.jpg" class="xo-img"></img>');
                checkSmall(currPos, cBigPos);
                player = 0;
                $('#curr-player').text("X's Turn");
            }
            block(nextBigPos(currPos));
            $(this).addClass('done');
            checkBig();
        } else {
            Materialize.toast('Already Clicked', 1000);
        }
    });

}

function checkSmall(currentSmall, currBigPos) {
    var min = getMinMax(currentSmall);
    if (matrix[min] == matrix[min + 1] && matrix[min + 1] == matrix[min + 2] && !(matrix[min] == 2)) {
        dispWin(min, min + 1, min + 2, currentSmall);
    } else if (matrix[min + 3] == matrix[min + 4] && matrix[min + 4] == matrix[min + 5] && !(matrix[min + 3] == 2)) {
        dispWin(min + 3, min + 4, min + 5, currentSmall);
    } else if (matrix[min + 6] == matrix[min + 7] && matrix[min + 7] == matrix[min + 8] && !(matrix[min + 6] == 2)) {
        dispWin(min + 6, min + 7, min + 8, currentSmall);
    } else if (matrix[min] == matrix[min + 3] && matrix[min + 3] == matrix[min + 6] && !(matrix[min] == 2)) {
        dispWin(min, min + 3, min + 6, currentSmall);
    } else if (matrix[min + 1] == matrix[min + 4] && matrix[min + 4] == matrix[min + 7] && !(matrix[min + 1] == 2)) {
        dispWin(min + 1, min + 4, min + 7, currentSmall);
    } else if (matrix[min + 2] == matrix[min + 5] && matrix[min + 5] == matrix[min + 8] && !(matrix[min + 2] == 2)) {
        dispWin(min + 2, min + 5, min + 8, currentSmall);
    } else if (matrix[min] == matrix[min + 4] && matrix[min + 4] == matrix[min + 8] && !(matrix[min] == 2)) {
        dispWin(min, min + 4, min + 8, currentSmall);
    } else if (matrix[min + 2] == matrix[min + 4] && matrix[min + 4] == matrix[min + 6] && !(matrix[min + 2] == 2)) {
        dispWin(min + 2, min + 4, min + 6, currentSmall);
    } else if (minicount[currBigPos] == 9) {
        $("#b" + currBigPos).empty().removeClass('hide').append('<img src="asset/draw.jpg" alt="" class="above xo-img-mega done">');
        big[currBigPos] = 3;
        ++megacount;
    }
}

function dispWin(po1, po2, po3, currentSmall) {
    bigPos = getBig(currentSmall);
    if (player == 0) {
        img = "xwin";
        imgw = "x-mega";
    } else if (player == 1) {
        img = "owin";
        imgw = "o-mega";
    }
    $("#" + po1).empty().append('<img src="asset/' + img + '.jpg" class="xo-img"></img>');
    $("#" + po2).empty().append('<img src="asset/' + img + '.jpg" class="xo-img"></img>');
    $("#" + po3).empty().append('<img src="asset/' + img + '.jpg" class="xo-img"></img>');
    $("#b" + bigPos).empty().removeClass('hide').append('<img src="asset/' + imgw + '.jpg" alt="" class="above xo-img-mega done">');
    big[bigPos] = player;
    ++megacount;
}

function nextBigPos(val) {
    return val - Math.floor(val / 9) * 9;
}

function block(position) {
    if (position == 9) {
        for (var i = 0; i < 9; i++) {
            $('#b' + i).removeClass('hide');
        }
    } else {
        minipos = position * 9;
        for (var i = 0; i < 81; i++) {
            $('#' + i).css("background-color", "#FFF");
        }
        if (big[position] != 2) {
            for (var i = 0; i < 9; i++) {
                if (big[i] == 2) {
                    $('#b' + i).addClass('hide');
                }
            }
            var bigCount = 0;
            for (var i = 0; i < 81; i++) {
                if (big[bigCount] != 2) {
                    i += 8;
                    bigCount++;
                    continue;
                }
                if (player == 0) {
                    $('#' + i).css("background-color", "#BBDEFB");
                } else if (player == 1) {
                    $('#' + i).css("background-color", "#FFEBEE");
                }
                
                if ((i + 1) % 9 == 0) {
                    bigCount++;
                }
            }
        } else {
            for (var i = 0; i < 9; i++) {
                if (big[i] == 2) {
                    $('#b' + i).removeClass('hide');
                }
            }
            for (var i = minipos; i < minipos + 9; i++) {
                if (player == 0) {
                    $('#' + i).css("background-color", "#BBDEFB");
                } else if (player == 1) {
                    $('#' + i).css("background-color", "#FFEBEE");
                }
                
            }
        }
        if (big[position] == 2) {
            $('#b' + position).addClass('hide');
        }

    }
}

function checkBig() {
    if (big[0] == big[1] && big[1] == big[2] && !(big[0] == 2) && !(big[0] == 3)) {
        dispBig(0, 1, 2);
    } else if (big[3] == big[4] && big[4] == big[5] && !(big[3] == 2) && !(big[3] == 3)) {
        dispBig(3, 4, 5);
    } else if (big[6] == big[7] && big[7] == big[8] && !(big[6] == 2) && !(big[6] == 3)) {
        dispBig(6, 7, 8);
    } else if (big[0] == big[3] && big[3] == big[6] && !(big[0] == 2) && !(big[0] == 3)) {
        dispBig(0, 3, 6);
    } else if (big[1] == big[4] && big[4] == big[7] && !(big[1] == 2) && !(big[1] == 3)) {
        dispBig(1, 4, 7);
    } else if (big[2] == big[5] && big[5] == big[8] && !(big[2] == 2) && !(big[2] == 3)) {
        dispBig(2, 5, 8);
    } else if (big[0] == big[4] && big[4] == big[8] && !(big[0] == 2) && !(big[0] == 3)) {
        dispBig(0, 4, 8);
    } else if (big[2] == big[4] && big[4] == big[6] && !(big[2] == 2) && !(big[2] == 3)) {
        dispBig(2, 4, 6);
    } else if (megacount == 9) {
        block(9);
        $('#won-player').text("Game Draw!");
        $('#modal2').modal('open');
    }
}

function dispBig(po1, po2, po3) {
    if (player == 1) {
        imgw = "xwin-mega";
        wonPlayer = "X won!";
    } else if (player == 0) {
        imgw = "owin-mega";
        wonPlayer = "O won!";
    }
    $("#b" + po1).empty().append('<img src="asset/' + imgw + '.jpg" alt="" class="above xo-img-mega done">');
    $("#b" + po2).empty().append('<img src="asset/' + imgw + '.jpg" alt="" class="above xo-img-mega done">');
    $("#b" + po3).empty().append('<img src="asset/' + imgw + '.jpg" alt="" class="above xo-img-mega done">');
    block(9);
    $('#won-player').text(wonPlayer);
    $('#modal2').modal('open');
}

function getMinMax(val) {
    pos = Math.floor(val / 9) * 9;
    return pos;
}

function getBig(val) {
    return Math.floor(val / 9);
}

function updateContainer() {
    $(".playstore").removeClass("right").addClass("center").addClass("center-page");
    var $containerWidth = $(window).width();
    if ((screen.height > screen.width) || $containerWidth < 570) {
        $(".card-cust").addClass('hide');
        $(".playstore").removeClass("right").addClass("center").addClass("center-page");
    }
    if ($containerWidth >= 570) {
        $(".card-cust").removeClass('hide');
        $(".playstore").addClass("right").removeClass("center").removeClass("center-page");
    }
}
