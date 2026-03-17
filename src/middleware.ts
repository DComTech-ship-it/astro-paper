// No middleware functionality needed
export const onRequest = async (context, next) => {
  return next();
};
