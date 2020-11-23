import { spawn, ChildProcessWithoutNullStreams } from 'child_process';
import nodemon from 'nodemon';

// 运行服务端
nodemon({
  exec: 'ts-node -P tsconfig-node.json ./server/index.ts',
  ext: 'ts',
  watch: [],
});

let process1: ChildProcessWithoutNullStreams | null = null;
nodemon.on('start', function() {
  process1 = spawn('umi', ['dev'], {
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
