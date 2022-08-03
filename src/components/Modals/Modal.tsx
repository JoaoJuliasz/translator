import { forwardRef, useImperativeHandle, useState } from 'react';
import { Button, Modal } from 'antd';
import 'antd/dist/antd.css';
import { ModalHandle } from '../../types/types';

import './Modal.styles.scss';

type ModalContainerProps = {
    children: React.ReactNode
}

const ModalContainer = forwardRef<ModalHandle, ModalContainerProps>(({ children }: ModalContainerProps, ref) => {
    const [visible, setVisible] = useState<boolean>(false);

    useImperativeHandle(ref, () => ({
        openModal: () => open(),
        close: () => close()
    }));

    const open = () => {
        setVisible(true);
    }

    const close = () => {
        setVisible(false);
    }

    return (
        <Modal visible={visible} onOk={close} onCancel={close}
        footer={null}
        >
            {children}
        </Modal>
    );
});

export default ModalContainer;