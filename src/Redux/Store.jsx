import { configureStore } from "@reduxjs/toolkit";
import kanbanSlice from "./Slice"
import { theme } from "antd";
export const store = configureStore({
    reducer:{
        kanban : kanbanSlice,
    }
})