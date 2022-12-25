import React, {useCallback} from 'react';
import {Task} from './Task';
import {UniversalInput} from './UniversalInput';
import style from '../App.module.scss'
import {EditableItem} from './EditableItem';
import {useAppDispatch} from '../hooks';
import {TodolistDomainType} from '../reducer/todolistReducer';
import {TaskStatuses, TaskType, TodoListFilterType} from './TodolistMain';

type TodoListPropsType = {
    // todoListId: string
    tasks: Array<TaskType>
    // todoListTitle: string
    removeTask: (taskId: string, todoListId: string) => void
    addTask: (todoListId: string, title: string) => void
    changeFilter: (todoListId: string, filter: TodoListFilterType) => void
    changeStatusTask: (todoListId: string, taskId: string, status: TaskStatuses) => void
    removeTodoList: (todoListId: string) => void
    changeTodoListTitle: (title: string, todoListId: string) => void
    changeTaskTitle: (title: string, todoListId: string, taskId: string) => void
    todolist: TodolistDomainType
    demo?: boolean
}

export const TodoList: React.FC<TodoListPropsType> = React.memo(({
                                                                     demo = false,
                                                                     tasks,
                                                                     todolist,
                                                                     removeTask,
                                                                     addTask,
                                                                     changeFilter,
                                                                     changeStatusTask,
                                                                     removeTodoList,
                                                                     changeTodoListTitle,
                                                                     changeTaskTitle
                                                                 }) => {
    // const dispatch = useAppDispatch();

    const addTaskValue = useCallback((title: string) => {
        addTask(todolist.id, title)
    }, [todolist.id, addTask])

    const onClickFilter = useCallback((filter: TodoListFilterType) => {
        changeFilter(todolist.id, filter)
    }, [todolist.id, changeFilter])

    const changeTodoListTitleHandler = useCallback((newTitle: string) => {
        changeTodoListTitle(todolist.id, newTitle)
    }, [todolist.id, changeTodoListTitle])

    const styleForTodolistTitle = {
        fontFamily: '\'Ruslan Display\', cursive',
        margin: 0,
        fontSize: '24px'
    }
    //
    // useEffect(() => {
    //         // if (demo) {
    //         //     return
    //         // }
    //     dispatch(fetchTasksTC(todolist.id))
    // }, [])

    return (
        <div className={style.card}>
            <EditableItem
                addItem={changeTodoListTitleHandler}
                titleInState={todolist.title}
                styleTitle={styleForTodolistTitle}
            />
            {/*<h2 className={style.title_todolist}>{todoListTitle}</h2>*/}

            <button className={style.btn_close} disabled={todolist.entityStatus === 'loading'} onClick={() => removeTodoList(todolist.id)}>x</button>
            <div className={style.card_inputbox}>
                <UniversalInput
                    entityStatus={todolist.entityStatus}
                    placeholder={'write your case'}
                    addItem={addTaskValue}
                />
            </div>

            <ul className={style.card_map}>
                {
                    tasks.map(i => {
                        const changeTaskTitleHandler = (newValue: string) => {
                            changeTaskTitle(todolist.id, i.id, newValue)
                        }

                        return <Task
                            key={i.id}
                            todoListId={todolist.id}
                            removeTask={removeTask}
                            changeStatusTask={changeStatusTask}
                            taskId={i.id}
                            check={i.status}
                            title={i.title}
                            changeTaskTitle={changeTaskTitleHandler}
                            entityStatus={todolist.entityStatus}
                        />
                    })

                }
            </ul>
            <div className={style.btn_box}>
                <button className={style.btn_todolist} onClick={() => onClickFilter('all')}>All</button>
                <button className={style.btn_todolist} onClick={() => onClickFilter('active')}>Active</button>
                <button className={style.btn_todolist} onClick={() => onClickFilter('completed')}>Completed</button>
            </div>
        </div>
    );
});

