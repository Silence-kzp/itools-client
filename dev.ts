import { spawn, ChildProcessWithoutNullStreams } from 'child_process';
import nodemon from 'nodemon';
import { program } from 'commander';

// 设置版本
program.version('1.0.0');

program.option('-s, --server', '启动服务端');
program.option('-c, --client', '启动客户端');
program.parse(process.argv);

// 运行服务端
const runServer = function() {
  return nodemon({
    exec: 'ts-node -P tsconfig-node.json ./server/index.ts',
    ext: 'ts',
    watch: ['server/'],
  });
};

// 运行客户端
const runClient = function(opts?: any) {
  return spawn('umi', ['dev'], opts);
};

// 同时运行
if (!program.client && !program.server) {
  console.log('同时运行', program);
  runServer();

  let process1: ChildProcessWithoutNullStreams | null = null;
  nodemon.on('start', function() {
    if (process1) return console.log('Restart server');
    process1 = runClient({
      stdio: 'pipe',
    }) as ChildProcessWithoutNullStreams;
    // 输出
    process1.stdout.pipe(process.stdout);
    // 错误
    process1.stderr.pipe(process.stderr);
    // 进程关闭
    process1.on('close', function() {
      nodemon.emit('quit');
    });
  });

  nodemon.on('quit', function() {
    if (process1) {
      process1?.kill();
    }
  });
}

if (program.server) runServer();
else runClient();
