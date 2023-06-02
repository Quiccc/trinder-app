import { LoadingOutlined, WarningOutlined } from '@ant-design/icons';
import { Button, Col, Form, Modal, Pagination, Row } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { createComment, getIsTopicLocked, getTopicCommentsByTopicId, sendReportForum } from '../../server/ForumService';
import styles from './TopicDetailsComponent.module.css';
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css';
import DOMPurify from 'dompurify';
import useNotification from '../../hooks/UseNotification';
import TextArea from 'antd/es/input/TextArea';
import { auth } from '../../server/config/FirebaseConfig';
import { isCurrentUserVerified } from '../../server/UtilsService';
import { sendForumNotification } from '../../server/NotificationService';

const TopicDetailsComponent = ({ topicID }) => {
    const [topicComments, setTopicComments] = useState(null);
    const [comment, setComment] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [resetLoading, setResetLoading] = useState(false)
    const [reportedComment, setReportedComment] = useState(null);
    const [isTopicLocked, setIsTopicLocked] = useState(false);
    const [count, setCount] = useState(0);
    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleChange = (value) => {
        setComment(value);
    };
    const { alertSuccess, alertError } = useNotification();
    const quillRef = useRef(null);

    const handleSubmit = (e) => {
        isCurrentUserVerified().then((response) => {
            if (auth?.currentUser === null) {
                alertError("You must be logged in to report");
                return;
            }
            if (!response) {
                alertError("You must verify your email to post a comment");
                return;
            }
            // Handle the comment submission and file uploads
            let sanitizedContent = DOMPurify.sanitize(comment);
            createComment(topicID, sanitizedContent).then((response) => {
                setComment('');
                if (response) {
                    setCount(count + 1);
                    alertSuccess("Comment created successfully.");
                    sendForumNotification(topicID, sanitizedContent, response.id);
                } else {
                    alertError("Error occured while creating comment");
                }
                if (quillRef.current) {
                    quillRef.current.getEditor().setText('');
                }
            });
        });
    };

    const handleReport = async () => {
        isCurrentUserVerified().then(async (response) => {
            if (auth?.currentUser === null) {
                alertError("You must be logged in to report");
                return;
            }
            if (!response) {
                alertError("You must verify your email to report a comment");
                return;
            }
            const text = document.getElementById('report-text').value;
            setResetLoading(true);
            try {
                await sendReportForum(reportedComment, text);
                alertSuccess("Your report has been sent successfully, we will review it as soon as possible");
                setResetLoading(false)
            } catch (err) {
                alertError("Report could not be sent, please try again later");
                setResetLoading(false)
            }
            setIsModalOpen(false);
        });
    };

    useEffect(() => {
        getTopicCommentsByTopicId(topicID,0,10).then((response) => {
            setTopicComments(response?.topicCommentList);
            setCount(response?.count);
        });
        getIsTopicLocked(topicID).then((response) => {
            setIsTopicLocked(response);
        });
    }, [topicID, count]);

    return (
        <Col>
            <Col className={styles.container} span={24}>
                {
                    topicComments && topicComments.map((comment, index) => {
                        return (
                            <div>
                                <Col>
                                    <Row justify='end'>
                                        <WarningOutlined className={styles.iconWarning} onClick={() => {
                                            setIsModalOpen(true);
                                            setReportedComment(comment);
                                        }} />
                                    </Row>
                                </Col>
                                <Row>
                                    <Col span={2} className={styles.topicTitleContainer}>
                                        <p className={styles.userName}>{comment?.user?.name + " " + comment?.user?.surname}</p>
                                        <img className={styles.userAvatar} src="images/logo.png" alt="profile" />
                                    </Col>
                                    <Col span={1} className={styles.topicTitleContainer}>
                                        <div className={styles.borderLineVertical}></div>
                                    </Col>
                                    <Col span={21} className={styles.topicTitleContainer}>
                                        <p className={styles.date}>{comment?.createdAt}</p>
                                        <div dangerouslySetInnerHTML={{ __html: comment?.comment }} />
                                    </Col>
                                    <Col span={24} className={styles.topicTitleContainer}>
                                        <div className={styles.borderLineHorizontal}></div>
                                    </Col>
                                </Row>

                            </div>
                        )
                    })
                }
                
            </Col>
            <Col>
                {
                    count > 0 && (
                        <Pagination
                            className={styles.pagination}
                            defaultCurrent={1}
                            total={count}
                            onChange={(page, pageSize) => {
                                getTopicCommentsByTopicId(topicID, page - 1, 10, topicComments[topicComments.length - 1]?.id).then((response) => {
                                    setTopicComments(response?.topicCommentList);
                                });
                            }}
                        />
                    )
                }
            </Col>
            {
                !isTopicLocked ? (
                    <Form.Provider>
                        <Form onFinish={handleSubmit}>
                            <Form.Item
                                name="comment"
                                rules={[{ required: true, message: 'Please input your comment!' }]}
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
                ) : (
                    <Col className={styles.container} span={24}>
                        <Row justify='center'>
                            <p className={styles.topicTitle}>Topic is locked, You can not comment</p>
                        </Row>
                    </Col>
                )
            }
            <Modal open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                footer={false}
            >
                <TextArea className={styles.modalInput} type="text" placeholder="Report Reason" autoSize={{ minRows: 3, maxRows: 3 }} id="report-text" />
                <Row align='center'>
                    <button onClick={handleReport} className={styles.modalButton}>
                        {resetLoading ? <LoadingOutlined /> : "Send Report"}
                    </button>
                </Row>
            </Modal>
        </Col>

    );
};

export default TopicDetailsComponent;