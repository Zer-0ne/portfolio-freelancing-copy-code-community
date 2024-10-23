import { getLatestSha, getMaterialsFromGithub, TreeNode } from '@/utils/FetchFromApi';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Define the state interface
export interface MaterialsState {
    materials: TreeNode[];
    currentTree: TreeNode | null | undefined; 
    loading: boolean;
    error: any;
}


// Define the initial state
const initialState: MaterialsState = {
    materials: [] as TreeNode[],
    currentTree: null,
    loading: false,
    error: null as any,
};

// Async thunk to fetch top-level materials
export const fetchTopLevelMaterials = createAsyncThunk(
    'materials/fetchTopLevelMaterials',
    async () => {
        const sha = await getLatestSha('copycodecommunity', 'portfolio');
        if (sha) {
            const topLevelMaterials = await getMaterialsFromGithub(sha);
            return topLevelMaterials ? topLevelMaterials.children : [];
        }
        throw new Error('Failed to fetch top-level materials');
    }
);

// Async thunk to fetch material tree
export const fetchMaterialTree = createAsyncThunk(
    'materials/fetchMaterialTree',
    async (sha: string) => {
        const tree = await getMaterialsFromGithub(sha as string);
        return tree;
    }
);

// Create the slice
const materialsSlice = createSlice({
    name: 'materials',
    initialState,
    reducers: {
        clearCurrentTree: (state) => {
            state.currentTree = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTopLevelMaterials.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTopLevelMaterials.fulfilled, (state: MaterialsState, action) => {
                state.loading = false;
                state.materials = action.payload as TreeNode[];
            })
            .addCase(fetchTopLevelMaterials.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(fetchMaterialTree.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMaterialTree.fulfilled, (state: MaterialsState, action) => {
                state.loading = false;
                state.currentTree = action.payload;
            })
            .addCase(fetchMaterialTree.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

// Export actions and reducer
export const { clearCurrentTree } = materialsSlice.actions;
export default materialsSlice.reducer;