import { BlogsInterface } from "@/utils/Interfaces";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchBlogs = createAsyncThunk('blogs/fetchBlogs', async (thunkApi) => {
    try {
        const { allPost } = await import('@/utils/FetchFromApi');
        return await allPost('blog') as BlogsInterface[];
    } catch (error) {
        console.log(error);
        // return  // Reject with error
    }
});

const initialState = {
    blogs: [] as BlogsInterface[],
    loading: false,
    error: null, // Optional: to store error messages
};

const blogsSlice = createSlice({
    name: 'blogs',
    initialState,
    reducers: {
        updateBlog: (state, action) => {
            const blogIdToUpdate = action.payload.id;
            const updatedBlog = action.payload.updateBlog;

            // Find the index of the blog with the specified id
            const blogIndex = state.blogs.findIndex(
                (blog: BlogsInterface) => blog._id === blogIdToUpdate
            );

            // Check if the id is available or not 
            if (blogIndex !== -1) {
                // If the blog is found, delete it
                state.blogs.splice(blogIndex, 1);
                if (updatedBlog !== null) {
                    state.blogs.push(updatedBlog as BlogsInterface);
                }
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchBlogs.pending, (state) => {
                state.loading = true; // Set loading to true when fetching starts
                state.error = null; // Reset error state
            })
            .addCase(fetchBlogs.fulfilled, (state, action) => {
                state.loading = false; // Set loading to false when fetching is successful
                if (action.payload) {
                    state.blogs = action.payload; // Update blogs with fetched data
                }
            })
            .addCase(fetchBlogs.rejected, (state, action) => {
                state.loading = false; // Set loading to false when fetching fails
                state.error = action.payload as any; // Store the error message
            });
    }
});

export const { updateBlog } = blogsSlice.actions;

export default blogsSlice.reducer;
