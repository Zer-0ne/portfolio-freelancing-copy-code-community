import { BlogsInterface, EventsInterface } from "@/utils/Interfaces";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchEvents = createAsyncThunk('events/fetchEvents', async (thunkApi) => {
    try {
        const { allPost } = await import('@/utils/FetchFromApi');
        return await allPost('event') as EventsInterface[];
    } catch (error) {
        console.log(error);
        // return
        // return thunkApi.rejectWithValue(error); // Reject with error
    }
});

const initialState = {
    events: [] as EventsInterface[],
    loading: false,
    error: null, // Optional: to store error messages
};

const eventsSlice = createSlice({
    name: 'events',
    initialState,
    reducers: {
        updateEvent: (state, action) => {
            const eventIdToUpdate = action.payload.id;
            const updatedEvent = action.payload.updatedEvent;

            // Find the index of the event with the specified id
            const eventIndex = state.events.findIndex(
                (event: EventsInterface) => event._id === eventIdToUpdate
            );

            // Check if the id is available or not 
            if (eventIndex !== -1) {
                // If the event is found, delete it
                state.events.splice(eventIndex, 1);
                if (updatedEvent !== null) {
                    state.events.push(updatedEvent as EventsInterface);
                }
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchEvents.pending, (state) => {
                state.loading = true; // Set loading to true when fetching starts
                state.error = null; // Reset error state
            })
            .addCase(fetchEvents.fulfilled, (state, action) => {
                state.loading = false; // Set loading to false when fetching is successful
                if (action.payload) {
                    state.events = action.payload; // Update events with fetched data
                }
            })
            .addCase(fetchEvents.rejected, (state, action) => {
                state.loading = false; // Set loading to false when fetching fails
                state.error = action.payload as any; // Store the error message
            });
    }
});

export const { updateEvent } = eventsSlice.actions;

export default eventsSlice.reducer;
