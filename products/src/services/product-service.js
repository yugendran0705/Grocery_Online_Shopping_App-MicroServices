const { ProductRepository } = require('../database/repository/product-repository');
const { formatData } = require('../utils/index');
const { DefinedError } = require('../utils/error-handler');

class ProductService {
    constructor() {
        this.productRepository = new ProductRepository();
    }

    createProduct = async (productInputs) => {
        try {
            const product = await this.productRepository.createProduct(productInputs);
            return formatData(product);
        } catch (err) {
            if (err instanceof DefinedError) {
                throw err;
            } else {
                throw new DefinedError("Error creating product", 500);
            }
        }
    }

    getProducts = async () => {
        try {
            const products = await this.productRepository.products();
            return formatData(products);
        } catch (err) {
            if (err instanceof DefinedError) {
                throw err;
            } else {
                throw new DefinedError("Error getting products", 500);
            }
        }
    }

    getProductDescription = async (productId) => {
        try {
            const product = await this.productRepository.FindById(productId);
            return formatData(product);
        } catch (err) {
            if (err instanceof DefinedError) {
                throw err;
            } else {
                throw new DefinedError("Error getting product description", 500);
            }
        }
    }

    getProductByCategory = async (category) => {
        try {
            const product = await this.productRepository.FindByCatogery(category);
            return formatData({ product });
        } catch (err) {
            if (err instanceof DefinedError) {
                throw err;
            } else {
                throw new DefinedError("Error getting product by category", 500);
            }
        }
    }

    getSelectedProducts = async (productIds) => {
        try {
            const products = await this.productRepository.FindSelected(productIds);
            return formatData(products);
        }
        catch (err) {
            if (err instanceof DefinedError) {
                throw err;
            }
            else {
                throw new DefinedError("Error getting selected products", 500);
            }
        }
    }

    getProductById = async (productId) => {
        try {
            const product = await this.productRepository.FindById(productId);
            return formatData(product);
        }
        catch (err) {
            if (err instanceof DefinedError) {
                throw err;
            }
            else {
                throw new DefinedError("Error getting product by id", 500);
            }
        }
    }

    getProductPayload = async (_id, { productId, quantity }, event) => {
        try {
            const product = await this.productRepository.FindById(productId);
            if (product) {
                const payload = {
                    event: event,
                    data: {
                        _id,
                        product,
                        quantity
                    }
                }
                return formatData(payload);
            }
            else {
                throw new DefinedError("Product not found", 404);
            }
        }
        catch (err) {
            if (err instanceof DefinedError) {
                throw err;
            }
            else {
                throw new DefinedError("Error getting product payload", 500);
            }
        }
    }

}

module.exports = { ProductService } 