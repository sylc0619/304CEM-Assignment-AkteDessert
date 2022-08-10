var http = require("http");
var fs = require("fs");
var qs = require("querystring");

var MongoClient = require("mongodb").MongoClient;
var ObjectId = require('mongodb').ObjectId;
var dbUrl = "mongodb://localhost:27017/";

// Initialize express middleware

var express = require('express');
var stytch = require("stytch");
var session = require("express-session");
var bodyParser = require('body-parser');
// var encodeUrl = require('encodeurl');

var app = express();
app.use(bodyParser.json());
require("dotenv").config();

var client = new stytch.Client({
    project_id: process.env.STYTCH_PROJECT_ID,
    secret: process.env.STYTCH_SECRET,
    env: stytch.envs.test,
});

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        cookie: {
            maxAge: 60000000000
        },
        resave: true,
        saveUninitialized: false,
    })
);

app.get(['/delivery', '/terms', '/privacy', '/cookie', '/regulatory'], function (req, res) {
    res.redirect("/404");
});

app.get("/", function (req, res) {
    res.redirect("/index");
});

app.post("/order",function(req,res){
    console.log("Start post checkout data!");  
    console.log(req.body);
    //console.log(req.body[0]);  

    // your JSON
    var orderDetail= req.body;
    session = req.session;
    email = session.email;
    username = session.username;
    
    MongoClient.connect(dbUrl, function (err, db) {

        var dbo = db.db("AkteDessertDatabase");
        
        var usernameCheck = {
            Username: username,
        };

        var myobj = {
            Username: username,
            Email: email,
            orderDetail,
        };

        dbo.collection("Cart").find(usernameCheck).toArray(function (err, result) {
            if (result.length > 0) {
                dbo.collection("Cart").deleteMany(usernameCheck, function (err, res) {
                    if (err) throw err;
                });

                dbo.collection("Order").insertOne(myobj, function (err, res) {
                    if (err) throw err;
                });
                console.log("Username: " + username + " order is created.")
                console.log(req.body)
                res.status(200).json("Success")
            }
        });
    });
   //res.send(req.body);
})

app.get("/checkPassword", function(req,res){
    console.log("Check Password Start", req.query);
    var password =req.query.password;
    fetch("https://test.stytch.com/v1/passwords/strength_check", {
        method: "post",
        body: JSON.stringify({ "password": password }),
        headers:  {
          "Content-Type": "application/json",
          "Authorization": "Basic cHJvamVjdC10ZXN0LWU0MmEyZGE3LWY5ZTAtNGRiMi1hMTQ2LWEzNjk5Njk5YTZmZDpzZWNyZXQtdGVzdC13R29sOHFWUThkZHhHbFhZUnBWRVI2RmxZSy15SExlcmE2az0="
        }
      })
      .then((res) => res.json())
      .then((json) => {
          console.log(json)
          res.status(200).json(json.score)
      });
});

app.get("/registerEmail", function(req,res){
    console.log("Register Email Start", req.query);
    var email =req.query.email;
    fetch("https://test.stytch.com/v1/magic_links/email/login_or_create", {
        method: "post",
        body: JSON.stringify({                                
             "email": email,
          "signup_magic_link_url": "http://localhost:9998/authenticate",
          "create_user_as_pending": true
         }),
        headers:  {
          "Content-Type": "application/json",
          "Authorization": "Basic cHJvamVjdC10ZXN0LWU0MmEyZGE3LWY5ZTAtNGRiMi1hMTQ2LWEzNjk5Njk5YTZmZDpzZWNyZXQtdGVzdC13R29sOHFWUThkZHhHbFhZUnBWRVI2RmxZSy15SExlcmE2az0="
        }
      })
      .then((res) => res.json())
      .then((json) => {
          console.log(json)
          res.status(200).json("Success")
      });
});

app.get("/resendAuthorization", function(req,res){
    console.log("Resend Authorization Start", req.query);
    
    session = req.session;
    var email = session.email;
    
    fetch("https://test.stytch.com/v1/magic_links/email/send", {
        method: "post",
        body: JSON.stringify({                                
            "email": email,
         }),
        headers:  {
          "Content-Type": "application/json",
          "Authorization": "Basic cHJvamVjdC10ZXN0LWU0MmEyZGE3LWY5ZTAtNGRiMi1hMTQ2LWEzNjk5Njk5YTZmZDpzZWNyZXQtdGVzdC13R29sOHFWUThkZHhHbFhZUnBWRVI2RmxZSy15SExlcmE2az0="
        }
      })
      .then((res) => res.json())
      .then((json) => {
          console.log(json)
          res.status(200).json("Success")
      });
});

