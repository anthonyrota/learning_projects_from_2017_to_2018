class ConvolutionFilter extends Card {
  constructor() {
    super(ConvolutionFilter.presets);
    
    this.defaultDimensions = 400;
    
    this.matrix = [];
    this.width = this.defaultDimensions;
    this.height = this.defaultDimensions;
    this.scaleFactor = 1;
    
    this.matrixDOM = [];
    
    this.bindHTML();
    
    this.bindToggles(ConvolutionFilter.presets[0]);
  }
  
  bindToggles(preset) {
    this.matrix = preset.matrix.slice(0);
    
    if (preset.scale) {
      this.scaleFactor = preset.scale;
    }
    
    if (this.matrixDOM) {
      for (let i = 0; i < this.matrixDOM.length; i++) {
        this.matrixDOM[i].val(this.matrix[i]);
      }
    }
  }
  
  createSlider(text, binding) {
    const li = $('<li>');
    const span = $('<span class="name">').html(text);
    const count = $('<span class="count">').html(this.defaultDimensions);
    const slider = $(`<input type="range" min="1" max="2000" value="${this.defaultDimensions}" class="slider">`);
    
    slider.on('change', () => {
      const val = slider.val();
      
      this[binding] = Number(val);
      count.html(val);
    });
    
    li.append(span);
    li.append(count);
    li.append(slider);
    
    return li;
  }
  
  createMatrix(size) {
    const li = $('<li>');
    const table = $('<table class="matrix-table">');
    
    for (let i = 0; i < size; i++) {
      const row = $('<tr>');
      
      for (let j = 0; j < size; j++) {
        const cell = $('<td>');
        const input = $('<input type="number" value="0" class="matrix-input text-input">');
        const index = i * size + j;
        
        cell.append(input);
        this.matrixDOM[index] = input;
        this.matrix[index] = 0;
        
        input.on('input', () => {
          this.matrix[index] = Number(input.val());
        });
        
        row.append(cell);
      }
      
      table.append(row);
    }
    
    const span = $('<span class="name matrix-header">').html('Matrix');
    
    li.append(span);
    li.append(table);
    
    return li;
  }
  
  createMultiplyButton() {
    const li = $('<li>');
    const span = $('<span class="name">').html('Multiply (Scale Factor)');
    const input = $('<input type="number" value="1" class="text-input">');
    
    input.on('input', () => {
      this.scaleFactor = Number(input.val());
    });
    
    li.append(span);
    li.append(input);
    
    return li;
  }
  
  bindHTML() {
    this.toggles = $('<ul class="toggles">');
    
    this.toggles.append(this.createSlider('Width', 'width'));
    this.toggles.append(this.createSlider('Height', 'height'));
    this.toggles.append(this.createMatrix(3));
    this.toggles.append(this.createMultiplyButton());
    
    this.listItem.append(this.toggles);
    
    $('.filters').append(this.listItem);
  }
  
  getFilter(image) {
    const matrix = this.matrix.slice(0);
    const width = this.width;
    const height = this.width;
    
    for (let i = 0; i < matrix.length; i++) {
      matrix[i] *= this.scaleFactor;
    }
    
    let filter = new PIXI.filters.ConvolutionFilter(matrix, width, height);
    
    return filter;
  }
}

ConvolutionFilter.presets = [
  {
    name: "Horizontal Edge",
    matrix: [
      -1, -1, -1,
      2, 2, 2,
      -1, -1, -1
    ]
  },
  {
    name: "Vertical Edge",
    matrix: [
      -1, 2, -1,
      -1, 2, -1,
      -1, 2, -1
    ]
  },
  {
    name: "Edge Detection",
    matrix: [
      -1, -1, -1,
      -1, 8, -1,
      -1, -1, -1
    ]
  },
  {
    name: "Edge Enhancement",
    matrix: [
      0, 0, 0,
      -1, 1, 0,
      0, 0, 0
    ]
  },
  {
    name: "Sobel Edge P1",
    matrix: [
      -1, -2, -1,
      0, 0, 0,
      1, 2, 1
    ]
  },
  {
    name: "Sobel Edge P2",
    matrix: [
      -1, 0, 1,
      -2, 0, 2,
      -1, 0, 1
    ]
  },
  {
    name: "Laplacian Edge",
    matrix: [
      0, -1, 0,
      -1, 4, -1,
      0, -1, 0
    ]
  },
  {
    name: "Blur V1",
    matrix: [
      0.111, 0.111, 0.111,
      0.111, 0.111, 0.111,
      0.111, 0.111, 0.111
    ]
  },
  {
    name: "Sharpen V1",
    matrix: [
      -1, -1, -1,
      -1, 9, -1,
      -1, -1, -1
    ]
  },
  {
    name: "Sharpen V2",
    matrix: [
      0, -1, 0,
      -1, 5, -1,
      0, -1, 0
    ]
  },
  {
    name: "Gradient Detection (H)",
    matrix: [
      -1, -1, -1,
      0, 0, 0,
      1, 1, 1
    ]
  },
  {
    name: "Gradient Detection (V)",
    matrix: [
      -1, 0, 1,
      -1, 0, 1,
      -1, 0, 1
    ]
  },
  {
    name: "Emboss",
    matrix: [
      -2, -1, 0,
      -1, 1, 1,
      0, 1, 2
    ]
  }
];
