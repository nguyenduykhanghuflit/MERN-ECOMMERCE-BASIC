import { useState } from 'react';
import styled from 'styled-components';
import { registerUser } from '../redux/apiRequest';
import { mobile } from '../responsive';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  background: linear-gradient(
      rgba(255, 255, 255, 0.5),
      rgba(255, 255, 255, 0.5)
    ),
    url('https://images.pexels.com/photos/6984661/pexels-photo-6984661.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940')
      center;
  background-size: cover;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Wrapper = styled.div`
  width: 40%;
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
  flex-wrap: wrap;
`;

const Input = styled.input`
  flex: 1;
  min-width: 40%;
  margin: 20px 10px 0px 0px;
  padding: 10px;
`;

const Agreement = styled.span`
  font-size: 12px;
  margin: 20px 0px;
`;

const Button = styled.button`
  width: 40%;
  border: none;
  padding: 15px 20px;
  background-color: teal;
  color: white;
  cursor: pointer;
`;

const Register = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigation = useNavigate();
  const error = useSelector((state) => state.auth.login.error);
  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { name: fullName, email, password };
    registerUser(data, dispatch, navigation);
  };
  return (
    <Container>
      <Wrapper>
        <Title>CREATE AN ACCOUNT</Title>
        {error && <span className="msg-err">{error}</span>}
        <Form onSubmit={handleSubmit}>
          <div className="form-group">
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
            <Input type="number" placeholder="phone" />
            <Input
              onChange={(e) => setPassword(e.target.value)}
              required
              type="password"
              autocomplete="off"
              placeholder="password"
            />
          </div>
          <Agreement>
            By creating an account, I consent to the processing of my personal
            data in accordance with the <b>PRIVACY POLICY</b>
          </Agreement>
          <Button type="submit">CREATE</Button>
        </Form>
      </Wrapper>
    </Container>
  );
};

export default Register;