app.get("/authenticate", function (req, res) {
    var token = req.query.token;

    client.magicLinks.authenticate(token).then((response) => {

        console.log(response.user);
        var email = response.user.emails[0].email;
        var user_id = response.user.user_id;
        var active = response.user.status;
        session = req.session;
        session.email = email;
        session.authenticated = true;
        session.save(function (err) {
            if (err) console.log(err);
        });
        res.redirect("/authenticated");

        MongoClient.connect(dbUrl, function (err, db) {
            var dbo = db.db("AkteDessertDatabase");
            var emailCheck = {
                Email: email,
            };
            var updateVal = [{
                $set: { Status: active, User_id: user_id },
            },];

            dbo.collection("Account").find(emailCheck).toArray(function (err, result) {
                if (result.length > 0) {
                    dbo.collection("Account").updateOne(emailCheck, updateVal, function (err, res) {
                        if (err) throw err;
                        console.log("Authentication updated to = " + email);
                    });
                    session.username = result[0].Username;
                    session.save(function (err) {
                        if (err) console.log(err);
                    });
                    console.log("Save Data to Session");
                    console.log(session);
                }
            });
        });
    })
    .catch((error) => {
        console.log(error);
        sendFileContent(res, "403-forbidden.html", "text/html");
        console.log("403 Forbidden Page");
        // res.send("There was an error authenticating the user.");
    });
});

app.get("/logout", function(req,res){
    console.log("Logout Start");
    session = req.session;
    session.email = "";
    session.username = "";
    session.authenticated = false;
    session.setting = false;
    session.save(function (err) {
        if (err) console.log(err);
    });
    res.status(200).json("Success")
});

app.get("/google-authenticate-register", function (req, res) {

    var token = req.query.token;

    client.oauth.authenticate(token).then((response) => {

        console.log("Goolge Register API Data !");
        console.log(response.user);
        var user_id = response.user.user_id;
        var type = response.provider_type;
        var email = response.user.emails[0].email;
        var active = response.user.status;
        // var user_image = response.user.providers[0].profile_picture_url;

        // Stytch authenticated setting (Must!)
        session = req.session;
        session.email = email;
        session.authenticated = true;
        session.setting = true;
        session.save(function (err) {
            if (err) console.log(err);
        });

        MongoClient.connect(dbUrl, function (err, db) {
            var dbo = db.db("AkteDessertDatabase");
            var emailCheck = {
                Email: email,
            };
            var myobj = {
                User_id: user_id,
                OAuth: type,
                Email: email,
                Status: active,
                // image : user_image,
            };
            var newOAuth = [{
                $set: { OAuth: type },
            },];

            dbo.collection("Account").find(emailCheck).toArray(function (err, result) {
                if (result.length > 0) {
                    dbo.collection("Account").updateOne(emailCheck, newOAuth, function (err, res) {
                        if (err) throw err;
                        console.log("OAuth updated to = " + email);
                    });
                    var username = result[0].Username;
                    res.cookie("Login_username", username);
                    session.username = username;
                    session.save(function (err) {
                        if (err) console.log(err);
                    });
                    console.log("Save Data to Session");
                    console.log(session);
                    res.redirect("/index");
                } else {
                    dbo.collection("Account").insertOne(myobj, function (err, res) {
                        if (err) throw err;
                        console.log("Stytch User_id = " + user_id + "inserted MongoDB.");
                    });
                    console.log("Save Data to Session");
                    console.log(session);
                    res.redirect("/set");
                }
            });
        });
    })
    .catch((error) => {
        console.log(error);
        sendFileContent(res, "403-forbidden.html", "text/html");
        console.log("403 Forbidden Page");
        // res.send("There was an error authenticating the user.");
    });
});

app.get("/google-authenticate-login", function (req, res) {

    var token = req.query.token;

    client.oauth.authenticate(token).then((response) => {

        console.log("Goolge Login API Data !");
        console.log(response.user);
        var email = response.user.emails[0].email;
        session = req.session;
        session.email = email;
        session.authenticated = true;
        session.save(function (err) {
            if (err) console.log(err);
        });

        MongoClient.connect(dbUrl, function (err, db) {
            var dbo = db.db("AkteDessertDatabase");
            var emailCheck = {
                Email: email,
            };
            dbo.collection("Account").findOne(emailCheck, function (err, result) {
                //res.cookie("login",encodeUrl(email));
                //console.log(result.Username);
                var username = result.Username;
                res.cookie("Login_username", username);
                session.username = username;
                session.save(function (err) {
                    if (err) console.log(err);
                });
                console.log("Save Data to Session");
                console.log(session);
                res.redirect("/index");
            });
        });
    })
    .catch((error) => {
        console.log(error);
        sendFileContent(res, "403-forbidden.html", "text/html");
        console.log("403 Forbidden Page");
        // res.send("There was an error authenticating the user.");
    });
});

