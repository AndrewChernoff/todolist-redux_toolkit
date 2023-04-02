import {AddTodolistActionType, RemoveTodolistActionType, SetTodolistsActionType, addTodolist, clearData, removeTodolist, setTodolists} from './todolists-reducer'
import {TaskPriorities, TaskStatuses, TaskType, todolistsAPI, UpdateTaskModelType} from '../../api/todolists-api'
import {Dispatch} from 'redux'
import {AppRootStateType, AppThunk} from '../../app/store'
import {setStatus} from '../../app/app-reducer'
import {handleServerAppError, handleServerNetworkError} from '../../utils/error-utils'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import produce from 'immer'

const initialState: TasksStateType = {}

/* export const tasksReducer = (state: TasksStateType = initialState, action: any): TasksStateType => {
    switch (action.type) {
        case 'REMOVE-TASK':
            return {...state, [action.todolistId]: state[action.todolistId].filter(t => t.id != action.taskId)}
        case 'ADD-TASK':
            return {...state, [action.task.todoListId]: [action.task, ...state[action.task.todoListId]]}
        case 'UPDATE-TASK':
            return {
                ...state,
                [action.todolistId]: state[action.todolistId]
                    .map(t => t.id === action.taskId ? {...t, ...action.model} : t)
            }
        case addTodolist.type:
            return {...state, [action.payload.todolist.id]: []}
        case  removeTodolist.name:
            const copyState = {...state}
            delete copyState[action.payload.id]
            return copyState
        case setTodolists.type: {
            const copyState = {...state}
            action.payload.todolists.forEach((tl: { id: string | number }) => {
                copyState[tl.id] = []
            })
            return copyState
        }
        case 'SET-TASKS':
            return {...state, [action.todolistId]: action.tasks}
        default:
            return state
    }
} */

const slice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        removeTask(state, action: PayloadAction<{taskId: string, todolistId: string}>) {
            const task = state[action.payload.todolistId]
            const index = task.findIndex(task => task.id === action.payload.taskId)
            if (index !== -1) task.splice(index, 1)
        },
      addTask(state, action: PayloadAction<{task: TaskType}>) {
        state[action.payload.task.todoListId].push(action.payload.task)
      },
      updateTask(state, action: PayloadAction<{taskId: string, model: UpdateDomainTaskModelType, todolistId: string}>) {
        const tasks = state[action.payload.todolistId]
        const index = tasks.findIndex(task => task.id === action.payload.taskId)
            if (index !== -1) tasks[index] = {...tasks[index], ...action.payload.model}
      },
      setTasks(state, action: PayloadAction<{tasks: Array<TaskType>, todolistId: string}>) {
        state[action.payload.todolistId] = action.payload.tasks 
    },
    },
    /* extraReducers: {
        [setTodolists.type]: (state, action) => {
            return action.payload.todolists.forEach((tl: { id: string | number }) => {
                state[tl.id] = []
            })
        },
        [removeTodolist.type]: (state, action) => {
            delete state[action.payload.id]
            return state
        },
        [addTodolist.type]: (state, action) => {
            state[action.payload.todolist.id] = []
        },
        [clearData.type]: (state) => {            
            return state = {}
        },
      }, */
      extraReducers: (builder) => {
        builder
          .addCase(setTodolists, (state, action) => {
            // action is inferred correctly here if using TS
            return action.payload.todolists.forEach((tl: { id: string | number }) => {
                state[tl.id] = []
            })
          })
          // You can chain calls, or have separate `builder.addCase()` lines each time
          .addCase(removeTodolist, (state, action) => {
            delete state[action.payload.id]
            return state
          })
          // You can match a range of action types
          .addCase(
            addTodolist,
            // `action` will be inferred as a RejectedAction due to isRejectedAction being defined as a type guard
            (state, action) => {
                state[action.payload.todolist.id] = []

            }
          )
          .addCase(clearData, (state) => {
            return state = {}
          })
          // and provide a default case if no other handlers matched
          .addDefaultCase((state) => {
            return state
          })
      },
  })

  export const tasksReducer = slice.reducer;
  const {removeTask, addTask, updateTask, setTasks} = slice.actions

// thunks
export const fetchTasksTC = (todolistId: string): AppThunk => (dispatch/* : Dispatch<ActionsType | SetAppStatusActionType> */) => {
    dispatch(setStatus({status: 'loading'}))
    todolistsAPI.getTasks(todolistId)
        .then((res) => {
            const tasks = res.data.items
            dispatch(setTasks({tasks, todolistId}))
            dispatch(setStatus({status: 'succeeded'}))
        })
}
export const removeTaskTC = (taskId: string, todolistId: string) => (dispatch: Dispatch/* <ActionsType> */) => {
    todolistsAPI.deleteTask(todolistId, taskId)
        .then(res => {
            const action = removeTask({taskId, todolistId})
            dispatch(action)
        })
}
export const addTaskTC = (title: string, todolistId: string): AppThunk => (dispatch/* : Dispatch<ActionsType | SetAppErrorActionType | SetAppStatusActionType> */) => {
    dispatch(setStatus({status: 'loading'}))
    todolistsAPI.createTask(todolistId, title)
        .then(res => {
            if (res.data.resultCode === 0) {
                const task = res.data.data.item
                const action = addTask({task})
                dispatch(action)
                dispatch(setStatus({status: 'succeeded'}))
            } else {
                handleServerAppError(res.data, dispatch);
            }
        })
        .catch((error) => {
            handleServerNetworkError(error, dispatch)
        })
}
export const updateTaskTC = (taskId: string, domainModel: UpdateDomainTaskModelType, todolistId: string) =>
    (dispatch: ThunkDispatch, getState: () => AppRootStateType) => {
        const state: any = getState()
        const task = state.tasks[todolistId].find((t: { id: string }) => t.id === taskId)
        if (!task) {
            //throw new Error("task not found in the state");
            console.warn('task not found in the state')
            return
        }

        const apiModel: UpdateTaskModelType = {
            deadline: task.deadline,
            description: task.description,
            priority: task.priority,
            startDate: task.startDate,
            title: task.title,
            status: task.status,
            ...domainModel
        }

        todolistsAPI.updateTask(todolistId, taskId, apiModel)
            .then(res => {
                if (res.data.resultCode === 0) {
                    const action = updateTask({taskId: taskId, model:domainModel, todolistId: todolistId})
                    dispatch(action)
                } else {
                    handleServerAppError(res.data, dispatch);
                }
            })
            .catch((error) => {
                handleServerNetworkError(error, dispatch);
            })
    }

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
type ThunkDispatch = Dispatch<any/* ActionsType | SetAppStatusActionType | SetAppErrorActionType */>
