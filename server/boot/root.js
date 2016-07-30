var multer  = require('multer')
var path = require('path');
var app = require(path.resolve(__dirname, '../server'));
var fs = require('fs');

module.exports = function(server) {
  //上传头像
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
  var upload_image = multer({storage: images_storage});
  var upload_json = multer({storage: jsons_storage});
  var router = server.loopback.Router();
  var customer = app.models.Customer;
  router.post('/upload-images', upload_image.single('upload-images'), function(req, res) {
    // console.log('req.body: ', typeof(req.body.username));
    // console.log('req.file: ', req.file);
    // console.log('res.req.file: ', res.req.file);
    res.send("hello");    
    var image_path = req.file.path.slice(23)
    var name = req.body.username
    // console.log('image_path: ', image_path)
    customer.updateAll({username: name}, {avatar: image_path});
  });

  //上传json文件
  router.post('/upload-jsons', upload_json.single('upload-jsons'), function(req, res) {
    // console.log('req.body: ', req.body);
    // console.log('req.file: ', req.file);
    // console.log('res.req.file: ', res.req.file);    
    var json_path = res.req.file.path;
    // console.log('json_path: ', json_path);
    fs.readFile(json_path, 'utf8', function(err, data) {
      var users = JSON.parse(data).user;
      var length = JSON.parse(data).user.length;
      // console.log('JSON.parse(data).user: ', JSON.parse(data).user);
      // console.log('JSON.parse(data).user.length: ', JSON.parse(data).user.length);
      // console.log('typeof(JSON.parse(data).user[0]): ', typeof(JSON.parse(data).user[0]));
      // for (var i = 0; i < length; i++)
      //   customer.upsert(users[i], function() {
      //     // console.log('无敌！！');
      //   });
    });
  });

  // Install a `/` route that returns server status
  router.get('/', server.loopback.status());

  server.use(router);
};
