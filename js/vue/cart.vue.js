var app = new Vue({
    el: '#app',
    data: {
        message: 'Hello Vue.js!',
        itemID: "",
        productList: [{
            _id: "62e4c8c78da8261f0a749d2d",
            ProductName: "Anytime Cakes",
            Category: "Cake",
            Image: "product-001.png",
            Quantity: 1,
            Price: 115,
            Total: 115
        }],
        cartData:true
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
        },
        updateCartList(){
            var data = {};
            $.ajax({
                type: "GET",
                url: "/getCart",
                data: data,
                dataType: "json",
                success: (data, status, xhr) => {
                    this.productList = data;
                    if (data == null || data.length == 0) {
                        this.cartData = false
                    }else{
                        this.cartData = true
                    }
                    console.log("cartData:" + this.cartData);
                    setTimeout(() => {

                        if ( $(window).scrollTop() < $(".cart-total-section").position().top - $("header").outerHeight() - $(".bg-flow-bottom-white").outerHeight()) {
                            $(".cart-total-section .row").addClass("test");
                        } else {
                            $(".cart-total-section .row").removeClass("test");
                        }
        
                        $(window).scroll(function () {
                            if ( $(window).scrollTop() < $(".cart-total-section").position().top - $("header").outerHeight() - $(".bg-flow-bottom-white").outerHeight()) {
                                $(".cart-total-section .row").addClass("test");
                            } else {
                                $(".cart-total-section .row").removeClass("test");
                            }
                        });
                        
                    }, 100)
                },
            });
        },
        updateCartDB(selectedItem){

            this.productList.forEach(item=>{
                 item.Total = item.Quantity * item.Price;
             });
             //Update DB Cart
             var username = getCookie("Login_username");
             var mydata = "Username=" + username + "&ProductName=" + selectedItem.ProductName + "&Price=" + selectedItem.Price + "&Quantity=" + selectedItem.Quantity + "&Action=Update";
             $.ajax({
                        type: "POST",
                        url: "http://localhost:9998/cart",
                        data: mydata,
                        dataType: "text",
                        success:  (data, status, xhr) => {
                        }
                    });
        },
        clickDelete(productname){
            var $this = $(this);
            var totalQty=0;
            var totalPrice=0;
            var username = getCookie("Login_username");
            var mydata = "Username=" + username + "&ProductName=" + productname + "&Action=Delete";
            console.log(mydata);

            $.ajax({
                type: "POST",
                url: "http://localhost:9998/cart",
                data: mydata,
                dataType: "text",
                success:  (r) => {
                    if (r == "Delete") {
                        // alert("r is = " + r + "");
                        $this.parents(".cart-item").addClass("d-none");
                        this.updateCartList();


                    } else {
                      return;
                    }
                },
                error: function (xhr, status, error) {
                    console.log(error.message);
                },
            });
        }
    },
    created() {
        //Get DB Product
        this.updateCartList();

        this.$nextTick(function () {
            // alert("Item selected:" + this.itemID);
        })
    },
    watch: {
        // productList: {
        //   handler(newValue, oldValue) {
        //     console.log(newValue, oldValue);
        //     if(JSON.stringify(newValue) != JSON.stringify(oldValue)){
        //         console.log("item have changed!")
        //         this.productList.forEach(item=>{
        //             item.Total = item.Quantity * item.Price;
        //         })
        //     }
        //   },
        //   deep: true
        // }
      },
    computed: {
        total(){
            let tmpTotal = 0;
            this.productList.forEach(item=>{
                tmpTotal += item.Total;
            })
            return parseFloat(tmpTotal).toFixed(2);
        
        },
        totalItemQty(){
            let tmpTotal = 0;
            this.productList.forEach(item=>{
                tmpTotal += item.Quantity;
            })
            return tmpTotal;
        }

    },
    mounted() {
        this.$nextTick(function () {
            console.log("mounted");
            
        })
    }
})