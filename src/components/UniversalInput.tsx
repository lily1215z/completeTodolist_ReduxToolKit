import React, {ChangeEvent, useState} from 'react';
import style from '../App.module.scss'
import {RequestStatusType} from '../reducer/appReducer';

type UniversalInputType = {
    addItem: (title: string) => void
    placeholder: string
    entityStatus?: RequestStatusType
}
export const UniversalInput:React.FC<UniversalInputType> = ({addItem, placeholder, entityStatus}) => {
    const [value, setValue] = useState('');
    const [error, setError] = useState(false);

    const check = entityStatus && entityStatus === 'loading'

    const addItemHandler = () => {
        if (value === '') {
            setError(true)
        } else {
            addItem(value)
            setValue('')
        }
    }
    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setValue(e.currentTarget.value)
        setError(false)
    }
    // @ts-ignore
    const onPressEnter = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.charCode  === 13) {
            addItemHandler()
        }
    }

    return (
        <div className={style.plans_box}>
                <input
                    disabled={check}
                    value={value}
                    onChange={onChangeHandler}
                    placeholder={placeholder}
                    className={`${style.input} ${error ? style.error_input : ''}`}
                    onKeyPress={onPressEnter}
                />
            <button className={style.btn_add} onClick={addItemHandler} disabled={check}>add</button>
           <div className={style.error}>{error ? 'write something :)' : ''}</div>
        </div>
    );
};

