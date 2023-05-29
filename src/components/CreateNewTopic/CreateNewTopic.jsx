import { Button, Col, Form, Input, Select } from 'antd';
import { useRef, useState } from 'react';
import styles from './CreateNewTopic.module.css';
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css';
import DOMPurify from 'dompurify';
import useNotification from '../../hooks/UseNotification';
import { useEffect } from 'react';
import { createTopic, getTopicCategories } from '../../server/ForumService';

const CreateNewTopic = () => {
    const [comment, setComment] = useState('');
    const [topicCategoryMenu, setTopicCategoryMenu] = useState(null);
    const [form] = Form.useForm()

    const handleChange = (value) => {
        setComment(value);
    };
    const { alertSuccess, alertError } = useNotification();
    const quillRef = useRef(null);

    const handleSubmit = (values) => {
        // Handle the comment submission and file uploads
        let sanitizedContent = DOMPurify.sanitize(comment);
        createTopic(sanitizedContent, values.topicHeader,values.topicCategoryId).then((response) => {
            setComment('');
            if (response) {
                alertSuccess("Topic created successfully.");
            } else {
                alertError("Error occured while creating topic");
            }
            if (quillRef.current) {
                quillRef.current.getEditor().setText('');
            }
            form.resetFields();
        });
    };
    useEffect(() => {
        getTopicCategories().then((response) => {
            setTopicCategoryMenu(response);
        });
    }, []);
    return (
        <Col>
            <Form.Provider>
                <Form onFinish={handleSubmit} form={form}>
                    <Form.Item
                        name="topicCategoryId"
                        rules={[{ required: true, message: 'Please select topic category!' }]}
                    >
                        <Select placeholder="Select Topic Category" className={styles.selectTopicCategoryInput}>
                            {
                                topicCategoryMenu && topicCategoryMenu.map((item) => {
                                    return <Select.Option value={item?.categoryId}>{item?.title}</Select.Option>
                                })
                            }
                        </Select>
                    </Form.Item>

                    <Form.Item
                    name="topicHeader"
                    rules={[{ required: true, message: 'Please input your topic header!' }]}>
                        <Input className={styles.createCommentInput} placeholder="Topic Header" />
                    </Form.Item>
                    <Form.Item
                        name="comment"
                        rules={[{ required: true, message: 'Please input your description of topic!' }]}
                    >
                        <ReactQuill value={comment} onChange={handleChange} className={styles.createCommentInput} ref={quillRef} /> 
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" className={styles.createCommentButton}>
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </Form.Provider>
        </Col>
    );
};

export default CreateNewTopic;