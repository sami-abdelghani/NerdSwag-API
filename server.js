let express = require('express');
let app = express();

let bodyparser = require('body-parser');

let mongoose = require('mongoose');

//A database object to connect to the NerdSwag_db mongodb database
let db = mongoose.connect('mongodb://localhost/NerdSwag_db');

//Creating objects for each model to be used to make the appropriate HTTP requests
let Product = require('./models/product');
let WishList = require('./models/wishlist');
let Cart = require('./models/cart');
let Account = require('./models/account');

//Allow all requests from all domains & localhost
app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "POST, GET");
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

/*Retrieves the wishlist data and populates the wishlist with the appropriate
 list of product data for each wishlist from the MongoDB database*/
app.get('/wishlist', function(req, res){
    WishList.find({}).populate({path: 'products', model: 'Product'}).exec(function(err, wishLists)
  {
    if(err){
      res.status(500).send({error: "The proper product information didn't get added to the appropriate wishlists."});
    }
    else{
      res.status(200).send(wishLists);
    }
  });
});

//To add a wishlist with it's designated data into the MongoDB database
app.post('/wishlist', function(req, res){

    let wishList = new WishList();
    wishList.title = req.body.title;

    wishList.save(function(err, newWishList){
       if(err){
          res.status(500).send({error: "The new wishlist couldn't be saved due to an error."});
       }
       else{
          res.status(200).send(newWishList);
       }
    })

});

/*To edit the designated wishlist from the database and add the desired product data
 for the list of products in the wishlist from the MongoDB database*/
app.put('/wishlist/product/add', function(req, res){
  Product.findOne({_id: req.body.productId}, function(err, product){
      if(err){
        res.status(500).send({error: "The requested product could not be found."});
      }
      else {
        WishList.update({_id: req.body.wishListId}, {$addToSet: {products: product._id}}, function(err, wishList){
          if(err){
            res.status(500).send({error: "Please check if the products intended to be added to the wishlist have proper product ids."});
          }
          else{
            res.send(wishList);
          }

        })
      }
  })
});

/*Retrieves the cart data and populates the cart with the appropriate
 list of product data for each cart from the MongoDB database*/
app.get('/cart', function(req, res){
    Cart.find({}).populate({path: 'products', model: 'Product'}).exec(function(err, cart)
  {
    if(err){
      res.status(500).send({error: "The proper product information didn't get added to the cart."});
    }
    else{
      res.status(200).send(cart);
    }
  });
});

//To add a cart with it's designated data into the MongoDB database
app.post('/cart', function(req, res){

    let cart = new Cart();
    cart.title = req.body.title;

    cart.save(function(err, newCart){
       if(err){
          res.status(500).send({error: "The cart couldn't be saved due to an error."});
       }
       else{
          res.status(200).send(newCart);
       }
    })

});

/*To edit the designated cart from the database and add the desired product data
 for the list of products in the cart from the MongoDB database*/
app.put('/cart/product/add', function(req, res){
  Product.findOne({_id: req.body.productId}, function(err, product){
      if(err){
        res.status(500).send({error: "The requested product could not be found."});
      }
      else {
        Cart.update({_id: req.body.cartId}, {$addToSet: {products: product._id}}, function(err, cart){
          if(err){
            res.status(500).send({error: "Please check if the products intended to be added to the cart have proper product ids."});
          }
          else{
            res.send(cart);
          }

        })
      }
  })
});

/*Retrieves the account data and populates the account with the appropriate
 type of list for wishlist and cart data for each account from the MongoDB database*/
app.get('/account', function(req, res){
    Account.find({}).populate({path: 'wishlists', model: 'WishList'}).exec(function(err, account)
  {
    if(err){
      res.status(500).send({error: "The proper wishlist information didn't get added to the appropriate account."});
    }
    else{
      res.status(200).send(account);
    }
  })

});

app.get('/account', function(req, res){

  Account.find({}).populate({path: 'carts', model: 'Cart'}).exec(function(err, account)
  {
  if(err){
    res.status(500).send({error: "The proper cart information didn't get added to the appropriate account."});
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

/*To edit the designated account from the database and add the desired wishlist data
 for the list of wishlists in the account from the MongoDB database*/
app.put('/account/wishlist/add', function(req, res){
  WishList.findOne({_id: req.body.wishListId}, function(err, wishlist){
      if(err){
        res.status(500).send({error: "The requested wishlist could not be found."});
      }
      else {
        Account.update({_id: req.body.accountId}, {$addToSet: {wishlist: wishlist._id}}, function(err, account){
          if(err){
            res.status(500).send({error: "Please check if the wishlist intended to be added to the account has a proper wishlist id."});
          }
          else{
            res.send(account);
          }

        })
      }
  })
});

/*To edit the designated account from the database and add the desired cart data
 for the list of carts in the account from the MongoDB database*/
app.put('/account/cart/add', function(req, res){
  Cart.findOne({_id: req.body.cartId}, function(err, cart){
      if(err){
        res.status(500).send({error: "The requested cart could not be found."});
      }
      else {
        Account.update({_id: req.body.accountId}, {$addToSet: {cart: cart._id}}, function(err, account){
          if(err){
            res.status(500).send({error: "Please check if the cart intended to be added to the account has a proper cart id."});
          }
          else{
            res.send(account);
          }

        });
      }
  });
});

/*Listens to port 3000 to see if its available to run the NerdSwag API
and prints out a statement stating it's running on that port if it runs on port 3000 */
app.listen(3000, function(){
    console.log("NerdSwag API running on port 3000");
});
