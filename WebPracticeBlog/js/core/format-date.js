export const formatDate = date => {
  if (!(date instanceof Date)) {
    return formatDate(new Date(date));
  }
  
  return date.toJSON().slice(0, 10).replace(/-/g, '/');
};
