const express = require('express');
const UserController = express.Router();
// const utils = require('../../utils');
// const bcrypt = require('bcrypt');


UserController.route('/login')
    .post(async (req, res) => {
        let error =false,
            data;

        if(!(req.body)) {
            error = true;
            data = 'Request cant find body';
        }
        else if(!(req.body.password)){
            error = true;
            data = 'Request cant find password';
        }
        else if(!(req.body.username)){
            error = true;
            data = 'Request cant find username';
        }
        else {
            try{
                let user = await User.findOne({username: req.body.username});
                if(!(user)) {
                    error = true;
                    data = 'Cant not find user with username';
                } else if(!user.validPassword(req.body.password)){
                    error = true;
                    data = 'Password incorrect';
                } else {

                    let token = await JWT.sign({username: user.username}, Config.secret);
                    data = {
                        token: token,
                        username: user.username
                    }
                    console.log(JWT.verify(token, Config.secret));
                }
            } catch (e){
                error = true;
                data = e.message.toString();
            }
        }
        res.json({error: error, result:{ data: data}});
    });

UserController.route('/signup')
    .post(async (req, res) => {
        console.log(req.body);
        let error,
            data;

        if(!(req.body)) {
            error = true;
            data = 'Request cant find body';
        }
        else if(!(req.body.password)){
            error = true;
            data = 'Request cant find password';
        }
        else if(!(req.body.username)){
            error = true;
            data = 'Request cant find username';
        }
        else {
            let user = new User({
                username: req.body.username,
                password: req.body.password
            });
            let check;
            try{
                check = await user.save();
                error = true;
                data = check;
            } catch (e){
                error = true;
                data = e.message.toString();
            }
        }
        res.json({error: error, result:{ data: data}});
    });

UserController.route('/logout')
    .post(async (req, res) => {
        console.log(req.body);
        res.json({error: false, result: { data: 'logout'}})
    })

module.exports = UserController;