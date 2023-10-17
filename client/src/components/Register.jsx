import React from 'react';
import { useState, useEffect } from 'react';
import { HashLink } from 'react-router-hash-link';
import axios from '../api/axios';

const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const REGISTER_URL = '/register';

const Register = () => {

    const [user, setUser] = useState('');
    const [validName, setValidName] = useState(false);
    const [userFocus, setUserFocus] = useState(false);

    const [pwd, setPwd] = useState('');
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);

    const [matchPwd, setMatchPwd] = useState('');
    const [validMatchPwd, setValidMatchPwd] = useState(false);
    const [matchPwdFocus, setMatchPwdFocus] = useState(false);

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const result = USER_REGEX.test(user);
        // console.log(result);
        // console.log(user);
        setValidName(result);
    }, [user]);

    useEffect(() => {
        const result = PWD_REGEX.test(pwd);
        // console.log(result);
        // console.log(pwd);
        setValidPwd(result);
        const match = (pwd === matchPwd);
        setValidMatchPwd(match);
    }, [pwd, matchPwd]);

    useEffect(() => {
        setErrMsg('');
    }, [user, pwd, matchPwd]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        // if button enabled with JS hack
        const v1 = USER_REGEX.test(user);
        const v2 = PWD_REGEX.test(pwd);
        if (!v1 || !v2){
            setErrMsg("Invalid Entry");
            return;
        }
        // console.log(user, pwd);
        // setSuccess(true);
        try{
            const payload = {
                user,
                pwd
            }
            const response = await axios.post(REGISTER_URL, 
                JSON.stringify(payload),
                {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    withCredentials: true
                }
            );
            console.log(response.data);
            // console.log(response.accessToken);
            // console.log(JSON.stringify(response));
            setSuccess(true);
            // clear the input fields
        }catch (err){
            // optional chaining to safely access nested properties of an object
            if (!err?.response) {
                setErrMsg('No Server Response');
            }
            else if (err.response?.status === 409){
                setErrMsg('Username Taken');
                setUser('');
            }
            else{
                setErrMsg('Registration Failed');
            }
        }
    }

    return (
        <>
            {success ? (
                <section>
                    <div className="container container-fluid col-4 text-center">
                        <div className="success card bg-light mx-auto px-md-5 px-1 py-5">
                            <div className="card-title display-6 text-uppercase text-center">
                                Success!
                            </div>
                            <span className='card-body'>
                                <HashLink to="/login">Sign In</HashLink>
                            </span>
                        </div>
                    </div>
                </section>
            ) : (
                <div className='register container-fluid col-4'>
                    <div className="card bg-light mx-auto px-md-5 px-1 py-5">
                        <p className={`mx-auto ${errMsg ? "errmsg" : "offscreen"}`}>{errMsg}</p>
                        <div className="card-title display-6 text-uppercase text-center">
                            Register
                        </div>
                        <div className="card-body">
                            <form className='form needs-validation' onSubmit={handleSubmit} noValidate>
                                <label className='form-label' htmlFor="username">Username</label>
                                <input 
                                    type="text"
                                    className={`form-control ${!user ? "" : validName ? "is-valid" : "is-invalid"}`}
                                    id="username"
                                    autoComplete='off'
                                    onChange={e => setUser(e.target.value)}
                                    value={user}
                                    required
                                    onFocus={() => setUserFocus(true)}
                                    onBlur={() => setUserFocus(false)} 
                                />
                                <p id="uidnote" className={userFocus && user && !validName ? "invalid-feedback" : "offscreen"}>
                                    4 to 24 characters. <br />
                                    Must begin with a letter. <br />
                                    Letters, numbers, underscores, hyphens allowed
                                </p>

                                <label className='form-label' htmlFor="password">Password</label>
                                <input 
                                    type="password"
                                    className={`form-control ${!pwd ? "" : validPwd ? "is-valid" : "is-invalid"}`}
                                    id="password"
                                    onChange={e => setPwd(e.target.value)}
                                    required
                                    onFocus={() => setPwdFocus(true)}
                                    onBlur={() => setPwdFocus(false)}
                                />
                                <p id="pwdnote" className={pwdFocus && !validPwd ? "invalid-feedback" : "offscreen"}>
                                    8 to 24 characters. <br />
                                    Must include uppercase and lowercase letters, a number and a special character. <br />
                                    Allowed special characters: <span aria-label="exclamation mark">!</span> <span aria-label="at symbol">@</span> <span aria-label="hashtag">#</span> <span aria-label="dollar sign">$</span> <span aria-label="percent">%</span>
                                </p>

                                <label className='form-label' htmlFor="matchPwd">Confirm Password</label>
                                <input 
                                    type="password"
                                    className={`form-control ${!matchPwd ? "" : validMatchPwd ? "is-valid" : "is-invalid"}`}
                                    id="matchPwd"
                                    onChange={e => setMatchPwd(e.target.value)}
                                    required
                                    onFocus={() => setMatchPwdFocus(true)}
                                    onBlur={() => setMatchPwdFocus(false)}
                                />
                                <p id="matchPwdNote" className={matchPwdFocus && !validMatchPwd ? "invalid-feedback" : "offscreen"}>
                                    Must match the first password input field.
                                </p>

                                <button className='col-12 btn btn-outline-dark mt-5' disabled={!validName || !validPwd || !validMatchPwd ? true : false}>Sign Up</button>
                            </form>
                            <p className='mt-4'>
                                Already Registered? <br />
                                <span>
                                    <HashLink className='text-decoration-none' to="/login">Sign In</HashLink>
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );  
}

export default Register;