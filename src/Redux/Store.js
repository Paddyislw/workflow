import { configureStore } from "@reduxjs/toolkit";
import { workFlowSlice } from "./WorkFlowSlice";

export const store = configureStore({
    reducer: workFlowSlice.reducer
})