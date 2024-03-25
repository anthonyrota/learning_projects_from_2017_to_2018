class SearchParameters {
  constructor() {
    this.url = window.location.search;
  }
  
  get(search) {
    const name = search.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
  
    const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    const results = regex.exec(this.url);
  
    return results === null ? ''
      : decodeURIComponent(results[1].replace(/\+/g, ' '));
  }
  
  getPost() {
    return this.get('post');
  }
  
  getQuery() {
    return this.get('query');
  }
  
  getEditing() {
    return this.get('editing');
  }
}

export const URLParameters = new SearchParameters();
