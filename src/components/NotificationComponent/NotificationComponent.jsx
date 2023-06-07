import { Col, Dropdown } from "antd";
import { CircleNotificationsRounded } from "@mui/icons-material";
import { deactivateNotification, subscribeToNotifications } from "../../server/NotificationService";
import styles from "./NotificationComponent.module.css"
import{ useEffect, useState } from "react";
import { MessageOutlined, WarningOutlined } from "@ant-design/icons";
import { ForumOutlined } from "@mui/icons-material";
import { useNavigate } from "react-router";


const NotificationComponent = () => {

  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavigateToChat = async (chatId,notificationId) => {
    await deactivateNotification(notificationId);
    navigate(`/chat`, { state: { chatId: chatId } });
  };
  const handleNavigateToForum = async (topicId,notificationId) => {
    await deactivateNotification(notificationId);
    navigate(`/forum`, { state: { topicId: topicId } });
  };

  const handleDeleteNotification = async (notificationId) => {
    setItems(items.filter((item) => item.key !== notificationId));
    await deactivateNotification(notificationId);
  };
  const getNotifications = async (notifications) => {
    const response = [];
    if (notifications.length > 0) {
      for (let i = notifications.length - 1; i >= 0; i--){
        if (notifications[i].type === "chat"){
          response.push({
            label: <div onClick={() => handleNavigateToChat(notifications[i].chatId,notifications[i].id)} className={styles.notificationText}>{notifications[i].senderName} sent a message.</div>,
            key: notifications[i].id,
            icon: <MessageOutlined />
          })
        }
        else if (notifications[i].type === "forum"){ 
          response.push({
            label: <div onClick={() => handleNavigateToForum(notifications[i].topicId,notifications[i].id)} className={styles.notificationText}>{notifications[i].senderName} commented on your topic.</div>,
            key: notifications[i].id,
            icon: <ForumOutlined />
          })
        } else {
          response.push({
            label: <div className={styles.notificationText} onClick={() => handleDeleteNotification(notifications[i].id)}>{notifications[i]?.content}</div>,
            key: notifications[i].id,
            icon: <WarningOutlined />
          })
        }
      }
    }
    return response;
  };

  useEffect(() => {
    subscribeToNotifications((newNotifications) => {
      getNotifications(newNotifications).then((response) => {
        setItems(response);
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subscribeToNotifications]);
  const handleOpen = (flag) => {
    setOpen(flag);
  };

  if (items.length > 0){
    return (
      <Dropdown menu={{ items }} trigger={["hover"]} open={open} onOpenChange={handleOpen} className={styles.dropdown}> 
            <Col>
              <CircleNotificationsRounded className={styles.notificationIcon} style={{fontSize:'3vw'}} />
            <div className={styles.notificationCount}>{items?.length}</div>
            </Col>
      </Dropdown>
    );
  }

  return (
    <Dropdown trigger={["hover"]} open={open} onOpenChange={handleOpen} dropdownRender={() => (
      <div className={styles.noNotificationContainer}>
        <img className={styles.noNotificationImage} src="/images/no_notification.png" alt="no notification" />
        <p className={styles.noNotificationText} alt="">You have no notifications.</p>
      </div>
    )}>
          <CircleNotificationsRounded className={ styles.notificationIcon } style={{fontSize:'3vw'}} />
    </Dropdown>
  );

};
export default NotificationComponent;
