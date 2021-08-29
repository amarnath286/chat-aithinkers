import React from 'react';

import { Row } from 'antd';
import { useSelector, shallowEqual } from 'react-redux';

import InfoModal from '../../../components/Modal';

const DeleteOnePinMessage = () => {
  const { deletePinMessage } = useSelector(
    ({ Channels }) => Channels,
    shallowEqual,
  );

  return (
    <>
      <InfoModal
        title={'Message'}
        width={700}
        className="memberModelInfo createFormModel"
        isOpen={deletePinMessage}
        isClose={false}
      >
        <>
          <Row justify="center">
            <p style={{ fontSize: '25px' }}>
              Oops! You are blocked in Thinksabio Chat by admin.
              <br></br>
              Please contact Admin
            </p>
          </Row>
        </>
      </InfoModal>
    </>
  );
};

export default DeleteOnePinMessage;
