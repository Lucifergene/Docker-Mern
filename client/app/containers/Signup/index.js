/*
 *
 * Signup
 *
 */

import React from 'react';
import { connect } from 'react-redux';

import { Row, Col } from 'reactstrap';
import { Redirect } from 'react-router-dom';

import actions from '../../actions';
import Input from '../../components/Input';
import LoadingIndicator from '../../components/LoadingIndicator';
import SignupProvider from '../../components/SignupProvider';
import Checkbox from '../../components/Checkbox';

class Signup extends React.PureComponent {
  render() {
    const {
      authenticated,
      signupFormData,
      isLoading,
      isSubscribed,
      signupChange,
      signUp,
      subscribeChange
    } = this.props;

    if (authenticated) return <Redirect to='/dashboard' />;

    return (
      <div className='signup-form'>
        {isLoading && (
          <div>
            <LoadingIndicator />
            <div className='popup-background' />
          </div>
        )}
        <h1>SignUp</h1>
        <hr />
        <Row>
          <Col xs='12' md='6' className='col-no-padding'>
            <Col xs='12' md='12'>
              <Input
                type={'text'}
                label={'Email Address'}
                name={'email'}
                placeholder={'Please Enter Your Email'}
                value={signupFormData.email}
                onInputChange={(name, value) => {
                  signupChange(name, value);
                }}
              />
            </Col>
            <Col xs='12' md='12'>
              <Input
                type={'text'}
                label={'First Name'}
                name={'firstName'}
                placeholder={'Please Enter Your First Name'}
                value={signupFormData.firstName}
                onInputChange={(name, value) => {
                  signupChange(name, value);
                }}
              />
            </Col>
            <Col xs='12' md='12'>
              <Input
                type={'text'}
                label={'Last Name'}
                name={'lastName'}
                placeholder={'Please Enter Your Last Name'}
                value={signupFormData.lastName}
                onInputChange={(name, value) => {
                  signupChange(name, value);
                }}
              />
            </Col>
            <Col xs='12' md='12'>
              <Input
                type={'password'}
                label={'Password'}
                name={'password'}
                placeholder={'Please Enter Your Password'}
                value={signupFormData.password}
                onInputChange={(name, value) => {
                  signupChange(name, value);
                }}
              />
            </Col>
          </Col>
          <Col xs='12' md='6'>
            <SignupProvider />
          </Col>
        </Row>
        <hr />
        <Checkbox
          id={'subscribe'}
          label={'Subscribe to newsletter'}
          checked={isSubscribed}
          toggleCheckboxChange={subscribeChange}
        />
        <div className='login-actions'>
          <button className='input-btn' type='submit' onClick={() => signUp()}>
            Sign Up
          </button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    authenticated: state.authentication.authenticated,
    signupFormData: state.signup.signupFormData,
    isLoading: state.signup.isLoading,
    isSubscribed: state.signup.isSubscribed
  };
};

export default connect(mapStateToProps, actions)(Signup);
