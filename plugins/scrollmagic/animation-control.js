
jQuery(document).ready(function ($) {
    
   var tweenAnimIn = new TimelineMax ()
   
        tweenAnimIn 
        .set(".animation-main-content", {autoAlpha:0})
       .from(".present1", 1, {y:-600, autoAlpha: 0, ease:Power2.easeOut})
       .from(".present2", 1, {y:-300, autoAlpha: 0, ease:Power2.easeOut}, "-=1")
       .from(".sleigh1", 1, {y:200, autoAlpha: 0, ease:Power2.easeOut}, "-=1")
       .from(".sleigh2", 1, {y:400, autoAlpha: 0, ease:Power2.easeOut}, "-=1")


var controller = new ScrollMagic.Controller();

var scrollOutAnim = new TimelineMax()
    .add([
        TweenMax.to(".present1", 1, {y:-100, autoAlpha: 0}),
        TweenMax.to(".present2", 1, {y:-100, autoAlpha: 0}),
        TweenMax.to(".sleigh1", 1, {y:100, autoAlpha: 0}),
        TweenMax.to(".sleigh2", 1, {y:100, autoAlpha: 0}),
        TweenMax.to(".animation-main-content", 1, {autoAlpha: 1}),
    
    ]);


//build Scene 
 var scrollScene = new ScrollMagic.Scene({
     triggerElement: '.aboutus-section',
     triggerHook:0,
     duration: "100%"})
     
    .setPin(".aboutus-section")
    .setTween(scrollOutAnim)
    //  .addIndicators({
    //  colorTrigger: "black",
    //  colorStart: "black",
    //  colorEnd: "black",
    //})
    .addTo(controller);

});