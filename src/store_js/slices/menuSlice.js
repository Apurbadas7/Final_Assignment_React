import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isDashboardDrawerOpened: true, // Initial state for the drawer
    openedItem: ['dashboard'],    // Initial opened menu item
};

const menuSlice = createSlice({
    name: 'menu',
    initialState,
    reducers: {
        handlerDrawerOpen(state, action) {
            state.isDashboardDrawerOpened = action.payload;
        },
        handlerActiveItem(state, action) {
            state.openedItem = action.payload;
        },
    },
});

export const { handlerDrawerOpen, handlerActiveItem } = menuSlice.actions;
export default menuSlice.reducer;
