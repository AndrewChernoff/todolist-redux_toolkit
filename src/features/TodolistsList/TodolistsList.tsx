import React, { useCallback, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { FilterValuesType, todolistsActions, todolistsThunks } from 'features/TodolistsList/todolists/todolists.reducer'
import { tasksThunks } from 'features/TodolistsList/tasks/tasks.reducer'
import { Grid, Paper } from '@mui/material'
import { AddItemForm } from 'common/components'
import { Todolist } from './Todolist/Todolist'
import { Navigate } from 'react-router-dom'
import { useActions } from 'common/hooks';
import { selectIsLoggedIn } from 'features/auth/auth.selectors';
import { selectTasks } from 'features/TodolistsList/tasks/tasks.selectors';
import { selectTodolists } from 'features/TodolistsList/todolists/todolists.selectors';

export const TodolistsList = () => {
	const todolists = useSelector(selectTodolists)
	const tasks = useSelector(selectTasks)
	const isLoggedIn = useSelector(selectIsLoggedIn)

	const {
		removeTodolist: removeTodolistThunk,
		addTodolist,
		fetchTodolists,
		changeTodolistTitle: changeTodolistTitleThunk
	} = useActions(todolistsThunks)

	useEffect(() => {
		if (!isLoggedIn) {
			return;
		}
		fetchTodolists({})
	}, [])

	const removeTodolist = useCallback(function (id: string) {
		removeTodolistThunk(id)
	}, [])

	const changeTodolistTitle = useCallback(function (id: string, title: string) {
		changeTodolistTitleThunk({id, title})
	}, [])

	const addTodolistCallback = useCallback((title: string) => {
		return addTodolist(title)
			.unwrap()
	}, [])

	if (!isLoggedIn) {
		return <Navigate to={'/login'}/>
	}

	return <>
		<Grid container style={{padding: '20px'}}>
			<AddItemForm addItem={addTodolistCallback}/>
		</Grid>
		<Grid container spacing={3}>
			{
				todolists.map(tl => {
					let allTodolistTasks = tasks[tl.id]

					return <Grid item key={tl.id}>
						<Paper style={{padding: '10px'}}>
							<Todolist
								todolist={tl}
								tasks={allTodolistTasks}
								removeTodolist={removeTodolist}
								changeTodolistTitle={changeTodolistTitle}
							/>
						</Paper>
					</Grid>
				})
			}
		</Grid>
	</>
}
