import React, {ChangeEvent, useCallback} from 'react';
import style from '../App.module.scss'
import {EditableItem} from './EditableItem';
import {RequestStatusType} from '../reducer/appReducer';
import {TaskStatuses} from './TodolistMain';

type TaskType = {
    todoListId: string
    removeTask: (taskId: string, todoListId: string) => void
    taskId: string,
    check: TaskStatuses,
    title: string
    changeStatusTask: (todoListId: string, taskId: string, status: TaskStatuses) => void
    changeTaskTitle: (newTitle: string) => void
    entityStatus?: RequestStatusType
}

export const Task: React.FC<TaskType> = React.memo(({
                                                        todoListId,
                                                        removeTask,
                                                        taskId,
                                                        check,
                                                        title,
                                                        changeStatusTask,
                                                        changeTaskTitle,
                                                        entityStatus
                                                    }) => {

    const changeStatusTaskHandler = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        changeStatusTask(todoListId, taskId, e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New)
    }, [todoListId, taskId, changeStatusTask])

    const styleForTasksTitle = {
        marginLeft: '5px',
        fontFamily: '\'Oleo Script Swash Caps\', cursive',
        fontSize: '18px',
    }

    const disabled = entityStatus && entityStatus === 'loading'

    return (
        <>
            {
                <li className={style.item}>
                    <input
                        disabled={disabled}
                        checked={check === 2}
                        type={'checkbox'}
                        onChange={changeStatusTaskHandler}
                        className={check === 2 ? `${style.item_input}` : `${style.item_active}`}
                    />

                    <div className={style.item_editbox}>
                        <EditableItem
                            addItem={changeTaskTitle}
                            titleInState={title}
                            styleTitle={styleForTasksTitle}
                        />
                        {/*<span className={style.item_title}>{title}</span>*/}
                    </div>

                    <button className={style.item_btn} onClick={() => removeTask(todoListId, taskId)}
                            disabled={disabled}></button>
                </li>
            }
        </>
    );
});

