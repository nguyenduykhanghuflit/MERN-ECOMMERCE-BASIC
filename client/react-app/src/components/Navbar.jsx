import { Badge } from '@material-ui/core';
import { Search, ShoppingCartOutlined } from '@material-ui/icons';
import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { mobile } from '../responsive';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../redux/apiRequest';
const Container = styled.div`
  height: 60px;
  ${mobile({ height: '50px' })}
`;

const Wrapper = styled.div`
  padding: 10px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  ${mobile({ padding: '10px 0px' })}
`;

const Left = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
`;

// const Language = styled.span`
//   font-size: 14px;
//   cursor: pointer;
//   ${mobile({ display: 'none' })}
// `;

const SearchContainer = styled.div`
  border: 0.5px solid lightgray;
  display: flex;
  align-items: center;
  margin-left: 25px;
  padding: 5px;
`;

const Input = styled.input`
  border: none;
  outline: none;
  overflow: hidden;
  ${mobile({ width: '50px' })}
`;

const Center = styled.div`
  flex: 1;
  text-align: center;
`;

const Logo = styled.h1`
  font-weight: bold;
  ${mobile({ fontSize: '24px' })}
`;
const Right = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  ${mobile({ flex: 2, justifyContent: 'center' })}
`;

const MenuItem = styled.div`
  font-size: 14px;
  cursor: pointer;
  font-weight: bold;
  margin-left: 20px;
  position: relative;

  ${mobile({ fontSize: '12px', marginLeft: '10px' })}
`;

const Navbar = () => {
  const dataUser = useSelector((state) => state.auth.login.currentUser);

  const cart = useSelector(
    (state) => state.auth.login.currentUser?.cart.quantity
  );

  const ref = useRef('');
  const navigation = useNavigate();
  const handleSearch = () => {
    const value = ref.current.value;
    if (value.trim()) navigation(`/products?search=${value}`);
  };
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      const value = ref.current.value;
      if (value.trim()) navigation(`/products?search=${value}`);
    }
  };
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogOut = () => {
    logoutUser(dispatch, navigate);
  };
  return (
    <Container>
      <Wrapper>
        <Left>
          <MenuItem>
            <Link className="hover-link" to="/">
              HOME
            </Link>
          </MenuItem>
          <MenuItem>
            <Link className="hover-link" to="/products">
              PRODUCT
            </Link>
          </MenuItem>
          <SearchContainer>
            <Input onKeyDown={handleKeyDown} ref={ref} placeholder="Search" />
            <Search
              onClick={handleSearch}
              style={{ cursor: 'pointer', color: 'gray', fontSize: 16 }}
            />
          </SearchContainer>
        </Left>
        <Center>
          <Logo>K-SHOP</Logo>
        </Center>
        <Right>
          {dataUser?.name ? (
            <>
              <MenuItem>
                <Link className="hover-link" to="/infor">
                  Hi, {dataUser.name}
                </Link>
              </MenuItem>
              <MenuItem>
                <span onClick={handleLogOut} className="hover-link">
                  LOGOUT
                </span>
              </MenuItem>
            </>
          ) : (
            <>
              <MenuItem>
                <Link className="hover-link" to="/register">
                  REGISTER
                </Link>
              </MenuItem>
              <MenuItem>
                <Link className="hover-link" to="/login">
                  LOGIN
                </Link>
              </MenuItem>
            </>
          )}

          <MenuItem>
            <Badge badgeContent={cart ? cart.toString() : '0'} color="primary">
              <Link to="/cart">
                <ShoppingCartOutlined className="hover-link"></ShoppingCartOutlined>
              </Link>
            </Badge>
          </MenuItem>
        </Right>
      </Wrapper>
    </Container>
  );
};

export default Navbar;
