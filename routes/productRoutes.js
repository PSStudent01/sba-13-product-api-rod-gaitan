// Ia) Router setup:
const express = require('express'); // loads Express to your app after having been installed
const Product = require('../models/Product'); //'productSchema' having been converted from a schema into a model 'Product', now we import it, so that it can interact with DB
const router = express.Router();  // this creates a mini router object that holds all of the needed routes

// Route POST /api/products - to create a new product
router.post('/', async (req, res) => { // creates a POST route..
    try{                                 //...while gracefully handling errors....
        // const product = await Product.create(req.body)
        const product = new Product(req.body);  //...where IF it 'imports' the 'Product' model successfully...
        const savedProduct = await product.save(); //... THEN 1)it waits and 2)if the 'Product' model (savedProduct) is valid, 3)it saves data to DB...
        res.status(201).json(savedProduct); // ...and 4)returns a 201 code (201 = 'Created')- record successfully 'created'!
    } catch(err){ //...ELSE
          //res.status(400).json(err);
          res.status(400).json({ message: err.message}); //returns a 400 error code (400 = 'Bad Request')-  record creation 'failed'! 
                                                         // chose '(err)' & 'message: err.message' bc many thing scan go wrong here and hardcoding it wouldnt cover them all   

    }
})
/*
Testing parameters:
Method: POST
URL: http://localhost:5000/api/products
Body: raw > JSON
- tested both for both status codes:
-- 201
-- 400
- MongoDB correctly updated
*/


// Route GET /api/products/:id - to fetch a single product by ID
router.get('/:id', async (req, res) => { // creates a GET route...
    try{      //...while gracefully handling errors...
        const product = await Product.findById(req.params.id); //...where IF it 'finds' the 'Product' model successfully..
        if (!product) {                                         //...BUT the specific product is not valid/found..
            return res.status(404).json({ message: 'Product not found' }); //...it returns a 404 error code (404 = 'Product not found') 
        }
        res.status(200).json(product); //...ELSE IF product found, it returns a 200 code (200 = OK) - specific record successfully 'found'!!
    } catch{                         
        //res.status(400).json({ message: err.message });
        res.status(400).json({ message: 'Invalid ID format' })  //...ELSE returns a 400 error code (400 = 'Invalid ID format') 
    }
})
/*
Testing parameters:
Method: GET
Body: raw > JSON
#
Test 1 — Valid ID that exists:
http://localhost:5000/api/products/69c09ec02259995c462a474c
Returned: 200 - OK
#
Test 2 —  Valid format, but ID doesn't exist:
http://localhost:5000/api/products/111111111111111111111111
Returned: 404 - Product not found
#
Test 3 — Invalid format:
http://localhost:5000/api/products/banana
Returned: 400 - Invalid ID format'
*/

// Route Update / PUT (/api/books/:id) for 1 single product document
router.put('/:id', async (req, res) => {   // creates a PUT route...
  try {                                  //...while gracefully handling errors....
    const updatedProduct = await Product.findByIdAndUpdate(  //...where IF it 'finds' ....
      req.params.id,  //...the 'Product' model by id successfully...
      req.body,      // ...THEN it replaces its data with what the client sent..
      //{ new: true, runValidators: true}  // ...and then returns the updated version, not the old one... 
      { returnDocument: 'after', runValidators: true }
      //{returnDocument: 'after'}
    );
    if (!updatedProduct) { // however IF the 'updatedBook'...
      return res.status(404).json({ message: 'Product not found' }); //...THEN  404 error code is generated...
    }
    res.status(200).json(updatedProduct);  //...ELSE IF 'updatedProduct' is valid THEN  200  code is generated...
  } catch (error) {  //ELSE....
    res.status(400).json({ message: error.message });  // 400  error code is generated
  }
});

/*
Testing parameters:
Method: PUT
Body: raw > JSON
{
    "price": 159.99,
    "inStock": true
}
#
Test 1 — Successful product update:
http://localhost:5000/api/products/69c09ec02259995c462a474c
Returned: 200 - OK
#
Test 2 — Product not found:
http://localhost:5000/api/products/111111111111111111111111
Returned: 404 - Product not found
#
Test 3 — Validation:
{
    "price": -10
}
http://localhost:5000/api/products/69c09ec02259995c462a474c
Returned: 400 - Validation failed: price: Price must be greater than 0
*/


