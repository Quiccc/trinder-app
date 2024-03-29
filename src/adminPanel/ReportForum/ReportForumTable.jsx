import { Button, Col, Modal, Table } from "antd";
import { useEffect, useState } from "react";
import { banUser, deleteComment, getReportsFromForum } from "../../server/AdminService";
import styles from "./ReportForumTable.module.css";

const ReportForumTable = () => {
  const [data, setData] = useState([]);
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
        title: "Comment Text",
        dataIndex: 'comment',
        key: 'comment',
        render: (text) => <div dangerouslySetInnerHTML={{ __html: text.comment }}></div>,
    },
    {
        title: "Reported User",
        dataIndex: 'user',
        key: 'user',
        render: (text) => <div>{text.name + " " + text.surname}</div>,
    },
    {
      title: "Action",
      dataIndex: 'id',
      key: 'id',
      render: (text,record) => (
        <Col>
          <Button onClick={() => showConfirmModal("deleteComment", record.commentId)}>Delete Comment / Send Warning</Button>
          <Button onClick={() => showConfirmModal("ban", record.comment.createdBy)}>Ban User</Button>
        </Col>
      ),
    },
  ];

  const handleDeleteComment = (commentId) => {
    deleteComment(commentId).then((res) => {
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
    if (selectedAction === "deleteComment") {
      handleDeleteComment(selectedItemId);
    } else if (selectedAction === "ban") {
      handleBanUser(selectedItemId);
    }

    setConfirmModalVisible(false);
  };

  const handleConfirmModalCancel = () => {
    setConfirmModalVisible(false);
  };

  useEffect(() => {
    getReportsFromForum().then((res) => {
      setData(res);
    });
  }, []);

  return (
    <div>
      <Table className={styles.Line} dataSource={dataSource} columns={columns} />

      <Modal
        title="Confirmation"
        visible={confirmModalVisible}
        onOk={handleConfirmModalOk}
        onCancel={handleConfirmModalCancel}
      >
        <p>
          {selectedAction === "deleteComment"
            ? "Are you sure you want to delete this comment?"
            : "Are you sure you want to ban this user?"}
        </p>
      </Modal>
    </div>
  );
};

export default ReportForumTable;
