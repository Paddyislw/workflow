import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchModules = createAsyncThunk(
  "workflow/fetchModules",
  async () => {
    const response = await fetch(
      "https://64307b10d4518cfb0e50e555.mockapi.io/modules?page=1&limit=5"
    );
    const data = response.json();
    return data;
  }
);

export const fetchWorkflow = createAsyncThunk(
  "workflow/fetchWorkflow",
  async (arg) => {
    const response = await fetch(
      `https://64307b10d4518cfb0e50e555.mockapi.io/workflow/${arg}`
    );
    const data = response.json();
    return data;
  }
);

export const fetchList = createAsyncThunk("workflow/fetchList", async () => {
  const response = await fetch(
    "https://64307b10d4518cfb0e50e555.mockapi.io/workflow"
  );
  const data = response.json();
  return data;
});

export const workFlowSlice = createSlice({
  name: "workflow",
  initialState: {
    module: { data: [], loading: false, fetched: false, error: false },
    workFlow: { data: [], fetched: false, loading: false, error: false },
    list: { data: [], loading: false, fetched: false, error: false },
  },
  extraReducers: {
    // pending
    [fetchModules.pending]: (state, action) => {
      state.module.loading = true;
      state.module.fetched = false;
      state.module.error = false;
    },
    [fetchWorkflow.pending]: (state, action) => {
      state.workFlow.fetched = false;
      state.workFlow.loading = true;
      state.workFlow.error = false;
    },
    [fetchList.pending]: (state, action) => {
      state.list.loading = true;
      state.list.fetched = false;
      state.list.error = false;
    },

    //fulfulled
    [fetchModules.fulfilled]: (state, action) => {
      state.module.loading = false;
      state.module.fetched = true;
      state.module.error = false;
      state.module.data = action.payload;
    },
    [fetchWorkflow.fulfilled]: (state, action) => {
      state.workFlow.fetched = true;
      state.workFlow.loading = false;
      state.workFlow.error = false;
      state.workFlow.data = action.payload;
    },
    [fetchList.fulfilled]: (state, action) => {
      state.list.loading = false;
      state.list.fetched = true;
      state.list.error = false;
      state.list.data = action.payload;
    },

    //rejected
    [fetchModules.rejected]: (state, action) => {
      state.module.loading = false;
      state.module.error = true;
    },
    [fetchWorkflow.rejected]: (state, action) => {
      state.workFlow.fetched = false;
      state.workFlow.error = true;
    },
    [fetchList.rejected]: (state, action) => {
      state.list.loading = false;
      state.list.error = true;
    },
  },
});

export const selectList = (state) => state.list;
export const selectWorkflow = (state) => state.workFlow;
export const selectModules = (state) => state.module;
