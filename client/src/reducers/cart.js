import {
    ADD_ITEM,
    REMOVE_ITEM,
    DELETE_ITEM,
    CLEAR_CART
} from '../actions/types';

const initialState = {
    items: [],
    quantityById: {},
    store: null,
    storeName: null,
    storeCurrency: null,
    buyerCurrency: 'USD'
};

const items = (state = initialState.items, action) => {
    switch (action.type) {
        case ADD_ITEM:
            const existItem = state.find(item => item._id === action.payload._id);
            if (existItem) {
                return state;
            };
            return [...state, action.payload];
        case REMOVE_ITEM:
            return state;
        case DELETE_ITEM:
            return state.filter(item => item._id !== action.payload._id);
        default:
            return state;
    }
};

const quantityById = (state = initialState.quantityById, action) => {
    switch (action.type) {
        case ADD_ITEM:
            return {
                ...state,
                [action.payload._id]: (state[action.payload._id] || 0) + action.quantity
            };
        case REMOVE_ITEM:
            return {
                ...state,
                [action.payload._id]: state[action.payload._id] - 1
            };
        case DELETE_ITEM:
            const quantityById = Object.assign({}, state);
            delete quantityById[action.payload._id];
            return quantityById;
        default:
            return state;
    }
};

export const getQuantities = state => state.quantityById;

export const getQuantityById = (state, id) => state.quantityById[id] || 0;

export const getItems = state => state.items;

const cart = (state = initialState, action) => {
    switch (action.type) {
        case ADD_ITEM:
            return {
                ...state,
                items: items(state.items, action),
                quantityById: quantityById(state.quantityById, action),
                store: action.payload.storeId,
                storeName: action.payload.storeName,
                storeCurrency: action.payload.storeCurrency,
            };
        case REMOVE_ITEM:
            return {
                ...state,
                items: items(state.items, action),
                quantityById: quantityById(state.quantityById, action),
            };
        case DELETE_ITEM:
            const isLast = state.items.length === 1 ? true : false;
            return {
                ...state,
                items: items(state.items, action),
                quantityById: quantityById(state.quantityById, action),
                store: isLast ? null : state.store,
                storeName: isLast ? null : state.storeName,
                storeCurrency: isLast ? null : state.storeCurrency,
            };
        case CLEAR_CART:
            return initialState;
        default:
            return state;
    }
};

export default cart;