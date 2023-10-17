import React from 'react';
import { useState, useEffect } from 'react';
import { HashLink } from 'react-router-hash-link';
import useAuth from '../hooks/useAuth';

import axios from '../api/axios';
const LOGIN_URL = '/auth';

const Login = () => {
    const { setAuth } = useAuth();

    const [user, setUser] = useState('');
    const [pwd, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        setErrMsg('');
    }, [user, pwd]);

    const handleSubmit = async(e) => {
        e.preventDefault();

        try{
            const payload = {
                user,
                pwd
            }
            const response = await axios.post(LOGIN_URL,
                JSON.stringify(payload), 
                {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    withCredentials: true
                }
            );
            console.log(JSON.stringify(response?.data));
            // console.log(JSON.stringify(response));
            const accessToken = response?.data?.accessToken;
            const roles = response?.data?.roles;
            setAuth({ user, pwd, roles, accessToken });
            setUser('');
            setPwd('');
            setSuccess(true);
            console.log("submitted");
        }catch (err){
            if (!err?.response){
                setErrMsg('No Server Response');
            }
            else if (err.response?.status === 400){
                setErrMsg('Missing Username or Password');
            }
            else if (err.response?.status === 401){
                setErrMsg('Unauthorized');
            }
            else{
                setErrMsg('Login Failed');
            }
        }
    }

    return (
        <>
            {
                success ? (
                    <section>
                        <div className="container container-fluid col-4 text-center">
                            <div className="success card bg-light mx-auto px-md-5 px-1 py-5">
                                <div className="card-title display-6 text-uppercase text-center">
                                    Success!
                                </div>
                                <span className='card-body'>
                                    <HashLink to="/">Sign Up</HashLink>
                                </span>
                            </div>
                        </div>
                    </section>
                ) : (
                    <div className='login container-fluid col-4'>
                        <div className="card bg-light mx-auto px-md-5 px-1 py-5">
                            <p className={`mx-auto ${errMsg ? "errmsg" : "offscreen"}`}>{errMsg}</p>
                            <div className="card-title display-6 text-uppercase text-center">
                                Login
                            </div>
                            <div className="card-body">
                                <form className='form needs-validation' onSubmit={handleSubmit} noValidate>
                                    <label className='form-label' htmlFor="username">Username</label>
                                    <input 
                                        type="text"
                                        className='form-control'
                                        id="username"
                                        autoComplete='off'
                                        onChange={e => setUser(e.target.value)}
                                        value={user}
                                        required
                                    />

                                    <label className='form-label' htmlFor="password">Password</label>
                                    <input 
                                        type="password"
                                        className='form-control'
                                        id="password"
                                        onChange={e => setPwd(e.target.value)}
                                        value={pwd}
                                        required
                                    />

                                    <button className='col-12 btn btn-outline-dark mt-5' disabled={!user || !pwd ? true : false}>Sign In</button>
                                </form>
                                <p className='mt-4'>
                                    Need an Account? <br />
                                    <span>
                                        <HashLink className='text-decoration-none' to="/">Sign Up</HashLink>
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                )
            }
        </>
    );
}

export default Login;