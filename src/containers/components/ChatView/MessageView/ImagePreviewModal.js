import React, { useState } from 'react';

import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';

import { setIsModalVisible } from '../../../../actions/channel';
import InfoModal from '../../../../components/Modal';

const ImagePreviewModal = () => {
  const { isModalVisible, images } = useSelector(
    ({ Channels }) => ({
      isModalVisible: Channels.isModalVisible,
      images: Channels.images,
    }),
    shallowEqual,
  );
  const dispatch = useDispatch();
  const [index, setIndex] = useState(0);
  const images_list = images
    .filter((d) => d.type === 'image')
    .map((v) => v.image_url);

  const slideRight = () => {
    setIndex((index + 1) % images_list.length); // increases index by 1
  };

  const slideLeft = () => {
    const nextIndex = index - 1;
    if (nextIndex < 0) {
      setIndex(images_list.length - 1); // returns last index of images array if index is less than 0
    } else {
      setIndex(nextIndex);
    }
  };

  const handleCancel = () => {
    dispatch(setIsModalVisible(false, {}));
  };

  return (
    <InfoModal
      isOpen={isModalVisible}
      onClose={handleCancel}
      className="imageModelInfo"
    >
      {images_list.length > 1 ? (
        <div className="imageModelInfoContent">
          <div className="imageModelInfoInner">
            <img src={images_list[index]} alt={index} />
            <span className="LeftModelArrow">
              <LeftOutlined onClick={() => slideLeft()} />
            </span>
            {/* <span>
                  {index+1} / {images_list.length}
                </span> */}
            <span className="RightModelArrow">
              <RightOutlined onClick={() => slideRight()} />
            </span>
          </div>
        </div>
      ) : (
        <div className="imageModelInfoContent singalImageInfo">
          <div className="imageModelInfoInner">
            <img src={images_list[index]} alt={index} />
          </div>
        </div>
      )}
    </InfoModal>
  );
};

export default ImagePreviewModal;
