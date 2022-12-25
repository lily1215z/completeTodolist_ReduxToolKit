import React from 'react';
import style from "../App.module.scss"
import pageNotFound from '../image/not-found.png';

export const NotFound = () => {
    return (
        <div className={style.not_found}>
           <img src={pageNotFound} alt={'page not found'} />
        </div>
    );
};

