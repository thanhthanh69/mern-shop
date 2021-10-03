const Products = require("../models/products.model");
class ProductController {
  async createProduct(req, res) {
    try {
      const { title, price, description, content, images, category } = req.body;
      if (!images) return res.status(400).json({ msg: "No image upload" });
      const product = await Products.findOne({ content });
      if (product)
        return res.status(400).json({ msg: "this product already exists" });
      const newProduct = new Products({
        title: title.toLowerCase(),
        price,
        description,
        content,
        images,
        category,
      });
      console.log(newProduct);
      newProduct.save();

      return res.json({ newProduct, msg: "created product" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  }
  async getProducts(req, res) {
    try {
      const { _limit, _page, _content_like } = req.query;
      const startIndex = (_page - 1) * _limit;
      const endIndex = _page * _limit;
      const products = await Products.find();

      let filterProduct = [...products];
      let totalRows = filterProduct.length;
      if (_content_like) {
        filterProduct = filterProduct.filter((product) => {
          return (
            product.content
              .toLowerCase()
              .indexOf(_content_like.toLowerCase()) !== -1
          );
        });
        totalRows = filterProduct.length;
      }
      if (_limit || _page) {
        filterProduct = filterProduct.slice(startIndex, endIndex);
      }
      res.json({
        products: filterProduct,
        pagination: {
          _limit: Number(_limit),
          _page: Number(_page),
          _totalRows: Number(totalRows),
        },
      });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  }

  async updateProduct(req, res) {
    console.log(req.params.id);
    console.log(req.body.images);
    try {
      const { title, price, description, content, images, category } = req.body;
      if (!images) return res.status(400).json({ msg: "No image upload" });

      await Products.findOneAndUpdate(
        { _id: req.params.id },
        {
          title: title.toLowerCase(),
          price,
          description,
          content,
          images,
          category,
        }
      );
      res.json({ msg: "updated a product" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  }

  async deleteProduct(req, res) {
    try {
      await Products.findByIdAndDelete(req.params.id);
      res.json({ msg: "deleted a products" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  }
}

module.exports = new ProductController();
