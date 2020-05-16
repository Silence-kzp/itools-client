import React, { useState } from 'react';
import { Button, Input, Checkbox } from 'antd';

import './index.less';

export default function() {
  const [error, setError] = useState<string>();
  const [type, setType] = useState('normal');
  const [form, setForm] = useState({
    account: null,
    password: null,
    remember: false,
  });

  const changeHandle = function(key: string) {
    return function(e: any) {
      if (key === 'remember') {
        setForm({
          ...form,
          [key]: e.target.checked,
        });
      } else {
        setForm({
          ...form,
          [key]: e.target.value,
        });
      }
      if (error) setError(undefined);
    };
  };

  const onConfirm = function() {
    if (!form.account) return setError('你还没有输入手机号码');
    else if (!form.password) return setError('你还没有输入密码');
  };
  return (
    <div className="login-frame">
      {error ? <span className="login-frame_error">{error}</span> : null}
      {type === 'normal' ? (
        <>
          <span className="login-frame_alternative">
            <span className="login-frame_atip">使用二维码登录</span>
            <span
              className="login-frame_qrcode"
              onClick={() => setType('qrcode')}
            />
          </span>
          <form>
            <Input
              placeholder="手机号码"
              name="account"
              onChange={changeHandle('account')}
            />
            <Input.Password
              placeholder="密码"
              name="password"
              autoComplete="on"
              onChange={changeHandle('password')}
            />
            <div style={{ textAlign: 'left' }}>
              <Checkbox onChange={changeHandle('remember')}>
                记住本次登录
              </Checkbox>
            </div>
          </form>
          <Button type="primary" shape="round" onClick={onConfirm}>
            登录
          </Button>
          <Button type="link">游客登录</Button>
        </>
      ) : null}
      {type === 'qrcode' ? (
        <>
          <span className="login-frame_alternative">
            <span className="login-frame_atip">使用(账号密码/游客)登录</span>
            <span
              className="login-frame_qrcode"
              onClick={() => setType('normal')}
            />
          </span>
          <span className="login-frame_qrcode-wrp">
            <img
              width="100%"
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQQAAAEEAQMAAAD0xthJAAAABlBMVEX///8AAABVwtN+AAABRElEQVRo3u3YMZKDMAwFUDEUlByBo3A0OBpH8RG2pPDkr2SZVREmO1FS/l+oUF7l2CAjzNvZ4DlFoKlWzxE9B0VGFLEsp2sTRUZIC8WtmAHsKvpqytorHhSfCetu/lsRiq8JWVBFQ/FSxNlXGbvVQpEU0HhX9VS1a/+AhyIlJIJdZGw6ehRPYsOPxPt8AsSz4qTIijLXvt7qrLsWkbZbB1DciP7W0dPs05BlAtRND6HIC+zW7XNQF9BQJIRHxQJL38OovpMpnkQ8LcsEeFXna0qRFn7v7rNPW2+xTgtFXtjZv24/Xs0NoLgXVuFr6hV9t1KkROS64cga8xLFjYg7oZYm4gsaRUrEt4sRUduqTxRpMQMxqVfTfWoaQPGfsOoTpgscFJ+LawLys0+RE3H2+9RkdyCKFwKeJmA5/r6gUWQE8/38AgaYGJOWfdLJAAAAAElFTkSuQmCC"
            />
          </span>
          <span className="login-frame_qrcode-tips">
            使用微信扫一扫，即可使用绑定账号登录
          </span>
        </>
      ) : null}
      <span className="login-frame_tips">推荐使用 Chrome 访问本站</span>
    </div>
  );
}
