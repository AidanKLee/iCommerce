import { createAsyncThunk, createSlice, current } from "@reduxjs/toolkit";
import api from "../utils/api";
import baseUrl from '../utils/baseUrl';

const { customer: c } = api;

export const fetchCategories = createAsyncThunk(
    'app/fetchCategories',
    async () => {
        let categories = await fetch(`${baseUrl}/api/categories`);
        categories = await categories.json();
        return categories;
    }
)

export const saveItem = createAsyncThunk(
    'app/saveItem',
    async({customerId, itemId: item_id, login}) => {
        if (customerId) {
            await c.saveItem(customerId, item_id, login);
        }
        return {item_id};
    }
)

export const addToBag = createAsyncThunk(
    'app/addToBag',
    async({customerId, bagId, itemId: item_id, quantity, login}, {getState}) => {
        let prevQuantity = getState().app.user.cart.items.filter(item => {
            return item_id === item.item_id
        })
        prevQuantity = prevQuantity.length > 0 ? prevQuantity[0].item_quantity : 0;
        if (customerId && bagId) {
            await c.addItemToBag(customerId, bagId, item_id, quantity, login);
        }
        return {item_id, item_quantity: Number(quantity) + Number(prevQuantity)};
    }
)

export const updateItemBagQuantity = createAsyncThunk(
    'app/updateItemBagQuantity',
    async({customerId, bagId, itemId: item_id, quantity}) => {
        if (customerId && bagId) {
            await c.updateItemBagQuantity(customerId, bagId, item_id, quantity);
        }
        return {item_id, item_quantity: Number(quantity)}
    }
)

export const deleteFromBag = createAsyncThunk(
    'app/deleteFromBag',
    async({customerId, bagId, itemId: item_id}) => {
        if (customerId && bagId) {
            c.deleteItemFromBag(customerId, bagId, item_id)
        }
        return item_id;
    }
)

const appSlice = createSlice({
    name: 'app',
    initialState: {
        user: {
            cart: {
                items: [],
                pending: false,
                fulfilled: false,
                rejected: false
            },
            pending: true,
            saved: [],
            savedStatus: {
                pending: false,
                fulfilled: false,
                rejected: false
            }
        },
        categories: {}
    },
    reducers: {
        login: (state, action) => {
            state.user = {...action.payload, savedStatus: {}};
        },
        setSavedItems: (state, action) => {
            state.user.saved = action.payload;
        },
        setBagItems: (state, action) => {
            state.user.cart.items = action.payload;
        }
    },
    extraReducers: {
        [fetchCategories.pending]: (state) => {
            state.categories.pending = true;
            state.categories.fulfilled = false;
            state.categories.rejected = false;
        },
        [fetchCategories.fulfilled]: (state, action) => {
            state.categories.pending = false;
            state.categories.fulfilled = true;
            state.categories.rejected = false;
            state.categories.data = action.payload;
        },
        [fetchCategories.rejected]: (state) => {
            state.categories.pending = false;
            state.categories.fulfilled = false;
            state.categories.rejected = true;
        },

        [addToBag.pending]: (state) => {
            state.user.cart.pending = true;
            state.user.cart.fulfilled = false;
            state.user.cart.rejected = false;
            state.user.cart.message = 'Adding Item To Shopping Bag';
        },
        [addToBag.fulfilled]: (state, action) => {
            state.user.cart.pending = false;
            state.user.cart.fulfilled = true;
            state.user.cart.rejected = false;
            state.user.cart.message = 'Item Added To Shopping Bag';
            const cart = current(state.user.cart);
            const itemInBag = cart.items.filter(item => {
                return item.item_id === action.payload.item_id;
            }).length > 0;
            if (itemInBag) {
                state.user.cart.items = cart.items.map(item => {
                    if (item.item_id === action.payload.item_id) {
                        return action.payload;
                    }
                    return item;
                })
            } else {
                state.user.cart.items = [...cart.items, action.payload];
            }
        },
        [addToBag.rejected]: (state) => {
            state.user.cart.pending = false;
            state.user.cart.fulfilled = false;
            state.user.cart.rejected = true;
            state.user.cart.message = 'Error Adding Item To Shopping Bag';
        },

        [updateItemBagQuantity.pending]: (state) => {
            state.user.cart.pending = true;
            state.user.cart.fulfilled = false;
            state.user.cart.rejected = false;
            state.user.cart.message = 'Updating Item Quantity';
        },
        [updateItemBagQuantity.fulfilled]: (state, action) => {
            state.user.cart.pending = false;
            state.user.cart.fulfilled = true;
            state.user.cart.rejected = false;
            state.user.cart.message = 'Quantity Updated';
            const cart = current(state.user.cart);
            state.user.cart.items = cart.items.map(item => {
                if (item.item_id === action.payload.item_id) {
                    return action.payload;
                }
                return item;
            })
        },
        [updateItemBagQuantity.rejected]: (state) => {
            state.user.cart.pending = false;
            state.user.cart.fulfilled = false;
            state.user.cart.rejected = true;
            state.user.cart.message = 'Error Updating Quantity';
        },

        [deleteFromBag.pending]: (state) => {
            state.user.cart.pending = true;
            state.user.cart.fulfilled = false;
            state.user.cart.rejected = false;
            state.user.cart.message = 'Deleting Item From Shopping Bag';
        },
        [deleteFromBag.fulfilled]: (state, action) => {
            state.user.cart.pending = false;
            state.user.cart.fulfilled = true;
            state.user.cart.rejected = false;
            state.user.cart.message = 'Item Removed From Shopping Bag';
            const cart = current(state.user.cart);
            state.user.cart.items = cart.items.filter(item => {
                return item.item_id !== action.payload;
            })
        },
        [deleteFromBag.rejected]: (state) => {
            state.user.cart.pending = false;
            state.user.cart.fulfilled = false;
            state.user.cart.rejected = true;
            state.user.cart.message = 'Error Deleting Item From Shopping Bag';
        },

        [saveItem.pending]: (state) => {
            state.user.savedStatus.pending = true;
            state.user.savedStatus.fulfilled = false;
            state.user.savedStatus.rejected = false;
            state.user.savedStatus.message = 'Updating Saved Items';
        },
        [saveItem.fulfilled]: (state, action) => {
            state.user.savedStatus.pending = false;
            state.user.savedStatus.fulfilled = true;
            state.user.savedStatus.rejected = false;
            const saved = current(state.user.saved);
            const itemInSaved = saved.filter(item => {
                return item.item_id === action.payload.item_id;
            }).length > 0;
            if (itemInSaved) {
                state.user.savedStatus.message = 'Removed From Saved Items';
                state.user.saved = saved.filter(item => {
                    return item.item_id !== action.payload.item_id; 
                })
            } else {
                state.user.savedStatus.message = 'Item Saved';
                state.user.saved = [...saved, action.payload];
            }
        },
        [saveItem.rejected]: (state) => {
            state.user.savedStatus.pending = false;
            state.user.savedStatus.fulfilled = false;
            state.user.savedStatus.rejected = true;
            state.user.savedStatus.message = "Error Couldn't Save Item";
        }
    }
})

export const { login, setSavedItems, setBagItems } = appSlice.actions;
export const selectCategories = state => state.app.categories;
export const selectUser = state => state.app.user;
export default appSlice.reducer;