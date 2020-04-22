declare module '*.css';
declare module '*.less';
declare module "*.png";
declare module "worker-loader!*" {
    class WebpackWorker  extends Worker {
        constructor();
      }
    
      export default WebpackWorker 
}
