import React, { useContext, useEffect, useState } from 'react';
import {useHttp} from '../hooks/http.hook'
import {useMessage} from '../hooks/message.hook'
import { AuthContext } from '../context/AuthContext';

export const AuthPage = () => {
    const auth =useContext(AuthContext)
    const message = useMessage()
    const {loading, request, error, clearError} = useHttp()
    const [form, setForm] = useState({
        email: '',
        password: ''
    })
    useEffect( () => {
        message(error)
        clearError()
    }, [error, message, clearError])

    const changeHandler = event => {
        setForm({ ...form, [event.target.name]: event.target.value })
    }

    const registerHandler = async () => {
        try{
            const data = await request('/api/auth/registration', 'POST', {...form})
            console.log(data)
        } catch(e) {}
    }

    const loginHandler = async () => {
        try{
            const data = await request('/api/auth/login', 'POST', {...form})
            auth.login(data.token, data.userId)
        } catch(e) {}
    }

    return (
        <div className='row'>
            <div className='col s6 offset-s3'>
                <h2>Скорочення посилання</h2>
                <div className="card blue darken-1">
                    <div className="card-content white-text">
                        <span className="card-title">Авторизація</span>
                        <div>

                        <div className="input-field">
                            <input
                            placeholder="Введіть email" 
                            id="email" 
                            type="email" 
                            name='email'
                            value={form.email}
                            onChange={changeHandler}
                            />
                        </div>

                        <div className="input-field">
                            <input
                            placeholder="Введіть пароль" 
                            id="password" 
                            type="password" 
                            name='password' 
                            value={form.password}
                            onChange={changeHandler}
                            disabled={loading}
                            />
                        </div>

                        </div>
                    </div>
                    <div className="card-action">
                        <button 
                        className="btn yellow darken-4"
                        disabled={loading}
                        onClick={loginHandler}
                        >
                        Увійти
                        </button>
                        <button 
                        className="btn greu lighten-1 right"
                        onClick={registerHandler}
                        disabled={loading}
                        >
                        Зарейструватися
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}


// 2:06:26