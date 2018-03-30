jssor_1_slider_init = function() {

    var jssor_1_SlideshowTransitions = [
        {$Duration:1000,x:1,$Rows:2,$ChessMode:{$Row:3},$Easing:{$Left:$Jease$.$InOutQuart,$Opacity:$Jease$.$Linear},$Opacity:2,$Brother:{$Duration:1000,x:-1,$Rows:2,$ChessMode:{$Row:3},$Easing:{$Left:$Jease$.$InOutQuart,$Opacity:$Jease$.$Linear},$Opacity:2}},
        {$Duration:1000,y:1,$Opacity:2,$Easing:$Jease$.$InBounce},
        {$Duration:1000,x:1,$Opacity:2,$Easing:$Jease$.$InBounce},
        {$Duration:1000,y:-1,$Cols:2,$ChessMode:{$Column:12},$Easing:{$Top:$Jease$.$InOutQuart,$Opacity:$Jease$.$Linear},$Opacity:2,$Brother:{$Duration:1000,y:1,$Cols:2,$ChessMode:{$Column:12},$Easing:{$Top:$Jease$.$InOutQuart,$Opacity:$Jease$.$Linear},$Opacity:2}}
    ];

    var jssor_1_options = {
        $AutoPlay: 1,
        $FillMode: 1,
        $SlideshowOptions: {
        $Class: $JssorSlideshowRunner$,
        $Transitions: jssor_1_SlideshowTransitions
        },
        $ArrowNavigatorOptions: {
        $Class: $JssorArrowNavigator$
        },
        $ThumbnailNavigatorOptions: {
        $Class: $JssorThumbnailNavigator$,
        $Orientation: 2,
        $NoDrag: true
        }
    };

    var jssor_1_slider = new $JssorSlider$("jssor_1", jssor_1_options);

    /*#region responsive code begin*/

    var MAX_WIDTH = 2000;

    function ScaleSlider() {
        var containerElement = jssor_1_slider.$Elmt.parentNode;
        var containerWidth = containerElement.clientWidth;

        if (containerWidth) {

            var expectedWidth = Math.min(MAX_WIDTH || containerWidth, containerWidth);

            jssor_1_slider.$ScaleWidth(expectedWidth);
        }
        else {
            window.setTimeout(ScaleSlider, 30);
        }
    }

    ScaleSlider();

    $Jssor$.$AddEvent(window, "load", ScaleSlider);
    $Jssor$.$AddEvent(window, "resize", ScaleSlider);
    $Jssor$.$AddEvent(window, "orientationchange", ScaleSlider);
    /*#endregion responsive code end*/
};