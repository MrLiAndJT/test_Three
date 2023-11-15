// 对象转换成字符串
export const tarnToStr = (value: unknown) => {
  let target = '';
  try {
    target = JSON.stringify(value);
  } catch (err) {
    target = '';
  }
  return target;
};

// 字符串转换成对象
export const tranToObj = <T>(value: string | null | undefined, defaultValue = {} as T): T => {
  let target = defaultValue;
  if (typeof value !== 'string') {
    return defaultValue;
  }
  try {
    target = JSON.parse(value);
  } catch (err) {
    target = defaultValue;
  }
  return target;
};