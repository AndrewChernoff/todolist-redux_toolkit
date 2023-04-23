import {clearData, thunkTodolists} from './todolists-reducer'
import {ResultCode, TaskPriorities, TaskStatuses, TaskType, todolistsAPI, UpdateTaskModelType} from '../../api/todolists-api'
import {setStatus} from '../../app/app-reducer'
import {handleServerAppError, handleServerNetworkError} from '../../utils/error-utils'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { createAppAsyncThunk } from '../../utils/createAppAsyncThunk'
import { authThunk } from '../Login/auth-reducer'
import { thunkTryCatch } from '../../utils/thunk-try-catch'

export type AddTaskArgType = {title: string, todolistId: string}

const initialState: TasksStateType = {}

export const fetchTasks = createAppAsyncThunk<{tasks: TaskType[] , todolistId: string}, string>(
    'tasks/fetchTasksByIdStatus',
    async (todolistId, thunkAPI) => {
        const {dispatch, rejectWithValue} = thunkAPI
        try {
        thunkAPI.dispatch(setStatus({status: 'loading'}))
        const res = await todolistsAPI.getTasks(todolistId)
        const tasks = res.data.items
        dispatch(setStatus({status: 'succeeded'}))
        return {tasks, todolistId}
    } catch (error) {
        handleServerNetworkError(error, dispatch)
        return rejectWithValue(null)
    }
      }
  )

const addTask = createAppAsyncThunk<{task: TaskType}, AddTaskArgType>(
    'tasks/addTask',
    async ({title, todolistId}, thunkAPI) => {
        const {dispatch, rejectWithValue} = thunkAPI
        return thunkTryCatch(thunkAPI, async() => {
          try {
            dispatch(setStatus({status: 'loading'}))
            const res = await todolistsAPI.createTask(todolistId, title)        
        if(res.data.resultCode === ResultCode.success) {
            const task = res.data.data.item
            dispatch(setStatus({status: 'succeeded'}))
            return {task}
    } else {
        handleServerAppError(res.data, dispatch)
        return rejectWithValue(null)
    }
    } catch (error) {
        handleServerNetworkError(error, dispatch)
        return rejectWithValue(null)
    }
        })
     }
  )

export type UpdateTaskType = {taskId: string, domainModel: UpdateDomainTaskModelType, todolistId: string} 

const updateTask = createAppAsyncThunk<UpdateTaskType, UpdateTaskType>(
    'tasks/updateTask', async (arg, thunkAPI) => {
        const {dispatch, getState, rejectWithValue} = thunkAPI
        const state = getState()
        const task = state.tasks[arg.todolistId].find((t: { id: string }) => t.id === arg.taskId)
        if (!task) {
            console.warn('task not found in the state')
            return rejectWithValue(null)
        }

        const apiModel: UpdateTaskModelType = {
            deadline: task.deadline,
            description: task.description,
            priority: task.priority,
            startDate: task.startDate,
            title: task.title,
            status: task.status,
            ...arg.domainModel
        }
        dispatch(setStatus({status: 'loading'}))

          return thunkTryCatch(thunkAPI, async() => {
            const res = await todolistsAPI.updateTask(arg.todolistId, arg.taskId, apiModel)
            
            if (res.data.resultCode === ResultCode.success) {
              dispatch(setStatus({status: 'succeeded'}))  
              return arg

            } else {
                dispatch(setStatus({status: 'succeeded'}))
                handleServerAppError(res.data, dispatch);
                return rejectWithValue(null)
            }
          })
      }
    )

    const removeTask = createAppAsyncThunk<{taskId: string, todolistId: string}, {taskId: string, todolistId: string}>(
      'tasks/removeTask',
      async ({taskId, todolistId}, thunkAPI) => {
          const {dispatch, rejectWithValue} = thunkAPI
          return thunkTryCatch(thunkAPI, async() => {
            dispatch(setStatus({status: 'loading'}))
              const res = await todolistsAPI.deleteTask(todolistId, taskId)        
          if(res.data.resultCode === ResultCode.success) {
              dispatch(setStatus({status: 'succeeded'}))
              return {taskId, todolistId}
          } else {
          handleServerAppError(res.data, dispatch)
          return rejectWithValue(null)
            }
          })
         }
    )

const slice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
      setTasks(state, action: PayloadAction<{tasks: Array<TaskType>, todolistId: string}>) {
        state[action.payload.todolistId] = action.payload.tasks 
    },
    },
      extraReducers: (builder) => {
        builder
          .addCase(thunkTodolists.fetchTodolists.fulfilled, (state, action) => {
            return action.payload.todolists.forEach((tl: { id: string | number }) => {
                state[tl.id] = []
            })
          })
          .addCase(thunkTodolists.removeTodolist.fulfilled, (state, action) => {
            delete state[action.payload.id]
            return state
          })
          .addCase(
            thunkTodolists.addTodolist.fulfilled,
            (state, action) => {
                state[action.payload.todolist.id] = []

            }
          )
          .addCase(clearData, (state) => {
            return state = {}
          })
          .addCase(fetchTasks.fulfilled, (state, action) => {
            state[action.payload.todolistId] = action.payload.tasks
          })
          .addCase(addTask.fulfilled, (state, action) => {
            state[action.payload.task.todoListId].unshift(action.payload.task)
          })
          .addCase(updateTask.fulfilled, (state, action) => {
            const tasks = state[action.payload.todolistId]
            const index = tasks.findIndex(task => task.id === action.payload.taskId)
            if (index !== -1) tasks[index] = {...tasks[index], ...action.payload.domainModel}
        })
        .addCase(removeTask.fulfilled, (state, action) => {
          const task = state[action.payload.todolistId]
            const index = task.findIndex(task => task.id === action.payload.taskId)
            if (index !== -1) task.splice(index, 1)
        })
        .addCase(authThunk.logout.fulfilled, () => {
            return {}
        })///;ll;
          .addDefaultCase((state) => {
            return state
          })

      },
  })

  export const tasksReducer = slice.reducer;
  export const {setTasks} = slice.actions
  export const taskThunks = {fetchTasks, addTask, updateTask, removeTask}

// types
export type UpdateDomainTaskModelType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}
export type TasksStateType = {
    [key: string]: Array<TaskType>
}