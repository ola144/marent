import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { ITask } from "../car/carType";
import {
  addTask,
  deleteTask,
  getAllTasks,
  updateTaskStatus,
} from "./taskService";

interface TaskState {
  tasks: Array<ITask>;
  loading: boolean;
  error: null;
}

const initialState: TaskState = {
  tasks: [],
  loading: false,
  error: null,
};

export const createTask = createAsyncThunk(
  "task/create",
  async (taskData: ITask) => {
    return addTask(taskData);
  },
);

export const editTaskStatus = createAsyncThunk(
  "task/update",
  async ({ status, id }: { status: boolean; id?: string }) => {
    return updateTaskStatus(status, id);
  },
);

export const removeTask = createAsyncThunk(
  "task/delete",
  async (id: string) => {
    return deleteTask(id);
  },
);

export const fetchAllTasks = createAsyncThunk("task/fecth", async () => {
  return getAllTasks();
});

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(createTask.pending, (state) => {
        state.loading = true;
      })
      .addCase(createTask.rejected, (state) => {
        state.loading = false;
        state.tasks = [];
      })
      .addCase(createTask.fulfilled, (state) => {
        state.loading = false;
      })

      .addCase(editTaskStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(editTaskStatus.rejected, (state) => {
        state.loading = false;
      })
      .addCase(editTaskStatus.fulfilled, (state) => {
        state.loading = false;
      })

      .addCase(removeTask.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeTask.rejected, (state) => {
        state.loading = false;
      })
      .addCase(removeTask.fulfilled, (state) => {
        state.loading = false;
      })

      .addCase(fetchAllTasks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllTasks.rejected, (state) => {
        state.loading = false;
        state.tasks = [];
      })
      .addCase(fetchAllTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
        console.log(state.tasks);
      });
  },
});

export default taskSlice.reducer;
