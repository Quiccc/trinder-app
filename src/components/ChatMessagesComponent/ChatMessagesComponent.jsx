import { Button, Col, Row } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { getChatMessages, sendMessage, subscribeToChat } from '../../server/ChatService';
import { auth } from '../../server/config/FirebaseConfig';
import styles from './ChatMessagesComponent.module.css';

const ChatMessagesComponent = ({ chatId }) => {
    const [chatMessages, setChatMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [advert, setAdvert] = useState({});
    const navigate = useNavigate();

    const handleMessageSend = async () => {
        await sendMessage(chatId, newMessage);
        setNewMessage(''); // Clear the input after sending the message
    };

    useEffect(() => {
        getChatMessages(chatId).then((res) => {
            setChatMessages(res.messages);
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
    return (
        <Col xxl={18} xl={18} lg={18} md={22} sm={22} xs={22} justify='center' align='center'>
            {
                advert && (
                    <Row align="middle" className={styles.cardContainer} span={23} onClick={() => {
                        navigate(`/advert/${advert?.advert_id}`);
                    }}>
                        <img
                            className={styles.advertImage}
                            src={advert?.image || 'images/no_image.png'}
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
                            <Button type='primary' onClick={handleMessageSend} disabled={!newMessage.message} className={styles.loadMoreButton}>
                                Send
                            </Button>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Col>
    );

}

export default ChatMessagesComponent;