app.get("/facebook-authenticate-register", function (req, res) {

    var token = req.query.token;

    client.oauth.authenticate(token).then((response) => {

        console.log("Facebook Register API Data !");
        console.log(response.user);
        var user_id = response.user.user_id;
        var type = response.provider_type;
        var email = response.user.emails[0].email;
        var active = response.user.status;
        // var user_image = response.user.providers[0].profile_picture_url;

        MongoClient.connect(dbUrl, function (err, db) {
            var dbo = db.db("AkteDessertDatabase");
            var emailCheck = {
                Email: email,
            };
            var myobj = {
                User_id: user_id,
                OAuth: type,
                Email: email,
                Status: active,
                // image : user_image,
            };
            var newOAuth = [{
                $set: { OAuth: type },
            },];

            // Stytch authenticated setting (Must!)
            session = req.session;
            session.email = email;
            session.authenticated = true;
            session.setting = true;
            session.save(function (err) {
                if (err) console.log(err);
            });

            dbo.collection("Account").find(emailCheck).toArray(function (err, result) {
                if (result.length > 0) {
                    dbo.collection("Account").updateOne(emailCheck, newOAuth, function (err, res) {
                        if (err) throw err;
                        console.log("OAuth updated to = " + email);
                    });
                    // console.log(result[0].Username);
                    var username = result[0].Username;
                    res.cookie("Login_username", username);
                    session.username = username;
                    session.save(function (err) {
                        if (err) console.log(err);
                    });
                    console.log("Save Data to Session");
                    console.log(session);
                    res.redirect("/index");
                } else {
                    dbo.collection("Account").insertOne(myobj, function (err, res) {
                        if (err) throw err;
                        console.log("Stytch User_id = " + user_id + "inserted MongoDB.");
                    });
                    console.log("Save Data to Session");
                    console.log(session);
                    res.redirect("/set");
                }
            });
        });
    })
    .catch((error) => {
        console.log(error);
        sendFileContent(res, "403-forbidden.html", "text/html");
        console.log("403 Forbidden Page");
        // res.send("There was an error authenticating the user.");
    });
});

app.get("/facebook-authenticate-login", function (req, res) {

    var token = req.query.token;
    client.oauth.authenticate(token).then((response) => {

        console.log("Facebook Logo API Data !");
        console.log(response.user);
        var email = response.user.emails[0].email;
        session = req.session;
        session.authenticated = true;
        session.email = email;
        session.save(function (err) {
            if (err) console.log(err);
        });

        MongoClient.connect(dbUrl, function (err, db) {
            var dbo = db.db("AkteDessertDatabase");
            var emailCheck = {
                Email: email,
            };
            dbo.collection("Account").findOne(emailCheck, function (err, result) {
                // res.cookie("login",encodeUrl(email));
                // console.log(result.Username);
                var username = result.Username;
                res.cookie("Login_username", username);
                session.username = username;
                session.save(function (err) {
                    if (err) console.log(err);
                });
                console.log("Save Data to Session.");
                console.log(session);
                res.redirect("/index");
            });
        });
    })
    .catch((error) => {
        console.log(error);
        sendFileContent(res, "403-forbidden.html", "text/html");
        console.log("403 Forbidden Page");
        // res.send("There was an error authenticating the user.");
    });
});

app.get("/forgetPassword", function(req,res){
    console.log("check Password Start", req.query);
    var email =req.query.email;
    fetch("https://test.stytch.com/v1/passwords/email/reset/start", {
        method: "post",
        body: JSON.stringify({                                
            "email": email,
            "reset_password_redirect_url": "http://localhost:9998/reset-password-authenticate"
         }),
        headers:  {
          "Content-Type": "application/json",
          "Authorization": "Basic cHJvamVjdC10ZXN0LWU0MmEyZGE3LWY5ZTAtNGRiMi1hMTQ2LWEzNjk5Njk5YTZmZDpzZWNyZXQtdGVzdC13R29sOHFWUThkZHhHbFhZUnBWRVI2RmxZSy15SExlcmE2az0="
      }
      })
      .then((res) => res.json())
      .then((json) => {
          console.log(json)
          res.status(200).json("Success")
      });
});

