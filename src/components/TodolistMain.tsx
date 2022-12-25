import React, {useCallback, useEffect} from 'react';
import style from '../App.module.scss';
import {UniversalInput} from './UniversalInput';
import {TodoList} from './TodoList';
import {ErrorSnackbar} from './ЕrrorSnackbar';
import {AppRootState} from '../redux/store';
import {
    addTodoListTC,
    changeFilterAC,
    changeTodolistTitleTC, getTodoTC,
    removeTodoListTC,
    TodolistDomainType
} from '../reducer/todolistReducer';
import {useAppDispatch} from '../hooks';
import {addTasksTC, removeTasksTC, updateTaskTC} from '../reducer/tasksReducer';
import {useSelector} from 'react-redux';
import {Navigate} from 'react-router-dom';

export type TodoListFilterType = 'all' | 'completed' | 'active';

export enum TaskStatuses {
    New = 0,
    InProgress = 1,
    Completed = 2,
    Draft = 3
}

export enum TaskPriorities {
    Low = 0,
    Middle = 1,
    Hi = 2,
    Urgently = 3,
    Later = 4
}

export type TaskType = {
    // id: string,
    // title: string,
    // isDone: boolean
    description: string
    title: string
    status: TaskStatuses
    priority: TaskPriorities
    startDate: string
    deadline: string
    id: string
    todoListId: string
    order: number
    addedDate: string
}

export type TasksType = {
    [key: string]: Array<TaskType>
}

export const TodolistMain = ({demo = false}) => {
    const isLoggedIn = useSelector<AppRootState, boolean>(state => state.auth.isLoggedIn);
    const tasks = useSelector<AppRootState, TasksType>(state => state.tasks)
    const todolist = useSelector<AppRootState, Array<TodolistDomainType>>(state => state.todolists)

// const dispatch = useDispatch();
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(getTodoTC())
    }, [])

    const removeTask = useCallback(function (todolistId: string, taskId: string) {
        dispatch(removeTasksTC(todolistId, taskId));
    }, [dispatch])

    const addTask = useCallback((todoListId: string, title: string) => {
        dispatch(addTasksTC(todoListId, title))
    }, [dispatch])

    const changeFilter = useCallback((todolistId: string, value: TodoListFilterType) => {
        dispatch(changeFilterAC({todolistId, value}))
    }, [dispatch])

    const changeStatusTask = useCallback((todoListId: string, taskId: string, status: TaskStatuses) => {
        dispatch(updateTaskTC(todoListId, taskId, {status: status}))
    }, [dispatch])

    const removeTodoList = useCallback((todoListId: string) => {
        dispatch(removeTodoListTC(todoListId));
    }, [dispatch])

    const addTodoList = useCallback((title: string) => {
        dispatch(addTodoListTC(title))
    }, [dispatch])

    const changeTodoListTitle = useCallback((todoListId: string, title: string) => {
        dispatch(changeTodolistTitleTC(todoListId, title))
    }, [dispatch])

    const changeTaskTitle = useCallback((todoListId: string, taskId: string, newTitle: string) => {
        dispatch(updateTaskTC(todoListId, taskId, {title: newTitle}))
    }, [dispatch])

    if(!isLoggedIn) {
        return <Navigate to={'/login'} />
    }

    return (
        <main className={style.main}>
            <div className={style.plan}>
                <div className={style.plan_add}>
                    <h2 className={style.plan_title}>My plans</h2>
                    <div className={style.plan_img}>
                        <UniversalInput
                            placeholder={'write the name of your list'}
                            addItem={addTodoList}
                        />
                    </div>

                </div>
                <div className={style.card_box}>
                    {
                        todolist.map(i => {
                            let allTasksTodoLists = tasks[i.id]

                            let tasksForTodoList = allTasksTodoLists

                            if (i.filter === 'active') {
                                tasksForTodoList = allTasksTodoLists.filter(i => i.status === 0)
                            }
                            if (i.filter === 'completed') {
                                tasksForTodoList = allTasksTodoLists.filter(i => i.status === 2)
                            }
                            return <TodoList
                                key={i.id}
                                todolist={i}
                                // todoListId={i.id}
                                tasks={tasksForTodoList}
                                // todoListTitle={i.title}
                                removeTask={removeTask}
                                addTask={addTask}
                                changeFilter={changeFilter}
                                changeStatusTask={changeStatusTask}
                                removeTodoList={removeTodoList}
                                changeTodoListTitle={changeTodoListTitle}
                                changeTaskTitle={changeTaskTitle}
                                demo={demo}
                            />
                        })
                    }
                </div>

                <ErrorSnackbar/>

            </div>
        </main>
    );
};

