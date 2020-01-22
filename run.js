const puppeteer = require('puppeteer');
var fs = require('fs');
var inputPath = "/Users/mwu233/test/"
var fileName = inputPath + 'UserStoryList.txt';

var document = fs.readFileSync(fileName, 'utf-8');
var count = 0;
const number = /^[0-9]+$/
var filesAlreadyScanned = new Array()


async function run(){
      fs.readdir(inputPath, function (err, items) {
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
                  await page.keyboard.type('xing.x.yu1@pwc.com');
                  await page.focus('#j_password');
                  await page.keyboard.type('Pwcwelcome1');
                  await page.waitFor(3000);
                  try{
                        await page.click('#login-button');
                        await page.click('#login-button');
                  }catch(err){
                        console.log(err)
                  }
                  console.log("log in success")
                  if (document) {
                        var userStories = eval(document)
                        console.log("reading file")

                        for (var userStory of userStories) {
                              var storyName = await userStory.name
                              var formattedId = await userStory.formattedId;
                              var objectId = await userStory.objectID;
                              if (filesAlreadyScanned.indexOf(formattedId) != -1) {
                                    console.log(formattedId + " has already scanned, will be skiped")
                                    continue
                              }
                              console.log("start handling " + formattedId)
                              var tempurl = 'https://rally1.rallydev.com/slm/ar/print/printSingleDialog.sp?oid=' + objectId
                              await page.goto(tempurl)
                              await page.waitFor(3000);
                              await page.waitForSelector('input[type="submit"]')
                              await page.click('input[type="submit"]')
                              await page.waitForSelector('.slm-print-link')
                              savingPath = inputPath + formattedId + '.pdf'

                              await page.waitForSelector('.dt-tbl')
                              await page.waitFor(10000);
                              await page.pdf({ path: savingPath, format: 'A4' });
                              console.log(savingPath + " has saved");
                              await page.goto('https://rally1.rallydev.com/');
                        }
                        console.log("finished")
                  }
                  await browser.close()
            })();
      });
}

module .exports=run;


