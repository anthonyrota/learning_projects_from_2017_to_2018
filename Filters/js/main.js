class Filter {
  constructor(img) {
    this.filterData = {};
    
    this.container = $('#container');
    this.canvas = $('#canvas');
    this.canvasDOM = this.canvas[0];
  
    this.renderer = PIXI.autoDetectRenderer(0, 0, {
      view: this.canvasDOM,
      resolution: 1
    });
    
    this.backgroundColor = 0x000000;
    
    this.currentImage = false;
    
    this.bindEvents();
    this.chooseImage(img);
    
    this.downloadManager = new DownloadManager(this.renderer, this);
  }
  
  hadImage() {
    return !!this.currentImage;
  }
  
  updateDimensions() {
    if (!this.currentImage) {
      return false;
    }
    
    const width = this.currentImage.width;
    const height = this.currentImage.height;
    
    this.renderer.resize(width, height);
    
    const maxWidth = $(window).width() * 0.9;
    const dimensions = width / height;
    
    if (width > maxWidth) {
      const sizing = {
        width: `${maxWidth}px`,
        height: `${maxWidth / dimensions}px`
      };
      
      this.container.css(sizing);
      this.canvas.css(sizing);
    } else {
      const sizing = {
        width: `${width}px`,
        height: `${height}px`
      };
      
      this.container.css(sizing);
      this.canvas.css(sizing);
    }
  }
  
  bindEvents() {
    const self = this;
    
    $(window).on('resize', this.updateDimensions.bind(this));
    
    const $upload = $('#upload');
    const $submit = $('#submit');
    
    const uploadDOM = $upload[0];
    
    $upload.on('change', function() {
      const { files } = uploadDOM;
      
      if (files && files[0]) {
        if (files[0].size > 2097152) {
          swal('Oops!', 'We only accept files less than 2MB', 'error');
          return;
        }
        
        const url = (window.webkitURL ? window.webkitURL : URL).createObjectURL(files[0]);
        
        self.chooseImage(url);
      }
    });
    
    $submit.on('click', this.render.bind(this));
    
    $('#add-simple-filter').on('click', this.addSimpleFilter.bind(this));
    $('#add-color-matrix-preset').on('click', this.addColorMatrixFilterPreset.bind(this));
    $('#add-convolution-matrix').on('click', this.addConvolutionMatrixFilter.bind(this));
  }
  
  render() {
    if (this.currentImage) {
      this.updateDimensions();
      const { width, height } = this.currentImage;
      
      const pos = [width / 2, height / 2];
      
      this.currentImage.pivot.set(...pos);
      this.currentImage.position.set(...pos);
      
      const graphics = new PIXI.Graphics();
      graphics.beginFill(this.backgroundColor);
      graphics.drawRect(0, 0, width, height);
      graphics.endFill();
      
      const stage = new PIXI.Container();
      stage.addChild(graphics);
      stage.addChild(this.currentImage);
      this.currentImage.filters = this.gatherFilters();
      this.currentImage.filterArea = new PIXI.Rectangle(0, 0, width, height);
      
      this.renderer.render(stage);
    }
  }
  
  gatherFilters() {
    const filters = [];
    const image = this.currentImage;
    
    for (let id in this.filterData) {
      const filter = this.filterData[id].getFilter(image);
      
      if (typeof filter === 'number') {
        this.backgroundColor = filter;
        continue;
      }
      
      if (filter) {
        filters.push(filter);
      }
    }
    
    return filters;
  }
  
  addFilter(FilterConstructor) {
    const self = this;
    
    const filter = new FilterConstructor();
    const id = filter.getID();
    
    this.filterData[id] = filter;
    
    filter.onclose(function() {
      delete self.filterData[id];
    });
  }
  
  addSimpleFilter() {
    this.addFilter(SimpleFilter);
  }
  
  addColorMatrixFilterPreset() {
    this.addFilter(ColorMatrixFilterPreset);
  }
  
  addConvolutionMatrixFilter() {
    this.addFilter(ConvolutionFilter);
  }
  
  chooseImage(src) {
    const self = this;
    
    const image = new Image();
    image.src = src;
    
    image.onload = function() {
      const base = new PIXI.BaseTexture(image);
      const texture = new PIXI.Texture(base);
      const sprite = new PIXI.Sprite(texture);
      
      sprite.position.set(0, 0);
      self.currentImage = sprite;
      
      self.render();
    };
  }
}

$(function() {
  new Filter('assets/jellyfish.png');
});