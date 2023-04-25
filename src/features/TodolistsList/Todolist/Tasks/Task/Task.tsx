import React, { ChangeEvent, memo, useCallback } from 'react'
import { Checkbox, IconButton } from '@mui/material'
import { Delete } from '@mui/icons-material'
import { EditableSpan } from 'common/components'
import { TaskStatuses } from 'common/enums';
import { TaskType } from 'features/TodolistsList/tasks/tasks.api';
import { useActions } from 'common/hooks';
import { tasksThunks } from 'features/TodolistsList/tasks/tasks.reducer';

type TaskPropsType = {
	task: TaskType
	todolistId: string
}

export const Task = memo(({task, todolistId}: TaskPropsType) => {

	const { updateTask, removeTask} = useActions(tasksThunks)

	const onClickHandler = useCallback(() => removeTask({taskId: task.id, todolistId:todolistId}), [task.id, todolistId]);

	const onChangeStatusHandler = useCallback((e: ChangeEvent<HTMLInputElement>) => {
		let newIsDoneValue = e.currentTarget.checked
		updateTask({taskId: task.id, domainModel: {status: newIsDoneValue ? TaskStatuses.Completed : TaskStatuses.New}, todolistId: todolistId})
	}, [task.id, todolistId]);

	const onTitleChangeHandler = useCallback((newValue: string) => {
		updateTask({taskId: task.id, domainModel: {title: newValue}, todolistId: todolistId})
	}, [task.id, todolistId]);

	return <div key={task.id} className={task.status === TaskStatuses.Completed ? 'is-done' : ''}>
		<Checkbox
			checked={task.status === TaskStatuses.Completed}
			color="primary"
			onChange={onChangeStatusHandler}
		/>

		<EditableSpan value={task.title} onChange={onTitleChangeHandler}/>
		<IconButton onClick={onClickHandler}>
			<Delete/>
		</IconButton>
	</div>
})
