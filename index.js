const app = require('electron').remote.app;

const run=require('./run');
document.getElementById('confirm-btn').addEventListener('click', function() {
  event.preventDefault();
  var path = document.getElementById('path').value
  var username = document.getElementById('username').value
  var password = document.getElementById('password').value
  var userStoryPath = document.getElementById('userstorypath').value
  if(!path||!username||!password||!userStoryPath){
      alert("need input required item")
  }else{
    (async () => {
      await run(path, userStoryPath,username, password,document);
    })();
  }
});
