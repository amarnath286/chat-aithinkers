import React, { useEffect, useCallback, useState, useRef } from 'react';

import { SearchOutlined } from '@ant-design/icons';
import { Input } from 'antd';
import { debounce } from 'lodash';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import {
  // filterChannels,
  filterChannelsByMessage,
  searchMessageInChannel,
  getChannels,
} from '../../../../actions/channel';
import { RESET_CHANNEL_SEARCH } from '../../../../constants/actionTypes';

const Filters = () => {
  const dispatch = useDispatch();
  const { search, client, channels, searchType, activeChannel } = useSelector(
    (state) => state.Channels,
    shallowEqual,
  );
  const inputValue = useRef(search);
  const [searchText, setSearchText] = useState('');
  const [page, setPage] = useState(0);
  // const [loading, setLoading] = useState(false);
  const handleInput = (e) => {
    inputValue.current = e.target.value;
  };

  const searchMessage = () => {
    if (inputValue.current && inputValue.current.length) {
      dispatch(
        searchMessageInChannel(
          inputValue.current,
          activeChannel,
          client,
          channels,
        ),
      );
    } else {
      dispatch({
        type: RESET_CHANNEL_SEARCH,
      });
    }
  };

  const loadMoreChannels = async (page) => {
    // setLoading(true);
    const newPage = page + 1;
    setPage(newPage);
    const offset = newPage * 10;
    await dispatch(getChannels(client, offset));
    // setLoading(false);
  };

  const onTextChange = (event) => {
    const { value } = event.target;
    if (!searchType) {
      debouncedSave(value);
    }
  };

  const changeSearchText = (value) => {
    setSearchText(value);
    if (value.length > 3) {
      loadMoreChannels(page);
    }
  };
  const debouncedSave = useCallback(
    debounce((value) => changeSearchText(value), 200),
  );

  useEffect(() => {
    if (searchText.length > 3) {
      const fetchData = async () => {
        await dispatch(filterChannelsByMessage(searchText, client, channels));
      };
      fetchData();
    } else {
      dispatch({
        type: RESET_CHANNEL_SEARCH,
      });
    }
  }, [channels, client, dispatch, searchText]);

  return (
    <>
      {searchType !== 'in-channel' ? (
        <div style={{ padding: '20px' }}>
          <Input
            placeholder="Search"
            size="middle"
            onChange={onTextChange}
            className="searchInputBoxList"
            prefix={<SearchOutlined color={'#c0c0c0 !important'} />}
            allowClear
          />
        </div>
      ) : (
        <div style={{ padding: '20px' }}>
          <Input
            placeholder="Search"
            size="middle"
            onChange={handleInput}
            className="searchInputBoxList"
            onPressEnter={() => searchMessage()}
            prefix={<SearchOutlined color={'#c0c0c0 !important'} />}
            allowClear
          />
        </div>
      )}
    </>
  );
};

export default Filters;
