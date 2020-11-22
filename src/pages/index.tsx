import React from 'react';
import { Carousel } from 'antd';
import { request, history, Helmet } from 'umi';

import Login from 'components/Login';
import { GetParam } from 'utils/index';

import './index.less';

const ITools = function(props: any) {
  const { imgs, location } = props;

  const onLoginSuccess = function() {
    const redirect = GetParam('redirect', location.search);
    if (redirect) {
      window.location.href = redirect;
      return;
    }
    history.push('/');
  };

  return (
    <>
      <Helmet>
        <title>登录 ｜ iTools</title>
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
        <Login onComplete={onLoginSuccess} />
      </div>
    </>
  );
};

export default ITools;
