const app = require('electron').remote.app;

const run=require('./run');

document.getElementById('start').addEventListener('click', function() {
  event.preventDefault();
  
  (async () => {
      await run();
  })();
});
