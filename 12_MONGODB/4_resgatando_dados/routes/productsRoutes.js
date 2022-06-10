const express = require('express')
const router = express.Router()

const ProductController = require('../controllers/ProductController')

router.get('/', ProductController.showProducts)
router.post('/products/create', ProductController.createProductPost)
router.get('/create', ProductController.createProduct)

module.exports = router