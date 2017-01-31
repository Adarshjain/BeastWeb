$(function() {
    updateContainer();
    $(window).resize(function() {
        updateContainer();
    });
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

function playGame() {
    $(".box-small").on('click', function() {
        if (!$(this).hasClass('done')) {
            matrix[$(this).attr('id')] = player;
            if (player == 0) {
                checkSmall($(this).attr('id'));
                $(this).append('<img src="asset/x.jpg" class="xo-img"></img>');
                player = 1;
            } else if (player == 1) {
                checkSmall($(this).attr('id'));
                $(this).append('<img src="asset/o.jpg" class="xo-img"></img>');
                player = 0;
            }
            $(this).addClass('done');
        } else {
            Materialize.toast('Already Clicked', 1000);
        }
    });
}

function checkSmall(currentSmall) {
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
    }
}

function dispWin(po1, po2, po3, currentSmall) {
    var temp = po1;
    p1 = "#" + po1;
    p2 = "#" + po2;
    p3 = "#" + po3;
    bp = "#b" + getBig(currentSmall);
    if (player == 0) {
        img = "xwin";
        imgw = "x-mega";
    } else {
        img = "owin";
        imgw = "o-mega";
    }
    $(p1).empty().append('<img src="asset/' + img + '.jpg" class="xo-img"></img>');
    $(p2).empty().append('<img src="asset/' + img + '.jpg" class="xo-img"></img>');
    $(p3).empty().append('<img src="asset/' + img + '.jpg" class="xo-img"></img>');
    $(bp).empty().removeClass('hide').append('<img src="asset/' + imgw + '.jpg" alt="" class="xo-img-mega">');
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