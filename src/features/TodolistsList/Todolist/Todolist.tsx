import React, { memo, useCallback, useEffect } from 'react'
import { Delete } from '@mui/icons-material'
import { IconButton } from '@mui/material'
import {  TodolistDomainType, todolistsThunks } from 'features/TodolistsList/todolists/todolists.reducer'
import { tasksThunks } from 'features/TodolistsList/tasks/tasks.reducer';
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
	onDragOver : (e:React.DragEvent<HTMLDivElement>) => void
	onDragLeave : (e:React.DragEvent<HTMLDivElement>) => void
	onDragStart : (e:React.DragEvent<HTMLDivElement>, id: string) => void
	onDragEnd : (e:React.DragEvent<HTMLDivElement>) => void
	onDrop : (e: React.DragEvent<HTMLDivElement>, id: string) => void
}

export const Todolist = memo(function ({todolist, tasks, onDragOver,
	onDragLeave,
	onDragStart,
	onDragEnd,
	onDrop}: PropsType) {

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


	return <div draggable={true}
	style={{cursor: 'grab'}}
	onDragOver={onDragOver}
		onDragLeave={onDragLeave}
		onDragStart={(e) => onDragStart(e,todolist.id)}
		onDragEnd={onDragEnd}
		onDrop={(e) => onDrop(e,todolist.id)}
	>
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


