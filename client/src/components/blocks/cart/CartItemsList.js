import React, { Component } from 'react';
// Redux
import { connect } from 'react-redux';
import { getCount, getSubtotal } from '../../../reducers/index';
import { clearCart } from '../../../actions/cart';
// Packages
import { Link } from 'react-router-dom';
// Material-UI
import Button from '@material-ui/core/Button';
// Components
import CartItem from './CartItem';
// Utils
import { convertAndFormat } from '../../../utils/Pricing';

class CartItemsList extends Component {
    render() {
        const { count, subtotal } = this.props;
        const { items, storeName, storeCurrency, buyerCurrency } = this.props.cart;
        const isEmpty = (items.length > 0) ? false : true;
        const formattedSubtotal = convertAndFormat(parseFloat(subtotal), storeCurrency, buyerCurrency);
        const formattedOriginalSubtotal = convertAndFormat(parseFloat(subtotal), storeCurrency, storeCurrency);

        return (
            <div className="basics">
                <div className="bar-top">
                    <div style={{ marginRight: 'auto' }}>
                        <Button
                            onClick={this.props.clearCart}
                            disabled={isEmpty}
                            variant="outlined"
                            color="default"
                        >
                            Clear
                        </Button>
                    </div>
                    <div>
                        {count} {(count === 1) ? 'item' : 'items'}
                    </div>
                    {
                        ((count > 0) && (storeName !== null)) && <div className="storeName">{storeName}</div>
                    }
                </div>
                {
                    isEmpty ?
                        <div className="empty-cart">
                            <div>Empty cart</div>
                            <div style={{ marginTop: 20 }}>
                                <Link to="/shop" style={{ textDecoration: 'none' }}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                    >
                                        Shop Here
                                    </Button>
                                </Link>
                            </div>
                        </div> :
                        <div className="items">
                            <div style={{ flex: '25%', marginRight: '6px' }}>
                                {
                                    items.map((item, index) => {
                                        if (index % 3 === 0) {
                                            return <CartItem key={index} data={item} />
                                        }
                                        else return null;
                                    })
                                }
                            </div>
                            <div style={{ flex: '25%', marginRight: '6px' }}>
                                {
                                    items.map((item, index) => {
                                        if ((index - 1) % 3 === 0) {
                                            return <CartItem key={index} data={item} />
                                        }
                                        else return null;
                                    })
                                }
                            </div>
                            <div style={{ flex: '25%' }}>
                                {
                                    items.map((item, index) => {
                                        if ((index - 2) % 3 === 0) {
                                            return <CartItem key={index} data={item} />
                                        }
                                        else return null;
                                    })
                                }
                            </div>
                        </div>
                }
                <div className="bar-bottom">
                    <div>
                        <b>Subtotal: {formattedSubtotal}</b>
                        {
                            (!isEmpty && (storeCurrency !== buyerCurrency)) &&
                            <div className="original-price">({formattedOriginalSubtotal})</div>
                        }
                    </div>
                    <div style={{ marginLeft: 'auto' }}>
                        <Button
                            onClick={() => this.props.handleSubmit(null, 2)}
                            disabled={isEmpty}
                            variant="contained"
                            color="primary"
                        >
                            Next
                        </Button>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    cart: state.cart,
    count: getCount(state),
    subtotal: getSubtotal(state),
});

export default connect(mapStateToProps, { clearCart })(CartItemsList);