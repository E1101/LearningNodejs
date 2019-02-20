const fs = require('fs');

function readCatalogSync()
{
   let file = './data/catalog.json';

   if ( fs.existsSync(file) )
   {
     let content = fs.readFileSync(file);

     return JSON.parse(content);
   }

   return undefined;
}


exports.findItems = function(categoryId)
{
  console.log('Returning all items for categoryId: ' + categoryId);

  let catalog = readCatalogSync();
  if (catalog === undefined) {
    return undefined;
  }

  let items = [];
  for (let index in catalog.catalog)
  {
    if (catalog.catalog[index].categoryId === categoryId)
    {
        let category = catalog.catalog[index];
        for (let itemIndex in category.items) {
            items.push(category.items[itemIndex]);
        }
    }
  }

  return items;
};


exports.findItem = function(categoryId, itemId)
{
  console.log('Looking for item with id' + itemId);

  let catalog = readCatalogSync();
  if (catalog) {
    for (let index in catalog.catalog)
    {
        if (catalog.catalog[index].categoryId === categoryId)
        {
          let category = catalog.catalog[index];
          for (let itemIndex in category.items)
          {
            if (category.items[itemIndex].itemId === itemId)
              return category.items[itemIndex];
          }
        }
    }
  }

  return undefined;
};


exports.findCategoryies = function()
{
  console.log('Returning all categories');

  let catalog = readCatalogSync();
  if (catalog) {
    let categories = [];
    for (let index in catalog.catalog)
    {
        let category = {};
        category["categoryId"]   = catalog.catalog[index].categoryId;
        category["categoryName"] = catalog.catalog[index].categoryName;

        categories.push(category);
    }

    return categories;
  }

  return [];
};
