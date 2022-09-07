import styled from 'styled-components';
import { mobile } from '../responsive';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { loginUser } from '../redux/apiRequest';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
const Container = styled.div`
  width: 100vw;
  height: 100vh;
  background: linear-gradient(
      rgba(255, 255, 255, 0.5),
      rgba(255, 255, 255, 0.5)
    ),
    url('https://images.pexels.com/photos/6984650/pexels-photo-6984650.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940')
      center;
  background-size: cover;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Wrapper = styled.div`
  width: 25%;
  padding: 20px;
  background-color: white;
  ${mobile({ width: '75%' })}
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 300;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  flex: 1;
  min-width: 40%;
  margin: 10px 0;
  padding: 10px;
`;

const Button = styled.button`
  width: 40%;
  border: none;
  padding: 15px 20px;
  background-color: teal;
  color: white;
  cursor: pointer;
  margin-bottom: 10px;
`;

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { email: username, password };
    loginUser(data, dispatch, navigate);
  };

  const error = useSelector((state) => state.auth.login.error);
  const user = useSelector((state) => state.auth.login.currentUser);

  useEffect(() => {
    if (user) navigate('/');
  }, [user, navigate]);
  return (
    <Container>
      <Wrapper>
        <Title>SIGN IN</Title>
        {error && <span className="msg-err">{error}</span>}
        <Form onSubmit={handleSubmit}>
          <Input
            onChange={(e) => setUsername(e.target.value)}
            placeholder="username"
          />
          <Input
            type="password"
            autocomplete
            onChange={(e) => setPassword(e.target.value)}
            placeholder="password"
          />
          <Button type="submit">LOGIN</Button>

          <Link className="link" to="/register">
            CREATE A NEW ACCOUNT
          </Link>
        </Form>
      </Wrapper>
    </Container>
  );
};

export default Login;
