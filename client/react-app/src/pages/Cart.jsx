import { Add, Remove } from '@material-ui/icons';
import styled from 'styled-components';

import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { mobile } from '../responsive';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useMemo } from 'react';
import { updateCartItem, order } from '../redux/apiRequest';
import { loginSuccess } from '../redux/authSlice';
import { createAxios } from '../././createInstance';

import Select from 'react-select';
import countryList from 'react-select-country-list';
import Modal from 'react-modal';

const customStyles = {
  content: {
    width: '500px',
    height: '400px',
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    backgroundColor: 'rgb(226, 233, 238)',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};
const Container = styled.div``;

const Wrapper = styled.div`
  padding: 20px;
  ${mobile({ padding: '10px' })}
`;

const Title = styled.h1`
  font-weight: 300;
  text-align: center;
`;

const Top = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
`;

const TopButton = styled.button`
  padding: 10px;
  font-weight: 600;
  cursor: pointer;
  border: ${(props) => props.type === 'filled' && 'none'};
  background-color: ${(props) =>
    props.type === 'filled' ? 'black' : 'transparent'};
  color: ${(props) => props.type === 'filled' && 'white'};
`;

// const TopTexts = styled.div`
//   ${mobile({ display: 'none' })}
// `;
// const TopText = styled.span`
//   text-decoration: underline;
//   cursor: pointer;
//   margin: 0px 10px;
// `;

const Bottom = styled.div`
  display: flex;
  justify-content: space-between;
  ${mobile({ flexDirection: 'column' })}
`;

const Info = styled.div`
  flex: 3;
`;

const Product = styled.div`
  display: flex;
  position: relative;
  justify-content: space-between;
  ${mobile({ flexDirection: 'column' })}
`;

const ProductDetail = styled.div`
  flex: 2;
  display: flex;
`;

const Image = styled.img`
  width: 200px;
`;

const Details = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
`;

const ProductName = styled.span``;

const ProductId = styled.span``;

const ProductColor = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: ${(props) => props.color};
`;

const ProductSize = styled.span``;

const PriceDetail = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const ProductAmountContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const ProductAmount = styled.div`
  font-size: 24px;
  margin: 5px;
  ${mobile({ margin: '5px 15px' })}
`;
const Close = styled.div`
  font-size: 35px;

  position: absolute;
  right: 5%;
  font-weight: bold;
  ${mobile({ margin: '5px 15px' })}
`;

const ProductPrice = styled.div`
  font-size: 30px;
  font-weight: 200;
  ${mobile({ marginBottom: '20px' })}
`;

const Hr = styled.hr`
  background-color: #eee;
  border: none;
  height: 1px;
`;

const Summary = styled.div`
  flex: 1;
  border: 0.5px solid lightgray;
  border-radius: 10px;
  padding: 20px;
  height: 50vh;
`;

const SummaryTitle = styled.h1`
  font-weight: 200;
`;

const SummaryItem = styled.div`
  margin: 30px 0px;
  display: flex;
  justify-content: space-between;
  font-weight: ${(props) => props.type === 'total' && '500'};
  font-size: ${(props) => props.type === 'total' && '24px'};
`;

const SummaryItemText = styled.span``;

const SummaryItemPrice = styled.span``;

const Button = styled.button`
  width: 100%;
  padding: 10px;
  background-color: black;
  color: white;
  font-weight: 600;
`;
const WrapperForm = styled.div`
  width: 100%;
  height: 100%;
  ${mobile({ width: '75%' })}
`;
const Form = styled.form`
  display: flex;
  flex-wrap: wrap;
  padding: 20px;
`;

const Input = styled.input`
  width: 100%;
  height: 20px;
  border: 1px black solid;
  margin: 20px 10px 0px 0px;
  padding: 10px;

  align-items: center;
  background-color: hsl(0, 0%, 100%);
  border-color: hsl(0, 0%, 80%);
  border-radius: 4px;
  border-style: solid;
  border-width: 1px;
`;

const Cart = () => {
  const accessToken = useSelector(
    (state) => state.auth.login.currentUser?.accesstoken
  );
  const user = useSelector((state) => state.auth.login?.currentUser);
  const cart = useSelector((state) => state.auth.login.currentUser?.cart);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  let axiosJWT = createAxios(user, dispatch, loginSuccess);
  useEffect(() => {
    if (!accessToken) navigate('/login');
  }, [accessToken, navigate]);

  const handleQuantity = (type, _id, size) => {
    const data = { _id, type, size };
    updateCartItem(data, accessToken, dispatch, axiosJWT);
  };

  const [modalIsOpen, setIsOpen] = useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }
  const handleCheckout = () => {
    setIsOpen(true);
  };
  const [value, setValue] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const options = useMemo(() => countryList().getData(), []);
  const changeHandler = (value) => {
    setValue(value);
  };
  const handleOrder = (e) => {
    e.preventDefault();
    const data = { fullName, email, phone, value, address, detail: cart };
    order(data, accessToken, axiosJWT, navigate);
  };

  return (
    <Container>
      <Navbar />
      <Wrapper>
        <Title>YOUR BAG</Title>

        <Top>
          <TopButton
            onClick={() => {
              navigate('/products');
            }}
          >
            CONTINUE SHOPPING
          </TopButton>
        </Top>
        <Bottom>
          <Info>
            {cart &&
              cart.products.map((item, index) => (
                <div key={index}>
                  <Product>
                    <Close
                      onClick={() =>
                        handleQuantity('delete', item._id, item.size)
                      }
                      className="cursor-pointer"
                    >
                      ×
                    </Close>
                    <ProductDetail>
                      <Image src={item.img} />
                      <Details>
                        <ProductName>
                          <b>Product:</b> {item.title}
                        </ProductName>
                        <ProductId>
                          <b>ID:</b> {item._id}
                        </ProductId>
                        <ProductColor color={item.color[0]} />
                        <ProductSize>
                          <b>Size:</b> {item.size}
                        </ProductSize>
                      </Details>
                    </ProductDetail>
                    <PriceDetail>
                      <ProductAmountContainer>
                        <Remove
                          className="cursor-pointer"
                          onClick={() =>
                            handleQuantity('dec', item._id, item.size)
                          }
                        />
                        <ProductAmount>{item.quantity}</ProductAmount>

                        <Add
                          className="cursor-pointer"
                          onClick={() =>
                            handleQuantity('inc', item._id, item.size)
                          }
                        />
                      </ProductAmountContainer>
                      <ProductPrice>$ {item.price}</ProductPrice>
                    </PriceDetail>
                  </Product>
                  <Hr />
                </div>
              ))}
          </Info>
          <Summary>
            <SummaryTitle>ORDER SUMMARY</SummaryTitle>
            <SummaryItem>
              <SummaryItemText>Subtotal</SummaryItemText>
              <SummaryItemPrice>$ {cart && cart.total}</SummaryItemPrice>
            </SummaryItem>
            <SummaryItem>
              <SummaryItemText>Estimated Shipping</SummaryItemText>
              <SummaryItemPrice>$ 5.90</SummaryItemPrice>
            </SummaryItem>
            <SummaryItem>
              <SummaryItemText>Shipping Discount</SummaryItemText>
              <SummaryItemPrice>$ -5.90</SummaryItemPrice>
            </SummaryItem>
            <SummaryItem type="total">
              <SummaryItemText>Total</SummaryItemText>
              <SummaryItemPrice>$ {cart && cart.total}</SummaryItemPrice>
            </SummaryItem>
            {cart.products.length > 0 && (
              <Button className="cursor-pointer" onClick={handleCheckout}>
                CHECKOUT NOW
              </Button>
            )}
          </Summary>
        </Bottom>
      </Wrapper>
      <Footer />
      <div>
        <button onClick={openModal}>Open Modal</button>
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          style={customStyles}
          ariaHideApp={false}
        >
          <WrapperForm>
            <Form onSubmit={handleOrder}>
              <Input
                onChange={(e) => setFullName(e.target.value)}
                required
                placeholder="full name"
              />
              <Input
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="email"
              />
              <Input
                onChange={(e) => setPhone(e.target.value)}
                type="number"
                required
                placeholder="phone"
              />
              <Select
                className="input-cus"
                options={options}
                value={value}
                onChange={changeHandler}
              />
              <Input
                onChange={(e) => setAddress(e.target.value)}
                required
                placeholder="address"
              />
              <Button className="btn-form" type="submit">
                ORDER
              </Button>
            </Form>
          </WrapperForm>
        </Modal>
      </div>
    </Container>
  );
};

export default Cart;
