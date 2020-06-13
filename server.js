let express = require('express');
let app = express();

let bodyparser = require('body-parser');

let mongoose = require('mongoose');

let db = mongoose.connect('mongodb://localhost/NerdSwag_db');


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

app.listen(3000, function(){
    console.log("NerdSwag API running on port 3000");
});
