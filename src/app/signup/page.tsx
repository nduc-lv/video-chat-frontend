'use client'
import type { FormProps } from 'antd';
import { Button, Checkbox, DatePicker, Form, Input } from 'antd';
import http from '../utils/http';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import {Select} from 'antd'
import { useEffect, useState } from 'react';
type FieldType = {
    name?:string;
    email?: string;
    password?: string;
    dateOfBirth?: Date;
    language?: number;
    sexualInterests?:number;
    gender?:number;
};
const languages = [
    "English",
    "Afrikaans",
    "العربية",
    "Azeri",
    "Български",
    "বাংলা",
    "Bosanski",
    "Català",
    "Čeština",
    "Dansk",
    "Deutsch",
    "Ελληνικά",
    "English (Australia)",
    "English (UK)",
    "Español",
    "Español (Argentina)",
    "Español (España)",
    "Eesti keel",
    "Euskera",
    "Suomi",
    "Français (France)",
    "Français (Canada)",
    "Galego",
    "עברית",
    "हिन्दी",
    "Hrvatski",
    "Magyar",
    "Bahasa Indonesia",
    "Italiano",
    "日本語",
    "ქართული ენა",
    "қазақ тілі",
    "ខ្មែរ",
    "한국어",
    "Lietuvių",
    "Latviešu",
    "Македонски",
    "Bahasa Melayu",
    "Norsk (bokmål)",
    "Nederlands",
    "Polski",
    "Português (Brasil)",
    "Português (Portugal)",
    "Română",
    "Русский",
    "Slovenčina",
    "Slovenščina",
    "Srpski",
    "Svenska",
    "தமிழ்",
    "తెలుగు",
    "ภาษาไทย",
    "Filipino",
    "Türkçe",
    "Українська",
    "Tiếng Việt",
    "中文 (简体)",
    "中文 (台灣)"
];
const sexualGroups = ["Male", "Female", "Everyone"];
export default function Singup() {
    const router = useRouter();
    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        console.log('Success:', values.dateOfBirth?.toISOString());
        console.log(values);
        const body = {
            dateOfBirth: values.dateOfBirth?.toISOString(),
            email: values.email,
            password: values.password,
            name: values.name,
            language: values.language,
            sexualInterests: values.sexualInterests,
            gender: values.gender
        }
        try {
            const data = await http.postWithAutoRefreshToken(`signup`, body, {useAccessToken:false});
            router.push("/login")
        }
        catch (e) {
            if (e instanceof AxiosError){
                switch (e.response?.status){
                    case 422: {
                        console.log(e);
                        break
                    }
                    case 409: {
                        alert("Tai khoan da ton tai")
                    }
                }
            }
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
        <div className='flex flex-col justify-center items-center'>
            <div style={{fontWeight: "bold", marginBottom: 10}} className='text-2xl'>
                Sign up
            </div>
            <Form
                    name="basic"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    style={{ maxWidth: 600, width: "40vw" }}
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
            >
            <Form.Item<FieldType>
                    label="Email"
                    name="email"
                    rules={[{ type:"email", required: true, message: 'Please input your email!' }]}
            >
                    <Input />
            </Form.Item>

            <Form.Item<FieldType>
                label="Password"
                name="password"
                rules={[{ required: true, message: 'Please input your password!'}, {pattern: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, message: "At least 8 characters including at least 1 uppcase letter, 1 digit and 1 special character"}]}
            >
                <Input.Password />
            </Form.Item>
            <Form.Item<FieldType>
                label="Name"
                name="name"
                rules={[{ required: true, message: 'Please input your name' }, {pattern: /[\p{L}\s]*$/, message: "Invalid name"}]}
            >
                <Input/>
            </Form.Item>
            <Form.Item<FieldType>
                label="Date of Birth"
                name="dateOfBirth"
                rules={[{ required: true, message: 'Please input your date of birth!' }]}
            >
                <DatePicker></DatePicker>
            </Form.Item>
            <Form.Item<FieldType>
                label="Language"
                name="language"
                rules={[{ required: true, message: 'Please input your phonenumber' }]}
            >
                <Select>
                    {languages.map((language, index) => {
                        return (
                            <Select.Option value = {index} key = {language}>
                                {language}
                            </Select.Option>
                        )
                    })}
                </Select>
            </Form.Item>
            <Form.Item<FieldType>
                label="Gender"
                name="gender"
                rules={[{ required: true, message: 'Please input your !' }]}
            >
                {/* City */}
                <Select>
                
                        <Select.Option value= {0} key={'Male-gender'}>
                            Male
                        </Select.Option>
                        <Select.Option value= {1} key={'Female-gender'}>
                            Female
                        </Select.Option>
                </Select>
            </Form.Item>
            <Form.Item<FieldType>
                label="Sexual Interests"
                name="sexualInterests"
                rules={[{ required: true, message: 'Please input your !' }]}
            >
                {/* District */}
                <Select>
                    {sexualGroups.map((option, index) => {
                        return (
                            <Select.Option value = {index} key = {option}>
                                {option}
                            </Select.Option>
                        )
                    })}
                </Select>
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 8, span: 16 }} style={{display: "flex", justifyContent: "center", paddingRight: 50}}>
            <Button type="primary" htmlType="submit" style={{backgroundColor: "#3B82F6"}}>
                    Sign up
            </Button>
            </Form.Item>
    </Form>
        </div>
    </div>
    )
}