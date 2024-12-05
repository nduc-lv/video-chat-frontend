'use client'
import type { FormProps } from 'antd';
import { Button, Checkbox, Form, Input } from 'antd';
import http from '../utils/http';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { useContext } from 'react';
// import { UserContext } from '../context/CustomerContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {Card} from "antd"
import { UserContext } from '../context/UserContext';
type FieldType = {
    username?: string;
    password?: string;
    remember?: string;
  };

export default function Login() {
    const router = useRouter();
    // const {setState} = useContext(UserContext);
    const {setState} = useContext(UserContext);
    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        try {
            const data = await http.postWithAutoRefreshToken("/login", {email: values.username, password: values.password}, {useAccessToken:false});
            console.log(data);
            if (localStorage){
                localStorage.setItem("accessToken", data.token)
                setState(curr => !curr);
                // localStorage.setItem("refreshToken", data.refreshToken)
                // setState((state:boolean) => !state);
                router.push("/");
            }
        }
        catch (e) {
            if (e instanceof AxiosError){
                switch (e.response?.status){
                    case 404: {
                        toast("Account not found", {type:"error"})
                        break
                    }
                    case 403: {
                        toast("Wrong password", {type:"error"})
                        break
                    }
                }
            }
            console.log(e);
        }
    };
      
    const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    
    return (
        <div className="h-screen" style={{paddingLeft: 20}}>
             <div id="Header" style={{height: "10%", fontWeight:"bold", paddingRight: "20px"}} className="py-6 text-2xl flex justify-between">
                <div>PeerChat</div>
            </div>
        <div className='flex flex-col items-center justify-center' style={{padding: 100}}>
            <ToastContainer></ToastContainer>
            <div style={{fontWeight: "bold", marginBottom: 10}} className='text-2xl'>
                Login
            </div>
            <Form
                    name="basic"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    style={{ maxWidth: 600}}
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
            >
            <Form.Item<FieldType>
                    label="Email"
                    name="username"
                    rules={[{ type:"email", required: true, message: 'Wrong format' }]}
            >
                    <Input />
            </Form.Item>

            <Form.Item<FieldType>
                label="Password"
                name="password"
                rules={[{ required: true, message: 'Password required' }]}
            >
                <Input.Password />
            </Form.Item>

   

            <Form.Item wrapperCol={{ offset: 8, span: 16 }} style={{display: "flex", justifyContent: "center", paddingRight: 50}}>
            <Button type="primary" htmlType="submit" style={{backgroundColor: "#3B82F6"}}>
                    Login
            </Button>
            
            </Form.Item>   
    </Form>
        </div>

        </div>
    )
}