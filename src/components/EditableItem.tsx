import React, {useState} from 'react';
import style from "../App.module.scss";

type todoListTitleType = {
    titleInState: string        //значение кот уже изменилось в стейте
    addItem: (newTitle: string) => void   //ф-я редактирования текста
    styleTitle: any              // стили
}

export const EditableItem: React.FC<todoListTitleType> =  React.memo(({ titleInState, addItem, styleTitle}) => {

    const [edit, setEdit] = useState(false)
    const [value, setValue] = useState(titleInState);

    const activateViewMode = () => {
        setEdit(false)
        addItem(value)
    }

    const onPressEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.charCode  === 13) {
            setEdit(false)
            addItem(value)
        }
    }

    return (
        <>
            {/*<h2 className={style.title_todolist}>{editItem}</h2>*/}
            {
                edit
                    ?
                    <input
                        value={value}
                        onChange={(e) => setValue(e.currentTarget.value)}
                        onBlur={activateViewMode}
                        className={style.input_edit}
                        onKeyPress={onPressEnter}
                        autoFocus
                    />
                    : <span style={styleTitle} onDoubleClick={() => setEdit(true)}>{titleInState}</span>
            }
        </>
    );
});