// Route DELETE /api/products/:id - Delete a product
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'No product found with this id!' });
    }
    res.status(200).json({ message: 'Product deleted!' });
  } catch {
    //res.status(400).json(err);
    res.status(400).json({ message: 'Invalid ID format'});
  }
});
/*
Testing parameters:
Method: DELETE
Body: raw > JSON
#
Test 1 — Successful product delete:
http://localhost:5000/api/products/69c09ec02259995c462a474c
Returned: 200 - Product deleted!
#
Test 2 — Product not found:
http://localhost:5000/api/products/111111111111111111111111
Returned: 404 - No product found with this id!
#
Test 3 — Invalid format:
http://localhost:5000/api/products/banana
Returned: 400 - Invalid ID format
*/


// Route GET /api/products - Get all products with filtering, sorting, and pagination
router.get('/', async (req, res) => {

    try {
         const { category, minPrice, maxPrice, sortBy, page, limit } = req.query;

         //1)----- FILTERING ------
         const filter = {};
        if (category) filter.category = category;
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = parseFloat(minPrice);
            if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
        }

         // 2) ------ SORTING ----------
          const sort = {};
          if (sortBy === 'price_asc') sort.price = 1;   // ascending
          if (sortBy === 'price_desc') sort.price = -1; // descending

          // 3) --- PAGINATION ---
          const pageNum = parseInt(page) || 1;
          const limitNum = parseInt(limit) || 10;
          const skip = (pageNum - 1) * limitNum;
          const products = await Product.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(limitNum);
        
        res.status(200).json(products);
  
    } catch(err){
         res.status(500).json({ message: err.message });
    }
})

/*
Testing parameters:
Method: GET - filtering, sorting, and pagination
Body: raw > JSON
#
Test 1 — Get ALL products (no filters):
http://localhost:5000/api/products
Returns: all 5 products
200 - OK
#
Test 2 — Filter by category:
http://localhost:5000/api/products?category=Electronics
Returns: 2 products (Wireless Headphones and Smart Watch)
200 - OK
#
Test 3 — Filter by price range:
http://localhost:5000/api/products?minPrice=50&maxPrice=150
Returns: 2 products (Wireless Headphones and Running Shoes)
200 - OK
#
Test 4 — Sort price ascending:
http://localhost:5000/api/products?sortBy=price_asc
Returns: Yoga Mat(29.99) > Coffee Maker(49.99) > Running Shoes(79.99) > Headphones(99.99) > Smart Watch(199.99)
200 - OK
#
Test 5 — Sort price descending:
http://localhost:5000/api/products?sortBy=price_desc
Returns: Smart Watch(199.99) > Headphones(99.99) > Running Shoes(79.99) > Coffee Maker(49.99) > Yoga Mat(29.99)
200 - OK
#
Test 6 — Pagination:
http://localhost:5000/api/products?page=1&limit=2
Returns: first 2 of 5 totals products only
200 - OK
#
Test 7 — Combine everything:
http://localhost:5000/api/products?category=Electronics&sortBy=price_asc&page=1&limit=2

*/


// Ib)
module.exports = router; // exports router so 'server.js' can use it




///////////////////////////////////////////////////////////////////////////////////////////////////////////


/* An attempt at task 5 - it fetch all products but without any filtering, sorting, and pagination
// Route GET /api/products/ - fetch ALL products
router.get('/', async (req, res) => { // creates a GET route...
  //const allProducts = await Product.find()
  //console.log('Found product:', allProducts )
  try{      //...while gracefully handling errors...
     const allProducts = await Product.find(); //...where IF it 'finds' the 'Product' MODEL successfully..
      if (!allProducts) {      //...BUT NOT one product is valid/found..
            return res.status(404).json({ message: 'Products not found' }); //...it returns a 404 error code (404 = 'Products not found') 
        }
        res.status(200).json(allProducts); //...ELSE IF products valid/found, it returns a 200 code (200 = OK) and lists ALL products found in the DB!!
    } catch{                         
        //res.status(400).json({ message: err.message });
        res.status(400).json({ message: 'Invalid Request' })  //...ELSE returns a 400 error code (400 = 'Invalid Request') 

  }
})
*/