app.get("/reset-password-authenticate", function (req, res) {

    var token = req.query.token;

    client.magicLinks.authenticate(token).then((response) => {

        console.log("Forget Password API Data !");
        console.log(response.user);
        var email = response.user.emails[0].email;
        session = req.session;
        session.email = email;
        session.authenticated = true;
        session.setting = true;
        session.save(function (err) {
            if (err) console.log(err);
        });
        MongoClient.connect(dbUrl, function (err, db) {
            var dbo = db.db("AkteDessertDatabase");
            var emailCheck = {
                Email: email,
            };
            dbo.collection("Account").findOne(emailCheck, function (err, result) {
                // res.cookie("login",encodeUrl(email));
                // console.log(result.Username);
                var username = result.Username;
                session.username = username;
                console.log("Save Data to Session.");
                console.log(session);
                res.redirect("/reset");
            });
        });
    })
    .catch((error) => {
        console.log(error);
        sendFileContent(res, "403-forbidden.html", "text/html");
        console.log("403 Forbidden Page");
        // res.send("There was an error authenticating the user.");
    });
});

app.get("/getProductList", function (req, res) {

    console.log("Get Product List Data!");
    //var data = req.(data);
    //TODO get item from db
    MongoClient.connect(dbUrl, async function (err, db) {
        var dbo = db.db("AkteDessertDatabase");
        var productDBO = dbo.collection("Product");
        var product = await productDBO.find().toArray(function (err, result) {
            if (err) throw err;
            // console.log(result);
            if (result.length > 0) {
                res.send(result);
            } else {
                res.send([]);
            }
        });
    });
});

app.get("/getCart", function (req, res) {

    //var data = req.(data);
    console.log("Get User Cart Data!");
    session = req.session;
    console.log(session);

    //TODO get item from db
    MongoClient.connect(dbUrl, async function (err, db) {
        var dbo = db.db("AkteDessertDatabase");
        var usernameCheck = {
            Username: session.username,
        };
        var productDBO = dbo.collection("Cart");
        var product = await productDBO.find(usernameCheck).toArray(function (err, result) {
            if (err) throw err;
            // console.log(result);
            if (result.length > 0) {
                res.send(result);
            } else {
                res.send([]);
            }
        });
    });
});

app.get("/getProduct", function (req, res) {

    //var data = req.(data);
    //console.log(req.query);

    console.log("Get Product Detail Data!");

    var itemid = req.query.id;

    //TODO get item from db
    MongoClient.connect(dbUrl, async function (err, db) {

        var dbo = db.db("AkteDessertDatabase");
        var o_id = new ObjectId(itemid); // string of 12 bytes or a string of 24 hex characters
        var myobj = {
            _id: o_id
        };
        // console.log(myobj);
        var productDBO = dbo.collection("Product");
        var product = await productDBO.findOne(myobj);
        res.send(product);
        console.log("Product Detail Page Getting Data is done.")
    });
});


app.get("/getQuantity", function (req, res) {
    //var data = req.(data);
    console.log("Get User Quantity Data!");
    session = req.session;
    console.log(session);

    //TODO get item from db
    MongoClient.connect(dbUrl, async function (err, db) {
        var dbo = db.db("AkteDessertDatabase");
        var usernameCheck = {
            Username: session.username,
        };
        var productDBO = dbo.collection("Cart");
        var product = await productDBO.find(usernameCheck).toArray(function (err, result) {
            if (err) throw err;
            // console.log(result);
            if (result.length > 0) {
                res.send(result);
                console.log("Getting Quantity Data is done.")
            } else {
                res.send([]);
                console.log("Getting Quantity Data is done.")
            }
        });
    });
});

