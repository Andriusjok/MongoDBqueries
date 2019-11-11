var mongoose = require('mongoose');
var express = require('express');
var router = express.Router();

const UserSchema = new mongoose.Schema({
  Name: {type:String},
  Age: {type:Number},
  Sex: { type: String },
  Email: { type: String }
});
const User = mongoose.model("User", UserSchema);

const ChampSchema = new mongoose.Schema({
  account:{type:String},
  Name: {type: String},
  cost: {type : Number}
});
const Champ = mongoose.model("Champions", ChampSchema);

const AccSchema = new mongoose.Schema({
  Name: {type: String},
  Username: { type: String },
  Password: { type: String },
  AccountLevel: { type: Number },
  BlueEssence: { type: Number },
  RitoPoints: { type: Number },
  Champions: [ChampSchema]
});


const Acc = mongoose.model("Account", AccSchema);


mongoose.connect("mongodb://localhost/sampsite", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
  router.post('/newUser',function(req,res,next){
    User.create(req.body, function(error){
      if (error)
      return console.log(error);
      else return console.log("OK");
    })
    res.status(200).send("Ok");
  });

  
  router.post('/addAcc',function(req,res,next){
    Acc.create(req.body, function(error){
      if (error)
      return console.log(error);
      else return console.log("OK");
    });
    res.send("Ok");
  });


  router.get('/1uzd', function(req, res, next) {
    Acc.find({},{"_id":0,"Champions":1}).then(function(err,result) {
      if (err)
      return res.send(err);
      else
      res.status(200).send(result);
    });
  });
  
  router.get('/2uzd', function(req, res, next) {
  Acc.aggregate([
     // { $match : { name :"$name" } },
      {$group: { _id: "$Name",BlueEssence: { $sum: "$BlueEssence"}}} 
  ]).then(function(err,result)
  {
    if (err)
    return res.send(err);
    else
    res.status(200).send(result);
  });
  });
  
  router.get('/3uzd', function(req, res, next) {
  Acc.mapReduce([
    function(){emit:(this.name, this.BlueEssence);},
    function(key,values){return Array.sum(values)},
  {
    query:{},
    out: "order_totals"
  }

  ]).then(function(err,result)
  {
    if (err)
    return res.send(err);
    else
    res.status(200).send(result);
  });
  });  
 
module.exports = router;