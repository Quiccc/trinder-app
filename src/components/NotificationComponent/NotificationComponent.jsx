import { Dropdown } from "antd";
import { CircleNotificationsRounded, MoreHorizOutlined } from "@mui/icons-material";
import { getUserNotifications } from "../../server/NotificationService";
import styles from "./NotificationComponent.module.css";

const NotificationComponent = () => {
  let notifications = [];
  const getNotifications = async () => {
    notifications = await getUserNotifications();
  };

  const items = [
    {
      label: <a href="https://www.antgroup.com">1st menu item</a>,
      key: '0'
    },
    {
      label: <a href="https://www.aliyun.com">2nd menu item</a>,
      key: '1'
    },
    {
      label: '3rd menu item',
      key: '2'
    },
    {
      label: '3rd menu item',
      key: '3'
    },
    {
      label: '3rd menu item',
      key: '4'
    },
    {
      type: 'divider'
    },
    {
      label: 'Show all notifications',
      icon: <MoreHorizOutlined />,
      key: '6'
    }
  ];
  
  return (
    <Dropdown menu={{ items }} trigger={["click"]}>
      <a onClick={getNotifications}>
          <CircleNotificationsRounded className={styles.notificationIcon} style={{fontSize:'3rem'}} />
      </a>
    </Dropdown>
  );
};
export default NotificationComponent;
