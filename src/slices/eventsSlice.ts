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
        updateEvent: (state, action) => {
            const eventIdToUpdate = action.payload.id;
            const updatedEvent = action.payload.updatedEvent;

            // Find the index of the event with the specified id
            const eventIndex = state.events[0].findIndex(
                (event: EventsInterface) => event._id === eventIdToUpdate
            );

            // check if the id is available or not 
            if (eventIndex !== -1) {
                // If the event is found delete
                state.events[0].splice(eventIndex, 1);
                if (updatedEvent !== null) {
                    state.events[0] = [...state.events[0], updatedEvent];
                }
            }
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchEvents.fulfilled, (state, action) => {
            if (action.payload) state.events.push(action.payload as any)
        })
    }
});

export const { updateEvent } = eventsSlice.actions;

export default eventsSlice.reducer