import Card from '../../components/card/card';
import { getProducts } from '../../api/Products/productService';

interface Product {
  BidItemID: number;
  ItemName: string;
  CurrentPrice: number;
  ImageURL: string;
}

interface ProductPageProps {
  products: Product[];
}

// Use an async function inside the component
const ProductPage = async () => {
  const products = await getProducts(3); // Fetching for customer roleId 3

  return (
    <div className="grid grid-cols-3 gap-6">
      {products.map((product: Product) => (
        <Card
          key={product.BidItemID}
          image={product.ImageURL}
          itemName={product.ItemName}
          currentPrice={product.CurrentPrice}
        />
      ))}
    </div>
  );
};

export default ProductPage;
