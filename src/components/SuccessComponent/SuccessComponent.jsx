import { Modal } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import Loading from '../Loading/Loading'


const SuccessComponent = () => {
    // react-router-dom
    const navigate = useNavigate()
    // pop up
    const success = (message) => {
        Modal.success({
            content: `${message}`,
            onOk() {
                navigate('/');
            },
            okText: "Ok",
        });
    };

    // const error = (message) => {
    //     Modal.error({
    //         content: `${message}`,
    //         onOk() {
    //             navigate('/');
    //         },
    //         okText: "Ok",
    //     });
    // };

    useEffect(() => {
        success("Payment is successful. In a few minutes, your package will be activated.");
        // eslint-disable-next-line
    }, [])
    return (
        <>
            <Loading payment={true} />
        </>
    )
}

export default SuccessComponent