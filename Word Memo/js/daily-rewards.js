import ScoreTracker from './score.js';
import Inventory from './inventory.js';

let isFirstTimePlaying = false;

const dayLength = 86400000;

export const namespace = 'Last Reward Date';

if (!store.get(namespace)) {
  store.set(namespace, Date.now());
  isFirstTimePlaying = true;
}

const rewardQueue = [
  {
    name: 'Daily 140 Coin Package',
    cb: () => ScoreTracker.removeCoins(-140)
  },
  {
    name: 'Daily Medium Score Booster',
    cb: () => Inventory.add('Medium Booster')
  }
];

export default function setupDailyRewards() {
  if (isFirstTimePlaying) {
    showReward();
  }
  
  checkForRewards();
}

function checkForRewards() {
  window.setTimeout(checkForRewards, 1000);
  
  const lastReward = Number(store.get(namespace));
  const time = Date.now();
  
  if (time - lastReward > dayLength) {
    showReward();
    store.set(namespace, time);
  }
}

const title = 'Collect Your Daily Reward';

export const countNamespace = '# Daily Rewards Collected';

if (!store.get(countNamespace)) {
  store.set(countNamespace, 0);
}

function showReward() {
  const amountOfRewards = Number(store.get(countNamespace || 0));
  store.set(countNamespace, amountOfRewards + 1);
  
  let index = -1;
  
  const showNext = () => {
    index++;
    
    if (index >= rewardQueue.length) {
      return;
    }
    
    const { name, cb } = rewardQueue[index];
    
    swal({
      title,
      text: name,
      type: 'success',
      buttons: [false, 'Accept']
    })
    .then(() => {
      cb();
      showNext();
    });
  };
  
  setTimeout(showNext, 2000);
}
