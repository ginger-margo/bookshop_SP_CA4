// Factory Pattern: create a book object from raw input
export function createBook({ title, author, price, isbn, category }) {
    return {
      title,
      author,
      price: parseFloat(price),
      isbn,
      category,
      createdAt: new Date(),
    };
  }
  