import { Button, Col, Row, Modal } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { LoadingOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { getChatMessages, sendMessage, subscribeToChat } from '../../server/ChatService';
import { sendReport } from '../../server/ChatService';
import useNotification from '../../hooks/UseNotification';
import { auth, db } from '../../server/config/FirebaseConfig';
import styles from './ChatMessagesComponent.module.css';
import { doc, getDoc } from 'firebase/firestore';
import { WarningOutlined } from '@ant-design/icons';
import { sendChatNotification } from '../../server/NotificationService';

const ChatMessagesComponent = ({ chatId }) => {
    const [chatMessages, setChatMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [advert, setAdvert] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [resetLoading, setResetLoading] = useState(false)
    const {alertSuccess, alertError} = useNotification();
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleMessageSend = async () => {
        setIsLoading(true);
        await sendMessage(chatId, newMessage);
        await sendChatNotification(chatId, newMessage);
        setIsLoading(false);
        setNewMessage(''); // Clear the input after sending the message
    };

    useEffect(() => {
        getChatMessages(chatId).then((res) => {
            setChatMessages(res.messages);
            console.log(res.advert);
            setAdvert(res.advert);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chatId]);

    useEffect(() => {
        let unsubscribe;

        // Subscribe to real-time updates for new messages
        unsubscribe = subscribeToChat(chatId, (newMessages) => {
            setChatMessages(newMessages);
        });

        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [subscribeToChat]);
    useEffect(() => {
        //If there is overflow scroll to bottom in styles.chatMessagesContainer
        const element = document.getElementsByClassName(styles.chatMessagesContainer)[0];
        element.scrollTo(0, element.scrollHeight);
    }, [chatMessages]);

    const handleOk = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleReport = async () => {
        const chatRef = doc(db, "chats", chatId);
        const chat = await getDoc(chatRef);
        const text = document.getElementById('report-text').value;
        setResetLoading(true);
        try {
            if (auth.currentUser.uid === chat.data().advertOwnerId) {
                await sendReport(chat,text,0);
            }
            else {
                await sendReport(chat,text,1);
            }
            alertSuccess("Your report has been sent successfully, we will review it as soon as possible");
            setResetLoading(false)
        } catch (err) {
            alertError("Report could not be sent, please try again later");
            setResetLoading(false)
        }
        setIsModalOpen(false);
    };

    return (
        <Col xxl={18} xl={18} lg={18} md={22} sm={22} xs={22} justify='center' align='center'>
            {
                advert && (
                    <Row align="middle" className={styles.cardContainer} span={23} onClick={() => {
                        navigate(`/advert/${advert?.advert_id}`);
                    }}>
                        <img
                            className={styles.advertImage}
                            src={advert?.images?.[0]?.url ||'images/no_image.png'}
                            alt={advert?.title} />
                        <Col className={styles.advertInfo}>
                        <p className={styles.advertTitle}>{advert?.title}</p>
                        <p className={styles.advertPrice}>{advert?.price} TL</p>
                        </Col>

                    </Row>
                )
            }
            <Row className={styles.chatMessagesContainer} justify='center'>
                <Col xxl={20} xl={20} lg={20} md={22} sm={22} xs={22}>
                    {
                        chatMessages.length > 0 && chatMessages.map((item, index) => {
                            return (
                                <Col>
                                    {
                                        index === 0 || chatMessages[index - 1].sentDay !== item.sentDay ?
                                            <Row className={styles.chatMessageDateRow} span={24} justify='center' align='middle'>
                                                <Col className={styles.chatMessageDate}>
                                                    {item.sentDay}
                                                </Col>
                                            </Row>
                                            : null
                                    }
                                    <Row
                                        className={item.senderId === auth.currentUser.uid ? styles.chatMessageRowRight : styles.chatMessageRowLeft}
                                        span={24}
                                        justify='space-between'
                                        align='middle'
                                        wrap={false}
                                        key={index}
                                    >
                                        <Col className={styles.chatMessageText}>
                                            {item.message}
                                        </Col>
                                    </Row>
                                    <span className={item.senderId === auth.currentUser.uid ? styles.chatMessageTimeRight : styles.chatMessageTimeLeft}>{item.sentAt}</span>
                                </Col>
                            )
                        })
                    }
                    <Row className={styles.messageInputContainer} align='end' justify='end'>
                    <Col>
                            <WarningOutlined className={styles.warningIcon} onClick={() => {setIsModalOpen(true)}}/>
                        </Col>
                        <Col flex='auto'>
                            <TextArea
                                maxLength={255}
                                value={newMessage.message}
                                onChange={(e) => {
                                    setNewMessage({
                                        message: e.target.value,
                                        type: 'text',
                                        senderId: auth.currentUser.uid,
                                    });
                                }}
                                placeholder='Type your message...'
                                autoSize={{ minRows: 2, maxRows: 6 }}
                            />
                        </Col>
                        <Col>
                            <Button type='primary' htmlType="submit" className={styles.loadMoreButton} disabled={isLoading || !newMessage.message} onClick={handleMessageSend}>
                            {isLoading ? <LoadingOutlined className={styles.loadingGif} /> : "Send"}
                        </Button>
                        </Col>
                    </Row>
                </Col>              
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
            </Row>
        </Col>
    );

}

export default ChatMessagesComponent;