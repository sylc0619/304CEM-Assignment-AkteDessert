var app = new Vue({
    el: '#app',
    data: {
        message: 'Hello Vue.js!',
        itemID: "",
        productList:[{
            _id:"62e4c8c78da8261f0a749d2d",
            ProductName : "Anytime Cakes",
            Category : "Cake",
            Price: 115,
            Quantity: 1,
            Image: "product-001.png"
        }],
        orderDetail:{},
        totalAmount:0,
        formDone:false,
        orderComplete:false,
        orderID:"",
        clientId:"AdmlVdRkrO0bHI9jVC44ls5Hxt9xZNIH5Bn7ktUSAUOOQnKkMf8swDwPH1RxYHORR7yJ-TYUqSct1cLw",
        account:"sb-4251s17845005@business.example.com",
        secret:"EMzIX3Iw9NNW_H8mvpKVLFnGKt25W8V0fCP253bXUxGFQLgNG3fVzej7H9ZEnlsYemavQMvTfQotQkj-"

    },
    methods: {
        
        clickContinue(){

            // Confirm Detail
            var firstNameVal = $("#checkout_Firstname").val();
            var lastNameVal = $("#checkout_Lastname").val();
            var addressFirstLineVal = $("#checkout_Address_Line_1").val();
            var addressSecondLineVal = $("#checkout_Address_Line_2").val();
            var phoneVal = $("#checkout_Phone").val();
        
            localStorage.setItem("Name", firstNameVal + " " + lastNameVal);
            localStorage.setItem("Address", addressFirstLineVal + " " + addressSecondLineVal);
            localStorage.setItem("Phone", phoneVal);
        
            if (firstNameVal == "") {
                $("#checkout_Firstname").siblings(".invalid-feedback").html("Please fill in this field").show();
            } else {
                $("#checkout_Firstname").siblings(".invalid-feedback").html("").hide();
            }

            if (lastNameVal == "") {
                $("#checkout_Lastname").siblings(".invalid-feedback").html("Please fill in this field").show();
            } else {
                $("#checkout_Lastname").siblings(".invalid-feedback").html("").hide();
            }

            if (addressFirstLineVal == "") {
                $("#checkout_Address_Line_1").siblings(".invalid-feedback").html("Please fill in this field").show();
            } else {
                $("#checkout_Address_Line_1").siblings(".invalid-feedback").html("").hide();
            }

            if (phoneVal == "") {
                $("#checkout_Phone").siblings(".invalid-feedback").html("Please fill in this field").show();
            } else {
                $("#checkout_Phone").siblings(".invalid-feedback").html("").hide();
            }

            if (firstNameVal != "" && lastNameVal != "" && addressFirstLineVal != ""  && phoneVal != "" ) {
                this.formDone=true;
                
                this.$nextTick(()=>{
                    //Open Paypal
                    this.createOrder();
                })
            }
        },
        
        objectToQueryString(obj) {
            var str = [];
            for (var p in obj)
              if (obj.hasOwnProperty(p)) {
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
              }
            return str.join("&");
          },

        clickEdit(){
            this.formDone=false;
            $("#paypal-button-container").html("");
        },

        createOrder(){
            var productTotal = 0;
            //calcuate the total Amount
            this.productList.forEach(item=>{
                productTotal += item.Total
            })

            // Discount 
            if (this.orderDetail.coupon == 'ABETTERWELCOME'){
                parseFloat(productTotal *=0.85).toFixed(2);
            }

            var name = localStorage.getItem("Name")
            var address = localStorage.getItem("Address")
            var phone = localStorage.getItem("Phone")
        
            if (!!name || !!address || !!phone) {
                $('.confirm-list .confirm-name').text(name);
                $('.confirm-list .confirm-address').text(address);
                $('.confirm-list .confirm-phone').text(phone);
            }
        
            $("#paypal-button-container").html("");
            paypal.Buttons({
                style: {
                    layout: 'horizontal',
                    shape:  'rect',
                    label:  'pay',
                    tagline: 'true'
                },
                createOrder: (data, actions)=> {
                  // Set up the transaction
                  
                  return actions.order.create({
                    purchase_units: [{
                        
                      amount: {
                        currency_code:"HKD",
                        value: parseFloat(productTotal).toFixed(2) + "" 
                      }
                    }]
                  });
                },
                onApprove: (data, actions)=> {
                    //Paypal success
                    this.orderID = data.orderID;
                    this.orderDetail.orderID = data.orderID;
                    this.orderDetail.totalAmount = parseFloat(this.totalAmount).toFixed(2);
                    console.log(this.orderDetail);
                    var queryString = this.objectToQueryString(this.orderDetail)
                    //Insert To DB Order
                    $.ajax({
                        type: "POST",
                        url: "http://localhost:9998/order",
                        //data: queryString,
                         data: JSON.stringify(this.orderDetail),
                         contentType: "application/json; charset=utf-8",
                        dataType: "json",
                      
                        success: (res)=> {
                            if (res == "Success") {
                                //Clear Cart
                                this.productList = [];
                                //Redirect to Success Page
                                this.orderComplete = true;
                                //alert('You have successfully created. Order ID  ' + data.orderID);
                                localStorage.removeItem("Name");
                                localStorage.removeItem("Address");
                                localStorage.removeItem("Phone");
                            }
                        },
                        error: (xhr, status, error) =>{
                            console.log(error.message);
                        },
                    });
                    
                  },
                  onCancel:  (data)=> {
                   //Paypal cancel
                   this.checkout=false;
                    alert("Payment Cancelled");
                  },
                  onError:  (err) => {
                    // For example, redirect to a specific error page
                    this.checkout=false;
                    alert("Payment Error");
                  }
              }).render('#paypal-button-container');
        },
        
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
        //Get DB Product
        var data = {};
        $.ajax({
            type: "GET",
            url: "/getCart",
            data: data,
            dataType: "json",
            success: (data, status, xhr) => {
                this.productList = data;
                this.orderDetail.Products= [];
                //this.orderDetail.Products = data;

                this.productList.forEach(item=>{
                    this.totalAmount += item.Total
                    this.orderDetail.Products.push({
                     Product :item.ProductName,
                     Price :item.Price,
                     Quantity :item.Quantity,
                     Total :item.Total,
                    });
                    this.$forceUpdate();
                });
            },
        });

        this.$nextTick(function () {
           // alert("Item selected:" + this.itemID);
        })
    },
    mounted() {
        this.$nextTick(function () {
            console.log("mounted");
  

        })
    }

})