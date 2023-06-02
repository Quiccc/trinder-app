import { Button, Col, Modal, Table } from "antd";
import { useEffect, useState } from "react";
import { banUser, getReportsFromChat, sendWarning } from "../../server/AdminService";
import styles from "./ReportChatTable.module.css";

const ReportChatTable = () => {
  const [data, setData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState([{}]);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [selectedAction, setSelectedAction] = useState("");
  const [selectedItemId, setSelectedItemId] = useState("");

  const dataSource = data;

  const columns = [
    {
        title: "Report Text",
        dataIndex: 'reportText',
        key: 'reportText',
    },
    {
        title: "Reported User",
        dataIndex: 'user',
        key: 'user',
        render: (text) => <div>{text.name + " " + text.surname}</div>,
    },
    {
        title: "View Chat",
        dataIndex: 'chat',
        key: 'chat',
        //Chat.messages is array show in modal
        render: (text) => <Button onClick={() => { setModalData(text); setModalVisible(true) }}>View Chat</Button>,
    },
    {
      title: "Action",
      dataIndex: 'id',
      key: 'id',
      render: (text,record) => (
        <Col>
          <Button onClick={() => showConfirmModal("sendWarning", text)}>Send Warning</Button>
          <Button onClick={() => showConfirmModal("ban", record.userId)}>Ban User</Button>
        </Col>
      ),
    },
  ];

  const handleSendWarning = (chatId) => {
    sendWarning(chatId).then((res) => {
      // Handle success or failure, if needed
    });
  };

  const handleBanUser = (userId) => {
    banUser(userId).then((res) => {
      // Handle success or failure, if needed
    });
  };

  const showConfirmModal = (action, itemId) => {
    setSelectedAction(action);
    setSelectedItemId(itemId);
    setConfirmModalVisible(true);
  };

  const handleConfirmModalOk = () => {
    if (selectedAction === "sendWarning") {
      handleSendWarning(selectedItemId);
    } else if (selectedAction === "ban") {
      handleBanUser(selectedItemId);
    }

    setConfirmModalVisible(false);
  };

  const handleConfirmModalCancel = () => {
    setConfirmModalVisible(false);
  };

  useEffect(() => {
    getReportsFromChat().then((res) => {
      setData(res);
    });
  }, []);

  return (
    <div>
      <Table className={styles.Line} dataSource={dataSource} columns={columns} />

      {modalVisible && (
        <Modal
          title="Chat"
          visible={modalVisible}
          onOk={() => setModalVisible(false)}
          onCancel={() => setModalVisible(false)}
        >
          <Col>
            <ul>
              {modalData.messages.map((message) => (
                <li key={message.id}>{message.message}</li>
              ))}
            </ul>
          </Col>
        </Modal>
      )}

      <Modal
        title="Confirmation"
        visible={confirmModalVisible}
        onOk={handleConfirmModalOk}
        onCancel={handleConfirmModalCancel}
      >
        <p>
          {selectedAction === "sendWarning"
            ? "Are you sure you want to send a warning to this user?"
            : "Are you sure you want to ban this user?"}
        </p>
      </Modal>
    </div>
  );
};

export default ReportChatTable;
