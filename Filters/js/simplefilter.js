class SimpleFilter extends Card {
  constructor() {
    super(SimpleFilter.filterData);
  }
  
  bindToggles(obj) {
    this.data = obj.modifier
      ? {
          modifier: true,
          name: obj.name,
          
          values: {}
        }
      : {
          constructor: obj.constructor,
          name: obj.name,
          
          values: {}
        };
    
    this.toggles = $('<ul class="toggles">');
    
    const values = this.data.values;
    
    const options = obj.options;
    
    for (let name in options) {
      const data = options[name];
      
      const binding = data.realname || name;
      const namespace = data.namespace || false;
      
      values[binding] = {
        value: data.init,
        namespace: namespace
      };
      
      values[binding].listItem = new ListItemInput(values[binding], {
        min: data.min,
        max: data.max,
        step: data.step,
        name: data.name,
        isColor: data.color
      });
      
      this.toggles.append(values[binding].listItem.getHtml());
    }
    
    this.listItem.children('.toggles').remove();
    this.listItem.append(this.toggles);
  }
  
  bindOptionsToObj(obj, binding, { value, namespace }) {
    if (namespace) {
      obj[namespace][binding] = value;
    } else {
      obj[binding] = value;
    }
    
    return value;
  }
  
  getFilter(image) {
    const data = this.data;
    
    if (data.modifier) {
      let background;
      
      for (let binding in data.values) {
        const value = this.bindOptionsToObj(image, binding, data.values[binding]);
        
        if (binding === 'background') {
          background = value;
        }
      }
      
      return background;
    }
    
    let filter = new PIXI.filters[data.constructor]();
    
    for (let binding in data.values) {
      this.bindOptionsToObj(filter, binding, data.values[binding]);
    }
    
    return filter;
  }
}

SimpleFilter.filterData = [
  {
    name: "Blur",
    constructor: "BlurFilter",
    options: {
      blur: {
        name: "Blur",
        min: 0,
        max: 20,
        step: 0.01,
        init: 9
      },
      quality: {
        name: "Quality",
        min: 1,
        max: 10,
        step: 0.01,
        init: 10
      }
    }
  },
  {
    name: "Noise",
    constructor: "NoiseFilter",
    options: {
      noise: {
        name: "Noise",
        min: 0,
        max: 1,
        step: 0.001,
        init: 0.5
      },
      seed: {
        name: "Seed",
        min: 0,
        max: 1,
        step: 0.001,
        init: 0.5
      }
    }
  },
  {
    name: "Ascii",
    constructor: "AsciiFilter",
    options: {
      size: {
        name: "Size",
        min: 1,
        max: 100,
        step: 0.01,
        init: 8
      }
    }
  },
  {
    name: "Dot",
    constructor: "DotFilter",
    options: {
      scale: {
        name: "Scale",
        min: 0.1,
        max: 1,
        step: 0.0001,
        init: 0.5
      },
      angle: {
        name: "Rotation",
        min: 0,
        max: 5,
        step: 0.01,
        init: 0
      }
    }
  },
  {
    name: "Emboss",
    constructor: "EmbossFilter",
    options: {
      strength: {
        name: "Strength",
        min: 0,
        max: 50,
        step: 0.1,
        init: 12
      }
    }
  },
  {
    name: "Pixelate",
    constructor: "PixelateFilter",
    options: {
      x: {
        namespace: "size",
        name: "Size X",
        min: 1,
        max: 40,
        step: 0.1,
        init: 5
      },
      y: {
        namespace: "size",
        name: "Size Y",
        min: 1,
        max: 40,
        step: 0.1,
        init: 5
      }
    }
  },
  {
    name: "RGB Split",
    constructor: "RGBSplitFilter",
    options: {
      redX: {
        namespace: "red",
        name: "Red X",
        realname: "x",
        min: -20,
        max: 20,
        step: 0.05,
        init: 0
      },
      redY: {
        namespace: "red",
        name: "Red Y",
        realname: "y",
        min: -20,
        max: 20,
        step: 0.05,
        init: 0
      },
      blurX: {
        namespace: "blue",
        name: "Blue X",
        realname: "x",
        min: -20,
        max: 20,
        step: 0.05,
        init: 0
      },
      blueX: {
        namespace: "blue",
        name: "Blue Y",
        realname: "y",
        min: -20,
        max: 20,
        step: 0.05,
        init: 0
      },
      greenX: {
        namespace: "green",
        name: "Green X",
        realname: "x",
        min: -20,
        max: 20,
        step: 0.05,
        init: 0
      },
      greenY: {
        namespace: "green",
        name: "Green Y",
        realname: "y",
        min: -20,
        max: 20,
        step: 0.05,
        init: 0
      }
    }
  },
  {
    name: "Cross Hatch",
    constructor: "CrossHatchFilter",
    options: {}
  },
  {
    name: "Bloom",
    constructor: "BloomFilter",
    options: {
      blur: {
        name: "Blur",
        min: 0,
        max: 20,
        step: 0.01,
        init: 2
      },
      blurX: {
        name: "Blur X",
        min: 0,
        max: 20,
        step: 0.01,
        init: 2
      },
      blurY: {
        name: "Blur Y",
        min: 0,
        max: 20,
        step: 0.01,
        init: 2
      }
    }
  },
  {
    name: "Tilt Shift",
    constructor: "TiltShiftFilter",
    options: {
      blur: {
        name: "Blur",
        min: 0,
        max: 200,
        step: 0.1,
        init: 120
      },
      gradientBlur: {
        name: "Gradient",
        min: 0,
        max: 1000,
        step: 0.5,
        init: 600
      }
    }
  },
  {
    name: "Shockwave",
    constructor: "ShockwaveFilter",
    options: {
      time: {
        name: "Time",
        min: 0,
        max: 1,
        step: 0.001,
        init: 0.5
      },
      x: {
        namespace: "center",
        name: "Center X",
        min: 0,
        max: 1,
        step: 0.001,
        init: 0.5
      },
      y: {
        namespace: "center",
        name: "Center Y",
        min: 0,
        max: 1,
        step: 0.001,
        init: 0.5
      }
    }
  },
  {
    name: "Bulge Pinch",
    constructor: "BulgePinchFilter",
    options: {
      radius: {
        name: "Radius",
        min: 0,
        max: 1000,
        step: 1,
        init: 100
      },
      strength: {
        name: "Strength",
        min: -1,
        max: 1,
        step: 0.001,
        init: 1
      },
      x: {
        name: "Center X",
        namespace: "center",
        min: 0,
        max: 1,
        step: 0.001,
        init: 0.5
      },
      y: {
        name: "Center Y",
        namespace: "center",
        min: 0,
        max: 1,
        step: 0.001,
        init: 0.5
      }
    }
  },
  {
    name: "Color Replace",
    constructor: "ColorReplaceFilter",
    options: {
      originalColor: {
        name: "Original",
        color: true
      },
      newColor: {
        name: "New",
        color: true
      },
      epsilon: {
        name: "Epsilon",
        min: 0,
        max: 1,
        step: 0.001,
        init: 0.4
      }
    }
  },
  {
    name: "Modifiers",
    modifier: true,
    options: {
      tint: {
        name: "Tint",
        color: true,
        init: 0xFFFFFF
      },
      alpha: {
        name: "Alpha",
        min: 0,
        max: 1,
        step: 0.001,
        init: 1
      },
      background: {
        name: "Background",
        color: true,
        init: 0x000000
      },
      rotation: {
        name: "Rotation",
        min: 0,
        max: 2 * Math.PI,
        step: 0.001,
        init: 0
      }
    }
  }
];
