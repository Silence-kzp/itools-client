import React from 'react';

// 曲线拟合
// TODO: 如果存在相同的x和不同的y点，使用取均值的方法处理
const fitted_curve = function(points: number[][]) {
  const matrix = [];
  const formula = [];
  const len = points.length;
  for (let i = 0; i < len; i += 1) {
    const arr = [];
    for (let j = 0; j < len; j += 1) {
      arr.push(Math.pow(points[i][0], len - j - 1));
    }
    arr.push(points[i][1]);
    matrix.push(arr);
  }
  for (let i = 0; i < len; i += 1) {
    const base = matrix[i][i];
    for (let j = 0; j < len + 1; j += 1) {
      if (base === 0) {
        throw new Error('存在相同的x和不同的y点，无法使用多项式拟合');
      }
      matrix[i][j] = matrix[i][j] / base;
    }
    for (let j = 0; j < len; j += 1) {
      if (i !== j) {
        const inner = matrix[j][i];
        for (let k = 0; k < len + 1; k += 1) {
          matrix[j][k] = matrix[j][k] - inner * matrix[i][k];
        }
      }
    }
  }

  for (let i = 0; i < len; i += 1) {
    const val = matrix[i][len];
    if (i !== 0) val > 0 ? formula.push('+') : formula.push('-');
    if (matrix[i][len] !== 0) {
      const idx = len - 1 - i;
      formula.push(
        `${i === 0 ? val : Math.abs(val)}${
          idx !== 0 ? ` * Math.pow(x, ${len - 1 - i})` : ''
        }`,
      );
    }
  }
  return formula.join(' ');
};

export default () => {
  const points = [
    [1, 4],
    [2, 5],
    [4, 8],
  ];
  const formula = fitted_curve(points);
  console.log(formula);
  return <div></div>;
};