//create a server object:
app.use(function (req, res) {
    if (req.url === "/index") {
        sendFileContent(res, "index.html", "text/html");
        console.log("Home page");
        console.log(session);
    } else if (req.url === "/login") {
        if (req.method == "POST") {
            console.log("Start post Login data!");

            return req.on("data", function (data) {

                formdata = "";
                formdata += data;
                data = qs.parse(formdata);

                username = data["Login_Username"];
                password = data["Login_Password"];
                // console.log(user);

                MongoClient.connect(dbUrl, function (err, db) {

                    var dbo = db.db("AkteDessertDatabase");
                    var myobj = {
                        Username: username,
                        Password: password,
                    };
                    //console.log(myobj);

                    dbo.collection("Account").find(myobj).toArray(function (err, result) {
                        console.log(result);
                        if (result.length > 0) {
                            //console.log(result[0].Status);
                            if (result[0].Status == "active") {
                                session = req.session;
                                session.username = username;
                                session.email = result[0].Email;
                                session.authenticated = true;
                                session.save(function (err) {
                                    if (err) console.log(err);
                                });
                                res.cookie("Login_username", result[0].Username);
                                console.log("Find User Account! and Save Data to Session.");
                                console.log(session);
                                res.end("Login_Success");
                            } else {
                                session = req.session;
                                session.username = username;
                                session.email = result[0].Email;
                                session.authenticated = false;
                                session.save(function (err) {
                                    if (err) console.log(err);
                                });
                                res.cookie("Login_username", result[0].Username);
                                console.log("Find User Account! and Save Data to Session.");
                                console.log(session);
                                res.end("Login_Success");
                            }
                        } else {
                            console.log("The Username or Password you typed is incorrect");
                            res.end("Login_Fail");
                        }
                    });
                    //Write Databse Insert/Update/Query Code Here..
                    //console.log("mongodb is running! - login");
                });
                // db.close(); // close connection
            });
        } else {
            sendFileContent(res, "login.html", "text/html");
            console.log("Login page");
        }
    } else if (req.url === "/register") {
        if (req.method == "POST") {
            console.log("Start post Register data!");

            return req.on("data", function (data) {
                formdata = "";
                formdata += data;
                //console.log(formdata);
                data = qs.parse(formdata);
                username = data["Register_Username"];
                password = data["Register_Password"];
                email = data["Register_Email"];
                // console.log(user);

                MongoClient.connect(dbUrl, function (err, db) {
                    var dbo = db.db("AkteDessertDatabase");
                    var usernameCheck = {
                        Username: username,
                    };
                    var emailCheck = {
                        Email: email,
                    };
                    var myobj = {
                        Username: username,
                        Password: password,
                        Email: email,
                        Status: "pending",
                    };
                    //console.log(myobj);
                    dbo.collection("Account").find({ $or: [usernameCheck, emailCheck], }).toArray(function (err, result) {
                        if (result.length > 0) {
                            dbo.collection("Account").find(usernameCheck).toArray(function (err, result) {
                                if (result.length > 0) {
                                    console.log("Username already exists.")
                                    res.end("Register_Username_Fail");
                                }else{
                                    console.log("Email address already exists.")
                                    res.end("Register_Email_Fail");
                                }
                            });
                        } else {
                            dbo.collection("Account").insertOne(myobj, function (err, res) {
                                if (err) throw err;
                            });
                            session = req.session;
                            session.username = username;
                            session.email = email;
                            session.authenticated = false;
                            session.save(function (err) {
                                if (err) console.log(err);
                            });
                            console.log("Save Data to Session and MongoDB.");
                            console.log(session);
                            res.cookie("Login_username", username);
                            res.end("Register_Success");
                        }
                        //Write Databse Insert/Update/Query Code Here..
                        //console.log("mongodb is running! - register");
                    });
                });
            });
        } else {
            // res.end("abc");
            console.log("Register Page");
            sendFileContent(res, "register.html", "text/html");
        }
    } else if (req.url === "/aboutus") {
        sendFileContent(res, "aboutus.html", "text/html");
        console.log("About Us page");
        console.log(session);
    } else if (req.url === "/product-list") {
        if (req.method == "POST") {
            console.log("Start post Product data in Cart! [Product List Page]");

            return req.on("data", function (data) {
                formdata = "";
                formdata += data;
                //console.log(formdata);
                data = qs.parse(formdata);
                username = data["Username"];
                productname = data["ProductName"];
                category = data["Category"];
                image = data["Image"];;
                price = parseInt(data["Price"]);
                quantity = parseInt(data["Quantity"]);

                console.log(data);

                MongoClient.connect(dbUrl, function (err, db) {
                    var dbo = db.db("AkteDessertDatabase");
                    var usernameCheck = {
                        Username: username,
                    };
                    var productCheck = {
                        ProductName: productname,
                    };
                    var myobj = {
                        Username: username,
                        ProductName: productname,
                        Category: category,
                        Image: image,
                        Price: price,
                        Total: price,
                        Quantity: quantity,
                    };
                    console.log(myobj);
                    dbo.collection("Cart").find({ $and: [usernameCheck, productCheck], }).toArray(function (err, result) {
                        if (result.length > 0) {
                            //console.log("Found the Product! Below is the Detail.");
                            //console.log(result[0]);
                            var newprice = [{
                                $set: {
                                    Quantity: {
                                        $sum: [quantity, "$Quantity"],
                                    },
                                    Total: {
                                        $let:{
                                            vars:{
                                                newQuantity: {
                                                    $sum: [quantity, "$Quantity"],
                                                },
                                            },
                                            in:{
                                                $multiply: [price, "$$newQuantity"],
                                            }
                                        }
                                    },
                                },
                            },];
                            dbo.collection("Cart").updateMany(productCheck, newprice, function (err, res) {
                                if (err) throw err;
                                console.log(result[0].ProductName + " Price and Quantity are updated !");
                            });
                            res.end("Cart_Repeat");
                        } else {
                            dbo.collection("Cart").insertOne(myobj, function (err, res) {
                                if (err) throw err;
                                console.log(productname + " is asdded !");
                            });
                            res.end("Cart_Success");
                        }
                        // Write Databse Insert/Update/Query Code Here..
                        //console.log("mongodb is running! - Cart");
                    });
                });
            });
        } else {
            // res.end("abc");
            sendFileContent(res, "product-list.html", "text/html");
            console.log("Product List page");
            console.log(session);
        }
    } else if (req.url === "/cart") {
        if (req.method == "POST") {
            console.log("Start post Product data in Cart! [Cart Page]");

            return req.on("data", function (data) {
                formdata = "";
                formdata += data;
                //console.log(formdata);
                data = qs.parse(formdata);
                username = data["Username"];
                productname = data["ProductName"];
                price = parseInt(data["Price"]);
                quantity = parseInt(data["Quantity"]);
                action = data["Action"];

                console.log(data);

                MongoClient.connect(dbUrl, function (err, db) {

                    var dbo = db.db("AkteDessertDatabase");
                    var usernameCheck = {
                        Username: username,
                    };
                    var productCheck = {
                        ProductName: productname,
                    };

                    dbo.collection("Cart").find({ $and: [usernameCheck, productCheck], }).toArray(function (err, result) {
                        if (result.length > 0) {
                            //console.log("Found the Product! Below is the Detail.");
                            //console.log(result[0]);
                            if (action == "Delete") {
                                console.log("Run Delete!");
                                console.log(result[0].ProductName + " Delete !");
                                dbo.collection("Cart").deleteMany(productCheck, function (err, res) {
                                    if (err) throw err;
                                });
                                res.end("Delete");
                            } else {
                                console.log("Run Update!");
                                var newprice = [{
                                    $set: {
                                        Quantity: quantity,
                                        Total: {
                                            $multiply: [price, quantity]
                                        },
                                    },
                                },];
                                dbo.collection("Cart").updateMany(productCheck, newprice, function (err, res) {
                                    if (err) throw err;
                                    console.log(result[0].ProductName + " Price and Quantity updated !");
                                });
                                res.end("Cart_Update");
                            }
                        }
                        // Write Databse Insert/Update/Query Code Here..
                        //console.log("mongodb is running! - Cart");
                    });
                });
            });
        } else {
            sendFileContent(res, "cart.html", "text/html");
            console.log("Cart Page");
            console.log(session);
        }
    } else if (req.url === "/checkout") {
        if(session.authenticated){
            sendFileContent(res, "checkout.html", "text/html");
            console.log("Checkout page");
            console.log(session);
        } else {
            res.redirect("/401");
        }
    } else if (req.url === "/location") {
        sendFileContent(res, "location.html", "text/html");
        console.log("Location page");
        session = req.session;
        console.log(session);
    } else if (req.url === "/faq") {
        sendFileContent(res, "faq.html", "text/html");
        console.log("Faq page");
        session = req.session;
        console.log(session);
    } else if (req.url === "/product-detail") {
        if (req.method == "POST") {
            console.log("Start post Product data in Cart! [Product Detail Page]");

            return req.on("data", function (data) {
                formdata = "";
                formdata += data;
                //console.log(formdata);
                data = qs.parse(formdata);
                username = data["Username"];
                productname = data["ProductName"];
                category = data["Category"];
                price = parseInt(data["Price"]);
                quantity = parseInt(data["Quantity"]);
                image = data["Image"];
                total = price * quantity;

                console.log(data);

                MongoClient.connect(dbUrl, function (err, db) {
                    var dbo = db.db("AkteDessertDatabase");
                    var usernameCheck = {
                        Username: username,
                    };
                    var productCheck = {
                        ProductName: productname,
                    };
                    var myobj = {
                        Username: username,
                        ProductName: productname,
                        Category: category,
                        Image: image,
                        Price: price,
                        Total: total,
                        Quantity: quantity,
                    };
                    console.log(myobj);
                    dbo.collection("Cart").find({ $and: [usernameCheck, productCheck], }).toArray(function (err, result) {
                        
                        // console.log("Found the Product! Below is the Detail.");
                        // console.log(result);

                        if (result.length > 0) {
                            
                            var newprice = [{
                                $set: {
                                    Quantity: {
                                        $sum: [quantity, "$Quantity"],
                                    },
                                    Total: {
                                        $let:{
                                            vars:{
                                                newQuantity: {
                                                    $sum: [quantity, "$Quantity"],
                                                },
                                            },
                                            in:{
                                                $multiply: [price, "$$newQuantity"],
                                            }
                                        }
                                    },
                                },
                            },];

                            dbo.collection("Cart").updateMany(productCheck, newprice, function (err, res) {
                                // if (err) throw err;
                            });
                            console.log(result[0].ProductName + " Price and Quantity updated !");
                            res.end("Second_Time_Add_Cart");

                        } else {
                            dbo.collection("Cart").insertOne(myobj, function (err, res) {
                                if (err) throw err;
                                console.log(productname + " is added !");
                            });
                            res.end("First_Time_Add_Cart");
                        }
                        // Write Databse Insert/Update/Query Code Here..
                        //console.log("mongodb is running! - Cart");
                    });
                });
            });
        } else {
            // res.end("abc");
            sendFileContent(res, "product-detail.html", "text/html");
            console.log("Product Detail A page");
            session = req.session;
            console.log(session);
        }
    } else if (req.url === "/contactus") {
        sendFileContent(res, "contactus.html", "text/html");
        console.log("Contact Us page");
        session = req.session;
        console.log(session);
    } else if (req.url === "/forget") {
        if (req.method == "POST") {
            console.log("Start post ForgetPassword Detail data! (Email)");

            return req.on("data", function (data) {
                formdata = "";
                formdata += data;
                // console.log(formdata);
                data = qs.parse(formdata);
                email = data["Email"];
                // console.log(email);

                MongoClient.connect(dbUrl, function (err, db) {
                    var dbo = db.db("AkteDessertDatabase");
                    var emailCheck = {
                        Email: email,
                    };
                    dbo.collection("Account").find(emailCheck).toArray(function (err, result) {
                        if (result.length > 0) {
                            res.end("Find_The_Account");
                        } else {
                            res.end("Cannot_Find_The_Account");
                        }
                        // Write Databse Insert/Update/Query Code Here..
                        //console.log("mongodb is running! - Cart");
                    });
                });
            });
        } else {
            // res.end("abc");
            sendFileContent(res, "forget-password.html", "text/html");
            console.log("Forget Password page");
        }
    } else if (req.url === "/reset") {
        if (session.setting) {
            if (req.method == "POST") {
                console.log("Start post New password Detail data!");

                return req.on("data", function (data) {
                    formdata = "";
                    formdata += data;
                    // console.log(formdata);
                    data = qs.parse(formdata);

                    email = session.email;
                    //email = storage.getItem('User');
                    password = data["Password"];
                    // console.log(token);

                    MongoClient.connect(dbUrl, function (err, db) {
                        var dbo = db.db("AkteDessertDatabase");
                        var emailCheck = {
                            Email: email,
                        };
                        var newPassword = [{
                            $set: { Password: password },
                        },];

                        dbo.collection("Account").find(emailCheck).toArray(function (err, result) {
                            if (result.length > 0) {
                                dbo.collection("Account").updateOne(emailCheck, newPassword, function (err, res) {
                                    if (err) throw err;
                                    console.log("Password updated to = " + email);
                                });
                                session = req.session;
                                session.setting = false;
                                session.save(function (err) {
                                    if (err) console.log(err);
                                });
                                res.end("Password_Updated_Success");
                                console.log("Password_Updated_Success. Changed Session Data");
                                console.log(session);
                            } else {
                                res.end("Password_Updated_Fail");
                            }
                        });
                    });
                });
            } else {
                // res.end("abc");
                sendFileContent(res, "reset-password.html", "text/html");
                console.log("Reset Password page");
                session = req.session;
                console.log(session);
            }
        } else {
            res.redirect("/403");
            return;
        }
    } else if (req.url === "/set") {
        if (session.setting) {
            if (req.method == "POST") {
                console.log("Start Post Data to Set Username!");

                return req.on("data", function (data) {
                    formdata = "";
                    formdata += data;
                    data = qs.parse(formdata);

                    email = session.email;
                    username = data["Username"];

                    MongoClient.connect(dbUrl, function (err, db) {
                        var dbo = db.db("AkteDessertDatabase");
                        var usernameCheck = {
                            Username: username,
                        };
                        var emailCheck = {
                            Email: email,
                        };
                        var setUsername = [{
                            $set: { Username: username },
                        },];

                        dbo.collection("Account").find(emailCheck).toArray(function (err, result) {    
                            if (result.length > 0) {    
                                dbo.collection("Account").find(usernameCheck).toArray(function (err, result) {
                                    if (result.length > 0) {
                                        res.end("Username_Updated_Fail");
                                    } else {
                                        dbo.collection("Account").updateOne(emailCheck, setUsername, function (err, res) {
                                            if (err) throw err;
                                            console.log("Username updated to = " + email);
                                        });
                                        res.cookie("Login_username", username);
                                        session = req.session;
                                        session.username = username
                                        session.setting = false;
                                        session.save(function (err) {
                                            if (err) console.log(err);
                                        });
                                        res.end("Username_Updated_Success");
                                        console.log("Username_Updated_Success. Changed Session Data");
                                        console.log(session);
                                    }
                                });
                            } else {
                                res.end("Username_Updated_Fail");
                            }   
                        });
                    });
                });
            } else {
                session = req.session;
                sendFileContent(res, "set-username.html", "text/html");
                console.log("Set Username page");
                console.log(session);
            }
        } else {
            res.redirect("/403");
            return;
        }
    } else if (req.url === "/401") {
        sendFileContent(res, "401-unauthorized.html", "text/html");
        console.log("401 Unauthorized.");
    } else if (req.url === "/403") {
        sendFileContent(res, "403-forbidden.html", "text/html");
        console.log("403 Forbidden.");
    } else if (req.url === "/404") {
        sendFileContent(res, "404-not-found.html", "text/html");
        console.log("404 Not Found.");
    } else if (req.url === "/authenticated") {
        sendFileContent(res, "authenticated.html", "text/html");
        console.log("Successful Authentication! 'Authenticated Page'.");
        session = req.session;
        console.log(session);
    } else if (/^\/[a-zA-Z0-9-._\/]*.js$/.test(req.url.toString())) {
        sendFileContent(res, req.url.toString().substring(1), "text/javascript");
    } else if (/^\/[a-zA-Z0-9-._\/]*.bundle.min.js$/.test(req.url.toString())) {
        sendFileContent(res, req.url.toString().substring(1), "text/javascript");
    } else if (/^\/[a-zA-Z0-9-._\/]*.css$/.test(req.url.toString())) {
        sendFileContent(res, req.url.toString().substring(1), "text/css");
    } else if (/^\/[a-zA-Z0-9-._\/]*.min.css$/.test(req.url.toString())) {
        sendFileContent(res, req.url.toString().substring(1), "text/css");
    } else if (/^\/[a-zA-Z0-9-._\/]*.jpg$/.test(req.url.toString())) {
        sendFileContent(res, req.url.toString().substring(1), "image/jpg");
    } else if (/^\/[a-zA-Z0-9-._\/]*.svg$/.test(req.url.toString())) {
        sendFileContent(res, req.url.toString().substring(1), "image/svg+xml");
    } else if (/^\/[a-zA-Z0-9-._\/]*.gif$/.test(req.url.toString())) {
        sendFileContent(res, req.url.toString().substring(1), "image/gif");
    } else if (/^\/[a-zA-Z0-9-._\/]*.min.js$/.test(req.url.toString())) {
        sendFileContent(res, req.url.toString().substring(1), "text/javascript");
    } else if (/^\/[a-zA-Z0-9-._\/]*.min.css.map$/.test(req.url.toString())) {
        sendFileContent(res, req.url.toString().substring(1), "text/map");
    } else if (/^\/[a-zA-Z0-9-._\/]*.min.js.map$/.test(req.url.toString())) {
        sendFileContent(res, req.url.toString().substring(1), "text/map");
    } else if (/^\/[a-zA-Z0-9-._\/]*.css.map$/.test(req.url.toString())) {
        sendFileContent(res, req.url.toString().substring(1), "text/map");
    } else if (/^\/[a-zA-Z0-9-._\/]*.png$/.test(req.url.toString())) {
        sendFileContent(res, req.url.toString().substring(1), "image/png");
    } else if (/^\/[a-zA-Z0-9-._\/]*.ico$/.test(req.url.toString())) {
        sendFileContent(res, req.url.toString().substring(1), "text/ico");
    } else if (/^\/[a-zA-Z0-9-._\/]*.ttf$/.test(req.url.toString())) {
        sendFileContent(res, req.url.toString().substring(1), "text/font");
    } else if (/^\/[a-zA-Z0-9-._\/]*.woff$/.test(req.url.toString())) {
        sendFileContent(res, req.url.toString().substring(1), "text/woff");
    } else if (/^\/[a-zA-Z0-9-._\/]*.woff2$/.test(req.url.toString())) {
        sendFileContent(res, req.url.toString().substring(1), "text/woff2");
    } else if (/^\/[a-zA-Z0-9-._\/]*.mtl$/.test(req.url.toString())) {
        sendFileContent(res, req.url.toString().substring(1), "model/mtl");
    } else if (/^\/[a-zA-Z0-9-._\/]*.obj$/.test(req.url.toString())) {
        sendFileContent(res, req.url.toString().substring(1), "model/obj");
        console.log(res, req.url.toString().substring(1), "model/obj");
    } else if (/^\/[a-zA-Z0-9-._\/]*.jpeg$/.test(req.url.toString())) {
        sendFileContent(res, req.url.toString().substring(1), "image/jpeg");
    } else {
        console.log("Requested URL is: " + req.url);
        res.end();
    }
})
http.createServer(app).listen(9998); //the server object listens on port 8080

function sendFileContent(response, fileName, contentType) {
    fs.readFile(fileName, function (err, data) {
        if (err) {
            response.writeHead(404);
            response.write("Not Found!");
        } else {
            response.writeHead(200, {
                "Content-Type": contentType,
            });
            response.write(data);
        }
        response.end();
    });
}