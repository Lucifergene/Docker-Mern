/*
 *
 * OrderSuccess
 *
 */

import React from 'react';
import { connect } from 'react-redux';

import actions from '../../actions';

import SubPage from '../../components/SubPage';
import OrderList from '../../components/OrderList';

class OrderSuccess extends React.PureComponent {
  componentDidMount() {
    const id = this.props.match.params.id;
    this.props.fetchOrder(id);
  }

  render() {
    const { order } = this.props;

    return (
      <div className='order-success'>
        <div className='order-message'>
          <h2>Thank you for your order.</h2>
          <p>
            Order #<span className='order-id'>{order._id}</span> is complete.
          </p>
          <p>A confirmation email wil be sent to you shortly.</p>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    order: state.order.order
  };
};

export default connect(mapStateToProps, actions)(OrderSuccess);
