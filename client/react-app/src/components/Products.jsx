import styled from 'styled-components';

import Product from './ProductItem';
import { useQuery } from 'react-query';
import { getData } from '../api/apiProduct';
import { useState, useEffect } from 'react';
const Container = styled.div`
  padding: 20px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`;

const Products = ({ home, queryKey, filters, sort }) => {
  const { data, isFetching, error, isPreviousData } = useQuery({
    queryKey,
    queryFn: getData,
    keepPreviousData: true,
  });

  const [product, setProduct] = useState([]);
  useEffect(() => {
    data && setProduct(data);
  }, [data]);

  const [filteredProducts, setFilteredProducts] = useState([]);
  useEffect(() => {
    !home &&
      setFilteredProducts(
        product.filter((item) =>
          Object.entries(filters).every(([key, value]) =>
            item[key].includes(value)
          )
        )
      );
  }, [product, home, filters]);
  useEffect(() => {
    if (sort === 'newest') {
      setFilteredProducts((prev) =>
        [...prev].sort((a, b) => a.createdAt - b.createdAt)
      );
    } else if (sort === 'asc') {
      setFilteredProducts((prev) =>
        [...prev].sort((a, b) => a.price - b.price)
      );
    } else {
      setFilteredProducts((prev) =>
        [...prev].sort((a, b) => b.price - a.price)
      );
    }
  }, [sort]);

  return (
    <Container>
      {home && product.map((item) => <Product item={item} key={item._id} />)}
      {!home &&
        filteredProducts.map((item) => <Product item={item} key={item._id} />)}

      {isPreviousData && isFetching && (
        <p style={{ textAlign: 'center' }}>Loading...</p>
      )}

      {error && <p style={{ textAlign: 'center' }}>{error.message}</p>}
    </Container>
  );
};

export default Products;
