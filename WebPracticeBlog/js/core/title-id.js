export const getIdOfTitle = title => title
  .toLowerCase()
  .trim()
  .replace(/[\-\s_]+/g, '-')
  .replace(/\-+/g, '-')
  .replace(/[^\-_a-zA-Z0-9]/g, '');
