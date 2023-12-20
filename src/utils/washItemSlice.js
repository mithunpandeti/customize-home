import { createSlice } from "@reduxjs/toolkit";

const washItemSlice = createSlice(
    {
        name: 'washItems',
        initialState: null,
        reducers:{
            addWashItems: (state, action) => {
                return action.payload;
            },
            removeWashItems: (state, action) => {
                return null;
            }
        }
    }
)

export const { addWashItems, removeWashItems } = washItemSlice.actions;

export default washItemSlice.reducer;