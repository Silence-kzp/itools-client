import React from 'react';
import { Helmet } from 'react-helmet';
import { Carousel } from 'antd';
import { request } from 'umi';

import Login from 'components/Login';

import './index.less';

const ITools = function(props: any) {
  const { imgs } = props;
  return (
    <>
      <Helmet>
        <title>登录 ｜ iToole</title>
      </Helmet>
      <div className="itools">
        <Carousel autoplay autoplaySpeed={5000} draggable={true} fade>
          {imgs &&
            imgs.map((img: any) => {
              return (
                <div className="carousel-item" key={img.id}>
                  <img width="100%" src={img.url} alt={img.copyright} />
                  <div className="carousel-item-wrapper">
                    <span className="carousel-item-title">{img.title}</span>
                    <span className="carousel-item-copyright">
                      {img.copyright}
                    </span>
                  </div>
                </div>
              );
            })}
        </Carousel>
        <Login />
      </div>
    </>
  );
};

ITools.getInitialProps = async function() {
  try {
    const { images } = await request(
      'https://cn.bing.com/HPImageArchive.aspx?format=js&idx=0&n=2',
    );
    return {
      imgs: images.map((img: any) => {
        const matched = img.copyright.match(/(.*)\((.*)\)$/);
        return {
          id: img.hsh,
          url: `http://s.cn.bing.net${img.url}`,
          title: matched[1],
          copyright: matched[2],
        };
      }),
    };
  } catch (e) {
    return {};
  }
};

export default ITools;
