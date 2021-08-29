import React from 'react';

import { Modal } from 'antd';

const InfoModal = (props) => {
  return (
    <>
      <Modal
        title={props.title ? props.title : ''}
        visible={props.isOpen}
        onCancel={props.onClose}
        closable={props.isClose}
        footer={null}
        className={props.className}
        width={props.width ? props.width : 1000}
      >
        {props.children}
      </Modal>
    </>
  );
};

export default InfoModal;
