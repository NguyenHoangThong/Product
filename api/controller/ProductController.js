const express = require('express');
const ProductController = express.Router();

const checkReq = (req, res, next) => {
    if(!(req.body)) {
        res.json({error: true, result:{data: 'Request cant find body'}});
    } else if(!(req.body.token)) {
        res.json({error: true, result:{data: 'Request cant find token'}});
    } else if(!(req.body.name)){
        res.json({error: true, result:{data: 'Request cant find data name'}});
    } else if (!(req.body.price)){
        res.json({error: true, result:{data: 'Request cant find data price'}});
    } else{
        next();
    }
}
ProductController.use('/add', checkReq);
ProductController.route('/add')
    .post(async (req, res) => {
       console.log(req.body);
       let error = false,
           data;

       try {
            let _username = await JWT.verify(req.body.token, Config.secret);
            console.log(_username);
            if(!(_username)){
                error = true;
                data = 'Token cant verify';
            } else {
                let user = await User.findOne({username: _username.username});
                let check;
                if(!(user)) {
                    error = true;
                    data = 'Token cant find user';
                } else {
                    let product = new Product({
                        userID: user._id,
                        name: req.body.name,
                        price: req.body.price
                    });
                    check = await product.save();
                    if(!check) {
                        error = true;
                        data = 'Cant save this product';
                    } else{
                        error = false;
                        data = {
                            id: check._id,
                            userID: check.userID,
                            name: check.name,
                            price: check.price
                        }
                    }
                }
            }
       }catch (e){
            error = true;
            data = e.message.toString();
       }

       res.json({error: error, result:{data: data}});
    });

ProductController.use('/edit', checkReq);
ProductController.route('/edit')
    .post(async (req, res) => {
        let error = false,
            data;
        if( !req.body.id){
            error = true;
            data = 'Cant find id of product'
        } else{
            try {
                let _username = await JWT.verify(req.body.token, Config.secret);
                console.log(_username);
                if(!(_username)){
                    error = true;
                    data = 'Token cant verify';
                } else {
                    let user = await User.findOne({username: _username.username});
                    let product = await Product.findOne({_id: req.body.id});
                    let check;

                    if(!(user)) {
                        error = true;
                        data = 'Token cant find user';
                    } else if( !product){
                        error = true;
                        data = 'Cant find product with product id';
                    } else if( String(user._id) !== String(product._id)){
                        error = true;
                        data = 'User is not owner of product';
                    }
                    else {
                        product.name = req.body.name;
                        product.price = req.body.price;
                        check = await product.save();
                        if(!check) {
                            error = true;
                            data = 'Cant update this product';
                        } else {
                            error = false;
                            data = {
                                id: check._id,
                                userID: check.userID,
                                name: check.name,
                                price: check.price
                            }
                        }
                    }
                }
            } catch (e){
                error = true;
                data = e.message.toString();
            }
        }
        res.json({error: error, result:{data: data}});
    });

ProductController.route('/delete')
    .post(async (req, res) => {
        let error = false;
        let data;
        try{

            if(!req.body){
                error = true;
                data = 'Request cant find body';
            } else if (!req.body.token) {
                error = true;
                data = 'Request cant find token';
            } else if ( !req.body.id) {
                error = true;
                data = 'Request cant find id';
            } else {
                let _username = await JWT.verify(req.body.token, Config.secret);
                console.log(_username);
                if(!(_username)){
                    error = true;
                    data = 'Token cant verify';
                } else {
                    let user = await User.findOne({username: _username.username});
                    let product = await Product.findOne({_id: req.body.id});
                    let check;

                    if(!(user)) {
                        error = true;
                        data = 'Token cant find user';
                    } else if( !product){
                        error = true;
                        data = 'Cant find product with product id';
                    } else if( String(user._id) !== String(product._id)){
                        error = true;
                        data = 'User is not owner of product';
                    }
                    else {
                        check = await Product.remove(product);
                        console.log('check', check);
                        if(!check) {
                            error = true;
                            data = 'Cant update this product';
                        } else {
                            error = false;
                            data = check
                        }
                    }
                }
            }

        } catch (e) {
            error = true;
            data = e.message.toString();
        }
        res.json({error: error, result:{data: data}});
    });

ProductController.route('/product')
    .get(async (req, res) => {
        console.log(req.query);
        let error = false,
            data;
        try {
            let product = await Product.find({}).populate('userID', ['username']);
            if(product.length == 0){
                error = false;
                data = 'Product empty';
            } else {
                error = false;
                data = product;
            }
            console.log(product);
        } catch (e) {
            error = true;
            data = e.message.toString();
        }
        res.json({error: error, result:{data: data}});
    });

ProductController.route('/ownproduct')
    .get(async (req, res) => {
        console.log(req.headers);
       let error = false,
           data;
       try {
           console.log(req.headers.token);
            if (!req.headers.token){
                error = true;
                data = 'Request cant find token';
            } else {
                let _username = await JWT.verify(req.headers.token, Config.secret);
                console.log(_username);
                if(!(_username)){
                    error = true;
                    data = 'Token cant verify';
                } else {
                    let user = await User.findOne({username: _username.username});
                    let product;
                    let check;

                    if(!(user)) {
                        error = true;
                        data = 'Token cant find user';
                    } else {
                        product =  await Product.find({userID: user._id}).populate('userID', ['username']);
                        if(!product){
                            error = true;
                            data = 'Cant find product';
                        } else {
                            error = false;
                            data = product;
                        }
                    }
                }
            }
       } catch(e) {
           error = true;
           data = e.message.toString();
       }
       res.json({error: error, result:{data: data}});
    });

module.exports = ProductController;