import { createAsyncThunk, createSlice, current } from "@reduxjs/toolkit";
import api from "../utils/api";
import baseUrl from '../utils/baseUrl';

const { customer: c, products: p } = api;

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
    async({customerId, itemId, login}) => {
        if (customerId) {
            await c.saveItem(customerId, itemId, login);
        }
        const product = await p.getByItemId(itemId);
        return product;
    }
)

export const addToBag = createAsyncThunk(
    'app/addToBag',
    async({customerId, bagId, itemId, quantity, login}, {getState}) => {
        let prevQuantity = getState().app.user.cart.items.filter(item => {
            return itemId === item.selected_item_id
        })
        prevQuantity = prevQuantity.length > 0 ? prevQuantity[0].item_quantity : 0;
        if (customerId && bagId) {
            await c.addItemToBag(customerId, bagId, itemId, quantity, login);
        }
        const product = await p.getByItemId(itemId, bagId);
        if (customerId && bagId) {
            return product;
        }
        return {...product, item_quantity: quantity + prevQuantity};
    }
)

export const updateItemBagQuantity = createAsyncThunk(
    'app/updateItemBagQuantity',
    async({customerId, bagId, itemId, quantity}) => {
        if (customerId && bagId) {
            await c.updateItemBagQuantity(customerId, bagId, itemId, quantity);
        }
        return {selected_item_id: itemId, quantity: quantity}
    }
)

export const deleteFromBag = createAsyncThunk(
    'app/deleteFromBag',
    async({customerId, bagId, itemId}) => {
        if (customerId && bagId) {
            c.deleteItemFromBag(customerId, bagId, itemId)
        }
        return itemId;
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
                return item.selected_item_id === action.payload.selected_item_id;
            }).length > 0;
            if (itemInBag) {
                state.user.cart.items = cart.items.map(item => {
                    if (item.selected_item_id === action.payload.selected_item_id) {
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
                if (item.selected_item_id === action.payload.selected_item_id) {
                    return {...item, item_quantity: action.payload.quantity};
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
                return item.selected_item_id !== action.payload;
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
                return item.selected_item_id === action.payload.selected_item_id;
            }).length > 0;
            if (itemInSaved) {
                state.user.savedStatus.message = 'Removed From Saved Items';
                state.user.saved = saved.filter(item => {
                    return item.selected_item_id !== action.payload.selected_item_id; 
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