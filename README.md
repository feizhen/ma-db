# Ma-db

1. npm install
2. run 'node bin/automigrate.js' to migrate data to mongodb
3. run 'node .' to start loopback
4. go to the '/Explorer' to checkout the usage of api
5. in MA , just change the  path in the $resource (index.api.js) to the loopback api, then you can use CRUD operation on the data


# Note

如果有此报错
    
    Connection fails:  { MongoError: failed to connect to server [127.0.0.1:27017] on first connect

请先开启mongodb


如果有此报错
    
    Error: listen EADDRINUSE 0.0.0.0:3000

请先运行此demo，再运行ma，或者在/server/config.json下修改端口号，否则会出现端口占用报错。。因为大家都在用3000端口


