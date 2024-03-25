const {
  cos,
  sin,
  PI,
  pow,
  sqrt,
  abs,
  asin
} = Math;

Object.assign($.easing, {
	'ease-in-quad': (x, t, b, c, d) => c * (t /= d) * t + b,
	'ease-out-quad': (x, t, b, c, d) => -c * (t /= d) * (t - 2) + b,
	'ease-in-out-quad': (x, t, b, c, d) => (t /= d / 2) < 1 ? c / 2 * t * t + b : -c / 2 * ((--t) * (t - 2) - 1) + b,
	'ease-in-cubic': (x, t, b, c, d) => c * (t /= d) * t * t + b,
	'ease-out-cubic': (x, t, b, c, d) => c * ((t = t / d - 1) * t * t + 1) + b,
	'ease-in-out-cubic': (x, t, b, c, d) => (t /= d / 2) < 1 ? c / 2 * t * t * t + b : c / 2 * ((t -= 2) * t * t + 2) + b,
	'ease-in-quart': (x, t, b, c, d) => c * (t /= d) * t * t * t + b,
	'ease-out-quart': (x, t, b, c, d) => -c * ((t = t / d - 1) * t * t * t - 1) + b,
	'ease-in-out-quart': (x, t, b, c, d) => (t /= d / 2) < 1 ? c / 2 * t * t * t * t + b : -c / 2 * ((t -= 2) * t * t * t - 2) + b,
	'ease-in-quint': (x, t, b, c, d) => c * (t /= d) * t * t * t * t + b,
	'ease-out-quint': (x, t, b, c, d) => c * ((t = t / d - 1) * t * t * t * t + 1) + b,
	'ease-in-out-quint': (x, t, b, c, d) => (t /= d / 2) < 1 ? c / 2 * t * t * t * t * t + b : c / 2 * ((t -= 2) * t * t * t * t + 2) + b,
	'ease-in-sine': (x, t, b, c, d) => -c * cos(t / d * (PI / 2)) + c + b,
	'ease-out-sine': (x, t, b, c, d) => c * sin(t / d * (PI / 2)) + b,
	'ease-in-out-sine': (x, t, b, c, d) => -c / 2 * (cos(PI * t / d) - 1) + b,
	'ease-in-exp': (x, t, b, c, d) => t === 0 ? b : c * pow(2, 10 * (t / d - 1)) + b,
	'ease-out-exp': (x, t, b, c, d) => t === d ? b + c : c * (-pow(2, -10 * t / d) + 1) + b,
	'ease-in-out-exp': (x, t, b, c, d) => t === 0 ? b : t === d ? b + c : (t /= d / 2) < 1 ? c / 2 * pow(2, 10 * (t - 1)) + b : c / 2 * (-pow(2, -10 * --t) + 2) + b,
	'ease-in-circ': (x, t, b, c, d) => -c * (sqrt(1 - (t /= d) * t) - 1) + b,
	'ease-out-circ': (x, t, b, c, d) => c * sqrt(1 - (t = t / d - 1) * t) + b,
	'ease-in-out-circ': (x, t, b, c, d) => (t /= d / 2) < 1 ? -c / 2 * (sqrt(1 - t * t) - 1) + b : c / 2 * (sqrt(1 - (t -= 2) * t) + 1) + b,
	'ease-in-elastic': (x, t, b, c, d) => {
		let s = 1.70158;
		let p = 0;
		let a = c;
		
		if (t === 0) {
		  return b;
	  }
	  if ((t /= d) == 1) {
	    return b + c;
    }
    if (!p) {
      p = d * 0.3;
    }
		if (a < abs(c)) {
		  a = c; s = p / 4;
		} else {
		  s = p / (2 * PI) * asin(c / a);
		}
		return -(a * pow(2, 10 * (t -= 1)) * sin((t * d - s) * (2 * PI) / p)) + b;
	},
	'ease-out-elastic': (x, t, b, c, d) => {
		let s = 1.70158;
		let p = 0;
		let a = c;
		
		if (t === 0) {
		  return b;
	  }
	  if ((t /= d) === 1) {
	    return b + c;
    }
    if (!p) {
      p = d * 0.3;
    }
		if (a < abs(c)) {
		  a = c;
		  s = p / 4;
		} else {
		  s = p / (2 * PI) * asin(c / a);
		}
		return a * pow(2, -10 * t) * sin((t * d - s) * (2 * PI) / p) + c + b;
	},
	'ease-in-out-elastic': (x, t, b, c, d) => {
		let s = 1.70158;
		let p = 0;
		let a = c;
		
		if (t === 0) {
		  return b;
	  }
	  if ((t /= d / 2) === 2) {
	    return b + c;
    }
    if (!p) {
      p = d * (0.3 * 1.5);
    }
		if (a < abs(c)) {
		  a = c;
		  s = p / 4;
		} else {
		  s = p / (2 * PI) * asin(c/a);
		}
		if (t < 1) {
		  return -0.5 * (a * pow(2, 10 * (t -= 1)) * sin((t * d - s) * (2 * PI) / p)) + b;
		} else {
  		return a * pow(2, -10 * (t -= 1)) * sin((t * d - s) * (2 * PI) / p ) * 0.5 + c + b;
		}
	},
	'ease-in-back': (x, t, b, c, d, s) => {
		if (s === undefined) {
		  s = 1.70158;
		}
		
		return c * (t /= d) * t * ((s + 1) * t - s) + b;
	},
	'ease-out-back': (x, t, b, c, d, s) => {
		if (s === undefined) {
		  s = 1.70158;
		}
		
		return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
	},
	'ease-in-out-back': (x, t, b, c, d, s) => {
		if (s === undefined) {
		  s = 1.70158;
		}
		if ((t /= d / 2) < 1) {
		  return c / 2 * (t * t * (((s *= 1.525) + 1) * t - s)) + b;
		} else {
		  return c / 2 * ((t -= 2) * t * (((s *= 1.525) + 1) * t + s) + 2) + b;
		}
	},
	'ease-in-bounce': (x, t, b, c, d) => c - $.easing['ease-out-bounce'](x, d - t, 0, c, d) + b,
	'ease-out-bounce': (x, t, b, c, d) => {
		if ((t /= d) < (1 / 2.75)) {
			return c * (7.5625 * t * t) + b;
		} else if (t < (2 / 2.75)) {
			return c * (7.5625 * (t -= 1.5 / 2.75) * t + 0.75) + b;
		} else if (t < (2.5 / 2.75)) {
			return c * (7.5625 * (t -= 2.25 / 2.75) * t + 0.9375) + b;
		} else {
			return c * (7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375) + b;
		}
	},
	'ease-in-out-bounce': (x, t, b, c, d) => {
		if (t < d / 2) {
		  return $.easing['ease-in-bounce'](x, t * 2, 0, c, d) * 0.5 + b;
		} else {
		  return $.easing['ease-out-bounce'](x, t * 2 - d, 0, c, d) * 0.5 + c * 0.5 + b;
		}
	}
});
