// Ia) Router setup:
const express = require('express'); // loads Express to your app after having been installed
const Product = require('../models/Product'); //'productSchema' having been converted from a schema into a model 'Product', now we import it, so that it can interact with DB
const router = express.Router();  // this creates a mini router object that holds all of the needed routes

// POST /api/products - to create a new product
router.post('/', async (req, res) => { 
    try{
        const product = await Product.create(req.body)
        res.status(201).json(product);
    } catch(err){
          //res.status(400).json(err);
          res.status(400).json({ message: err.message});
    }
})




    /*
// POST /api/notes - Create a new note
router.post('/', async (req, res) => {
  try {
    const note = await Note.create({
      ...req.body,
      // The user ID needs to be added here
    });
    res.status(201).json(note);
  } catch (err) {
    res.status(400).json(err);
  }
});

*/













// Ib)
module.exports = router; // exports router so 'server.js' can use it

/*
// Apply authMiddleware to all routes in this file
router.use(authMiddleware);
 
// GET /api/notes - Get all notes for the logged-in user
// THIS IS THE ROUTE THAT CURRENTLY HAS THE FLAW
router.get('/', async (req, res) => {
  // This currently finds all notes in the database.
  // It should only find notes owned by the logged in user.
  try {
    const notes = await Note.find({});
    res.json(notes);
  } catch (err) {
    res.status(500).json(err);
  }
});
 
// POST /api/notes - Create a new note
router.post('/', async (req, res) => {
  try {
    const note = await Note.create({
      ...req.body,
      // The user ID needs to be added here
    });
    res.status(201).json(note);
  } catch (err) {
    res.status(400).json(err);
  }
});
 
// PUT /api/notes/:id - Update a note
router.put('/:id', async (req, res) => {
  try {
    // This needs an authorization check
    const note = await Note.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!note) {
      return res.status(404).json({ message: 'No note found with this id!' });
    }
    res.json(note);
  } catch (err) {
    res.status(500).json(err);
  }
});
 
// DELETE /api/notes/:id - Delete a note
router.delete('/:id', async (req, res) => {
  try {
    // This needs an authorization check
    const note = await Note.findByIdAndDelete(req.params.id);
    if (!note) {
      return res.status(404).json({ message: 'No note found with this id!' });
    }
    res.json({ message: 'Note deleted!' });
  } catch (err) {
    res.status(500).json(err);
  }
});
 
export default router
*/


/*
Task 4: API Routes and Logic
In routes/productRoutes.js, use express.Router() to define your API endpoints. The logic for each route should be handled directly within the route file for this assessment.
Implement the following endpoints. All endpoints must handle potential errors with try...catch blocks and return appropriate status codes and JSON responses.
1.	POST /api/products (Create a Product)
o	Creates a new product based on the req.body.
o	Responds with the newly created product and a 201 status code.
o	If validation fails, it should return a 400 status code with a descriptive error message.

2.	GET /api/products/:id (Read a Single Product)
o	Retrieves a single product by its _id.
o	If the product is found, responds with the product object.
o	If no product is found, responds with a 404 status code.

3.	PUT /api/products/:id (Update a Product)
o	Updates a product by its _id with the data from req.body.
o	Responds with the updated product data (use the { new: true } option).
o	If no product is found to update, responds with a 404 status code.

4.	DELETE /api/products/:id (Delete a Product)
o	Deletes a product by its _id.
o	If successful, responds with a success message.
o	If no product is found to delete, responds with a 404 status code.

5.	GET /api/products (Read All Products with Advanced Querying)
o	This is the most complex endpoint. It should retrieve all products but also support the following optional query parameters: 
	category: Filter products by a specific category.
	minPrice: Filter products with a price greater than or equal to this value.
	maxPrice: Filter products with a price less than or equal to this value.
	sortBy: Sort results. For example, price_asc for ascending price or price_desc for descending price.
	page & limit: For pagination (defaulting to page 1, limit 10).
o	Dynamically build the Mongoose query based on which query parameters are provided.
o	Respond with an array of the resulting products.


*/