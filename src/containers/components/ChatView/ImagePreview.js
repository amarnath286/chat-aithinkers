import React from 'react';

import { Row } from 'antd';

const ImagePreview = ({ images }) => {
  return (
    <>
      {images &&
        images.map((i) => {
          return (
            <div style={{ backgroundColor: 'black', margin: '5px' }}>
              <Row justify="flex-end" width="30px">
                <span style={{ fontWeight: 'bold', padding: '5px' }}>X</span>
              </Row>
              <Row>
                <img
                  src={URL.createObjectURL(i)}
                  alt={i.name}
                  style={{ width: '100px', height: '100px', padding: '5px' }}
                />
              </Row>
            </div>
          );
        })}
    </>
  );
};

export default ImagePreview;
