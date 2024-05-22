const express = require("express");
const multer = require('multer');
const path = require('path');
var fs = require('fs');
var colors = require('colors');
var colors = require('colors/safe');
var art = require('ascii-art');
const Image = require('ascii-art-image');
var Color = require('ascii-art-ansi/color.js');
var Convert = require('ansi-to-html');
Color.isTrueColor = true;

const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const PORT = 5000;

const app = express();
app.use(express.static('public'));
app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html')
})
app.use('/uploads', express.static(__dirname + '/uploads'));


app.listen(PORT, () => {
  console.log(colors.green.italic(`Listening on port `)+colors.brightGreen.bold(`${PORT}`)+colors.green.italic("..."));
  console.log(colors.bold.brightWhite("Server Started"));
  console.log(colors.bold.underline.white(`>>> http://127.0.0.1:${PORT} \n`));
});



// upload files --------------------------------------------------------------------------------------------------
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: function(req, file, cb){
  try {
   cb(null, file.originalname);
  }
  catch(err) {
  console.log('beans got squished')
  } 
}
});
  const upload = multer({
  storage: storage,
  }).array('name', 75);
  app.post('/upload', upload);
  app.post('/upload', async(req, res) => {
    console.log(colors.bold.white('Uploading ')+colors.bold.underline.brightWhite(req.files.length)+colors.bold.white(' Images...'));
    await res.json('ok');
    await res.end;
  });
  //get req ID
  app.post('/upload_reqID', async(req, res) => {
    await timerDeleteFiles();
    await res.json('ok');
    await res.end;
  // timer delete files -------------------------------------------
  function timerDeleteFiles() {
    let reqID = req.body[0].reqID;
    let upload_arr = req.body;
  console.log(colors.white(`Upload request id: `)+colors.brightWhite(reqID));
  console.log(colors.yellow('Delete Timer Started, 1 hour for '+reqID));
  console.log(colors.bold.underline.brightWhite(`Upload done\n`));


  var waitDelete = setInterval(function(){
    console.log(colors.bold.yellow(`Timer Delete: `)+colors.bold.brightWhite(upload_arr.length)+colors.bold.yellow(` images deleting for upload id: `)+colors.bold.brightWhite(reqID));
    for (let i = 0; i < upload_arr.length; i++) {
    fs.stat(upload_arr[i].location, function(err, stat) {
    if(err == null) {  
    fs.unlink(upload_arr[i].location, function(err) {
    if (err) {
    throw err
    } else {
      upload_arr[i] = 'deleted';
      if ((i+1) == upload_arr.length) {
        console.log(colors.underline.bold.brightYellow(`done > timer delete for upload id: `)+colors.bold.brightWhite(reqID+`\n`));
      }
    }
    })
    } else if(err.code === 'ENOENT') {
      console.log(colors.brightRed('no file found > ')+colors.brightWhite(upload_arr[i].location));
    } else {
        console.log('Some other error: ', err.code);
    }
   });
  }
  newarr = upload_arr.filter(a => a !== 'deleted');
  upload_arr = newarr;
  clearInterval(waitDelete);
 }, 3600000);//3600000
}
});


// convert to ascii request --------------------------------------------------------------------------------------------------
  app.post('/', (req, res) => {
  let i = req.body.i;
  let imgLinks_length = req.body.imgLinks.length;
  console.log(colors.brightBlue.bold((i+1)+"/"+imgLinks_length+` `)+
  colors.bold.brightBlue(`Converting `)+
  colors.bold.cyan(req.body.imgLinks[i].name+`...`));
  console.log(colors.bold.brightBlue(`From: `)
  +colors.bold.cyan(req.body.imgLinks[i].location));
  console.log(colors.cyan(`Request Id: `)+
  colors.white(req.body.reqId));

  function convertImg() {

    fs.stat(req.body.imgLinks[i].location, function(err, stat) {
      if(err == null) {
      //file exists
      Color.isTrueColor = true;
      var image = new Image({
      filepath: req.body.imgLinks[i].location,
      alphabet: req.body.imgLinks[i].alphabet,
      width: req.body.imgLinks[i].size * 12,
      posterize: false,
      threshold:9
      });
      image.write(async function(err, rendered){
        const dom = new JSDOM(`<!DOCTYPE html><p>${rendered}</p>`)
        let imgContent = dom.window.document.querySelector("p").textContent
        console.log(imgContent)
        var convert = new Convert({
          newline: true,
          escapeXML: false,
          stream: false
        });
        let convertHtml = convert.toHtml(imgContent)
        res.write(`<pre class='pre_cC' style='background: ${req.body.imgLinks[i].background};'>`+convertHtml.replace(/span/g, 'font')+"</pre>")
        await endRequest();
    })
      } else if(err.code === 'ENOENT') {
        res.write(`<pre class='pre_cC' style='background: #222020; padding: 9px;'><span style='font-size: 1.6rem; color: #ff6a6a'>No file found :(</span></pre>`)
        if ((i+1) == imgLinks_length) {
          console.log(colors.bold.cyan(`request end for > request id:`)+colors.bold.white(req.body.reqId))
          console.log(colors.bold.brightWhite.underline.bgCyan(`done\n`))
        }
        if ((i+1) < imgLinks_length) {
          console.log(colors.bold.brightRed('no file found > ')+colors.bold.brightWhite(req.body.imgLinks[i].location))
          console.log(colors.bold.brightRed(`next >>> \n`));
        }

        res.end();
      } else {
          console.log('Some other error: ', err.code);
      }
  });
}
convertImg();

// end request > convert to ascii
function endRequest() {
  const pathToFile = req.body.imgLinks[i].location;
  fs.unlink(pathToFile, function(err) {
    if (err) {
    throw err
    } else {
    console.log(colors.bold.cyan(`successfully deleted the image `)+colors.bold.brightBlue(req.body.imgLinks[i].data_name));
    if ((i+1) == imgLinks_length) {
    console.log(colors.bold.cyan(`request end for > request id:`)+colors.bold.white(req.body.reqId))
    console.log(colors.bold.brightWhite.underline.bgCyan(`done\n`))
    }
    if ((i+1) < imgLinks_length) {
    console.log(colors.bold.cyan(`next >>> \n`))
    }
    res.end();
    }
  })  
 }
});


// delete select images --------------------------------------------------------------------------------------------------
app.post('/deleteImg', (req, res) => {
  let reqDelArr = req.body;
  for (let i = 0; i < reqDelArr.length; i++) {
  fs.unlink('./uploads/'+reqDelArr[i].deleteID, function(err) {
    if (err) {
    throw err
    } else {
      console.log(colors.bold.brightYellow(`Delete >>> `)+colors.yellow(`successfully deleted the image `)+colors.brightWhite(req.body[i].data_name));
    }
  })  
  }
  res.send('ok');
  res.end;
});





// delete all files --------------------------------------------------------------------------------------------------
  const clearUploads = () => {
    const directory = './uploads';
        fs.readdir(directory, (err, files) => {
          if (err) throw err;
        
          for (const file of files) {
            fs.unlink(path.join(directory, file), err => {
              if (err) throw err;
              });
             }
           })
        };
clearUploads()