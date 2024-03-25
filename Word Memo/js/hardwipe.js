export function setupHardwipeDOM($container) {
  const $card = $('<div class="card shadow-dark">');
  const $content = $('<ul class="card-content flex-center">');
  
  const $trigger = $(`
    <li class="card-item flex-center red-button align-center">
      <h1 class="margin-bottom-small bold uppercase">Hardwipe</h1>
      <h2>Remove All<br>Your Progress</h2>
    </li>
  `);
  
  $trigger.fastClick(() => {
    swal({
      title: 'Are you sure?',
      text: 'This will delete all your progress.',
      type: 'warning',
      buttons: ['Cancel', 'Hardwipe'],
      dangerMode: true
    })
    .then(value => {
      if (value) {
        confirm();
      }
    });
  });
  
  $content.append($trigger);
  $card.append($content);
  
  $container.append($card);
}

function confirm() {
  swal('Type CONFIRM To Hardwipe', {
    content: 'input'
  })
  .then(value => {
    if (value === 'CONFIRM') {
      checkAgain();
    }
  });
}

function checkAgain() {
  swal({
    title: 'Are you sure?',
    text: 'Last Chance to stop. (Hardwiping will delete all of your in app purchases too...)',
    type: 'warning',
    dangerMode: true,
    buttons: ['Cancel', 'Hardwipe']
  })
  .then(value => {
    if (value) {
      hardwipe();
    }
  });
}

function hardwipe() {
  swal('Reloading', 'You Wiped Your Progress...', 'success');
  
  store.clearAll();
  
  window.setTimeout(() => window.location.reload(true), 2000);
}
