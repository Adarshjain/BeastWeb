$(function() {
    updateContainer();
    $(window).resize(function() {
        updateContainer();
    });
    playGame();
});

function updateContainer() {
    $(".card-cust").hide();
    $(".playstore").removeClass("right").addClass("center").addClass("center-page");
    var $containerWidth = $(window).width();
    if ((screen.height > screen.width) || $containerWidth < 570) {
        $(".card-cust").hide();
        $(".playstore").removeClass("right").addClass("center").addClass("center-page");
    }
    if ($containerWidth >= 570) {
        $(".card-cust").show();
        $(".playstore").addClass("right").removeClass("center").removeClass("center-page");
    }
}

function playGame() {
    var player = true;
    $(".box-small").on('click', function() {
        if (!$(this).hasClass('done')) {
            if (player) {
                $(this).append('<img src="asset/x.jpg" class="xo-img"></img>');
                player = false;
            } else {
                $(this).append('<img src="asset/o.jpg" class="xo-img"></img>');
                player = true;
            }
            $(this).addClass('done');
        } else {
            Materialize.toast('Already Clicked', 2000);
        }
    });
}