import React, {useEffect} from 'react';
import style from './App.module.scss'
import {useSelector} from 'react-redux';
import {AppRootState} from './redux/store';
import {useAppDispatch} from './hooks';
import {initializeAppTC, RequestStatusType} from './reducer/appReducer';
import LinearProgress from '@mui/material/LinearProgress';
import {Header} from './components/Header';
import {Footer} from './components/Footer';
import {Navigate, Route, Routes} from 'react-router-dom';
import {Login} from './components/Login';
import {TodolistMain} from './components/TodolistMain';
import {LoaderMain} from './components/LoaderMain';
import {NotFound} from './components/404';

type PropsType = {
    demo?: boolean
}

function App({demo = false}: PropsType) {
    //const todoListId1 = v1();
    // const [todolist, setTodoList] = useState<Array<TodoListType>>([
    //     {id: todoListId1, title: 'Daily affairs', filter: 'all'},
    //     {id: todoListId2, title: 'My deals on camp', filter: 'all'},
    // ])

    //  const [tasks, setTasks] = useState<TasksType>({
    //         [todoListId1]: [
    //             {id: v1(), title: 'wash up', isDone: false},
    //             {id: v1(), title: 'brush your teeth', isDone: true}
    //         ]
    //     }
    // )

    const status = useSelector<AppRootState, RequestStatusType>(state => state.app.status)
    const isInitialized = useSelector<AppRootState, boolean>(state => state.app.isInitialized)
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(initializeAppTC()).then()
    }, [])

    if (!isInitialized) {
        return <LoaderMain />
    }

    return (
        <>
            {status === 'loading' && <div className={style.progress}><LinearProgress color="primary"/></div>}
            <div className={style.wrapper}>

                <Header/>

                <Routes>
                    <Route path={'/'} element={<TodolistMain demo={demo}/>}/>
                    <Route path={'/login'} element={<Login/>}/>

                    <Route path="404" element={<NotFound />}/>
                    <Route path="*" element={<Navigate to="404"/>}/>
                </Routes>

                <Footer/>

            </div>

        </>
    );

}

export default App;
