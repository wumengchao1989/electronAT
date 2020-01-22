const puppeteer = require('puppeteer');
const path=require('path')
var fs = require('fs');
var count = 0;
var filesAlreadyScanned = new Array()


function addConsoleList(document,text){
      var elem = document.createElement("li");
      elem.className = "list-group-item";
      elem.innerHTML=`<span>${text}</span>`
      document.documentElement.appendChild(elem);
}

function terminatePupeeteer(browserInstance){
      browserInstance.close();
}

async function run(inputPath,userStoryPath,username,password,browserDocument){
      const fileName = userStoryPath;
      try{
            fs.statSync(inputPath);
            fs.statSync(userStoryPath);
      }catch(err){
            if(err){
                  console.log(err)
                  alert("No such directory,please input right path,Process stop");
                  return 0
            }
      }
      var document = fs.readFileSync(fileName, 'utf-8');
      fs.readdir(inputPath, function (err, items) {
            if(err){
                  addConsoleList(browserDocument,err.toString())
                  return;
            }
            for (var i = 0; i < items.length; i++) {
                  var temp = items[i]
                  if (temp.split('.')[1] == 'pdf') {
                        filesAlreadyScanned[count] = temp.split('.')[0]
                        count = count + 1
                  }
            }
            console.log('This is the list that has already output: ')
            for (var fileAreadyScanned of filesAlreadyScanned) {
                  console.log(fileAreadyScanned)
            }

            (async () => {
                  console.log('There are ' + filesAlreadyScanned.length + " already scanned")
                  const browser = await puppeteer.launch({
                        headless: true
                  });
                  var page = await browser.newPage();
                  await page.goto('https://rally1.rallydev.com/');
                  await page.waitForSelector('#j_username')
                  await page.focus('#j_username')
                  await page.keyboard.type(username);
                  await page.focus('#j_password');
                  await page.keyboard.type(password);
                  try{
                        await page.click('#login-button');
                        await page.click('#login-button');
                  }catch(err){
                        console.log(err)
                  }
         /*          await page.waitFor(3000);
                  let loginFlag = await page.$(".slm-print-link")
                  if (!loginFlag){
                        addConsoleList(browserDocument, "log in failed,process stopped")
                        await browser.close();
                        return;
                  } */
                  addConsoleList(browserDocument,"log in success")
                  if (document) {
                        var userStories = eval(document)
                        addConsoleList(browserDocument, "reading file")
                        for (var userStory of userStories) {
                              var storyName = await userStory.name
                              var formattedId = await userStory.formattedId;
                              var objectId = await userStory.objectID;
                              if (filesAlreadyScanned.indexOf(formattedId) != -1) {
                                    addConsoleList(browserDocument, `${formattedId} has already scanned, will be skiped`)
                                    continue
                              }
                              addConsoleList(browserDocument, `start handling ${formattedId}`)
                              var tempurl = 'https://rally1.rallydev.com/slm/ar/print/printSingleDialog.sp?oid=' + objectId
                              await page.goto(tempurl)
                              await page.waitFor(3000);
                              await page.waitForSelector('input[type="submit"]')
                              await page.click('input[type="submit"]')
                              await page.waitForSelector('.slm-print-link')
                              savingPath = path.join(inputPath,`${formattedId}.pdf`)
                              await page.waitForSelector('.dt-tbl')
                              await page.waitFor(10000);
                              await page.pdf({ path: savingPath, format: 'A4' });
                              addConsoleList(browserDocument, `${savingPath} has saved`)
                              await page.goto('https://rally1.rallydev.com/');
                        }
                        console.log("finished")
                  }
                  await browser.close()
            })();
      });
}

module .exports=run;


