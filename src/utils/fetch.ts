import axios, { AxiosResponse } from 'axios';

const instance = axios.create();

instance.interceptors.response.use(
  function(response: AxiosResponse<any>) {
    const { data } = response;
    if (!data.success) return Promise.reject(data.message);
    if (data.obj && !data.list) return data.obj;
    else if (data.list && !data.obj) return data.list;
    else if (data.list && data.obj) return { obj: data.obj, list: data.list };
  },
  function(error: any) {
    return Promise.reject(error);
  },
);
export default instance;
