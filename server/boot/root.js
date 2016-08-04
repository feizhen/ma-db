var multer  = require('multer')
var path = require('path');
var app = require(path.resolve(__dirname, '../server'));
var fs = require('fs');

module.exports = function(server) {
  var images_storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, '../my-achievements/src/assets/images/upload_images')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + '.jpg')
    }
  });
  var jsons_storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, '../my-achievements/src/assets/images/upload_jsons')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + '.json')
    }
  });
  var homework_pictures_storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, '../my-achievements/src/assets/images/upload_homework_pictures')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + '.jpg')
    }
  });
  var homework_codes_storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, '../my-achievements/src/assets/images/upload_homework_codes')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + '.zip')
    }
  });
  var upload_image = multer({storage: images_storage, limits: {fileSize: 2000000}});
  var upload_json = multer({storage: jsons_storage, limits: {fileSize: 60000}});
  var upload_homework_picture = multer({storage: homework_pictures_storage, limits: {fileSize: 2000000}});
  var upload_homework_code = multer({storage: homework_codes_storage, limits: {fileSize: 60000000}});

  var router = server.loopback.Router();
  var customer = app.models.Customer;
  var commit = app.models.Commit;

  //上传头像
  router.post('/upload-images', upload_image.single('upload-images'), function(req, res) {
    // res.send("hello");    
    var image_path = req.file.path.slice(23)
    var name = req.body.username
    customer.updateAll({username: name}, {avatar: image_path});
  });

  //上传json文件
  router.post('/upload-jsons', upload_json.single('upload-jsons'), function(req, res) {
    //现在是根据固定的json文件格式里来写的，json文件里有一个user数组，数组里面放的是各user的信息，到时候可根据需求改动。在'../my-achievements/src/assets/images/upload_jsons'路径下有一个json文件以供参考。
    var json_path = req.file.path;
    fs.readFile(json_path, 'utf8', function(err, data) {
      var users = JSON.parse(data).user;
      var length = JSON.parse(data).user.length;
      for (var i = 0; i < length; i++)
        customer.upsert(users[i], function() {
          // console.log('无敌！！');
        });
    });
  });

  //上传作业截图
  router.post('/upload-homework-pictures', upload_homework_picture.single('upload-homework-pictures'), function(req, res) {  
    //因为现在数据模型里还没有存作业截图路径的属性，所以等数据模型改了之后再完善这一个函数，代码和上传作业的差不多。
  });

  //上传作业代码
  router.post('/upload-homework-codes', upload_homework_code.single('upload-homework-codes'), function(req, res) {
    var id = req.body.homework_id;
    var name = req.body.username;
    var github_address = req.body.github;
    var homework_codes_path = req.file.path;
    var data = {
      "github" : "",
      "filePath" : "",
      "description" : "",
      "homework_id" : 0,
      "title" : "",
      "user" : {
          "username" : "",
          "fullname" : ""
      },
      "group" : 0,
      "class" : 0,        
    }
    data.homework_id = id;
    data.title = "my homework " + id;
    customer.findOne({where: {username: name}}, function(err, result) {
      data.user.username = result.username;
      data.user.fullname = result.fullname;
      data.group = result.group;
      data.class = result.class;
    });
    commit.find({where: {homework_id: id, "user.username": name}}, function(err, result) {
      if (result.length == 0) {
        commit.upsert(data, function() {
          // console.log("upsert data success!!");
        });
      }
      commit.updateAll({homework_id: id}, {filePath: homework_codes_path, github: github_address});
      //"description"目前还没有输入框所以没有数据
    });
  });

  // Install a `/` route that returns server status
  router.get('/', server.loopback.status());

  server.use(router);
};
