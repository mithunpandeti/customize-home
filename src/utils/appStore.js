import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import peopleReducer from "./peopleSlice";
import kitchenItemReducer from "./kitchenItemSlice";
import washItemReducer from "./washItemSlice";


const appStore = configureStore(
    {
        reducer: {
            user: userReducer,
            people: peopleReducer,
            kitchenItems: kitchenItemReducer,
            washItems: washItemReducer
        },
        devTools: process.env.NODE_ENV !== 'production',
    }
)

export default appStore;