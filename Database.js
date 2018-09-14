var USE_DB = true;

var mongoose = USE_DB ? require("mongoose") : null;

// make a connection
mongoose.connect('mongodb+srv://DHadmin:Lekkerding!!@cluster0-047x3.mongodb.net/myGame', { useNewUrlParser: true });

// get reference to database
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function() {

      console.log("Connection Successful!");

      console.log("db connected");

      //account:  {username:string, password:string}
      //progress:  {username:string, items:[{id:string,amount:number}]}

      var accountSchema = new mongoose.Schema({username:'string', password:'string'});
      var progressSchema = new mongoose.Schema({username:'string', items:[{id:'string',amount:'number'}]});

      var account = mongoose.model('account', accountSchema);
      var progress = mongoose.model('progress', progressSchema);

      Database = {};

      Database.isValidPassword = function(data,cb){
          if(!USE_DB)
              return cb(true);
          account.findOne({username:data.username,password:data.password},function(err,res){
          		if(res)
          			cb(true);
          		else
          			cb(false);
          	});
      }
      Database.isUsernameTaken = function(data,cb){
          if(!USE_DB)
              return cb(false);
      	account.findOne({username:data.username},function(err,res){
      		if(res)
      			cb(true);
      		else
      			cb(false);
      	});
      }
      Database.addUser = function(data,cb){
          if(!USE_DB)
              return cb();
      	account.create({username:data.username,password:data.password},function(err){
              Database.savePlayerProgress({username:data.username,items:[]},function(){
                  cb();
              })
      	});
      }
      Database.getPlayerProgress = function(username,cb){
          if(!USE_DB)
              return cb({items:[]});
      	progress.findOne({username:username},function(err,res){
      		cb({items:res.items});
      	});
      }
      Database.savePlayerProgress = function(data,cb){
          cb = cb || function(){}
          if(!USE_DB)
              return cb();
          progress.updateOne({username:data.username},data,{upsert:true},cb);
      }
});
