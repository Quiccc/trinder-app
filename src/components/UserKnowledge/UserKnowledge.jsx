import { LoadingOutlined, UserOutlined } from '@ant-design/icons';
import { Col, Form, Input, Modal, Row, Upload } from 'antd'
import { useAuth } from '../../contexts/AuthContext';
import useNotification from '../../hooks/UseNotification';
import styles from './UserKnowledge.module.css'
import { getAlertMessage } from '../../utils/AlertUtils';
import { useState } from 'react';
import { updateProfileFirebase } from '../../server/UserService';


const UserKnowledge = () => {
    const { userDetails,setUserDetails } = useAuth();
    const [userInfoUpdate, setUserInfoUpdate] = useState(userDetails);
    const [userInfo] = useState(userDetails);
    const [loading, setLoading] = useState(false);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [imageList, setImageList] = useState(
        userInfo?.profile_image
          ? [
                {
                    name: userInfo?.profile_image.name,
                    status: 'done',
                    url: userInfo?.profile_image.url,
                }
            ]
          : [
                {
                    name: "no_profile_image.jpeg",
                    status: 'done',
                    url: "images/no_profile_image.jpeg",
                }
            ]
      );
    const { alertSuccess, alertError } = useNotification();


    const handleSubmit = async () => {
        setLoading(true)
        try {
            await updateProfileFirebase(userInfoUpdate).then((res) => {
                setUserDetails({
                    name: userInfoUpdate?.name,
                    surname: userInfoUpdate?.surname,
                    email: userDetails?.email,
                    profile_image: {
                        name: userInfoUpdate?.profile_image?.name,
                        url: res,
                    },
                    isAdmin: userDetails?.isAdmin,
                    premiumID: userDetails?.premiumID,
                    isVerified: userDetails?.isVerified,
                });
            });
            alertSuccess("Your profile has been updated successfully");
            setLoading(false)
        } catch (err) {
            let errorMessage = getAlertMessage(err.code);
            alertError(errorMessage);
            setLoading(false)
        }
    };

    const handleCancel = () => setPreviewOpen(false);

    const getBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });

    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }

        setPreviewImage(file.url || (file.preview));
        setPreviewOpen(true);
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    };

    const dummyRequest = ({ file, onSuccess }) => {
        setTimeout(() => {
            onSuccess("ok");
        }, 0);
    };

    return (
        <Row className={styles.userKnowledgeContainer} align='top' justify='start'>
            <Col className={styles.userKnowledgeColumn} justify='center' span={24}>
                <h1 className={styles.userKnowledgeHeader}>User Info</h1>
                <Col xxl={10} xl={10} lg={10} md={22} sm={22} xs={24} className={styles.formColumn}>
                    <Form
                        initialValues={{
                            "name": userDetails?.name,
                            "surname": userInfoUpdate?.surname,
                            "profile_image": userInfoUpdate?.profile_image || {
                                name: "no-image.png",
                                url: "images/no-image.png"
                            },
                        }}
                        name='register form'
                        className={styles.formContainer}
                        onFinish={handleSubmit}
                    >
                        <Form.Item
                            labelCol={{ span: 24 }}
                            className={styles.inputContainer}
                            name='name'
                            label="Name"
                            rules={
                                [
                                    {
                                        required: true,
                                        message: "Please enter your name!"
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
                                    setUserInfoUpdate({ ...userInfoUpdate, name: val.charAt(0).toUpperCase() + val.slice(1).toLowerCase() });
                                }}
                                onKeyPress={(event) => {
                                    if (!/[a-zA-ZğüıIşöçİĞÜŞÖÇ\s]/.test(event.key)) {
                                        event.preventDefault();
                                    }
                                }}
                            />
                        </Form.Item>
                        <Form.Item
                            labelCol={{ span: 24 }}
                            className={styles.inputContainer}
                            name='surname'
                            label="Surname"
                            rules={
                                [
                                    {
                                        required: true,
                                        message: "Please enter your surname!"
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
                                    setUserInfoUpdate({ ...userInfoUpdate, surname: val.charAt(0).toUpperCase() + val.slice(1).toLowerCase() });
                                }}
                                onKeyPress={(event) => {
                                    if (!/[a-zA-ZğüıIşöçİĞÜŞÖÇ\s]/.test(event.key)) {
                                        event.preventDefault();
                                    }
                                }}
                            />
                        </Form.Item>
                        <Form.Item
                            name="profile_image"
                            labelCol={{ span: 24 }}
                            label="Profile Image"
                        >
                            <Upload
                                fileList={imageList}
                                onPreview={handlePreview}
                                accept="image/*"
                                listType="picture-card"
                                multiple={false}
                                disabled={previewOpen}
                                onRemove={(e) => {
                                    setImageList([]);
                                    setUserInfoUpdate({ ...userInfoUpdate, profile_image: null });
                                }}
                                onChange={(e) => {
                                    //When new image is uploaded, replace the old one
                                    if (e.file.status === "done" || e.file.status === "uploading") {
                                        setImageList([e.file]);
                                        setUserInfoUpdate({ ...userInfoUpdate, profile_image: e.file });
                                    }
                                }}
                                customRequest={dummyRequest}
                            >
                                <div>
                                    <div className="ant-upload-text">Upload</div>
                                </div>
                                <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                                </Modal>
                            </Upload>
                        </Form.Item>
                        {
                            loading ?
                                <button type="submit" className={styles.updateButton} disabled>
                                    <LoadingOutlined />
                                </button>
                                :
                                <button type="submit" className={styles.updateButton}>
                                    Update
                                </button>
                        }
                    </Form>
                </Col>
            </Col>
        </Row>
    )
}

export default UserKnowledge