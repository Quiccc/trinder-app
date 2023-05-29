
import { MailOutlined, LockOutlined, LoadingOutlined } from '@ant-design/icons'
import { Col, Form, Input, Modal, Row } from 'antd'
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styles from './LoginComponent.module.css'
import { getAlertMessage } from '../../utils/AlertUtils';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../server/config/FirebaseConfig';
import useNotification from '../../hooks/UseNotification';
import { userLogin } from '../../server/UserService';
import { useAuth } from '../../contexts/AuthContext';

const LoginComponent = () => {
    let location = useLocation();
    const navigate = useNavigate();
    const { alertSuccess, alertError } = useNotification();
    const { currentUser } = useAuth();
    // states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [user, setUser] = useState();
    const [loading, setLoading] = useState(false)
    const [resetLoading, setResetLoading] = useState(false)

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await userLogin(user.email, user.password)
                .then(() => {
                    alertSuccess("Login successful");
                })
            // if the user is using the promotional link, 
            // this control enables the component to be used after 
            // logging in this link that user entered without logging in.
            if (location.state) {
                navigate(`${location.state.from.pathname}`)
            } else {
                navigate('/')
            }
        } catch (err) {
            let errorMessage = getAlertMessage(err.code);
            alertError(errorMessage);
            setLoading(false)
        }
    };
    //email reset function
    const handleReset = async () => {
        const email = document.getElementById('email-reset-id').value;
        setResetLoading(true);
        try {
            await sendPasswordResetEmail(auth, email).then((res) => console.log(res))
            alertSuccess("Password reset successfully, please check your email");
            setResetLoading(false)
        } catch (err) {
            let errorMessage = getAlertMessage(err.code);
            alertError(errorMessage);
            setResetLoading(false)
        }
        setIsModalOpen(false);
    };
    useEffect(() => {
        // when this page mount, it is controlled user login or not
        if (currentUser) {
            navigate("/");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <>
            <Row className={styles.loginContainer} justify='center' align='middle'>
                <Col className={styles.loginColumn} xxl={6} xl={6} lg={8} md={10} sm={14} xs={20} align='middle'>
                    <h1 className={styles.header}>Login</h1>
                    <Form
                        className={styles.formContainer}
                        name='loginForm'
                        onFinish={handleSubmit}
                    >
                        <Form.Item
                            className={styles.inputContainer}
                            name='Email'
                            rules={
                                [
                                    {
                                        required: true,
                                        message: "Email is required"
                                    },

                                ]
                            }>
                            <Input
                                className={styles.loginInput}
                                size='large'
                                type="email"
                                name="email"
                                id="email"
                                placeholder="Email"
                                prefix={<MailOutlined />}
                                onChange={(e) => {
                                    setUser({ ...user, email: e.target.value.trim() });
                                }}
                            />
                        </Form.Item>
                        <Form.Item
                            className={styles.inputContainer}
                            name='password'
                            rules={
                                [
                                    {
                                        required: true,
                                        message: "Password is required"
                                    },

                                ]
                            }>
                            <Input.Password
                                className={styles.loginInput}
                                size='large'
                                type="password"
                                name="password"
                                id="password"
                                placeholder="Password"
                                prefix={<LockOutlined />}
                                onChange={(e) => {
                                    setUser({ ...user, password: e.target.value.trim() });
                                }}
                            />
                        </Form.Item>
                        <button type="submit" className={styles.loginButton}>
                            {loading ? <LoadingOutlined /> : 'Login'}
                        </button>
                    </Form>
                    <div className={styles.description}>You don't have an account?<Link to={'/register'} className={styles.registerLink}>Register</Link></div>
                    <div className={styles.forgotPassword} onClick={() => { setIsModalOpen(true) }}>
                        Forgot Password?
                    </div>
                    <Modal open={isModalOpen}
                        onOk={handleOk}
                        onCancel={handleCancel}
                        footer={false}
                    >
                        <Input className={styles.modalInput} type="email" name="email" id="email-reset-id" placeholder="Email" prefix={<MailOutlined />} />
                        <Row align='end'>
                            <button onClick={handleReset} className={styles.modalButton}>
                                {resetLoading ? <LoadingOutlined /> : "Reset Password"}
                            </button>
                        </Row>
                    </Modal>
                </Col>
            </Row>
        </>
    )
}

export default LoginComponent