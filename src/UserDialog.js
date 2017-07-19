import React, { Component } from 'react';
import {signUp, signIn, sendPasswordResetEmail} from './leanCloud'
import SignInOrSignUp from './SignInOrSignUp'
import SignInForm from './SignInForm'
import ForgotPasswordForm from './ForgotPasswordForm'
import './UserDialog.css'
export default class UserDialog extends Component{
    constructor(props){
        super(props)
        this.state = {

            selectedTab: 'signInOrSignUp', // 'forgotPassword'
            formData: {
                username: '',
                password: '',
            }
        }
    }
    signUp(e){
        e.preventDefault()
        let {username, password} = this.state.formData
        let success = (user)=>{
            this.props.onSignUp.call(null, user)
        }
        let error = (error)=>{
            switch(error.code){
                case 218:
                    alert("密码不能为空")
                    break
                case 202:
                    alert('用户名已被占用')
                    break
                default:
                    alert(error)
                    break
            }
        }
        signUp(username, password, success, error)
    }
    signIn(e){
        e.preventDefault()
        let {username, password} = this.state.formData
        let success = (user)=>{
            this.props.onSignIn.call(null, user)
        }
        let error = (error)=>{
            switch(error.code){
                case 210:
                    alert('用户名与密码不匹配')
                    break
                case 211:
                    alert("找不到用户")
                    break
                case 101:
                    alert("网络故障")
                    break
                case 502:
                    alert("网络故障")
                    break
                default:
                    alert(error)
                    break
            }
        }
        signIn(username, password, success, error)
    }
    changeFormData(key, e){
        let stateCopy = JSON.parse(JSON.stringify(this.state))  // 用 JSON 深拷贝
        stateCopy.formData[key] = e.target.value
        this.setState(stateCopy)
    }
    render(){

        return (
            <div className="UserDialog-Wrapper">
                <div className="UserDialog">
                    <h1>Welcome</h1>
                    {
                        this.state.selectedTab === 'signInOrSignUp' ?
                            <SignInOrSignUp
                                formData={this.state.formData}
                                onSignIn={this.signIn.bind(this)}
                                onSignUp={this.signUp.bind(this)}
                                onChange={this.changeFormData.bind(this)}
                                onForgotPassword={this.showForgotPassword.bind(this)}
                            /> :
                        <ForgotPasswordForm
                            formData={this.state.formData}
                            onSubmit={this.resetPassword.bind(this)}
                            onChange={this.changeFormData.bind(this)}//这个就是输入框改变后触发的事件
                            onSignIn={this.returnToSignIn.bind(this)}//回到登陆界面
                        />
                    }
                </div>
            </div>
        )
    }
    returnToSignIn(){
        let stateCopy = JSON.parse(JSON.stringify(this.state))
        stateCopy.selectedTab = 'signInOrSignUp'
        this.setState(stateCopy)
    }
    showForgotPassword(){
        let stateCopy = JSON.parse(JSON.stringify(this.state))
        stateCopy.selectedTab = 'forgotPassword'
        this.setState(stateCopy)
    }
    resetPassword(e){
        e.preventDefault()
        sendPasswordResetEmail(this.state.formData.email)
    }
}