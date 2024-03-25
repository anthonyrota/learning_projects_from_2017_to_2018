import { search } from './search.js';
import { createSearchHTML } from './search-html.js';
import { URLParameters } from './url-parameters.js';

class SiteSearch {
  constructor() {
    this.cache = {};
    this.images = {};
  }
  
  query(query) {
    this.search.val(query);
    
    if (!query) {
      this.count.css('color', 'c0392b');
      this.count.html('Please Enter a Valid Search');
      this.results.html('');
      
      return;
    }
    
    if (this.cache[query]) {
      this.display(this.cache[query]);
      
      return;
    }
    
    search(query, results => {
      this.cache[query] = results;
      
      this.display(results);
    }, this.titles);
  }
  
  bind({
    titles,
    onresultcreated,
    $count,
    $results,
    $search
  }) {
    this.titles = titles;
    this.onresultcreated = onresultcreated;
    this.count = $count;
    this.results = $results;
    this.search = $search;
    
    this.search.on('input', e => {
      const query = this.search.val();
      
      this.query(query);
    });
    
    const query = URLParameters.getQuery();
    
    this.query(query);
  }
  
  display(results) {
    const count = results.length;
    
    this.results.html('');
    
    if (!count) {
      this.count.html('We Could Not Find Any Search Results<br>Try Searching Another Topic');
      
      return;
    }
    
    this.count.html(`${count} ${count === 1 ? 'Result' : 'Results'} Found`);
    
    for (let i = 0; i < results.length; i++) {
      this.displayResult(results[i]);
    }
  }
  
  displayResult(result) {
    const id = result.id;
    
    let $html = this.images[id]
      ? createSearchHTML(result, this.images[id])
      : createSearchHTML(result, false, url => this.images[id] = url);
    
    if (this.onresultcreated) {
      $html = this.onresultcreated(result, $html);
    }
    
    this.results.append($html);
  }
}

export const Search = new SiteSearch();
