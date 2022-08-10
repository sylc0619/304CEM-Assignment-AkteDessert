var app = new Vue({
    el: '#app',
    data: {
        message: 'Hello Vue.js!',
        itemID: "",
        searchKey:"",
        oriProductList:[],
        categorys:["All","Bready","Dessert","Cake"],
        selectedCategory:["All"],
        minPrice:"0",
        maxPrice:"500",
        sortingOption: "2",
        productList:[{
            _id:"62e4c8c78da8261f0a749d2d",
            ProductName : "Chestnut Cakes",
            Category : "Cake",
            Price: 268.00,
            Rating : 1,
            Image: "product-001.png"
        }]
    },
    computed: {
        computedProductList(){
            var result =this.productList;
             if (this.searchKey || this.selectedCategory.length>0 || this.minPrice || this.maxPrice){
                result = this.productList.filter(product => product.ProductName.toUpperCase().indexOf(this.searchKey.toUpperCase())>=0 );
                result = result.filter(product => this.minPrice <= product.Price && this.maxPrice >= product.Price );
                if (this.selectedCategory.indexOf("All")<0){
                    var result = result.filter(product => this.selectedCategory.indexOf(product.Category)>=0 );
                }
                console.log(result)
            }else{
                 result =  Object.assign([],this.oriProductList);
            }
            
                this.updateRating();
            
            
            return result
        },

        sortedArray() {
            if (this.sortingOption === "1"){
                return [...this.productList].sort((a, b) => a.Rating - b.Rating);
            } else if (this.sortingOption === "2"){
                return [...this.productList].sort((a, b) => b.Rating - a.Rating);
            } 
            return this.productList;
        },
    },
    methods: {
        updateRating(){
            this.$nextTick(()=>{
                $(".product-rating").each(function () {
                    //var rating = parseInt($(this).html() - 1);
                    var rating = $(this).attr("rating");
                    rating = parseInt(rating) -1;
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
                    $(this).html("");
                    $(this).html($(this).html() + star);
                });
             })
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
        },
        onClickSearch(){
            // if (this.searchKey){
            //     var result = this.productList.filter(product => product.ProductName.toUpperCase().indexOf(this.searchKey.toUpperCase())>=0 );
            //     console.log(result)
                
            //     this.productList = result;
            // }else{
            //     this.productList = this.oriProductList;
            // }
            // console.log("click Search by keyword", this.searchKey);
        },
        clickCategoryBox(category){
            var foundIndex = this.selectedCategory.indexOf(category);
            if (foundIndex >=0){
                if (category =="All"){
                    this.selectedCategory=[];
                }else{
                    this.selectedCategory.splice(foundIndex,1);
                }
                
            }else{
                if (category =="All"){
                    var copyCategory = Object.assign([],this.categorys);
                    this.selectedCategory = copyCategory;
                }else{
                    this.selectedCategory.push(category);
                }
                
            }
        }
    },
    created() {

        //TODO get product list
        var data = {};
        $.ajax({
            type: "GET",
            url: "/getProductList",
            data: data,
            dataType: "json",
            success: (data, status, xhr) => {
                this.productList = data;
                this.oriProductList = data;
            },
        });
        this.$nextTick(function () {
        })
    },
    mounted() {
        this.$nextTick(function () {
            console.log("mounted");
            setTimeout(()=>{
                $("#product-price-filer").slider({
                    range: true,
                    min: 0,
                    max: 500,
                    values: [0, 500],
                    slide: (event, ui) => {
                        $("#price-range").val("$" + ui.values[0] + " - $" + ui.values[1]);
                        this.minPrice = ui.values[0];
                        this.maxPrice = ui.values[1];
                        this.$forceUpdate();
                    },
                });
                
                $("#price-range").val(
                    "$" +
                    $("#product-price-filer").slider("values", 0) +
                    " - $" +
                    $("#product-price-filer").slider("values", 1)
                );

                // $(".widget-option").click(function() {
                //     if ($(this).find("input[type='checkbox']").is(":checked")) {
                //         $(this).find("input[type='checkbox']").removeAttr("checked");
                //     } else {
                //         $(this).find("input[type='checkbox']").attr("checked", "checked");
                //     }
                // });

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
                            url: "http://localhost:9998/product-list",
                            data: mydata,
                            dataType: "text",
                            success: function(r) {
                                // alert(r);
                                if (r == "First_Time_Add_Cart") {
                                    // alert("r:" + r + ",Cart Success");
                                    $(".toast-cart").find(".product-name").text(productname);
                                    $(".toast-cart").toast("show");

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
            },100)
           
        })
    }

})