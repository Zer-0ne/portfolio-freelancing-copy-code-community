import { BlogsInterface } from "@/utils/Interfaces";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchBlogs = createAsyncThunk('blogs', async (thunkApi) => {
    try {
        const { allPost } = await import('@/utils/FetchFromApi')
        return await allPost('blog') as BlogsInterface[]
    } catch (error) {
        console.log(error)
    }
})

const initialState = {
    blogs: [],
    loading: false
} as any

const blogsSlice = createSlice({
    name: 'blogs',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder.addCase(fetchBlogs.fulfilled, (state, action) => {
            if (action.payload) state.blogs.push(action.payload as any)
        })
    }
})

export default blogsSlice.reducer