import { combineReducers } from 'redux';
import Lodash from 'lodash';
import cart, * as fromCart from './cart';

export default combineReducers({
    cart,
});

const getQuantities = state => fromCart.getQuantities(state.cart);
const getItems = state => fromCart.getItems(state.cart);
const getQuantityById = (state, id) => fromCart.getQuantityById(state.cart, id);

export const getCount = state => Lodash.sum(Lodash.values(getQuantities(state)));

export const getSubtotal = state => getItems(state)
    .reduce((total, item) => total + item.price * getQuantityById(state, item._id), 0).toFixed(2);