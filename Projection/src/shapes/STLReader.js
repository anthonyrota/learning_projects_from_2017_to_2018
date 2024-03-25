import Vec3 from '../math/Vec3.js';

const binaryVec3 = (view, offset) => new Vec3(
  view.getFloat32(offset + 0, true),
  view.getFloat32(offset + 4, true),
  view.getFloat32(offset + 8, true)
);

const loadBinaryStl = (buffer) => {
  const view = new DataView(buffer);
  const size = view.getUint32(80, true);
  const geom = {
    vertices: [],
    faces: []
  };
  
  let offset = 84;
  
  for (let i = 0; i < size; i++) {
    geom.vertices.push(
      binaryVec3(view, offset + 12),
      binaryVec3(view, offset + 24),
      binaryVec3(view, offset + 36)
    );
    
    geom.faces.push(i * 3, i * 3 + 1, i * 3 + 2);
    
    offset += 50;
  }
  
  return geom;
};

const m2vec3 = match => new Vec3(
  parseFloat(match[1]),
  parseFloat(match[2]),
  parseFloat(match[3])
);

const toLines = array => {
  let lines = [];
  let h = 0;
  
  for (let i = 0; i < array.length; i++) {
    if (array[i] === 10) {
      let line = String.fromCharCode.apply(null, array.subarray(h, i));
      lines.push(line);
      h = i + 1;
    }
  }
  
  lines.push(String.fromCharCode.apply(null, array.subarray(h)));
  return lines;
};

const loadTextStl = buffer => {
  const lines = toLines(new Uint8Array(buffer));
  let index = 0;
  
  const scan = regexp => {
    while (lines[index].match(/^\s*$/)) {
      index++;
    }
    
    return lines[index].match(regexp);
  };
  
  const scanOk = regexp => {
    let r = scan(regexp);
    
    if (!r) {
      throw new Error([
        `not text stl: ${regexp.toString()}`,
        `=> (line ${index - 1})`,
        `[${lines[index-1]}]`
      ].join(''));
    }
    
    index++;
    return r;
  };
  
  const facetReg = /^\s*facet\s+normal\s+([^\s]+)\s+([^\s]+)\s+([^\s]+)/;
  const vertexReg = /^\s*vertex\s+([^s]+)\s+([^\s]+)\s+([^\s]+)/;
  
  const geom = {
    vertices: [],
    faces: []
  };
  
  scanOk(/^\s*solid\s(.*)/);
  
  while (!scan(/^\s*endsolid/)) {
    scanOk(facetReg);
    scanOk(/^\s*outer\s+loop/);
    
    const v1 = scanOk(vertexReg);
    const v2 = scanOk(vertexReg);
    const v3 = scanOk(vertexReg);
    
    scanOk(/\s*endloop/);
    scanOk(/\s*endfacet/);
    
    const base = geom.vertices.length;
    
    geom.vertices.push(
      m2vec3(v1),
      m2vec3(v2),
      m2vec3(v3)
    );
    
    geom.faces.push(base, base + 1, base + 2);
  }
  
  return geom;
};

const getGeom = buffer => {
  try {
    return loadTextStl(buffer);
  } catch (e) {
    return loadBinaryStl(buffer);
  }
};

export default (src, callback) => {
  const request = new XMLHttpRequest();
  request.open('GET', src, true);
  request.responseType = 'blob';
  
  request.onload = function() {
    const reader = new FileReader();
    reader.readAsArrayBuffer(this.response);
    
    reader.onload = e => {
      const geom = getGeom(e.target.result);
      callback(geom);
    };
  };
  
  request.send();
};
