import { LoadingOutlined, LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';
import { Col, Form, Input, Row } from 'antd';
import { useEffect, useState } from 'react';
import styles from './RegisterComponent.module.css'
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { emailVerification, userRegister } from '../../server/UserService';
import useNotification from '../../hooks/UseNotification';

const RegisterComponent = () => {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const { alertError } = useNotification();

    const [newUser, setNewUser] = useState({
        name: "",
        surname: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        setLoading(true)
        try {
            await userRegister(newUser);
            await emailVerification().then(() => {
                navigate('/', { state: { register: true } });
            });
            // await signup(newUser.email, newUser.password);
            // await registerFirebase(newUser).then(async () => {
            //     await sendEmailVerificationFirebase();
            //     //navigate with param register:true
            //     navigate('/', { state: { register: true } });
            // });
        } catch (err) {
            console.log(err);
            // let errorMessage = getAlertMessage(err.code);
            alertError("Something went wrong");
            setLoading(false)
        }
    };
    useEffect(() => {
        if (currentUser) {
            navigate("/");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentUser]);
    return (
        <>
            <Row className={styles.registerContainer} justify='center' align='middle'>
                <Col className={styles.registerColumn} xxl={6} xl={6} lg={8} md={10} sm={14} xs={20} align='middle'>
                    <h1 className={styles.header}>Register</h1>
                    <p className={styles.formDescription}>All fields are required</p>
                    <Form
                        name='register form'
                        className={styles.formContainer}
                        onFinish={handleSubmit}
                    >
                        <Form.Item
                            className={styles.inputContainer}
                            name='name'
                            rules={
                                [
                                    {
                                        required: true,
                                        message: "Name is required"
                                    },

                                ]
                            }>
                            <Input
                                className={styles.registerInput}
                                size='large'
                                type="text"
                                name="name"
                                id="name"
                                placeholder="Name"
                                prefix={<UserOutlined />}
                                onChange={(e) => {
                                    let val = e.target.value.trim();
                                    setNewUser({ ...newUser, name: val.charAt(0).toUpperCase() + val.slice(1).toLowerCase() });
                                }}
                                onKeyPress={(event) => {
                                    if (!/[a-zA-ZğüıIşöçİĞÜŞÖÇ\s]/.test(event.key)) {
                                        event.preventDefault();
                                    }
                                }}
                            />
                        </Form.Item>
                        <Form.Item
                            className={styles.inputContainer}
                            name='surname'
                            rules={
                                [
                                    {
                                        required: true,
                                        message: "Surname is required"
                                    },

                                ]
                            }>
                            <Input
                                className={styles.registerInput}
                                size='large'
                                type="text"
                                name="surname"
                                id="surname"
                                placeholder="Surname"
                                prefix={<UserOutlined />}
                                onChange={(e) => {
                                    let val = e.target.value.trim();
                                    setNewUser({ ...newUser, surname: val.charAt(0).toUpperCase() + val.slice(1).toLowerCase() });
                                }}
                                onKeyPress={(event) => {
                                    if (!/[a-zA-ZğüıIşöçİĞÜŞÖÇ\s]/.test(event.key)) {
                                        event.preventDefault();
                                    }
                                }}
                            />
                        </Form.Item>
                        <Form.Item
                            className={styles.inputContainer}
                            name='email'
                            rules={[
                                {
                                    type: "email",
                                    message: "Please enter a valid email address"
                                },
                                {
                                    required: true,
                                    message: "Email is required"
                                },
                            ]}
                        >
                            <Input
                                className={styles.registerInput}
                                size='large'
                                type="email"
                                name="email"
                                id="email"
                                placeholder="Email"
                                prefix={<MailOutlined />}
                                onChange={(e) => {
                                    setNewUser({ ...newUser, email: e.target.value.trim() });
                                }}
                            />
                        </Form.Item>
                        <Form.Item
                            className={styles.inputContainer}
                            name="password"
                            rules={[
                                {
                                    min: 6,
                                    message: "Password must be at least 6 characters",
                                },
                                {
                                    required: true,
                                    message: "Password is required",
                                },
                            ]}
                        >
                            <Input.Password
                                className={styles.registerInput}
                                size='large'
                                placeholder="Password"
                                prefix={<LockOutlined />}
                                onChange={(e) => {
                                    setNewUser({ ...newUser, password: e.target.value.trim() });
                                }}
                            />
                        </Form.Item>

                        <Form.Item
                            className={styles.inputContainer}
                            name="confirm"
                            dependencies={["password"]}
                            hasFeedback
                            rules={[
                                {
                                    required: true,
                                    message: "Please confirm your password",
                                },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue("password") === value) {
                                            return Promise.resolve();
                                        }

                                        return Promise.reject(
                                            new Error(
                                                "The two passwords that you entered do not match"
                                            )
                                        );
                                    },
                                }),
                            ]}
                        >
                            <Input.Password
                                size='large'
                                className={styles.registerInput}
                                placeholder="Confirm Password"
                                prefix={<LockOutlined />}
                                onChange={(e) => {
                                    setNewUser({
                                        ...newUser,
                                        passwordConfirm: e.target.value.trim(),
                                    });
                                }}
                            />
                        </Form.Item>
                        {/* <Form.Item
                            className={styles.phoneContainer}
                            name="phoneNumber"
                            rules={[
                                {
                                    required: true,
                                    message: "Phone number is required",
                                },
                            ]}
                        >
                            <PhoneInput
                                className={styles.phoneInput}
                                country={"tr"}
                                inputProps={{ required: true }}
                                inputStyle={{ width: "100%" }}
                                placeholder="Phone number"
                                onChange={(e) => { setNewUser({ ...newUser, phoneNumber: "+" + e.trim() }); }}
                            ></PhoneInput>
                        </Form.Item> */}
                        <button
                            type="submit"
                            className={styles.registerButton}
                        >
                            {loading ? <LoadingOutlined /> : "Register"}
                        </button>
                    </Form>
                    <div className={styles.description}>Already registered? <Link to={'/login'} className={styles.loginLink}>Login</Link></div>
                </Col>
            </Row>
        </>
    )
}

export default RegisterComponent;