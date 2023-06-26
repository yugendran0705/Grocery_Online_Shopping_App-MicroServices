const ProductModel = require('../models/Product');
const { DefinedError } = require('../../utils/error-handler');

class ProductRepository {
    createProduct = async ({ name, desc, banner, type, unit, price, available, suplier }) => {
        try {
            const product_check = await ProductModel.findOne({ name: name });
            if (product_check) {
                throw new DefinedError("Product already exists", 409)
            }
            else {
                const product = await ProductModel.create({ name, desc, banner, type, unit, price, available, suplier });
                return product;
            }
        }
        catch (err) {
            if (err instanceof DefinedError) {
                throw err;
            }
            else {
                throw new DefinedError("Error creating product", 500)
            }
        }
    }

    products = async () => {
        try {
            const products = await ProductModel.find({});
            return products;
        }
        catch (err) {
            throw new DefinedError("Error finding products", 500)
        }
    }

    FindById = async (_id) => {
        try {
            const product = await ProductModel.findById(_id);
            if (!product) {
                throw new DefinedError("Product not found", 404)
            }
            else {
                return product;
            }
        }
        catch (err) {
            if (err instanceof DefinedError) {
                throw err;
            }
            else {
                throw new DefinedError("Error finding product", 500)
            }
        }
    }

    FindByCatogery = async (type) => {
        try {
            const product = await ProductModel.find({ type: type });
            if (!product) {
                throw new DefinedError("Product not found", 404)
            }
            else {
                return product;
            }
        }
        catch (err) {
            if (err instanceof DefinedError) {
                throw err;
            }
            else {
                throw new DefinedError("Error finding product", 500)
            }
        }
    }

    FindSelected = async (selectedIds) => {
        try {
            const products = await ProductModel.find({ _id: { $in: selectedIds } });
            return products;
        }
        catch (err) {
            throw new DefinedError("Error finding products", 500)
        }
    }
}

module.exports = { ProductRepository }