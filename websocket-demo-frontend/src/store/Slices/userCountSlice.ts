import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "../store.ts";

interface userCountState {
    userCount: number;
}

const initialState: userCountState = {
    userCount: 0,
};

export const userCountSlice = createSlice({
    name: 'userCount',
    initialState,
    reducers: {
        setUserCount: (state, action: PayloadAction<number>) => {
            state.userCount = action.payload;
        },
    },
});

export const {setUserCount} = userCountSlice.actions;
export default userCountSlice.reducer;
export const selectUserCount = (state: RootState) => state.userCount.userCount;