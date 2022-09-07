import { Add, Remove } from '@material-ui/icons';
import styled from 'styled-components';

import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

import { mobile } from '../responsive';
import { useLocation } from 'react-router-dom';
import { useQuery } from 'react-query';
import { getData } from '../api/apiProduct';
import { useState } from 'react';
import { addCartUser } from '../redux/apiRequest';
import { loginSuccess } from '../redux/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { createAxios } from '../././createInstance';

const Container = styled.div``;

const Wrapper = styled.div`
  padding: 50px;
  display: flex;
  ${mobile({ padding: '10px', flexDirection: 'column' })}
`;

const ImgContainer = styled.div`
  flex: 1;
`;

const Image = styled.img`
  width: 100%;
  height: 90vh;
  object-fit: cover;
  ${mobile({ height: '40vh' })}
`;

const InfoContainer = styled.div`
  flex: 1;
  padding: 0px 50px;
  ${mobile({ padding: '10px' })}
`;

const Title = styled.h1`
  font-weight: 200;
`;

const Desc = styled.p`
  margin: 20px 0px;
`;

const Price = styled.span`
  font-weight: 100;
  font-size: 40px;
`;

const FilterContainer = styled.div`
  width: 50%;
  margin: 30px 0px;
  display: flex;
  justify-content: space-between;
  ${mobile({ width: '100%' })}
`;

const Filter = styled.div`
  display: flex;
  align-items: center;
`;

const FilterTitle = styled.span`
  font-size: 20px;
  font-weight: 200;
`;

const FilterColor = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: ${(props) => props.color};
  margin: 0px 5px;
  cursor: pointer;
`;

const FilterSize = styled.select`
  margin-left: 10px;
  padding: 5px;
`;

const FilterSizeOption = styled.option``;

const AddContainer = styled.div`
  width: 50%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  ${mobile({ width: '100%' })}
`;

const AmountContainer = styled.div`
  display: flex;
  align-items: center;
  font-weight: 700;
`;

const Amount = styled.span`
  width: 30px;
  height: 30px;
  border-radius: 10px;
  border: 1px solid teal;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0px 5px;
`;

const Button = styled.button`
  padding: 15px;
  border: 2px solid teal;
  background-color: white;
  cursor: pointer;
  font-weight: 500;

  &:hover {
    background-color: #f8f4f4;
  }
`;

const Product = () => {
  const id = useLocation().pathname.slice(9);
  const queryKey = `/product/${id}`;
  const { data, isFetching, error, isPreviousData } = useQuery({
    queryKey,
    queryFn: getData,
    keepPreviousData: true,
  });
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState('L');

  const navigation = useNavigate();
  const dispatch = useDispatch();

  const accessToken = useSelector(
    (state) => state.auth.login.currentUser?.accesstoken
  );
  const user = useSelector((state) => state.auth.login?.currentUser);

  const handleQuantity = (type) => {
    if (type === 'dec') {
      quantity > 1 && setQuantity(quantity - 1);
    } else {
      setQuantity(quantity + 1);
    }
  };
  let axiosJWT = createAxios(user, dispatch, loginSuccess);

  const handleAddCart = async () => {
    if (!accessToken) navigation('/login');
    else {
      const cartItem = { ...data, quantity, size };
      addCartUser(cartItem, accessToken, dispatch, axiosJWT);
    }
  };

  return (
    <Container>
      <Navbar />

      {data && (
        <Wrapper>
          <ImgContainer>
            <Image src={data.img} />
          </ImgContainer>
          <InfoContainer>
            <Title>{data.title}</Title>
            <Desc>{data.desc}</Desc>
            <Price>$ {data.price}</Price>
            <FilterContainer>
              <Filter>
                <FilterTitle>Color</FilterTitle>
                {data.color.map((item, index) => (
                  <FilterColor key={index} color={item} />
                ))}
              </Filter>
              <Filter>
                <FilterTitle>Size</FilterTitle>
                <FilterSize onChange={(e) => setSize(e.target.value)}>
                  {data.size.map((item, index) => (
                    <FilterSizeOption value={item} key={index}>
                      {item}
                    </FilterSizeOption>
                  ))}
                </FilterSize>
              </Filter>
            </FilterContainer>
            <AddContainer>
              <AmountContainer>
                <Remove
                  onClick={() => handleQuantity('dec')}
                  className="cursor-pointer"
                />
                <Amount>{quantity}</Amount>
                <Add
                  onClick={() => handleQuantity('inc')}
                  className="cursor-pointer"
                />
              </AmountContainer>
              <Button onClick={handleAddCart}>ADD TO CART</Button>
            </AddContainer>
          </InfoContainer>
        </Wrapper>
      )}

      {isPreviousData && isFetching && (
        <p style={{ textAlign: 'center' }}>Loading...</p>
      )}

      {error && <p style={{ textAlign: 'center' }}>{error.message}</p>}

      <Footer />
    </Container>
  );
};

export default Product;
