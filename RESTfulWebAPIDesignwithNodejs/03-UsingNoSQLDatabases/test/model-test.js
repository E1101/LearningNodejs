const mongoose = require('mongoose');
const should   = require('should');
const prepare  = require('./prepare');


const model = require('../model/item.js');
const CatalogItem = model.CatalogItem;

mongoose.createConnection('mongodb://localhost/catalog');


describe('CatalogItem: models', function ()
{
  describe('#create()', function ()
  {
    it('Should create 1_understand_async new CatalogItem', function (done)
    {
      let item = {
        "itemId": "1",
        "itemName": "Sports Watch",
        "price": 100,
        "currency": "EUR",
        "categories": [
          "Watches",
          "Sports Watches"
        ]
      };

      CatalogItem.create(item, function (err, createdItem) {
        // Check that no error occured
        should.not.exist(err);

        // Assert that the returned item has is what we expect
        createdItem.itemId.should.equal('1');
        createdItem.itemName.should.equal('Sports Watch');
        createdItem.price.should.equal(100);
        createdItem.currency.should.equal('EUR');
        createdItem.categories[0].should.equal('Watches');
        createdItem.categories[1].should.equal('Sports Watches');

        //Notify mocha that the test has completed
        done();
      });
    });
  });

});
