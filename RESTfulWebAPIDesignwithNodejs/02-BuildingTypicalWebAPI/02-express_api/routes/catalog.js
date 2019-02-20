const express = require('express');
const router  = express.Router();


const catalog = require('../modules/catalog.js');


router.get('/', function(request, response, next)
{
  let categories = catalog.findCategoryies();

  response.json(categories);
});


router.get('/:categoryId', function(request, response, next)
{
  let categories = catalog.findItems(request.params.categoryId);

  if (categories === undefined)
  {
    response.writeHead(404, {'Content-Type' : 'text/plain'});
    response.end('Not found');
  }
  else
  {
    response.json(categories);
  }
});


router.get('/:categoryId/:itemId', function(request, response, next)
{
  let item = catalog.findItem(request.params.categoryId, request.params.itemId);

  if (item === undefined)
  {
    response.writeHead(404, {'Content-Type' : 'text/plain'});
    response.end('Not found');
  }
  else
  {
    response.json(item);
  }
});

module.exports = router;
