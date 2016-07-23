// Copyright IBM Corp. 2015,2016. All Rights Reserved.
// Node module: loopback-example-database
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

var path = require('path');
var fs = require('fs-extra');
var async = require('async')

var app = require(path.resolve(__dirname, '../server/server'));
//data sources
var ds = app.datasources.maDS;

async.parallel({
  customers: async.apply(createCustomers),
  homeworks: async.apply(createHomeworks),
  reviews: async.apply(createReviews),
  commits: async.apply(createCommits),
}, function(err, result) {
  if (err) throw err;
  console.log(result)
    ds.disconnect();

}) 

function createCustomers(cb){
  ds.automigrate('Customer', function(err) {
  if (err) throw err;

  var customers = fs.readJSONSync(path.resolve(__dirname, './customers.json'))
  // console.log(customers)
  
  customers.user.forEach(function(customer) {
    app.models.Customer.create(customer, function(err, result) {
      if(err) cb(err)
    });
  });
  cb(null, 'customers migrate successfully')

});
}


function createHomeworks(cb) {
  ds.automigrate('Homework', function(err) {
    if(err) throw err;

    fs.readJSON(path.resolve(__dirname, './homeworks.json'), function(err, homeworks) {


    // console.log(homeworks)
    homeworks.data.forEach(function(homework){
      app.models.Homework.create(homework, function(err, result) {
        if (err) cb(err)
      })
    })

    cb(null, 'homeworks migrate successfully')
    })


  })

}

function createReviews(cb) {
  ds.automigrate('Review', function(err) {
    if (err) throw err;

    var reviews = fs.readJSONSync(path.resolve(__dirname, './reviews.json'))
    // console.log(reviews)

    reviews.data.forEach(function(review) {
      app.models.Review.create(review, function(err, result) {
        if(err) cb(err);
      })
    })

    cb(null, 'reviews migrate successfully')
  })
}

function createCommits(cb) {
    ds.automigrate('Commit', function(err) {
    if (err) throw err;

    var commits = fs.readJSONSync(path.resolve(__dirname, './commits.json'))
    // console.log(commits)

    commits.data.forEach(function(commit) {
      app.models.Commit.create(commit, function(err, result) {
        if(err) cb(err);
      })
    })

    cb(null, 'commits migrate successfully')
  })
}