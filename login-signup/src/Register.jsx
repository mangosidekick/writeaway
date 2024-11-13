import React, { useState } from "react";

export const Register = (props) => {
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(email);
    }

    return(
        <div className="auth-form-container">
        <form onSubmit={handleSubmit}>
            <label htmlFor="email">email</label>
            <input value={email} type="email" placeholder="enter your email here" id="email" name="email"/>

            <label htmlFor="password">password</label>
            <input  value={pass} type="password" placeholder="enter password" id="password" name="password"/>
            <button type="submit">Log In</button>
        </form>
        <button onClick={() => props.onFormSwitch('login')}>got an account? log in here!</button>
        </div>
    );
}