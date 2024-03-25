import { randomInt } from './helpers.js';

export const BRIGHT_COLORS = '#2ecc71|#3498db|#e67e22|#ecf0f1|#9b59b6'.split('|');

const shadow = `
  0.25px 1px COLOR,
  0.5px 2px COLOR,
  0.75px 3px COLOR,
  1px 4px COLOR
`;

export function colorText(selector) {
  const $text = $(selector);
  const text = $text.text().split('');
  
  $text.html(
    text.map(char => {
      const index = randomInt(0, BRIGHT_COLORS.length - 1);
      const color = BRIGHT_COLORS[index];
      return `<span style="
                color: ${color};
                text-shadow: ${shadow.replace(/COLOR/g, lighten(color, -0.38))};
                font-weight: bold;
              ">${char}</span>`;
    })
    .join('')
  );
}

function lighten(g,b){var a=parseInt(g.slice(1),16),c=0>b?0:255,d=0>b?-1*b:b,e=a>>16,f=a>>8&255;a&=255;return"#"+(16777216+65536*(Math.round((c-e)*d)+e)+256*(Math.round((c-f)*d)+f)+(Math.round((c-a)*d)+a)).toString(16).slice(1)};
