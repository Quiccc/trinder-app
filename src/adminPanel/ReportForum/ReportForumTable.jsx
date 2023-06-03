import { Button, Col, Modal, Table } from "antd";
import { useEffect, useState } from "react";
import useNotification from "../../hooks/UseNotification";
import { banUser, deleteComment, deleteReport, getReportsFromForum } from "../../server/AdminService";
import styles from "./ReportForumTable.module.css";

const ReportForumTable = () => {
  const [data, setData] = useState([]);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [selectedAction, setSelectedAction] = useState("");
  const [selectedItemId, setSelectedItemId] = useState("");
  const { alertSuccess } = useNotification();
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
      title: "User Warning Count",
      key: 'warningCount',
      render: (text,record) => <div>
        { record?.user?.warningCount ? record.user.warningCount : 0 }
      </div>,
  },
    {
      title: "Action",
      dataIndex: 'id',
      key: 'id',
      render: (text,record) => (
        <Col>
          <Button onClick={() => showConfirmModal("deleteComment", record.commentId)}>Delete Comment / Send Warning</Button>
          <Button onClick={() => showConfirmModal("ban", record.comment.createdBy)}>Ban User</Button>
          <Button onClick={() => showConfirmModal("deleteReport", text)}>Delete Report</Button>
        </Col>
      ),
    },
  ];

  const handleDeleteComment = (commentId) => {
    deleteComment(commentId).then((res) => {
      // Handle success or failure, if needed
      alertSuccess("Comment deleted successfully!");
      const newData = data.filter((item) => item?.commentId !== commentId);
      setData(newData);
    });
  };

  const handleBanUser = (userId) => {
    banUser(userId).then((res) => {
      // Handle success or failure, if needed
      alertSuccess("User banned successfully!");
      const newData = data.filter((item) => item?.comment.createdBy !== userId);
      setData(newData);
    });
  };

  const handleDeleteReport = (reportId) => {
    deleteReport(reportId).then((res) => {
      alertSuccess("Report deleted successfully!");
      const newData = data.filter((item) => item?.id !== reportId);
      setData(newData);
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
    } else if (selectedAction === "deleteReport") {
      handleDeleteReport(selectedItemId);
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
