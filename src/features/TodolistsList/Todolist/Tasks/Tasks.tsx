import React, { useState } from 'react'
import { TaskType } from "features/TodolistsList/tasks/tasks.api"
import { Task } from './Task/Task'
import { TodolistDomainType, todolistsThunks } from 'features/TodolistsList/todolists/todolists.reducer'
import { TaskStatuses } from 'common/enums'
import { useActions, useAppDispatch, useAppSelector } from 'common/hooks'

type Props = {
    todolist: TodolistDomainType
    tasks: TaskType[] 
}

export const Tasks = ({todolist, tasks} : Props) => {

    let tasksForTodolist = tasks

	if (todolist.filter === 'active') {
		tasksForTodolist = tasks.filter(t => t.status === TaskStatuses.New)
	}
	if (todolist.filter === 'completed') {
		tasksForTodolist = tasks.filter(t => t.status === TaskStatuses.Completed)
	}

    return <div>
    {
        tasksForTodolist.map(t => <Task key={t.id} task={t} todolistId={todolist.id} />)
    }
</div>
}