import { LoadingOutlined, LockOutlined } from '@ant-design/icons'
import { Col, Form, Input, Row } from 'antd'
import useNotification from '../../hooks/UseNotification';
import { useState } from 'react';
import styles from './ChangePassword.module.css'
import { changePasswordAuth } from '../../server/UserService';
import { getAlertMessage } from '../../utils/AlertUtils';

const ChangePassword = () => {
    const { alertSuccess, alertError } = useNotification();
    // state
    const [newUser, setNewUser] = useState();
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        setLoading(true)
        await changePasswordAuth(newUser.oldPassword, newUser.password).then((res) => {
            if (res === "true") {
                alertSuccess("Password changed successfully");
                setLoading(false)
            } else {
                let errorMessage = getAlertMessage(res);
                alertError(errorMessage);
                setLoading(false)
            }
        });
    };
    return (
        <>
            <Row className={styles.changePasswordContainer} align='top'>
                <Col className={styles.changePasswordColumn} xxl={10} xl={10} lg={10} md={16} sm={24} xs={24} justify='center'>
                    <h1 className={styles.changePasswordTitle}>Change Password</h1>
                    <Form className={styles.form} onFinish={handleSubmit} scrollToFirstError>
                        <Form.Item
                            className={styles.inputContainer}
                            name="oldPassword"
                            label="Old Password"
                            labelCol={{ span: 24 }}
                            rules={[
                                {
                                    required: true,
                                    message: "Please input your old password!"
                                },
                            ]}
                        >
                            <Input.Password
                                className={styles.newPasswordInput}
                                size='large'
                                type="password"
                                name="old password"
                                placeholder="Current Password"
                                prefix={<LockOutlined />}
                                onChange={(e) => {
                                    setNewUser({ ...newUser, oldPassword: e.target.value });
                                }}
                                autoComplete="off"
                            />
                        </Form.Item>

                        <Form.Item
                            className={styles.inputContainer}
                            name='new password'
                            label="New Password"
                            labelCol={{ span: 24 }}
                            rules={[
                                {
                                    min: 6,
                                    message: "Password must be at least 6 characters!"
                                },
                                {
                                    required: true,
                                    message: "Please input your new password!"
                                },
                            ]}>
                            <Input.Password
                                className={styles.newPasswordInput}
                                size='large'
                                type="password"
                                name="new password"
                                placeholder="New Password"
                                prefix={<LockOutlined />}
                                onChange={(e) => {
                                    setNewUser({ ...newUser, password: e.target.value });
                                }}
                                autoComplete="off"
                            />
                        </Form.Item>
                        <Form.Item
                            label="Confirm Password"
                            labelCol={{ span: 24 }}
                            className={styles.inputContainer}
                            name="confirm"
                            dependencies={["new password"]}
                            hasFeedback
                            rules={[
                                {
                                    required: true,
                                    message: "Please confirm your new password!"
                                },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue("new password") === value) {
                                            return Promise.resolve();
                                        }

                                        return Promise.reject(
                                            new Error(
                                                "The two passwords that you entered do not match!"
                                            )
                                        );
                                    },
                                }),
                            ]}
                        >
                            <Input.Password
                                size='large'
                                className={styles.newPasswordInput}
                                placeholder="Confirm New Password"
                                prefix={<LockOutlined />}
                                onChange={(e) => {
                                    setNewUser({ ...newUser, passwordConfirm: e.target.value });
                                }}
                                autoComplete="off"
                            />
                        </Form.Item>
                        {
                            loading ?
                                <button className={styles.formButton} type='submit' disabled>
                                    <LoadingOutlined />
                                </button>
                                :
                                <button className={styles.formButton} type='submit'>
                                    Change Password
                                </button>
                        }

                    </Form>
                </Col>
            </Row>
        </>
    )
}

export default ChangePassword