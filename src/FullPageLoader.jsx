// src/components/FullPageLoader.js

import React from 'react';
import { Spin } from 'antd';

const FullPageLoader = () => {
  return (
    <div className="full-page-loader">
      <Spin size="large" />
    </div>
  );
};

export default FullPageLoader;
