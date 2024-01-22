import { createSlice } from "@reduxjs/toolkit";

const kitchenItemSlice = createSlice(
    {
        name: 'kitchenItems',
        initialState: null,
        reducers:{
            addItems: (state, action) => {
                return action.payload;
            },
            removeItems: (state, action) => {
                return null;
            }
        }
    }
)

export const { addItems, removeItems } = kitchenItemSlice.actions;

export default kitchenItemSlice.reducer;