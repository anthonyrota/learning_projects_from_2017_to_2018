class ColorMatrixFilterPreset extends Card {
  constructor() {
    super(ColorMatrixFilterPreset.filterData);
  }
  
  bindToggles(obj) {
    this.data = {
      binding: obj.binding,
      name: obj.name,
      
      params: []
    };
    
    this.toggles = $('<ul class="toggles">');
    
    const params = this.data.params;
    
    const options = obj.params;
    
    for (let i = 0; i < options.length; i++) {
      const data = options[i];
      
      params[i] = {
        value: data.init
      };
      
      params[i].listItem = new ListItemInput(params[i], {
        min: data.min,
        max: data.max,
        step: data.step,
        name: data.name,
        isColor: data.color
      });
      
      this.toggles.append(params[i].listItem.getHtml());
    }
    
    this.listItem.children('.toggles').remove();
    this.listItem.append(this.toggles);
  }
  
  getFilter() {
    let params = [];
    
    for (let i = 0; i < this.data.params.length; i++) {
      params[i] = this.data.params[i].value;
    }
    
    let filter = new PIXI.filters.ColorMatrixFilter();
    
    const binding = this.data.binding;
    
    filter[binding](...params);
    
    return filter;
  }
}

ColorMatrixFilterPreset.filterData = [
  {
    name: "Contrast",
    binding: "contrast",
    params: [
      {
        name: "Amount",
        min: 0,
        max: 10,
        step: 0.001,
        init: 4
      }
    ]
  },
  {
    name: "Black & White",
    binding: "blackAndWhite",
    params: []
  },
  {
    name: "Brightness",
    binding: "brightness",
    params: [
      {
        name: "Amount",
        min: 0,
        max: 5,
        step: 0.0001,
        init: 2
      }
    ]
  },
  {
    name: "Browni",
    binding: "browni",
    params: []
  },
  {
    name: "Color Tone",
    binding: "colorTone",
    params: [
      {
        name: "Desaturation",
        min: -3,
        max: 3,
        step: 0.01,
        init: 0
      },
      {
        name: "Toned",
        min: -3,
        max: 3,
        step: 0.01,
        init: 0
      },
      {
        name: "Light Color",
        color: true
      },
      {
        name: "Dark Color",
        color: true
      }
    ]
  },
  {
    name: "Desaturate",
    binding: "desaturate",
    params: []
  },
  {
    name: "Greyscale",
    binding: "greyscale",
    params: [
      {
        name: "Scale",
        min: 0,
        max: 1,
        step: 0.0001,
        init: 0.5
      }
    ]
  },
  {
    name: "Hue",
    binding: "hue",
    params: [
      {
        name: "Rotation",
        min: 0,
        max: 360,
        step: 0.01,
        init: 180
      }
    ]
  },
  {
    name: "Kodachrome",
    binding: "kodachrome",
    params: []
  },
  {
    name: "LSD :)",
    binding: "lsd",
    params: []
  },
  {
    name: "Negative",
    binding: "negative",
    params: []
  },
  {
    name: "Night",
    binding: "night",
    params: [
      {
        name: "Intensity",
        min: -2,
        max: 2,
        step: 0.0001,
        init: 1
      }
    ]
  },
  {
    name: "Polaroid",
    binding: "polaroid",
    params: []
  },
  {
    name: "Predator",
    binding: "predator",
    params: [
      {
        name: "Amount",
        min: -1.2,
        max: 1.2,
        step: 0.0001,
        init: 0.6
      }
    ]
  },
  {
    name: "Saturate",
    binding: "saturate",
    params: [
      {
        name: "Amount",
        min: 0,
        max: 1,
        step: 0.0001,
        init: 0.4
      }
    ]
  },
  {
    name: "Sepia",
    binding: "sepia",
    params: []
  },
  {
    name: "Technicolor",
    binding: "technicolor",
    params: []
  },
  {
    name: "RGB -> GBR",
    binding: "toBGR",
    params: []
  },
  {
    name: "Vintage",
    binding: "vintage",
    params: []
  }
];
