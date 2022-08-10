var app = new Vue({
    el: '#app',
    data: {
        message: 'Hello Vue.js!',
        itemID: "",
        product:{
            _id:"62e4c8c78da8261f0a749d2d",
            ProductName : "Anytime Cake",
            Category : "Cake",
            Introduction:`<p>Lollipop dessert donut marzipan cookie bonbon sesame snaps chocolate. Cupcake sweet roll sweet dragée dragée. Lollipop dessert donut marzipan cookie bonbon sesame snaps chocolate cake.</p>
            <p>Toffee chocolate cake apple pie sugar plum sesame snaps muffin cake pudding cupcake. Muffin danish muffin lollipop biscuit jelly beans oat cake croissant.</p>`,
            Description:`<h5 class="product-content-name">Supremo Coffee Beans</h5>
            <p>Caramels tootsie roll carrot cake sugar plum. Sweet roll jelly bear claw liquorice. Gingerbread lollipop dragée cake. Pie topping jelly-o. Fruitcake dragée candy canes tootsie roll. Pastry jelly-o cupcake. Bonbon brownie soufflé muffin.</p>
            <p>Sweet roll soufflé oat cake apple pie croissant. Pie gummi bears jujubes cake lemon drops gummi bears croissant macaroon pie. Fruitcake tootsie roll chocolate cake Carrot cake cake bear claw jujubes topping cake apple pie. Jujubes gummi bears soufflé candy canes topping gummi bears cake soufflé cake. Cotton candy soufflé sugar plum pastry sweet roll.</p>`,
            OriginalPrice : 330,
            Price: 115,
            Image: "product-010-A.png",
            Images: ["product-010-A.png","product-010-B.png","product-010-C.png"],
            Model: "product3D-A",
        }
    },
    methods: {
        setCookie(cname, cvalue, exdays) {
            const d = new Date();
            d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
            let expires = "expires=" + d.toUTCString();
            document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
        },
        getCookie(cname) {
            let name = cname + "=";
            let ca = document.cookie.split(';');
            for (let i = 0; i < ca.length; i++) {
                let c = ca[i];
                while (c.charAt(0) == ' ') {
                    4
                    c = c.substring(1);
                }
                if (c.indexOf(name) == 0) {
                    return decodeURIComponent(c.substring(name.length, c.length));
                }
            }
            return "";
        }
    },
    created() {
        this.itemID = this.getCookie("selectItem");
        console.log(this.getCookie("selectItem"));
        /* if (!this.itemID) {
            location.href = "/404"
        } */
        //Get DB Product
        var data = {"id":this.itemID};
        
        $.ajax({
            type: "GET",
            url: "/getProduct",
            data: data,
            dataType: "json",
            success: (data, status, xhr) => {
                this.product = data;
            },
        });

        this.$nextTick(function () {
           // alert("Item selected:" + this.itemID);
        })
    },
    mounted() {
        this.$nextTick(function () {
            console.log("mounted");
            setTimeout(()=>{
                $(".purchase-quantity").each(function() {
                    var $this = $(this),
                        numberValue = $this.find("input").val();
                        $this.find(".puchase-plus").on("click", function(e) {
                        e.preventDefault();
                        numberValue++;
                        $this
                            .siblings("button[data-tooltip='Add to Cart']")
                            .data("quantity", numberValue);
                        // alert($("button[data-tooltip='Add to Cart']").data('quantity'))
                        $this.find("input").val(numberValue);
                        $this.find("input").attr("value", numberValue);
                    });
                    $this.find(".puchase-minus").on("click", function(e) {
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

                $("[data-tooltip='Add to Cart']").click(function(event) {
                    event.preventDefault();
                    var username = getCookie("Login_username");
                    var productname = $(this).data("productname");
                    var category = $(this).data("category");
                    var quantity = $(this).data("quantity");
                    var price = $(this).data("price");
                    var image = $(this).data("image");
                    var mydata = "Username=" + username + "&ProductName=" + productname + "&Category=" + category + "&Price=" + price + "&Quantity=" + quantity + "&Image=" + image;
                    console.log(mydata);

                    var loginUsername = getCookie("Login_username");
                    if (!!loginUsername) {
                        $.ajax({
                            type: "POST",
                            url: "http://localhost:9998/product-detail",
                            data: mydata,
                            dataType: "text",
                            success: function(r) {
                                // alert(r);
                                if (r == "Cart_Success") {
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
                                        error: (xhr, status, error) =>{
                                            console.log(error.message);
                                        },
                                    });
                                    // alert("r:" + r + ",Cart Success");
                                    $(".toast-cart").find(".product-name").text(productname);
                                    $(".toast-cart").toast("show");
                                } else {
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
                                        error: (xhr, status, error) =>{
                                            console.log(error.message);
                                        },

                                    });
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
                        window.location.href = "/login";
                    }
                });
                
            },1000)
        })
    }

})