import '../core/core.js';

import { Search } from '../core/search-field.js';

fetch('https://webdesignblog-a4a18.firebaseio.com/posts.json?shallow=true')
  .then(res => res.json())
  .then(json => {
    const titles = Object.keys(json);
    
    $(() => Search.bind(({
      titles,
      $count: $('.site-search-count'),
      $results: $('.site-search-results'),
      $search: $('.site-search-no-redirect')
    })));
  });
