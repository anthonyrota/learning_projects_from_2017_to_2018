import { getIdOfTitle } from './title-id.js';

const wordDifference = (a, b) => {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          Math.min(
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          )
        );
      }
    }
  }

  return matrix[b.length][a.length];
};

const resolve = (search, callback, ids) => {
  const max = 24;
  const count = 50;
  
  const close = [];
  
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    const x = ids[i];
    const closeness = wordDifference(x, search);
    
    if (closeness < max) {
      close.push([id, closeness]);
      continue;
    }
    
    const ldiff = Math.abs(x.length - search.length);
    const isContained = x.indexOf(search) !== -1 || search.indexOf(x) !== -1;
    
    if (ldiff < max * 2 && isContained) {
      close.push([id, ldiff]);
    }
  }
  
  if (close.length === 0) {
    callback([]);
    return;
  }
  
  const sorted = close.sort((a, b) => a[1] - b[1]);
  const matches = sorted.slice(0, count);
  
  const postsRef = firebase.database().ref('posts');
  const idList = [];
  const res = [];
  
  for (let i = 0; i < matches.length; i++) {
    const id = matches[i][0];
    const ref = postsRef.child(id);
    
    idList[i] = id;
    res[i] = postsRef.child(id).once('value');
  }
  
  Promise.all(res).then(values => {
    const result = [];
    
    for (let i = 0; i < values.length; i++) {
      const id = idList[i];
      const {
        title,
        date,
        imagecaption,
        smallimage
      } = values[i].val();
      
      result[i] = {
        id,
        title,
        post: {
          image: smallimage,
          imagecaption,
          date
        }
      };
    }
    
    callback(result);
  });
};

export const search = (search, callback, allTitles) => {
  search = getIdOfTitle(search);
  
  if (allTitles) {
    resolve(search, callback, allTitles);
    return;
  }
  
  fetch('https://webdesignblog-a4a18.firebaseio.com/posts.json?shallow=true')
    .then(res => res.json())
    .then(res => {
      if (!posts) {
        callback([]);
        return;
      }
      
      resolve(search, callback, Object.keys(res));
    });
};
