import { configureStore } from "@reduxjs/toolkit";
import sessionReducer from '@/slices/sessionSlice'

export const makeStore = () => {
    return configureStore({
        reducer: {
            session: sessionReducer
        }
    })
}

export const store = makeStore()

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch