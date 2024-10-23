import { configureStore } from "@reduxjs/toolkit";
import sessionReducer from '@/slices/sessionSlice'
import blogsSlice from "@/slices/blogsSlice";
import eventsSlice from "@/slices/eventsSlice";
import materialSlice from "@/slices/materialSlice";

export const makeStore = () => {
    return configureStore({
        reducer: {
            session: sessionReducer,
            blogs: blogsSlice,
            events: eventsSlice,
            materials: materialSlice,
        }
    })
}

export const store = makeStore()

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch