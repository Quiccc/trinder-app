
import { CloseCircleOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { notification } from "antd";

const useNotification = () => {
    const alertError = (message) => {
        notification.config({
          placement: "topRight",
          duration: 5,
          style: {
            height: "5vw",
          },
          closeIcon: (
            <CloseCircleOutlined style={{ color: "red", fontSize: "3vh" }} />
          ),
        });
        notification.open({
          key: "unupdatable",
          message: "Error!",
          description: message,
          style: {
            marginTop: "4vh",
          },
        });
      };
    
      const alertSuccess = (message) => {
        notification.config({
          placement: "topRight",
          duration: 3.5,
          closeIcon: (
            <CheckCircleOutlined style={{ color: "green", fontSize: "3vh" }} />
          ),
        });
        notification.open({
          key: "unupdatable",
          message: "Success!",
          description: message,
          style: {
            marginTop: "4vh",
          },
        });
      };
    return {
        alertError,
        alertSuccess,
    };
};

export default useNotification;