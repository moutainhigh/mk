import React from 'react'
import {
    Button,
    Form,
    Input,
    Select,
    Checkbox,
    Modal
} from 'antd';

import './login.css';
const FormItem = Form.Item;
const Option = Select.Option;
let Login = React.createClass({
    getInitialState() {
        return {
            ischecked: 0,
            height:window.innerHeight
        }
    },
    handleSubmit(e) {
        e.preventDefault();
        this.props.form.validateFields((errors, values) => {
            if (!!errors) {
                //console.log('Errors in form!!!');
                return;
            }
            //console.log(values);
            var params = values;
            this.login(params);
        });
    },
    login(params) {
        var me = this;
        Utils.ajaxData({
            url: '/system/user/login.htm',
            contentType: 'application/x-www-form-urlencoded',
            data: params,
            callback: function(result) {
                if (result.code == 200) {
                	Utils.ajaxData({
                        url: '/modules/manage/system/roleMenu/find.htm?sysType=1',
                        method: 'get',
                        type: 'json',
                        callback: (result) => {
                            var menuData = result.data;
                            localStorage.scriptid = menuData[0].scriptid;
                            localStorage.isLogin = true;
                            localStorage.Token = result.Token;
                            location.reload();
                        }
                    });
                } else {
                    me.changeImg();
                    Modal.error({
                        title: result.msg,
                        onOk: ()=>{
                            me.props.form.resetFields(['code']);
                        }
                    });
                    
                }
            }
        });
    },
    onWindowResize(){
        this.setState({
            height: window.innerHeight
        })
    },
    componentDidMount() {
        var username = Cookies.get("username"); 
        var password = Cookies.get("password"); 
        if (username) {
            this.props.form.setFieldsValue({ username,password });
        }
        window.addEventListener('resize', this.onWindowResize);
    },
    changeImg(){
        var imgSrc = document.getElementsByClassName("imgCode")[0];  
        var times = (new Date()).getTime(); 
        imgSrc.setAttribute("src", '/system/user/imgCode/generate.htm?timestamp='+times); 
    },
    componentWillUnmount() {
        window.removeEventListener('resize', this.onWindowResize)
    },
    render() {
     
        const {
            getFieldProps
        } = this.props.form;
        return (
            <div>
                <div className="g-loginbox">
                    <div className="g-bd">
                        <div className="m-loginbg" style={{height:this.state.height}}>
                        </div>
                        <div className="m-bgwrap" style={{ cursor: "pointer" }}></div>
                        <div className="m-loginboxbg" ></div>
                        <div className="m-loginbox">
                            <div className="lbinner" id="J_body_bg">
                                <div className="login-form">
                                    <div className="login-hd">现金贷管理系统</div>
                                    <div className="login_input">
                                        <Form inline-block onSubmit={this.handleSubmit} form={this.props.form}>
                                            <FormItem>
                                                <Input type="text" className="ipt ipt-user" name="username" autoComplete="off"
                                                       {...getFieldProps('username', {
                                                           
                                                           rules: [{
                                                               required: true,
                                                               message: '请输入账户名'
                                                           }],
                                                           trigger: 'onBlur'
                                                       })
                                                       }
                                                       placeholder = "用户名" />
                                            </FormItem>
                                            <FormItem >
                                                <Input type="password" className="ipt ipt-pwd" name="password" autoComplete="off"
                                                       {...getFieldProps('password', {
                                                           
                                                           rules: [{
                                                               required: true,
                                                               whitespace: false,
                                                               message: '请输入密码'
                                                           }],
                                                           trigger: 'onBlur'
                                                       })
                                                       }
                                                       placeholder="密码"/>
                                            </FormItem>
                                            <FormItem >
                                                <Input type="text" className="ipt ipt-pwd1" name="code" autoComplete="off"
                                                   {...getFieldProps('code', {
                                                       rules: [{
                                                           required: true,
                                                           whitespace: false,
                                                           message: '请输入图片验证码'
                                                       }],
                                                       trigger: 'onBlur'
                                                   })
                                                   }
                                                   placeholder="验证码"/>
                                                <img onClick={this.changeImg} className='imgCode' src="/system/user/imgCode/generate.htm" alt="图片验证码"/>
                                            </FormItem>
                                            <Button type="primary" size="large" className="ant-input u-loginbtn" htmlType="submit">登录</Button>
                                        </Form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
})

Login = Form.create()(Login);
export default Login;