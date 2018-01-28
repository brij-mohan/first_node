const express = require('express');
const router = express.Router();

//Add Schema
const contact = require('../models/contacts');

//Retrive the data from database
router.get('/contacts',(req,res, next)=>{
    //res.send('get contact lists');
    contact.find(function(err,result){
        res.json(result);
    });
});

//Add data in database
router.post('/add-contacts',(req, res, next)=>{
    let newContact = new contact({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        phone: req.body.phone
    });
    newContact.save((err,result)=>{
      if(err){
        res.json('Contact is not added' + err);
      }else{
        res.json('contact is added successfully');
      }

    });

});

//Update the data in database
router.put('/update-contacts',(req, res, next)=>{

});

//Delete the data from database
router.delete('/delete-contact/:id',(req, res, next)=>{
    contact.remove({_id: req.params.id},function(err, result){
        if(err){
            res.json(err);
        }else{
          res.json(result);
        }
    });
});
module.exports = router;
