//$('.home-banner').css({height:$(window).height()})
//console.log($(window).height())

$(document).ready(function() {
  
  /* ================  Sermon Select Category ==========*/
  $('.filter select').change((event)=>{
    var selectdFiltr = event.currentTarget.value; //Get the value of the element whose event listeners triggered a specific event
    window.location.href = `/sermons/filter/${selectdFiltr}`
  });
  /*$('#byPastor').change(function(){
    console.log($(this).val());
    var pastor = $('#byPastor').val();
    window.location.href = `/sermons/filter/${pastor}`
  });

  $('#byCat').change(function(){
    var category = $('#byCat').val();
    window.location.href = `/sermons/filter/${category}`
  })

  $('#bySeries').change(function(){
    var series = $('#bySeries').val();
    window.location.href = `/sermons/filter/${series}`
  })*/




  /*<-----*Side Navigation controls ---->*/
  $('.openbtn').on('click', function(e){
    e.preventDefault
    document.getElementById("mySidenav").style.width = "250px";
    document.getElementById("main").style.marginLeft = "250px"; 
    $('.openbtn').css({opacity:'0'})
  });


  $('.dropdwn').on('click', function(){
    $('.dropdwn-content').toggle(500);
  })
  $('.closebtn').on('click', function(){
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("main").style.marginLeft= "0";
    $('.openbtn').css({opacity:'1'})
  });
    




  //slider 
    // Here we're going to move the active class between the slides. You can do this however you want, but for brevity I'm using JQuery.

    // Get all the slides
    var slides = $('.slide');

    // Move the last slide before the first so the user is able to immediately go backwards
    slides.first().before(slides.last());

    function clicker() {
    // Get all the slides again
    slides = $('.slide');
    // Register button
    var button = $(this);
    // Register active slide
    var activeSlide = $('.active');
    
    // Next function
        // Move first slide to the end so the user can keep going forward
        slides.last().after(slides.first());
        // Move active class to the right
        activeSlide.removeClass('active').next('.slide').addClass('active');
    
    // Previous function
    if (button.attr('id') == 'previous') {
        // Move the last slide before the first so the user can keep going backwards
        slides.first().before(slides.last());
        // Move active class to the left
        activeSlide.removeClass('active').prev('.slide').addClass('active');
    }
    };
    setInterval(clicker,5000)

    var movementStrength = 25;
    var height = movementStrength / $(window).height();
    var width = movementStrength / $(window).width();
    $("#top-image").mousemove(function(e){
              var pageX = e.pageX - ($(window).width() / 2);
              var pageY = e.pageY - ($(window).height() / 2);
              var newvalueX = width * pageX * -1 - 25;
              var newvalueY = height * pageY * -1 - 50;
              $('#top-image').css("background-position", newvalueX+"px     "+newvalueY+"px");
    });
    /*$(window).scroll(function() {
        var scroll = $(window).scrollTop();
          $(".zoom-me").css({
              width: (100 + scroll/5)  + "%",
              top: -(scroll/10)  + "%",
              //Blur suggestion from @janwagner: https://codepen.io/janwagner/ in comments
              "-webkit-filter": "blur(" + (scroll/200) + "px)",
              filter: "blur(" + (scroll/200) + "px)"
          });
      });
      */
 });