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
        //$(".header-mobile").removeClass("open");
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

function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return decodeURIComponent(c.substring(name.length, c.length));
        }
    }
    return "";
}

$(document).ready(function () {
    "use strict";

    var loginUsername = getCookie("Login_username");
    if (!!loginUsername) {
        $("header").addClass("member-logged");
        $("header #loggedUsername").text(loginUsername);
        var totalQty=0;
        $.ajax({
            type: "GET",
            url: "http://localhost:9998/getQuantity",
            data: "data",
            dataType: "json",
            success: function(data, status, xhr) {
                data.forEach((item)=>{
                    totalQty+=item.Quantity
                })
                $('.header-top-menu .icon-cart a').attr('data-quantity', totalQty);
            },
        });

        //alert("Login!"+ login);
    } else {
        $("header #loggedUsername").text();
    };

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
        var counter = $("#counter");
        if (counter.length) {
            var oTop = counter.offset().top - window.innerHeight;
            if (a == 0 && $(window).scrollTop() > oTop) {
                $(".counter-value").each(function () {
                    var $this = $(this),
                        countTo = $this.attr("data-count");
                    $({
                        countNum: $this.text(),
                    }).animate({
                        countNum: countTo,
                    }, {
                        duration: 5000,
                        easing: "swing",
                        step: function () {
                            $this.text(Math.floor(this.countNum));
                        },
                        complete: function () {
                            $this.text(this.countNum);
                            //alert('finished');
                        },
                    });
                });
                a = 1;
            }
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
        $("html, body").animate({
            scrollTop: $(hash).offset().top - $("header").outerHeight(),
        },
            800
        );
        return false;
    });

    // TOAST FAVORITE FACTION

    $("a[data-tooltip='Favorite']").click(function (event) {
        event.preventDefault();
        if (!!loginUsername) {
            $(".toast-favorite").toast("show");
        } else {
            window.location.href = "/login";
        }
    });

    // PURCHARE : PLUS + MINUS FACTION

    $(".purchase-quantity").each(function () {
        var $this = $(this),
            numberValue = $this.find("input").val();
        $this.find(".puchase-plus").on("click", function (e) {
            e.preventDefault();
            numberValue++;
            $this.siblings("button[data-tooltip='Add to Cart']").data("quantity", numberValue);
            // alert($("button[data-tooltip='Add to Cart']").data('quantity'));
            $this.find("input").val(numberValue);
            $this.find("input").attr("value", numberValue);
        });
        $this.find(".puchase-minus").on("click", function (e) {
            e.preventDefault();
            if (numberValue > 1) {
                numberValue--;
                $this
                    .siblings("button[data-tooltip='Add to Cart']")
                    .data("quantity", numberValue);
                $this.find("input").val(numberValue);
                $this.find("input").attr("value", numberValue);
            }
        });
    });


    /*
    // Backup Old Coding..Now Change to Vue.js...
    // TOAST CART FACTION
    $("[data-tooltip='Add to Cart']").click(function(event) {
        event.preventDefault();
        var username = localStorage.getItem("login_Success");
        var productname = $(this).data("productname");
        var category = $(this).data("category");
        var quantity = $(this).data("quantity");
        var price = $(this).data("price");
        var mydata = "Username=" + username + "&ProductName=" + productname + "&Category=" + category + "&Price=" + price + "&Quantity=" + quantity;
        console.log(mydata);
        if (localStorage.login_Success && localStorage.login_Success !== "" || localStorage.OAuth_Success && localStorage.OAuth_Success !== "") {
            if (window.location.pathname == "/product-list") {
                $.ajax({
                    type: "POST",
                    url: "http://localhost:9998/product-list",
                    data: mydata,
                    dataType: "text",
                    success: function(r) {
                        // alert(r);
                        if (r == "First_Time_Add_Cart") {
                            // alert("r:" + r + ",Cart Success");
                            $(".toast-cart").find(".product-name").text(productname);
                            $(".toast-cart").toast("show");
                        } else {
                            // alert("Result:" + r + "Please try agrain");
                            $(".toast-cart").find(".product-name").text(productname);
                            $(".toast-cart").toast("show");
                            return;
                        }
                    },
                    error: function(xhr, status, error) {
                        console.log(error.message);
                    },
                });
            } else {
                $.ajax({
                    type: "POST",
                    url: "http://localhost:9998/product-detail-a",
                    data: mydata,
                    dataType: "text",
                    success: function(r) {
                        // alert(r);
                        if (r == "Cart_Success") {
                            // alert("r:" + r + ",Cart Success");
                            $(".toast-cart").find(".product-name").text(productname);
                            $(".toast-cart").toast("show");
                        } else {
                            // alert("Result:" + r + "Please try agrain");
                            $(".toast-cart").find(".product-name").text(productname);
                            $(".toast-cart").toast("show");
                            return;
                        }
                    },
                    error: function(xhr, status, error) {
                        console.log(error.message);
                    },
                });
            }
        } else {
            window.location.href = "/login";
        }
    }); 
   
    $(".btn-cancel").click(function(event) {
    event.preventDefault();
    var hash = $(this).attr("href");
    $(this).parents(".cart-item").addClass("d-none");
    });
    */

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

    /*
    // Backup Old Coding..Now Change to Vue.js...
    // PRICE SLIDER
    $(function () {
        $("#product-price-filer").slider({
            range: true,
            min: 0,
            max: 500,
            values: [75, 300],
            slide: function(event, ui) {
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
    $(".widget-option").click(function() {
        if ($(this).find("input[type='checkbox']").is(":checked")) {
            $(this).find("input[type='checkbox']").removeAttr("checked");
        } else {
            $(this).find("input[type='checkbox']").attr("checked", "checked");
        }
    });

    */

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

    //LOGIN SECTION

    //LOGIN BUTTON FUNCTION

    $("#login").click(function () {
        var username = $("#username").val();
        var password = $("#password").val();
        var remember = $("#remember").val();
        var mydata = "Login_Username=" + username + "&Login_Password=" + password;
        console.log(mydata);

        $.ajax({
            type: "POST",
            url: "http://localhost:9998/login",
            data: mydata,
            dataType: "text",
            success: function (r) {
                // alert(r);
                if (r == "Login_Success") {
                    $(".alert-danger").hide();
                    $(".alert-danger").find(".invalid-feedback").text("").hide();
                    localStorage.removeItem("Register_Username");
                    localStorage.removeItem("Register_Email");
                    window.location.href = "/index";
                    // alert("r:" + r + ",Login Success");
                } else {
                    $(".alert-danger").show();
                    $(".alert-danger").find(".invalid-feedback").text("The Username or Password you typed is incorrect").show();
                    //alert("r:" + r + ",Login Fail");
                    //return;
                }
            },
            error: function (xhr, status, error) {
                console.log(error.message);
            },
        });

        // REMEMNER FUNCTION
        if ($("#remember").is(":checked")) {
            // alert("Remember Username");
            localStorage.setItem("login_Username", username);
            c
        } else {
            // alert("Forget Username");
            localStorage.removeItem("login_Username");
            localStorage.removeItem("login_Remember");
        }
    });

    function deleteAllCookies() {
        var cookies = document.cookie.split(";");

        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i];
            var eqPos = cookie.indexOf("=");
            var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
            document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
        }
    }
    
    $("#logout").click(function (e) {
        $.get('/logout', function (data, textStatus, jqXHR) {
            console.log(data);
        });
        $("header").removeClass("member-logged");
        deleteAllCookies();
        $("header #loggedUsername").text();
    });


    // LOGIN STATUS
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
    //PASSWORD STRENGTH FUNCTION

    function checkStrength(password) {
        var strength = password * 100 / 4;
        if ($("#password").val() != "") {
            if (strength <= 25) {
                $("#password").siblings(".progress").find(".progress-status").html("Weak");
                $("#password").siblings(".progress").find(".progress-status").css("color", "#737373");
                $("#password").siblings(".progress").find(".progress-bar").css("width", "25%");
                $("#password").siblings(".progress").find(".progress-bar").css("background-color", "#EA1111");
            } else if (strength >= 26 && strength <= 50) {
                $("#password").siblings(".progress").find(".progress-status").html("Fear");
                $("#password").siblings(".progress").find(".progress-status").css("color", "#737373");
                $("#password").siblings(".progress").find(".progress-bar").css("width", "50%");
                $("#password").siblings(".progress").find(".progress-bar").css("background-color", "#FFAD00");
            } else if (strength >= 51 && strength <= 75) {
                $("#password").siblings(".progress").find(".progress-status").html("Good");
                $("#password").siblings(".progress").find(".progress-status").css("color", "#FFF");
                $("#password").siblings(".progress").find(".progress-bar").css("width", "75%");
                $("#password").siblings(".progress").find(".progress-bar").css("background-color", "#9BC158");
            } else {
                $("#password").siblings(".progress").find(".progress-status").html("Strong");
                $("#password").siblings(".progress").find(".progress-status").css("color", "#FFF");
                $("#password").siblings(".progress").find(".progress-bar").css("width", "100%");
                $("#password").siblings(".progress").find(".progress-bar").css("background-color", "#00B500");
            }
        }
    }

    //CHECKING CONFIRM PASSWORD WITHOUT RELOADING PAGE + PASSWORD STRENGTH

    $("#password").focusout(function () {
        if (window.location.pathname == "/register" || window.location.pathname == "/reset") {
            if ($("#password").val() != "") {
            
                var inputpassword = $("#password").val();
            
                $.get('/checkPassword', {password:inputpassword}, function (data, textStatus, jqXHR) {
                    checkStrength(data);
                });
            
                /*  
                // Backup Old Coding..Now Change to Server Get API...
                var settings = {
                    "url": "https://test.stytch.com/v1/passwords/strength_check",
                    "method": "POST",
                    "crossDomain": true,
                    "timeout": 0,
                    "headers": {
                        "Content-Type": "application/json",
                        "Authorization": "Basic cHJvamVjdC10ZXN0LWU0MmEyZGE3LWY5ZTAtNGRiMi1hMTQ2LWEzNjk5Njk5YTZmZDpzZWNyZXQtdGVzdC13R29sOHFWUThkZHhHbFhZUnBWRVI2RmxZSy15SExlcmE2az0="
                    },
                    "data": JSON.stringify({
                        "password": inputpassword
                    }),
                };
                $.ajax(settings).done(function (response) {
                    // console.log(response);
                    // console.log("Zxcvbn's Strength = " + response.score);
                    checkStrength(response.score);
                });
                */
            
            } else {
                $("#password").siblings(".progress").find(".progress-status").html("");
                $("#password").siblings(".progress").find(".progress-status").css("color", "#737373");
                $("#password").siblings(".progress").find(".progress-bar").css("width", "0%");
                $("#password").siblings(".progress").find(".progress-bar").css("background-color", "#E9ECEF");
        };
        }
    });

    $("#password, #confirm").keyup(function () {
        if (window.location.pathname == "/register" || window.location.pathname == "/reset") {
            if ($("#password").val() != "" || $("#confirm").val() != "") {
                if ($("#password").val() == $("#confirm").val()) {
                    $("#password").removeClass("is-invalid");
                    $("#confirm").removeClass("is-invalid");
                    $("#password").addClass("is-valid");
                    $("#confirm").addClass("is-valid");
                } else {
                    $("#password").removeClass("is-valid");
                    $("#confirm").removeClass("is-valid");
                    $("#password").addClass("is-invalid");
                    $("#confirm").addClass("is-invalid");
                    $("#password").siblings(".invalid-feedback").html("Password and Confirm Password Does Not Matching").show();
                    $("#confirm").siblings(".invalid-feedback").html("Password and Confirm Password Does Not Matching").show();
                }
            } else {
                $("#password").removeClass("is-invalid");
                $("#confirm").removeClass("is-invalid");
                $("#password").removeClass("is-valid");
                $("#confirm").removeClass("is-valid");
            }
        }
    });

    //CHECK EMAIL VALID FUNCTION

    function validateEmail(email) {
        var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
        return emailReg.test(email);
    }

    //REGISTER BUTTON FUNCTION

    $("#register").click(function () {
        var username = $("#username").val();
        var email = $("#email").val();
        var password = $("#password").val();
        var confirm = $("#confirm").val();
        var mydata = "Register_Username=" + username + "&Register_Password=" + password + "&Register_Email=" + email;
        var passwordlength = false;
        var confirmEmail = false;
        console.log(mydata);

        localStorage.setItem("Register_Username", username);
        localStorage.setItem("Register_Email", email);

        if (username == "") {
            $("#username").siblings(".invalid-feedback").html("Please fill in this field").show();
        } else {
            $("#username").siblings(".invalid-feedback").html("").hide();
        }

        if (email == "") {
            $("#email").siblings(".invalid-feedback").html("Please fill in this field").show();
        } else {
            $("#email").siblings(".invalid-feedback").html("").hide();
            if ((!validateEmail(email))) {
                confirmEmail = false;
                $("#email").siblings(".invalid-feedback").html("Please enter a valid email address.").show();
            } else {
                confirmEmail = true;
            }
        }

        if (password == "") {
            $("#password").siblings(".invalid-feedback").html("Please fill in this field").show();
        } else {
            $("#password").siblings(".invalid-feedback").html("").hide();
            if (password.length < 5) {
                passwordlength = false;
                $("#password").siblings(".invalid-feedback").html("Password too short at least 5.").show();
            } else {
                passwordlength = true;
            }
        }

        if (confirm == "") {
            $("#confirm").siblings(".invalid-feedback").html("Please fill in this field").show();
        } else {
            $("#confirm").siblings(".invalid-feedback").html("").hide();
        }

        if ($("#privacy").not(":checked").length) {
            $("#privacy").siblings(".invalid-feedback").html("Please accept the terms to proceed.").show();
        } else {
            $("#privacy").siblings(".invalid-feedback").html("").hide();
        }

        if (username != "" && confirmEmail && passwordlength && confirm == password && $("#privacy:checked").length) {
            $.ajax({
                type: "POST",
                url: "http://localhost:9998/register",
                data: mydata,
                dataType: "text",
                success: function (r) {
                    //alert(r);
                    if (r == "Register_Success") {
                        $(".alert-danger").hide();
                        $(".alert-danger").find(".invalid-feedback").text("").hide();
                        $(".alert-success").show();
                        $(".register-section").hide();

                        console.log("MongoDB Save and Send to Stytch");

                        $.get('/registerEmail', {email:email}, function (data, textStatus, jqXHR) {
                            console.log(data);
                            localStorage.removeItem("Register_Username");
                            localStorage.removeItem("Register_Email");
                            window.location.href = "/index";
                        });

                        /*  
                        // Backup Old Coding..Now Change to Server Get API...
                        var settings = {
                            "url": "https://test.stytch.com/v1/magic_links/email/login_or_create",
                            "method": "POST",
                            "timeout": 0,
                            "headers": {
                                "Content-Type": "application/json",
                                "Authorization": "Basic cHJvamVjdC10ZXN0LWU0MmEyZGE3LWY5ZTAtNGRiMi1hMTQ2LWEzNjk5Njk5YTZmZDpzZWNyZXQtdGVzdC13R29sOHFWUThkZHhHbFhZUnBWRVI2RmxZSy15SExlcmE2az0="
                            },
                            "data": JSON.stringify({
                                "email": email,
                                "signup_magic_link_url": "http://localhost:9998/authenticate",
                                "create_user_as_pending": true
                            }),
                        };

                        $.ajax(settings).done(function (response) {
                            console.log(response);
                            localStorage.removeItem("Register_Username");
                            localStorage.removeItem("Register_Email");
                            window.location.href = "/index";
                        }); 
                        */

                    } else if (r == "Register_Username_Fail") {
                        $(".alert-danger").hide();
                        $(".alert-danger").find(".invalid-feedback").text("").hide();
                        $(".alert-danger").show();
                        $(".alert-danger").find(".invalid-feedback").text("Username already exists").show();
                    } else {
                        $(".alert-danger").hide();
                        $(".alert-danger").find(".invalid-feedback").text("").hide();
                        $(".alert-danger").show();
                        $(".alert-danger").find(".invalid-feedback").text("Email address already exists").show();
                    }
                },
                error: function (xhr, status, error) {
                    console.log(error.message);
                },
            });
        }
    });

    // REGISTRATION DATA

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

    //FORGET PASSWORD SECTION

    $("#forgetPassword").click(function () {
        var email = $("#email").val();
        var mydata = "Email=" + email;
        console.log(mydata);
        if (email == "") {
            $("#email").siblings(".invalid-feedback").html("Please fill in this field").show();
        } else {
            if ((!validateEmail(email))) {
                $("#email").siblings(".invalid-feedback").html("Please enter a valid email address.").show();
            } else {
                $("#email").siblings(".invalid-feedback").html("").hide();
                $.ajax({
                    type: "POST",
                    url: "http://localhost:9998/forget",
                    data: mydata,
                    dataType: "text",
                    success: function (r) {
                        //alert(r);
                        if (r == "Find_The_Account") {
                            // alert("r:" + r + ", Success");
                            $.get('/forgetPassword', {email:email}, function (data, textStatus, jqXHR) {
                                console.log(data);
                                $(".alert-success").show();
                                $(".forgetpassword-section").hide();
                            });

                            /* 
                            // Backup Old Coding..Now Change to Server Get API...
                            var settings = {
                                "url": "https://test.stytch.com/v1/passwords/email/reset/start",
                                "method": "POST",
                                "timeout": 0,
                                "headers": {
                                    "Content-Type": "application/json",
                                    "Authorization": "Basic cHJvamVjdC10ZXN0LWU0MmEyZGE3LWY5ZTAtNGRiMi1hMTQ2LWEzNjk5Njk5YTZmZDpzZWNyZXQtdGVzdC13R29sOHFWUThkZHhHbFhZUnBWRVI2RmxZSy15SExlcmE2az0="
                                },
                                "data": JSON.stringify({
                                    "email": email,
                                    "reset_password_redirect_url": "http://localhost:9998/reset-password-authenticate"
                                }),
                            };
                            $.ajax(settings).done(function (response) {
                                console.log(response);
                                $(".alert-success").show();
                                $(".forgetpassword-section").hide();
                            }); 
                            */

                        } else {
                            // alert("r:" + r + ",Fail");
                            $(".alert-danger").show();
                            return;
                        }
                    },
                    error: function (xhr, status, error) {
                        console.log(error.message);
                    },
                });

            }
        }
    });

    // RESET PASSWORD SECTION

    $("#resetPassword").click(function () {
        var password = $("#password").val();
        var confirm = $("#confirm").val();
        var mydata = "Password=" + password;
        console.log(mydata);

        if (password == "") {
            $("#password").siblings(".invalid-feedback").html("Please fill in this field").show();
        } else {
            $("#password").siblings(".invalid-feedback").html("").hide();
            if (password.length < 5) {
                $("#password").siblings(".invalid-feedback").html("Password too short at least 5.").show();
            } else {
                $("#password").siblings(".invalid-feedback").html("").hide();
                if (password == confirm) {
                    $.ajax({
                        type: "POST",
                        url: "http://localhost:9998/reset",
                        data: mydata,
                        dataType: "text",
                        success: function (r) {
                            // alert(r);
                            if (r == "Password_Updated_Success") {
                                $(".alert-success").show();
                                $(".resetpassword-section").hide();
                                // alert("r:" + r + ",Login Success");
                            } else {
                                //alert("r:" + r + ",Login Fail");
                                $(".alert-danger").show();
                                return;
                            }
                        },
                        error: function (xhr, status, error) {
                            console.log(error.message);
                        },
                    });
                }
            }
        }

        if (confirm == "") {
            $("#confirm").siblings(".invalid-feedback").html("Please fill in this field").show();
        } else {
            $("#confirm").siblings(".invalid-feedback").html("").hide();
        }
    });

    // RESEND AUTHENTICATION SECTION

    $("#resend-authentication").click(function () {
        $.get('/resendAuthorization', function (data, textStatus, jqXHR) {
            console.log(data);
            $(".alert-success").show();
        });
    });


    // SET USERNAME SECTION

    $("#setUsername").click(function () {
        var username = $("#username").val();
        var mydata = "Username=" + username;
        console.log(mydata);

        if (username == "") {
            $("#username").siblings(".invalid-feedback").html("Please fill in this field").show();
        } else {
            $("#username").siblings(".invalid-feedback").html("").hide();
            $.ajax({
                type: "POST",
                url: "http://localhost:9998/set",
                data: mydata,
                dataType: "text",
                success: function (r) {
                    // alert(r);
                    if (r == "Username_Updated_Success") {
                        $(".alert-danger").hide();
                        $(".alert-success").show();
                        $(".setusername-section").hide();
                        // alert("r:" + r + ",Login Success");
                        $("header #loggedUsername").text(getCookie("Login_username"));
                        $("header").addClass("member-logged");
                    } else {
                        //alert("r:" + r + ",Login Fail");
                        $(".alert-danger").show();
                        return;
                    }
                },
                error: function (xhr, status, error) {
                    console.log(error.message);
                },
            });
        }
    });

    /*
    // Backup Old Coding..Now Change to Vue.js...
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
    */

    // OWL SILDER : HISTORY
    if (window.location.pathname == "/aboutus") {
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
    }
    // OWL SILDER : COMMENT SUGGEST
    if (window.location.pathname == "/index") {
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
    }
    // OWL SILDER : PRODUCT SUGGEST
    if (window.location.pathname == "/index" || window.location.pathname == "/product-detail") {
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
    }
    // OWL SILDER : ONE PRODUCT
    if (window.location.pathname == "/product-detail") {
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
    }
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
    if (window.location.pathname == "/aboutus") {
        $(".team-img-inner").freetile();
        $(".teamslider-wrap").teamslider();
    };
    //new WOW().init();
});

    /* 
    // Teacher Coding Reference
    //GET API SAMPLE
    $.ajax({
        type: "GET",
        url: "https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=fnd&lang=tc",
        data: "data",
        dataType: "json",
        success: function(data, status, xhr) {
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
        success: function(data, status, xhr) {
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
        success: function(data, status, xhr) {
            console.log("data:", data);
            //alert(data);

            // var returnedData = JSON.parse(data.length); Txt 先用依個
            var returnedData = JSON.stringify(data); // decoode JSON string object
            //alert (data.formatted);
            $("#showme").html("<img src=" + data.message + ">");
        },
    });
    */