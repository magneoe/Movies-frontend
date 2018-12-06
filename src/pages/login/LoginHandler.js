import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {login} from './actions';


export class LoginHandler extends Component {
    constructor(props){
        super(props);
        this.state = {
            message: '',
        }
    }
    onSubmit = (event) => {
        event.preventDefault();
        let formData = new FormData();
        formData.append('email', document.getElementById("email").value);
        formData.append('password', document.getElementById("password").value);
        //validate
        if(this.isInputValid(formData)){
             //Attempt login
            this.props.actions.login(formData);
        }
        else
            this.setState({message: 'One or more fields are empty!'});
       
    }
    isInputValid = (formData) => {
        const email = formData.get('email');
        const password = formData.get('password');
        if(!email || email.split('').findIndex((e) => e === '@') === -1)
            return false;
        if(!password || password.length < 1)
            return false;
        return true;
    } 
    render() {
        return (
            <div>
                <h3>Login with Username and Password</h3>
                <h4>{this.state.message}</h4>
                <form method="POST" name="loginFormData" id="loginFormData">
                    <table>
                        <tbody>
                            <tr>
                                <td>User:</td>
                                <td>
                                    <input type='text' name='email' id="email" />
                                </td>
                            </tr>
                            <tr>
                                <td>Password:</td>
                                <td>
                                    <input type='password' name='password' id="password" />
                                </td>
                            </tr>
                            <tr>
                                <td colSpan='2'>
                                    <input name="submit" id="loginSubmit" type="submit" value="Login" onClick={this.onSubmit} />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </form>
            </div>
        );
    }
}

export default connect(
    (state) => ({
    }),
    (dispatch) => ({
        actions: bindActionCreators(Object.assign({},
            { login }), dispatch)

    })
)(LoginHandler)