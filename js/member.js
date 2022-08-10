// JQUERY DOCUMENT

$(window).on("load", function () {
  // LOADING FADEOUT
  $(".loading-animation").fadeOut();
  // COOKTEAM FUNCTION
});

// HIDE HEADER ON SCROLL DOWN (MOBILE VERSION)
var didScroll;
var lastScrollTop = 0;
var delta = 5;
var navbarHeight = $("header").outerHeight();

setInterval(function () {
  if (didScroll) {
    hasScrolled();
    didScroll = false;
  }
}, 250);

function hasScrolled() {
  var st = $(this).scrollTop();

  if (Math.abs(lastScrollTop - st) <= delta) return;

  if (st > lastScrollTop && st > navbarHeight) {
    // Scroll Down
    $("header").addClass("hide-nav-bar");
    // $(".header-mobile").removeClass("open");
    //$(".hamburger-menu").removeClass("show-in");
  } else {
    // Scroll Up
    if (st + $(window).height() < $(document).height()) {
      $("header").removeClass("hide-nav-bar");
      //$(".header-mobile").addClass("open");
      //$(".hamburger-menu").addClass("show-in");
    }
  }

  lastScrollTop = st;
}

$(document).ready(function () {
  "use strict";

  // GET API
  $.ajax({
    type: "GET",
    url: "https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=fnd&lang=tc",
    data: "data",
    dataType: "json",
    success: function (data, status, xhr) {
      console.log("data:", data);
      //alert(data);

      // var returnedData = JSON.parse(data.length); Txt 先用依個
      var returnedData = JSON.stringify(data); // decoode JSON string object
      //alert (data.weatherForecast[0]['week']);
      $("#week").html(data.weatherForecast[0]["week"]);
    },
  });

  $.ajax({
    type: "GET",
    url: "http://api.timezonedb.com/v2.1/get-time-zone?key=VKAGGICP0OE2&format=json&by=zone&zone=Asia/Taipei&time=1653484049",
    data: "data",
    dataType: "json",
    success: function (data, status, xhr) {
      console.log("data:", data);
      //alert(data);

      // var returnedData = JSON.parse(data.length); Txt 先用依個
      var returnedData = JSON.stringify(data); // decoode JSON string object
      //alert (data.formatted);
      $("#date").html(data.formatted);
    },
  });

  $.ajax({
    type: "GET",
    url: "https://dog.ceo/api/breeds/image/random",
    data: "data",
    dataType: "json",
    success: function (data, status, xhr) {
      console.log("data:", data);
      //alert(data);

      // var returnedData = JSON.parse(data.length); Txt 先用依個
      var returnedData = JSON.stringify(data); // decoode JSON string object
      //alert (data.formatted);
      $("#showme").html("<img src=" + data.message + ">");
    },
  });

  var requestOptions = {
  method: 'POST',
  body: JSON.stringify({"apikey": "84f58e3c4ca1783f4fa0010d361701887c3f3019"}) ,
  headers:{
    "Content-Type": "application/json"
  }
};

fetch("https://api.flaticon.com/v3/app/authentication", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));

  // SCROLL FUNCTION
  $(window).scroll(function () {
    // HEADER SCROLL DOWN DEFAULT
    didScroll = true;

    // FADEIN / OUT - FUNCTION
    if ($(this).scrollTop() > 100) {
      $(".back").fadeIn();
    } else {
      $(".back").fadeOut();
    }
    // BACKGROUND - EFFECT
    var scrolleffect = $(this).scrollTop();
    $(".aboutus-section").css(
      "background-position",
      "0% " + parseInt(scrolleffect * 2 + 30) + "px"
    );
    $(".aboutus-bg-effect-section").css(
      "background-position",
      "0% " + parseInt(scrolleffect * 1.5) + "px"
    );

    // COUNTER - FUNCTION
    var a = 0;
    var oTop = $("#counter").offset().top - window.innerHeight;
    if (a == 0 && $(window).scrollTop() > oTop) {
      $(".counter-value").each(function () {
        var $this = $(this),
          countTo = $this.attr("data-count");
        $({
          countNum: $this.text(),
        }).animate(
          {
            countNum: countTo,
          },
          {
            duration: 5000,
            easing: "swing",
            step: function () {
              $this.text(Math.floor(this.countNum));
            },
            complete: function () {
              $this.text(this.countNum);
              //alert('finished');
            },
          }
        );
      });
      a = 1;
    }
  });

  // POP
  function subscribePopup() {
    var subscribe = $("#subscribe"),
      time = subscribe.data("time");
    setTimeout(function () {
      if (subscribe.length > 0) {
        subscribe.addClass("active");
      }
    }, time);
    $(".btn-close").click(function (event) {
      event.preventDefault();
      $(this).parents(".popup-ads-section").removeClass("active");
    });
  }
  subscribePopup();
  // BACK TO TOP FACTION

  $(".back").click(function (event) {
    event.preventDefault();
    var hash = $(this).attr("href");
    $("html, body").animate(
      {
        scrollTop: $(hash).offset().top - $("header").outerHeight(),
      },
      800
    );
    return false;
  });

  // TOAST FACTION

  $("a[data-tooltip='Favorite']").click(function () {
    event.preventDefault();
    $(".toast-favorite").toast("show");
  });

  $(".btn-cancel").click(function (event) {
    event.preventDefault();
    var hash = $(this).attr("href");
    $(this).parents(".cart-item").addClass("d-none");
  });

  // MENU

  $(".hamburger-menu").click(function () {
    $(this).parents("header").siblings(".header-mobile").toggleClass("open");
    $(this).toggleClass("show-in");
  });

  $(".main-menu-parent").click(function () {
    $(this).siblings(".main-menu-parent").children(".sub-menu").slideUp("fast");
    $(this)
      .siblings(".main-menu-parent")
      .find(".fa-angle-down")
      .removeClass("active");
    $(this).find(".fa-angle-down").addClass("active");
    $(this).children(".sub-menu").slideToggle("fast");
  });

  // PRICE SLIDER

  $(function () {
    $("#product-price-filer").slider({
      range: true,
      min: 0,
      max: 500,
      values: [75, 300],
      slide: function (event, ui) {
        $("#price-range").val("$" + ui.values[0] + " - $" + ui.values[1]);
      },
    });
    $("#price-range").val(
      "$" +
        $("#product-price-filer").slider("values", 0) +
        " - $" +
        $("#product-price-filer").slider("values", 1)
    );
  });

  // FILTER : CHECK FACTION

  $(".widget-option").click(function () {
    if ($(this).find("input[type='checkbox']").is(":checked")) {
      $(this).find("input[type='checkbox']").removeAttr("checked");
    } else {
      $(this).find("input[type='checkbox']").attr("checked", "checked");
    }
  });

  $("label[for='checkbox-remember-me']").click(function () {
    if ($(this).siblings("input[type='checkbox']").is(":checked")) {
      $(this).siblings("input[type='checkbox']").removeAttr("checked");
    } else {
      $(this).siblings("input[type='checkbox']").attr("checked", "checked");
    }
  });

  $(".dropdown-menu a").click(function () {
    $(this)
      .parents(".dropdown")
      .find(".btn-filter")
      .html('<i class="fas fa-sort-amount-up mr-5"></i>' + $(this).text());
    $(this).parents(".dropdown").find(".btn-filter").val($(this).data("value"));
  });

  // LOCK

  $(".fa-lock-alt").click(function (e) {
    e.preventDefault();
    if ($(this).siblings("input").attr("type") !== "password") {
      $(this).siblings("input").attr("type", "password");
      $(this).removeClass("fa-unlock-alt");
      $(this).addClass("fa-lock-alt");
    } else {
      $(this).siblings("input").attr("type", "text");
      $(this).removeClass("fa-lock");
      $(this).addClass("fa-unlock-alt");
    }
  });

  //REMEMBER ME FUNCTION

  $("#login").click(function () {
    var username = $("#username").val();
    var password = $("#password").val();
    var remember = $("#remember").val();
    var mydata = "Login_Username=" + username + "&Login_Password=" + password;
    console.log(mydata);

    $.ajax({
      type: "POST",
      url: "http://127.0.0.1:9998/login",
      data: mydata,
      dataType: "text",
      success: function (r) {
        alert(r);
        if(r=="success") {
          window.location.href='/index';
          localStorage.setItem("login_Success", username);
          // alert("r:" + r + ",login_Success");
        } else{
          alert("r:" + r + ",Login fail");
          return
        }
      },
      error: function (xhr, status, error) {
        console.log(error.message);
      },
    });
    
    if ($("#remember").is(":checked")) {
      alert("Remember Username");
      localStorage.setItem("login_Username", username);
      localStorage.setItem("login_Remember", remember);
    } else {
      alert("Forget Username");
      localStorage.removeItem("login_Username", username);
      localStorage.removeItem("login_Remember", remember);
    }
    
  });

  $("#logout").click(function (e) {
    var username = $("#username").val();
    $("header").removeClass("member-logged");
    localStorage.removeItem("login_Success", username);
    $("header #loggedUsername").text();
    alert("clicked");
  });
  
  // LOGGIN IN DATA
  if (localStorage.login_Success && localStorage.login_Success !== "") {
    var localvalusername = localStorage.getItem("login_Success");
    $("header").addClass("member-logged");
    $("header #loggedUsername").text(localvalusername);   
  } else {
    $("header #loggedUsername").text();
  }
    // REMEMBER ME DATA

  if (localStorage.login_Username && localStorage.login_Username !== "") {
    var localvalusername = localStorage.getItem("login_Username");
    $("#remember").attr("checked", "checked");
    $(".login-section #username").val(localvalusername);
  } else {
    $("#remember").removeAttr("checked");
    $(".login-section #username").val();
  }

  //REGISTRATION SECTION

  //CHECK DATA FUNCTION
  $("#register").click(function () {
    var username = $("#username").val();
    var email = $("#email").val();
    var password = $("#password").val();
    var confirm = $("#confirm").val();
    var mydata = "Register_Username=" + username + "&Register_Password=" + password + "&Register_Email=" + email;
    console.log(mydata);
    
    localStorage.setItem("Register_Username", username);
    localStorage.setItem("Register_Email", email);

    if (password.length < 5) {
      alert("Password too short at least 5");
      $(".error-messaging").html("Please try again").addClass("fa-unlock-alt");
    } else if (confirm != password) {
      alert("密碼唔一樣");
      $(".error-messaging").html("Please try again").addClass("fa-unlock-alt");
    } else if ($("#privacy").not(":checked").length) {
      alert("未check");
      $(".error-messaging").html("Please try again").addClass("fa-unlock-alt");
    } else if (confirm == password) {
      $.ajax({
        type: "POST",
        url: "http://127.0.0.1:9998/register",
        data: mydata,
        dataType: "text",
        success: function (r) {
          alert(r);
          if(r=="success") {
            window.location.href='/index';
          } else{
            alert("r:" + r + ",register fail");
            return
          }
        },
        error: function (xhr, status, error) {
          console.log(error.message);
        },
      });
    }
  });

  if (localStorage.Register_Username && localStorage.Register_Username !== "") {
    var localvalusername = localStorage.getItem("Register_Username");
    console.log("Register_Username=" + localvalusername);
    $(".register-section #username").val(localvalusername);
  } else {
    $(".register-section #username").val();
  }

  if (localStorage.Register_Email && localStorage.Register_Email !== "") {
    var localvalusername = localStorage.getItem("Register_Email");
    $(".register-section #email").val(localvalusername);
  } else {
    $(".register-section #email").val();
  }

  // PRODUCT Rating : FOR LOOP

  $(".product-rating").each(function () {
    var rating = parseInt($(this).html());
    var color = "fa-normal-yellow";
    var i;
    var star = "";
    for (i = 0; i < 5; i++) {
      if (i <= rating) {
        star += '<i class="fas fa-star ' + color + '"></i>';
      } else {
        star += '<i class="fas fa-star fa-normal"></i>';
      }
    }
    $(this).html($(this).html() + star);
  });

  // PURCHARE : PLUS + MINUS FACTION

  $(".purchase-quantity").each(function () {
    var el = $(this),
      numberValue = el.find("input").val();
    el.find(".puchase-plus").on("click", function (e) {
      e.preventDefault();
      numberValue++;
      el.find("input").val(numberValue);
      el.find("input").attr("value", numberValue);
    });
    el.find(".puchase-minus").on("click", function (e) {
      e.preventDefault();
      if (numberValue > 1) {
        numberValue--;
        el.find("input").val(numberValue);
        el.find("input").attr("value", numberValue);
      }
    });
  });

  // OWL SILDER : HISTORY

  $(".slider-history").owlCarousel({
    nav: false,

    dots: true,

    loop: false,

    margin: 50,

    merge: true,

    autoplay: false,

    autoplayTimeout: 2000,

    autoplayHoverPause: true,

    responsive: {
      0: {
        items: 1,
      },

      768: {
        items: 2,
      },

      992: {
        items: 2,
      },
    },
  });

  // OWL SILDER : COMMENT SUGGEST

  $(".slider-comment").owlCarousel({
    nav: true,

    navText: [
      "<i class='fas fa-angle-left fa-2x'></i>",
      "<i class='fas fa-angle-right fa-2x'></i>",
    ],

    dots: true,

    margin: 10,

    merge: true,

    loop: true,

    // startPosition: '#btn-product1',

    responsive: {
      0: {
        items: 1,
      },

      768: {
        items: 1,
      },

      992: {
        items: 1,
      },
    },
  });

  // OWL SILDER : PRODUCT SUGGEST

  $(".slider-product-suggest").owlCarousel({
    nav: true,

    navText: [
      "<i class='fas fa-angle-left fa-2x'></i>",
      "<i class='fas fa-angle-right fa-2x'></i>",
    ],

    dots: false,

    margin: 10,

    merge: true,

    autoplay: true,

    autoplayTimeout: 2000,

    autoplayHoverPause: true,

    loop: true,

    URLhashListener: true,

    // startPosition: '#btn-product1',

    responsive: {
      0: {
        items: 2,
      },

      768: {
        items: 3,
      },

      992: {
        items: 5,
      },
    },
  });

  // OWL SILDER : ONE PRODUCT

  $(".slider-product").owlCarousel({
    nav: true,

    navText: [
      "<i class='fas fa-angle-left fa-2x'></i>",
      "<i class='fas fa-angle-right fa-2x'></i>",
    ],

    dots: false,

    loop: false,

    mouseDrag: false,
    autoplayTimeout: 1000,
    URLhashListener: true,

    // startPosition: '#btn-product1',

    responsive: {
      0: {
        items: 1,
      },

      768: {
        items: 1,
      },

      992: {
        items: 1,
      },
    },
  });

  // OWL SILDER : ONE PRODUCT CLICK FUNTION

  $(".slider-product").on("translated.owl.carousel", function (e) {
    var hash = $(".slider-product .active > div").attr("data-hash");

    $(".slider-navbar a").removeClass("active");

    $("#btn-" + hash).addClass("active");
  });

  $(".owl-prev").on("click", function () {
    var hash = $(".slider-product .active > div").attr("data-hash");

    $(".slider-navbar a").removeClass("active");

    $("#btn-" + hash).addClass("active");
  });

  // REV SLIDER : HOME BANNER

  if ($("#rev_slider_1059_1").revolution == undefined) {
    //revslider_showDoubleJqueryError("#rev_slider_1059_1");
  } else {
    $("#rev_slider_1059_1")
      .show()
      .revolution({
        sliderType: "standard",
        jsFileLocation: "revolution/js/",
        sliderLayout: "fullwidth",
        dottedOverlay: "none",
        delay: 9000,
        navigation: {
          keyboardNavigation: "off",
          keyboard_direction: "horizontal",
          mouseScrollNavigation: "off",
          mouseScrollReverse: "default",
          onHoverStop: "off",
          touch: {
            touchenabled: "on",
            swipe_threshold: 75,
            swipe_min_touches: 50,
            swipe_direction: "horizontal",
            drag_block_vertical: false,
          },
          bullets: {
            enable: true,
            hide_onmobile: true,
            hide_under: 800,
            style: "zeus",
            hide_onleave: false,
            direction: "horizontal",
            h_align: "center",
            v_align: "bottom",
            h_offset: 0,
            v_offset: 30,
            space: 5,
            tmp: '<span class="tp-bullet-image"></span><span class="tp-bullet-imageoverlay"></span><span class="tp-bullet-title">{{title}}</span>',
          },
        },
        responsiveLevels: [1240, 1024, 778, 480],
        visibilityLevels: [1240, 1024, 778, 480],
        gridwidth: [1240, 1024, 778, 480],
        gridheight: [800, 768, 960, 720],
        lazyType: "none",
        parallax: {
          type: "scroll",
          origo: "slidercenter",
          speed: 1000,
          levels: [
            5, 10, 15, 20, 25, 30, 35, 40, 45, 46, 47, 48, 49, 50, 100, 55,
          ],
          type: "scroll",
        },
        shadow: 0,
        spinner: "off",
        stopLoop: "on",
        stopAfterLoops: 0,
        stopAtSlide: 1,
        shuffle: "off",
        autoHeight: "off",
        fullScreenAutoWidth: "off",
        fullScreenAlignForce: "off",
        fullScreenOffsetContainer: "",
        fullScreenOffset: "60px",
        disableProgressBar: "on",
        hideThumbsOnMobile: "off",
        hideSliderAtLimit: 0,
        hideCaptionAtLimit: 0,
        hideAllCaptionAtLilmit: 0,
        debugMode: false,
        fallbacks: {
          simplifyAll: "off",
          nextSlideOnWindowFocus: "off",
          disableFocusListener: false,
        },
      });
  }

  $(".team-img-inner").freetile();
  $(".teamslider-wrap").teamslider();
  new WOW().init();
});
