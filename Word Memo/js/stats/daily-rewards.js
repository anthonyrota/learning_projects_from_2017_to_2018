import { namespace, countNamespace } from '../daily-rewards.js';
import { format } from '../helpers.js';

export default [
  [
    'Time Until Next<br>Daily Reward',
    () => {
      const diff = 86400000 - (Date.now() - Number(store.get(namespace)));
      
      const hr = Math.floor(diff / 3600000);
      const min = Math.floor(diff / 60000) % 60;
      
      return `${hr}hr<br>${min}min`;
    }
  ],
  [
    'Amount Of Daily Rewards Collected',
    () => store.get(countNamespace)
  ]
];

