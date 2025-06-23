import { configureStore } from "@reduxjs/toolkit";
import reducer from "./authSlice";
const store  = configureStore({
    reducer: {
        reducer
    }
});

export default store;