import React from 'react';
import style from '../App.module.scss'
import {useFormik} from 'formik';
import {loginTC} from '../reducer/authReducer';
import {useAppDispatch} from '../hooks';
import {Particle} from './Particle';
import {useSelector} from 'react-redux';
import {AppRootState} from '../redux/store';
import {Navigate} from 'react-router-dom';

interface FormikErrorType {
    email?: string
    password?: string
    rememberMe?: boolean
}

export const Login: React.FC<{}> = () => {
    const isLoggedIn = useSelector<AppRootState, boolean>(state => state.auth.isLoggedIn);

    const dispatch = useAppDispatch();

    const formik = useFormik({
        validate: (values) => {
            const errors: FormikErrorType = {}

            if (!values.email) {
                errors.email = 'Required';
            } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
                errors.email = 'Invalid email address';
            }

            if (!values.password) {
                errors.password = 'Required';
            } else if (values.password.length < 3) {
                errors.password = 'must be more 3 characters';
            }

            return errors;
        },

        initialValues: {
            email: '',
            password: '',
            rememberMe: false,
        },
        onSubmit: (values) => {
            // alert(JSON.stringify(values, null, 2));
            dispatch(loginTC(values))
            formik.resetForm()
        },
    });

    if (isLoggedIn) {
        return <Navigate to={'/'}/>
    }

    return (
        <div className={style.login_wrapper}>
            <Particle/>
            <div className={style.login_block}>
                <div className={style.login_info}>
                    Please enter this email and password:
                    <div className={style.login_info_box}>
                        <div className={style.login_info_data}>
                            <div className={style.login_info_span}>Email:</div> <span>free@samuraijs.com</span>
                        </div>
                        <div className={style.login_info_data}>
                            <div className={style.login_info_span}>Password:</div> <span>free</span>
                        </div>
                    </div>

                </div>
                <h2 className={style.login_formtitle}>Enter in my Todolist</h2>

                <form onSubmit={formik.handleSubmit}>
                    <div className={style.login_input_block}>
                        <label htmlFor="email" className={style.login_title}>Login</label>
                        <input
                            id="email"
                            className={`${style.login_input} ${formik.touched.email && formik.errors.email ? style.login_input_error : ''}`}
                            type={'email'}
                            placeholder={'free@samuraijs.com'}
                            {...formik.getFieldProps('email')}
                        />
                        {formik.touched.email && formik.errors.email ?
                            <div className={style.login_error}>{formik.errors.email}</div> : null}
                    </div>

                    <div className={style.login_input_block}>
                        <label htmlFor="password" className={style.login_title}>Password</label>
                        <input
                            id="password"
                            className={`${style.login_input} ${formik.touched.password && formik.errors.password ? style.login_input_error : ''}`}
                            type={'password'}
                            placeholder={'free'}
                            {...formik.getFieldProps('password')}
                        />
                        {formik.touched.password && formik.errors.password ?
                            <div className={style.login_error}>{formik.errors.password}</div> : null}
                    </div>


                    <div className={style.login_checkbox}>
                        <input
                            id="rememberMe"
                            type={'checkbox'}
                            name={'rememberMe'}
                            onChange={formik.handleChange}
                            checked={formik.values.rememberMe}
                        />
                        <label className={style.login_checkbox_label} htmlFor="rememberMe"></label>
                    </div>

                    <div className={style.btn_block}>
                        <button className={style.btn_todolist} type="submit">LOGIN</button>
                    </div>

                </form>
            </div>

        </div>

    );
};

