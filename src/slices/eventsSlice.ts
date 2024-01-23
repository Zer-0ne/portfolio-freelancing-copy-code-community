import { BlogsInterface, EventsInterface } from "@/utils/Interfaces";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchEvents = createAsyncThunk('events', async (thunkApi) => {
    try {
        const { allPost } = await import('@/utils/FetchFromApi')
        return await allPost('event') as BlogsInterface[] | EventsInterface
    } catch (error) {
        console.log(error)
    }
})

const initialState = {
    events: [],
    loading: false
} as any

const eventsSlice = createSlice({
    name: 'events',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder.addCase(fetchEvents.fulfilled, (state, action) => {
            if (action.payload) state.events.push(action.payload as any)
        })
    }
})

export default eventsSlice.reducer