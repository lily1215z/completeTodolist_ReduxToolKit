import React from 'react';
import style from '../App.module.scss';
import {logoutTC} from '../reducer/authReducer';
import {useAppDispatch} from '../hooks';
import {useSelector} from 'react-redux';
import {AppRootState} from '../redux/store';

export const Header = () => {
    const isInitial = useSelector<AppRootState, boolean>(state => state.app.isInitialized);
    const login = useSelector<AppRootState, string >(state => state.app.login)

    const dispatch = useAppDispatch();

    const logout = () => {
        dispatch(logoutTC()).then()
    }

    return (
        <header className={style.header}>
            <h1 className={style.title}>My first things...</h1>
            <div className={style.login_box}>
                <span className={style.nik_name}>{isInitial ? login : 'hello'}</span>
                <span
                    className={style.logout}
                    onClick={logout}
                >LogOut</span>
            </div>
        </header>
    );
};

