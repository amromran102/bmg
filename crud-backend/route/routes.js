var express = require('express');
var router = express.Router();

module.exports = router;

const Item = require('../model/useritem');

//retrieving data from database
router.get('/users', (req,res,next)=>{
    Item.find(function(err, items){
        if(err){
            res.json(err);
        }
        else{
            res.json(items);
        }
    });
});

//inserting new data
router.post('/user', (req,res,next)=>{
    let newUserItem = new Item({
        username: req.body.username,
        fullname: req.body.fullname,
        birthdate: req.body.birthdate,
        email: req.body.email,
        password: req.body.password
    });
    newUserItem.save((err, item)=>{
        if(err){
            res.json(err);
        }
        else{
            res.json({msg: 'User has been added successfully'});
        }
    });
});

//updating the data
router.put('/user/:id', (req,res,next)=>{
    Item.findOneAndUpdate({_id: req.params.id},{
        $set:{
            username: req.body.username,
            fullname: req.body.fullname,
            birthdate: req.body.birthdate,
            email: req.body.email,
            password: req.body.password
        }
    },
    function(err,result){
        if(err){
            res.json(err);
        }
        else{
            res.json(result);
        }
    })
});

//inserting new data
router.delete('/user/:id', (req,res,next)=>{
    Item.remove({_id: req.params.id}, function(err,result){
        if(err){
            res.json(err);
        }
        else{
            res.json(result);
        }
    })
});
