/**
 *
 * ChallengeForm
 *
 */

import React, { memo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import history from 'utils/history';
import { sessionBeginSuccess } from './actions';
import { makeSelectIsAuth } from './selectors';

const Form = styled.form``;
const Label = styled.label`
  display: block;
  max-width: 480px;
  font-size: 15px;
  font-weight: 300;
  line-height: 17px;
  color: rgba(0, 0, 0, 0.87);
  margin-bottom: 0.75rem;
  font-family: Roboto-Light, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue';
`;
const Field = styled.input`
  text-align: center;
  font-size: 30px;
  outline: none;
  box-shadow: none;
  border-radius: 0;
  padding: 0;
  border-bottom: 1px solid #a6a9ae;
  border-left: none;
  border-right: none;
  border-top: none;
  display: block;
  width: 100%;
  height: calc(1.5em + 0.75rem + 2px);
  font-weight: 400;
  line-height: 1.5;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  font-family: Roboto-Light, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue';
`;
const Error = styled.div`
  height: 1.2rem;
  padding: 0;
  margin: 0;
  font-size: 12px;
  color: #ff586b;
`;
const Button = styled.a`
  display: block;
  margin: 1rem 0;
  background-color: #572a59;
  color: #fff;
  border-color: #572a59;
  cursor: pointer;
  border-radius: 30px;
  padding: 0.5rem 1rem;
  font-size: 1.25rem;
  line-height: 1.5;
  text-align: center;
  vertical-align: middle;
  user-select: none;
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,
    border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
`;
const Timer = styled.div`
  display: flex;
  justify-content: center;
  text-align: center;
  padding: 10px 0;
`;
const Resend = styled.a`
  text-align: center;
  padding-top: 5px;
  display: block;
  cursor: pointer;
  font-size: 1rem;
  text-decoration: none;
  color: #572a59 !important;
  border-bottom: 1px solid #572a59;
  margin-right: auto;
  margin-left: auto;
  margin-bottom: 10px;
  width: 150px;
`;

const Time = styled.div`
  margin-left: 5px;
`;

function ChallengeForm({ submit }) {
  const { register, handleSubmit, errors } = useForm();
  const [time, setTime] = useState(120);
  const dispatch = useDispatch();
  const isAuth = useSelector(makeSelectIsAuth());

  useEffect(() => {
    const timerID = setTimeout(setMinutes, 1000);
    if (time === 0) {
      clearTimeout(timerID);
    }
  }, [time]);

  useEffect(() => {
    if (isAuth) {
      history.push('/');
    }
  }, [isAuth]);

  function setMinutes() {
    setTime(time - 1);
  }

  function setResend() {
    dispatch(sessionBeginSuccess());
    setTime(120);
  }

  return (
    <Form onSubmit={handleSubmit(submit)}>
      <Label for="code">
        Enter a one-time verification code that we have sent to your mobile:
      </Label>
      <Field
        type="text"
        name="code"
        placeholder="one-time code"
        ref={register({ required: true })}
      />
      <Error>{errors && errors.code && 'Code is required!'}</Error>
      <Button onClick={handleSubmit(submit)}>Send</Button>
      {time === 0 ? (
        <Resend onClick={setResend}>Click here to resend.</Resend>
      ) : (
        <Timer>
          Click here to resend in<Time>{Math.floor(time / 60)} : </Time>
          <Time>{Math.floor(time / 2)}</Time>
        </Timer>
      )}
    </Form>
  );
}

ChallengeForm.propTypes = {
  submit: PropTypes.func.isRequired,
};

export default memo(ChallengeForm);
