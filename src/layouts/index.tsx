import React, { FunctionComponent } from 'react';
import { ConfigProvider, Layout } from 'antd';
import { withRouter } from 'umi';

import './index.less';

const LayoutWrapper: FunctionComponent = function(props) {
  return (
    <ConfigProvider>
      <Layout>
        <Layout.Header></Layout.Header>
        <Layout.Content>{props.children}</Layout.Content>
        <Layout.Footer></Layout.Footer>
      </Layout>
    </ConfigProvider>
  );
};

export default withRouter(LayoutWrapper);
