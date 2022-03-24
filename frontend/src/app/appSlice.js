import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import baseUrl from '../utils/baseUrl';

export const fetchCategories = createAsyncThunk(
    'app/fetchCategories',
    async () => {
        let categories = await fetch(`${baseUrl}/api/categories`);
        categories = await categories.json();
        return categories;
    }
)

const appSlice = createSlice({
    name: 'app',
    initialState: {
        user: {},
        categories: {}
    },
    reducers: {
        login: (state, action) => {
            state.user = action.payload;
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
        }
    }
})

export const { login } = appSlice.actions;
export const selectCategories = state => state.app.categories;
export const selectUser = state => state.app.user;
export default appSlice.reducer;