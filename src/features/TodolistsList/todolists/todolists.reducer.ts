import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RequestStatusType } from 'app/app.reducer'
import { todolistsApi, TodolistType, UpdateTodolistTitleArgType } from 'features/TodolistsList/todolists/todolists.api';
import { createAppAsyncThunk } from 'common/utils';
import { ResultCode } from 'common/enums';
import { clearTasksAndTodolists } from 'common/actions';

const fetchTodolists = createAppAsyncThunk<{ todolists: TodolistType[] }, void>
('todo/fetchTodolists', async (_, thunkAPI) => {
		const res = await todolistsApi.getTodolists()
		return {todolists: res.data}
})

const addTodolist = createAppAsyncThunk<{ todolist: TodolistType }, string>
('todo/addTodolist', async (title, {rejectWithValue}) => {
		const res = await todolistsApi.createTodolist(title)
		if (res.data.resultCode === ResultCode.Success) {
			return {todolist: res.data.data.item}
		} else {
			return rejectWithValue({data: res.data, showGlobalError: false})
		}
})

const removeTodolist = createAppAsyncThunk<{ id: string }, string>
('todo/removeTodolist', async (id, thunkAPI) => {
	const {rejectWithValue} = thunkAPI
		const res = await todolistsApi.deleteTodolist(id)
		if (res.data.resultCode === ResultCode.Success) {
			return {id}
		} else {
			return rejectWithValue({data: res.data, showGlobalError: false})
		}
})

const changeTodolistTitle = createAppAsyncThunk<UpdateTodolistTitleArgType, UpdateTodolistTitleArgType>
('todo/changeTodolistTitle', async (arg, thunkAPI) => {
	const {rejectWithValue} = thunkAPI
		const res = await todolistsApi.updateTodolist(arg)
		if (res.data.resultCode === ResultCode.Success) {
			return arg
		} else {
			return rejectWithValue({data: res.data, showGlobalError: false})
		}
})

const reorderTodolist = createAppAsyncThunk<{todolistId: string, putAfterItemId: string}, any>
('todo/reorderTodolist', async (arg, thunkAPI) => {
	const {rejectWithValue} = thunkAPI
		const res = await todolistsApi.reorderTodolist(arg)
		if (res.data.resultCode === ResultCode.Success) {
			return arg
		} else {
			return rejectWithValue({data: res.data, showGlobalError: false})
		}
}
)
const reorderTasks = createAppAsyncThunk<{todolistId: string, taskId: string, putAfterItemId: string}, any>
('todo/reorderTodolist', async (arg, thunkAPI) => {
	const {rejectWithValue} = thunkAPI
		const res = await todolistsApi.reorderTasks(arg)
		if (res.data.resultCode === ResultCode.Success) {
			return arg
		} else {
			return rejectWithValue({data: res.data, showGlobalError: false})
		}
})

const initialState: TodolistDomainType[] = []

const slice = createSlice({
	name: 'todo',
	initialState,
	reducers: {
		changeTodolistFilter: (state, action: PayloadAction<{ id: string, filter: FilterValuesType }>) => {
			const todo = state.find(todo => todo.id === action.payload.id)
			if (todo) {
				todo.filter = action.payload.filter
			}
		},
		changeTodolistEntityStatus: (state, action: PayloadAction<{ id: string, entityStatus: RequestStatusType }>) => {
			const todo = state.find(todo => todo.id === action.payload.id)
			if (todo) {
				todo.entityStatus = action.payload.entityStatus
			}
		},
	},
	extraReducers: builder => {
		builder
			.addCase(fetchTodolists.fulfilled, (state, action) => {
				return action.payload.todolists.map(tl => ({...tl, filter: 'all', entityStatus: 'idle'}))
			})
			.addCase(addTodolist.fulfilled, (state, action) => {
				const newTodolist: TodolistDomainType = {
					...action.payload.todolist,
					filter: 'all',
					entityStatus: 'idle'
				}
				state.unshift(newTodolist)
			})
			.addCase(removeTodolist.fulfilled, (state, action) => {
				const index = state.findIndex(todo => todo.id === action.payload.id)
				if (index !== -1) state.splice(index, 1)
			})
			.addCase(changeTodolistTitle.fulfilled, (state, action) => {
				const todo = state.find(todo => todo.id === action.payload.id)
				if (todo) {
					todo.title = action.payload.title
				}
			})
			.addCase(clearTasksAndTodolists, () => {
				return []
			})
			.addCase(reorderTodolist.fulfilled, (state, action) => {
				const fromIndex  = state.findIndex(el => el.id === action.payload.todolistId)
				
				const toIndex = state.findIndex(el => el.id === action.payload.putAfterItemId)

				const element = state.splice(fromIndex, 1)[0]
			
				state.splice(toIndex, 0, element)
			})
			/* .addCase(reorderTasks.fulfilled, (state, action) => {
				return state
				
			}) */
	}
})

export const todolistsReducer = slice.reducer
export const todolistsActions = slice.actions
export const todolistsThunks = {fetchTodolists, addTodolist, removeTodolist, changeTodolistTitle, reorderTodolist, reorderTasks}


// types
export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodolistDomainType = TodolistType & {
	filter: FilterValuesType
	entityStatus: RequestStatusType
}
