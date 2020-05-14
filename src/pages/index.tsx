import React from 'react';
import { Carousel } from 'antd';
import { request } from 'umi';
import './index.less';

const ITools = function(props: any) {
  const { imgs } = props;
  return (
    <div className="itools">
      <Carousel autoplay draggable={true}>
        {imgs &&
          imgs.map((img: any) => {
            return (
              <div className="carousel-item" key={img.id}>
                <img width="100%" src={img.url} alt={img.copyright} />
              </div>
            );
          })}
      </Carousel>
    </div>
  );
};

ITools.getInitialProps = async function() {
  const { images } = await request(
    'https://cn.bing.com/HPImageArchive.aspx?format=js&idx=0&n=3',
  );
  return {
    imgs: images.map((img: any) => ({
      id: img.hsh,
      url: `http://s.cn.bing.net${img.url}`,
      copyright: img.copyright,
    })),
  };
};

export default ITools;
