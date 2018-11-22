import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {login} from './actions';


class LoginHandler extends Component {

    onSubmit = (event) => {
        event.preventDefault();
        let form = document.getElementById("loginFormData");
        let formData = new FormData(form);
        //1 validate
        //Login
        this.props.actions.login(formData);
    }
    render() {
        return (
            <div>
                <h3>Login with Username and Password</h3>
                <form method="POST" name="loginFormData" id="loginFormData">
                    <table>
                        <tbody>
                            <tr>
                                <td>User:</td>
                                <td>
                                    <input type='text' name='email' />
                                </td>
                            </tr>
                            <tr>
                                <td>Password:</td>
                                <td>
                                    <input type='password' name='password' />
                                </td>
                            </tr>
                            <tr>
                                <td colSpan='2'>
                                    <input name="submit" type="submit" value="Login" onClick={this.onSubmit} />
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