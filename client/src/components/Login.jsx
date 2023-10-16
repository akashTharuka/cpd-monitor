import React from 'react';
import { useRef, useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthProvider';

import axios from '../api/axios';
const LOGIN_URL = '/auth';

const Login = () => {
    const { setAuth } = useContext(AuthContext);
    const userRef = useRef();
    const errRef = useRef();

    const [user, setUser] = useState('');
    const [pwd, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        userRef.current.focus();
    }, []);

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
            errRef.current.focus();
        }
    }

    return (
        <>
            {
                success ? (
                    <section>
                        <h1>Success!</h1>
                        <p>
                            <a href="#">Sign Up</a>
                        </p>
                    </section>
                ) : (
                    <div className='login container-fluid'>
                        <div className="card bg-light mx-auto px-md-5 px-1 py-5">
                            <p ref={errRef} className={`mx-auto ${errMsg ? "errmsg" : "offscreen"}`} aria-live="assertive">{errMsg}</p>
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
                                        ref={userRef}
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
                                    <span className='line'>
                                        {/* put router link here */}
                                        <a className='text-decoration-none' href="#">Sign Up</a>
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