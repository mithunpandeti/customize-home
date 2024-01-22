import { createSlice } from "@reduxjs/toolkit";

const peopleSlice = createSlice(
    {
        name: 'people',
        initialState: null,
        reducers:{
            updatePeople: (state, action) => {
                return action.payload;
            },
            removePeople: (state, action) => {
                return null;
            }
        }
    }
)

export const { updatePeople, removePeople } = peopleSlice.actions;

export default peopleSlice.reducer;