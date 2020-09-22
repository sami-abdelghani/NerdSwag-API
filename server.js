let express = require('express');
let app = express();

let bodyparser = require('body-parser');

let mongoose = require('mongoose');

//A database object to connect to the NerdSwag_db mongodb database
let db = mongoose.connect('mongodb://localhost/NerdSwag_db');

//Creating objects for each model to be used to make the appropriate HTTP requests
let Product = require('./models/product');
let Account = require('./models/account');

//Allow all requests from all domains & localhost
app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "POST, GET, PUT");
  next();
});


app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:false}));

//To add a product with its designated data into the MongoDb database
app.post('/product', function(req, res){
    let product = new Product();
    product.title = req.body.title;
    product.price = req.body.price;
    product.imgUrl = req.body.imgUrl;

    product.save(function(err, savedP){
      if(err){
        res.status(500).send({error: "The new product couldn't save."});
      }
      else{
        res.status(200).send(savedP);
      }
    })
});

//To get the product data from the MongoDB database
app.get('/product', function(req, res){
    Product.find({}, function(err, products){
      if(err){
        res.status(500).send({error: "Could not find products due to an error."});
      }
      else{
        res.send(products);
      }
    })
});


/*Retrieves the account data and populates the account with the appropriate
 type of product data for each wishlist and cart for each account from the MongoDB database*/
app.get('/account', function(req, res){
    Account.find({}).populate({path: 'wishlist', model: 'Product'}).exec(function(err, account)
    {
      if(err){
        res.status(500).send({error: "The proper product data didn't get added to the appropriate wishlist for each account."});
      }
      else{
        res.status(200).send(account);
      }
  })

});


app.get('/account', function(req, res){

  Account.find({}).populate({path: 'cart', model: 'Product'}).exec(function(err, account)
  {
  if(err){
    res.status(500).send({error: "The proper product data didn't get added to the appropriate cart for each account."});
  }
  else{
    res.status(200).send(account);
  }
})

});

//To add an account with it's designated data into the MongoDB database
app.post('/account', function(req, res){

    let account = new Account();
    account.username = req.body.username;
    account.password = req.body.password;
    account.email = req.body.email;
    account.balance = req.body.balance;

    account.save(function(err, newAccount){
       if(err){
          res.status(500).send({error: "The new account couldn't be saved due to an error."});
       }
       else{
          res.status(200).send(newAccount);
       }
    })

});

/*To edit the designated account balance from the MongoDB database*/
app.put('/account/balance/:id', function(req, res){

    Account.update({_id: req.params.id}, {balance: req.body.balance}, function(err){
      if(err){
        res.status(500).send({error: "The requested account could not be found."});
      }
      else{
          Account.findOne({_id: req.params.id}, function(err, account){
            if(err){
              res.status(500).send({error: "The requested account balance could not be changed due to an error."});
            }
            else{
              res.send(account);
            }
          });
      }

    });

});


/*To edit the designated account's wishlist data of products in the user's wishlist from the MongoDB database*/
app.put('/account/wishlist/:id', function(req, res){
  Account.update({_id: req.params.id}, {wishlist: req.body.wishlist}, function(err){
    if(err){
      res.status(500).send({error: "The requested account could not be found."});
    }
    else{
        Account.findOne({_id: req.params.id}, function(err, account){
          if(err){
            res.status(500).send({error: "The requested account wishlist could not be changed due to an error."});
          }
          else{
            res.send(account);
          }
        });
    }

  });
});


/*To edit the designated account's cart data of products in the user's cart from the MongoDB database*/
app.put('/account/cart/:id', function(req, res){
  Account.update({_id: req.params.id}, {cart: req.body.cart}, function(err){
    if(err){
      res.status(500).send({error: "The requested account could not be found."});
    }
    else{
        Account.findOne({_id: req.params.id}, function(err, account){
          if(err){
            res.status(500).send({error: "The requested account cart could not be changed due to an error."});
          }
          else{
            res.send(account);
          }
        });
    }

  });
});


/*Retrieves the designated account's wishlist data after populating the account's wishlist with the appropriate
 type of product data from the MongoDB database*/
app.get('/account/wishlist/:id', function(req, res){

    Account.findOne({_id: req.params.id}).populate({path: 'wishlist', model: 'Product'}).exec(function(err, account)
    {
      if(err){
        res.status(500).send({error: "Either the designated account couldn't be found, or the proper product data couldn't get populated in the appropriate wishlist for the designated account."});
      }
      else{
        res.status(200).send(account);
      }
  })

});

/*Retrieves the designated account's cart data after populating the account's cart with the appropriate
 type of product data from the MongoDB database*/
app.get('/account/cart/:id', function(req, res){

  Account.findOne({_id: req.params.id}).populate({path: 'cart', model: 'Product'}).exec(function(err, account)
  {
    if(err){
      res.status(500).send({error: "Either the designated account couldn't be found, or the proper product data couldn't get populated in the appropriate cart for the designated account."});
    }
    else{
      res.status(200).send(account);
    }
})

});


/*Listens to port 3000 to see if its available to run the NerdSwag API
and prints out a statement stating it's running on that port if it runs on port 3000 */
app.listen(3000, function(){
    console.log("NerdSwag API running on port 3000");
});
