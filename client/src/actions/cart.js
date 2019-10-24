import {
    ADD_ITEM,
    REMOVE_ITEM,
    DELETE_ITEM,
    CLEAR_CART
} from './types';

export const addItem = (item, quantity) => dispatch => {
    dispatch({
        type: ADD_ITEM,
        payload: item,
        quantity: quantity
    });
}

export const removeItem = (item) => dispatch => {
    dispatch({
        type: REMOVE_ITEM,
        payload: item
    });
}

export const deleteItem = (item) => dispatch => {
    dispatch({
        type: DELETE_ITEM,
        payload: item
    });
}

export const clearCart = () => dispatch => {
    dispatch({
        type: CLEAR_CART
    });
}