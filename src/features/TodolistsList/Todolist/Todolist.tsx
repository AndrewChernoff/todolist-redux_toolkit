import React, { memo, useCallback, useEffect } from 'react'
import { Delete } from '@mui/icons-material'
import { Button, IconButton } from '@mui/material'
import { Task } from './Tasks/Task/Task'
import {  TodolistDomainType, todolistsActions, todolistsThunks } from 'features/TodolistsList/todolists/todolists.reducer'
import { tasksThunks } from 'features/TodolistsList/tasks/tasks.reducer';
import { TaskStatuses } from 'common/enums';
import { useActions } from 'common/hooks';
import { AddItemForm, EditableSpan } from 'common/components'
import { TaskType } from '../tasks/tasks.api'
import { FilterButtons } from './FilterButtons'
import { Tasks } from './Tasks/Tasks'

type PropsType = {
	todolist: TodolistDomainType
	tasks: TaskType[]
	removeTodolist: (id: string) => void
	changeTodolistTitle: (id: string, newTitle: string) => void
}

export const Todolist = memo(function ({todolist, tasks}: PropsType) {

	const {
		removeTodolist,
		changeTodolistTitle
	} = useActions(todolistsThunks)
	
	const {fetchTasks, addTask} = useActions(tasksThunks)

	useEffect(() => {
		fetchTasks(todolist.id)
	}, [])

	const addTaskCallback = useCallback((title: string) => {
		return addTask({title, todolistId: todolist.id})
			.unwrap()
	}, [addTask, todolist.id])

	const removeTodolistCallback = () => {
		removeTodolist(todolist.id)
	}

	const changeTodolistTitleCallback = useCallback((title: string) => {
		changeTodolistTitle({id:todolist.id, title})
	}, [todolist.id, changeTodolistTitle])


	return <div>
		<h3><EditableSpan value={todolist.title} onChange={changeTodolistTitleCallback}/>
			<IconButton onClick={removeTodolistCallback} disabled={todolist.entityStatus === 'loading'}>
				<Delete/>
			</IconButton>
		</h3>
		<AddItemForm addItem={addTaskCallback} disabled={todolist.entityStatus === 'loading'}/>
		<div>
			<Tasks tasks={tasks} todolist={todolist} />
		</div>
		<div style={{paddingTop: '10px'}}>
			<FilterButtons todolist={todolist}/>
		</div>
	</div>
})


