import { configureStore } from "@reduxjs/toolkit";
import kanbanSlice from "./Slice"
export const store = configureStore({
    reducer:{
        kanban : kanbanSlice
    }
})