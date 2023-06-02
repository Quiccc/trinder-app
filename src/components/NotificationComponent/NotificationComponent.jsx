import { Dropdown } from "antd";
import { CircleNotificationsRounded } from "@mui/icons-material";
import { getActiveUserNotifications, deactivateNotification } from "../../server/NotificationService";
import styles from "./NotificationComponent.module.css"
import{ useState, useEffect } from "react";
import { MessageOutlined } from "@ant-design/icons";
import { ForumOutlined } from "@mui/icons-material";


const NotificationComponent = () => {

  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);

  const getNotifications = async () => {
    const response = [];
    const notifications = await getActiveUserNotifications();
    if (notifications.length > 0) {
      for (let i = notifications.length - 1; i >= 0; i--){
        if (notifications[i].type === "chat"){
          response.push({
            label: <a href="https://trinder-4pp.firebaseapp.com/chat" className={styles.notificationText}>{notifications[i].senderName} sent a message: "{notifications[i].content}"</a>,
            key: notifications[i].id,
            icon: <MessageOutlined />
          })
        }
        else if (notifications[i].type === "forum"){ 
          response.push({
            label: <a href="https://trinder-4pp.firebaseapp.com/forum" className={styles.notificationText}>{notifications[i].senderName} commented: "{notifications[i].content}" on "{notifications[i].topicHeader}"</a>,
            key: notifications[i].id,
            icon: <ForumOutlined />
          })
        }
      }
    }
    return response;
  };

  useEffect(() => {
    getNotifications().then((res) => {
      setItems(res);
    });
  }, [items])

  useEffect(() => {
    console.log("open", open);
    if(items.length !== 0 && open === false){
      items.forEach((item) => {
        deactivateNotification(item.key);
      });
    }
  }, [open])

  const handleOpen = (flag) => {
    setOpen(flag);
  };

  if (items.length > 0){
    return (
      <Dropdown menu={{ items }} trigger={["hover"]} open={open} onOpenChange={handleOpen}>
        <a>
            <CircleNotificationsRounded className={styles.notificationIcon} style={{fontSize:'3rem'}} />
        </a>
      </Dropdown>
    );
  }

  return (
    <Dropdown trigger={["hover"]} open={open} onOpenChange={handleOpen} dropdownRender={() => (
      <div className={styles.noNotificationContainer}>
        <img className={styles.noNotificationImage} src="/images/no_notification.png"></img>
        <p className={styles.noNotificationText} alt="">You have no notifications.</p>
      </div>
    )}>
      <a>
          <CircleNotificationsRounded className={ styles.notificationIcon } style={{fontSize:'3rem'}} />
      </a>
    </Dropdown>
  );

};
export default NotificationComponent;
