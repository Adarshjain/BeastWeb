function adjustStyle() {
    width = parseInt($(this).width());
    if(width < 601) {
        var tempWidth = width - 6;
        var tempBigWidth = (tempWidth / 3) - 0.69;
        var tempSmallWidth = (tempBigWidth / 3) - 1;
        $("#size-stylesheet").attr("href", "css/index-mobile.css");
        $('.card-cust').css({
            "height": tempWidth,
            "width": tempWidth
        });

        $('.box-big').css({
            "height": tempBigWidth,
            "width": tempBigWidth
        });

        $('.box-small').css({
            "height": tempSmallWidth,
            "width": tempSmallWidth
        });
        $('.above').css({
            "height": tempBigWidth,
            "width": tempBigWidth
        });
        $('.xo-img').css({
            "height": tempSmallWidth,
            "width": tempSmallWidth,
            "cursor": "default"
        });
        $('.xo-img-mega').css({
            "height": tempBigWidth,
            "width": tempBigWidth
        });
        $('.ol1').css({
            "left": tempBigWidth
        });
        $('.ol2').css({
            "left": tempBigWidth * 2
        });

        $('.ot1').css({
            "top": tempBigWidth
        });

        $('.ot2').css({
            "top": tempBigWidth * 2
        });

    } else {
        $("#size-stylesheet").attr("href", "css/index.css");
    }
}

$(function() {
    adjustStyle();
    $(window).resize(function() {
        adjustStyle();
    });
});
