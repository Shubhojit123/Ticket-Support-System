import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  value: "Kanban",
  dark:true
}

export const kanbanSlice = createSlice({
    name:'kanban',
    initialState,
    reducers:{
        change:(state,action)=>{
            state.value = action.payload;
        },
    

    }
})


export const {change} = kanbanSlice.actions;
export default kanbanSlice.reducer