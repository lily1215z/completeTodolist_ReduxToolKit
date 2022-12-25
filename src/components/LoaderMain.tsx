import React from 'react';
import style from '../App.module.scss';
import loader from '../image/497.gif';

export const LoaderMain = () => {
    return (
        <div className={style.loader}>
           <img src={loader} alt={'preloader'}/>
        </div>
    );
};

