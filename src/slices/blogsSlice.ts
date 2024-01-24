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
        updateBlog: (state, action) => {
            const blogIdToUpdate = action.payload.id;
            const updatedBlog = action.payload.updateBlog;

            // Find the index of the event with the specified id
            const blogIndex = state.events[0].findIndex(
                (event: BlogsInterface) => event._id === blogIdToUpdate
            );

            // check if the id is available or not 
            if (blogIndex !== -1) {
                // If the event is found delete
                state.events[0].splice(blogIndex, 1);
                if (updatedBlog !== null) {
                    state.events[0] = [...state.events[0], updatedBlog];
                }
            }
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchBlogs.fulfilled, (state, action) => {
            if (action.payload) state.blogs.push(action.payload as any)
        })
    }
})

export const { updateBlog } = blogsSlice.actions;

export default blogsSlice.reducer