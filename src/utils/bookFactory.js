// Factory Pattern: create a book object from raw input
export function createBook({ title, author, price, isbn, category, stock = 0, imageUrl }) {
    return {
      title,
      author,
      price: parseFloat(price),
      isbn,
      category,
      stock: parseInt(stock),
      imageUrl,
      createdAt: new Date(),
    };
  }
  