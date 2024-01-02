import { userInfo } from "@/utils/FetchFromApi";
import { Session, User } from "@/utils/Interfaces";
import { currentSession } from "@/utils/Session";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchSession = createAsyncThunk('session', async (thunkApi) => {
    const session = await currentSession() as Session
    if (!session) return false
    return await userInfo(session?.user?.id)
})

const initialState = {
    session: [],
    loading: false
} as any

const sessionSlice = createSlice({
    name: 'session',
    initialState,
    reducers: {
        removeSession: (state, action) => {
            const sessionIdToRemove = action.payload;
            state.session = state.session.filter((session: User) => session.id !== sessionIdToRemove);
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchSession.fulfilled, (state, action) => {
            if (action.payload) state.session.push(action.payload as any)
        })
    }
})
export const { removeSession } = sessionSlice.actions;
export default sessionSlice.reducer