var PhotoApi_url = 'http://127.0.0.1:5000/uploads/';
// var PhotoApi_url = '/uploads/';

/*
      _                               _                 
   __| |_ __ ___  _ __    _ __     __| |_ __ ___  _ __  
  / _` | '__/ _ \| '_ \  | '_ \   / _` | '__/ _ \| '_ \ 
 | (_| | | | (_) | |_) | | | | | | (_| | | | (_) | |_) |
  \__,_|_|  \___/| .__/  |_| |_|  \__,_|_|  \___/| .__/ 
                 |_|                             |_|    
----------------------------------------------------------
*/


const dragDrop_app = () => {
    const droparea = document.querySelector('.droparea');
  const active = () => 
    document.querySelector(".innerflexRow_BorderDashed").classList.add("fileHover_borderOp") +
    document.querySelector(".dragNdrop_i").classList.add("dragNdrop_paraDrag");
  const inactive = () => 
    document.querySelector(".innerflexRow_BorderDashed").classList.remove("fileHover_borderOp") +
    document.querySelector(".dragNdrop_i").classList.remove("dragNdrop_paraDrag");
  const prevents = (e) => e.preventDefault();
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(evtName => {
    droparea.addEventListener(evtName, prevents);
    });
    ['dragenter', 'dragover'].forEach(evtName => {
        droparea.addEventListener(evtName, active);
    });
    ['dragleave', 'drop'].forEach(evtName => {
        droparea.addEventListener(evtName, inactive);
    });
    droparea.addEventListener("drop", handleDrop);
    }
    document.addEventListener("DOMContentLoaded", dragDrop_app);
  

const handleDrop = (e) => {
const dt = e.dataTransfer;
const dragDrop_file = dt.files;
if (clickChecker == false) {
  for (let i = 0; i < dragDrop_file.length; i++) {
    handFiles.push(dragDrop_file[i]);
    }
handleFiles();
}
}


const fileSelector = document.getElementById('file-upload');
fileSelector.addEventListener('change', (e) => {
const clickUpload_file = e.target.files;
if (clickChecker == false) {
  for (let i = 0; i < clickUpload_file.length; i++) {
    handFiles.push(clickUpload_file[i]);
    }
fileSelector.value = '';
handleFiles();
}
});

var handFiles = [];
var clickChecker = false;
var uploadFiles_sizeSum = 0;
var clickIsOkk = 'yes';
var requestId;
var imgData_Arr = [];
var uploadFiles_Name = [];



  /* 
  _                     _ _         __ _ _           
 | |__   __ _ _ __   __| | | ___   / _(_) | ___  ___ 
 | '_ \ / _` | '_ \ / _` | |/ _ \ | |_| | |/ _ \/ __|
 | | | | (_| | | | | (_| | |  __/ |  _| | |  __/\__ \
 |_| |_|\__,_|_| |_|\__,_|_|\___| |_| |_|_|\___||___/
  */


var fileText = document.getElementById("dragNdrop_files");
function handleFiles() {
 clickChecker = true;
 selectFileArr = [];
 clickIsOkk = 'yes';
//if not an accepted file type -------------------------------------------
//if size cap reached -------------------------------------------

  fileText.style.display = "none";
  if (imgData_Arr.length > 1) {
  document.getElementById("select_all").classList.add("file_areaButton");
  document.getElementById("select_all").classList.remove("file_areaButton_notAllowed");
  }

  var notOk_files = [];
  for (let i = 0; i < handFiles.length; i++) {
  var fname = handFiles[i].name;
  var re = /(\.jpg|\.jpeg|\.png)$/i;
    if (!re.exec(fname)) { 
      notOk_files.push(handFiles[i].name);
      handFiles[i] = 'deleted';
    } 
  }
  let newarr = handFiles.filter(a => a !== 'deleted');
  handFiles = newarr;

  uploadFiles_sizeSum = 0;
  uploadFiles_amount = [];
for (let i = 0; i < handFiles.length; i++) {
  uploadFiles_sizeSum += handFiles[i].size;
  uploadFiles_amount.push(handFiles[i].size);
}
for (let a = 0; a < imgData_Arr.length; a++) {
  uploadFiles_sizeSum += imgData_Arr[a].file_size;
  uploadFiles_amount.push(imgData_Arr[a].file_size);
}
if(uploadFiles_sizeSum > 50000000 || uploadFiles_sizeSum == NaN) {
  uploadFiles_sizeSum = 0;
  for (let i = 0; i < handFiles.length; i++) {
    uploadFiles_sizeSum += handFiles[i].size;
  }
  document.getElementById('dragNdrop_iPara').innerText = bytesToSize(uploadFiles_sizeSum)+
  " Transfer is too large! Size cap reached.";
    handFiles = [];
    clickIsOkk = 'no';
    if (imgData_Arr < 1) {
      fileText.style.display = 'flex';
    }
    return uploadError();
  } 
  
if(uploadFiles_amount.length > 75) {
  document.getElementById('dragNdrop_iPara').innerText = handFiles.length+
  " is too many images to transfer, already "+imgData_Arr.length+" images in queue.";
 if (imgData_Arr.length >= 75) {
   document.getElementById('dragNdrop_iPara').innerText = handFiles.length+
   " is too many images to transfer, you reached the maximum allowed in the queue.";
 }
   handFiles = [];
   clickIsOkk = 'no';
   if (imgData_Arr < 1) {
    fileText.style.display = 'flex';
  }
   return uploadError();
}
if (notOk_files.length > 0) {
  document.getElementById('dragNdrop_iPara').innerHTML = notOk_files+
  ', is not a valid image. Only jpeg and png images can be uploaded';
 if (notOk_files.length > 1) {
  document.getElementById('dragNdrop_iPara').innerText = notOk_files[0]+' and '+(notOk_files.length-1)+
  ' more image are not valid. Only jpeg and png images can be uploaded.';
 }
 if (notOk_files.length > 2) {
  document.getElementById('dragNdrop_iPara').innerText = notOk_files[0]+' and '+(notOk_files.length-1)+
  ' more images are not valid. Only jpeg and png images can be uploaded.';
 }
 uploadError();
}
  document.getElementById("dragNdrop_size").innerText = bytesToSize(uploadFiles_sizeSum) + " / 50MB";


  return sendPhotos();

}

//end handlefiles ------------------------------------------------------------------------------------
function uploadError() {

var uploadErrorTl = anime.timeline({
  easing: 'easeOutQuart'
});

uploadErrorTl
.add({
  targets: '.dragNdrop_i',
  begin: function() {
    if (imgData_Arr.length < 1) {
    document.querySelectorAll(".filearebP").forEach(Element => {
      Element.classList.remove("file_areaButton");
      Element.classList.add("file_areaButton_notAllowed");
    });
   }
    document.querySelector('.dragNdrop_i').classList.add('dragNdrop_iNotAccepted');
  },
  opacity: [
    {value: 1, duration: 4500},
  ],
  complete: function() {
    document.getElementById('dragNdrop_iPara').style.opacity = '0';
  }
})
.add({
  begin: function() {
    document.querySelector('.dragNdrop_i').classList.remove('dragNdrop_iNotAccepted');
    document.getElementById('dragNdrop_iPara').innerText = "Drag and drop to upload photos. Up to 75 images, and or a maximum of 50MB. This is the maximum that this little server can handle and on trying to submit more, an error may occur and your request won't be sent.";
  },
  targets: '#dragNdrop_iPara',
  opacity: 0.7,
  duration: 200,
  complete: function() {
    if (clickIsOkk == 'no')  {
      handFiles = [];
      clickChecker = false;
    }
  }
});

}

  function bytesToSize(uploadFiles_sizeSum) {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (uploadFiles_sizeSum == 0) return '0Bytes';
    var i = parseInt(Math.floor(Math.log(uploadFiles_sizeSum) / Math.log(1024)));
    return Math.round(uploadFiles_sizeSum / Math.pow(1024, i), 2) + sizes[i];
 }

  function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
  charactersLength));
   }
   return result;
  }

/*
              _                 _         _           _            
  _   _ _ __ | | ___   __ _  __| |  _ __ | |__   ___ | |_ ___  ___ 
 | | | | '_ \| |/ _ \ / _` |/ _` | | '_ \| '_ \ / _ \| __/ _ \/ __|
 | |_| | |_) | | (_) | (_| | (_| | | |_) | | | | (_) | || (_) \__ \
  \__,_| .__/|_|\___/ \__,_|\__,_| | .__/|_| |_|\___/ \__\___/|___/
       |_|                         |_|                             
*/


async function sendPhotos() {

    const opts = {
    method: 'POST',
    body: new FormData(),
    };

  requestId = Date.now()+'xx'+makeid(6)+"-";
  fileText.style.display = "none";
  let reqID_arr = [];

  for (let i = 0; i < handFiles.length; i++) {

    let img_idLoading = makeid(9)+"-"+handFiles[i].name;
    uploadFiles_Name.push(img_idLoading);
    opts.body.append(`name`, handFiles[i], requestId+uploadFiles_Name[i]);
    
    let photoInput = document.createElement('div');
    let photoInput_Inner = document.createElement('div');
    let photoPhotoNnLoadIcon_P = document.createElement('div');
    let photoInput_img = document.createElement('img');
    let photoInput_loadIcon = document.createElement('i');
    let photoInput_txt = document.createElement('p');

    photoInput.classList.add("file_item");
    photoInput.classList.add("file_itemInner-loading");
    photoInput_Inner.classList.add("file_itemInner");
    photoPhotoNnLoadIcon_P.classList.add("ImgContainer");
    photoInput_img.classList.add('file_itemImg');
    photoPhotoNnLoadIcon_P.style.animationDelay = anime.random(-18,-1)+'s';
    photoInput_txt.style.animationDelay = anime.random(-18,-1)+'s';

    photoInput.setAttribute("name", handFiles[i].name);
    photoInput.setAttribute("data", img_idLoading);
    photoInput.setAttribute("reqID", requestId);

    photoInput.setAttribute("photoSize", size_Counter);
    photoInput.setAttribute("background",  backgroundColor_arr[backgroundColor_arrCounter]);
    photoInput.setAttribute("alphabet", alphabet_arr[alphabet_arrCounter].name);
    photoInput.setAttribute("alphabetShort", alphabet_arr[alphabet_arrCounter].short);
    photoInput.setAttribute("fileSize", handFiles[i].size);

    photoInput.setAttribute("onclick", 'selectFile(event)');
    photoInput_img.setAttribute("width", '25px');
    photoInput_img.setAttribute("height", '25px');
    photoPhotoNnLoadIcon_P.append(photoInput_img);
    photoInput_loadIcon.innerHTML = `<i class="icon-ccw-1"></i>`;
    photoPhotoNnLoadIcon_P.append(photoInput_loadIcon);
    photoInput_txt.innerText = 'Loading...';
    photoInput_Inner.append(photoPhotoNnLoadIcon_P);
    photoInput_Inner.append(photoInput_txt);

    photoInput.append(photoInput_Inner);
    document.querySelector(".fileContainer").append(photoInput);
    reqID_arr.push({
      reqID: requestId,
      location: './uploads/'+requestId+img_idLoading
    })
  }

  // //if no images uploaded -------------------------------------------
  if (document.getElementsByClassName('file_item').length < 1) {
    document.getElementById("dragNdrop_files").style.display = "flex";
  } 
  if (document.getElementsByClassName('file_item').length > 1) {
  document.getElementById("dragNdrop_files").style.display = "none";
  }

  let opts_reqID = {
    method: 'POST',
    mode: 'cors', 
    cache: 'no-cache', 
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json'
    },
    redirect: 'follow', 
    referrerPolicy: 'no-referrer',
    body: JSON.stringify(reqID_arr)
  }

  try {
  const response = await fetch('/upload', opts)
  const response_reqID = await fetch('/upload_reqID', opts_reqID)
  if (response.ok && response_reqID.ok) {
    return uploadImgs_finish()
  } else {
    document.querySelector('.dragNdrop_iNotAccepted').innerText = "Something went wrong :(";
    return uploadError();
  }
  } catch {
    document.querySelector('.dragNdrop_iNotAccepted').innerText = "Something went wrong :(";
    return uploadError();
   }
  }

// finish upload -------------------------------------------------------------------------------------------
async function uploadImgs_finish() {

  uploadFiles_sizeSum = 0;
  let uploadLength = handFiles.length;
  let uploadedFiles = [];
  
  for (let i = 0; i < uploadFiles_Name.length; i++) {
    if (document.getElementsByClassName("file_itemInner-loading")[i].getAttribute("data") == uploadFiles_Name[i]) {
      let currentImageP = document.getElementsByClassName("file_itemInner-loading")[i].querySelector('.ImgContainer');
      let currentimage = document.getElementsByClassName("file_itemInner-loading")[i].querySelector('img');

      document.getElementsByClassName("file_itemInner-loading")[i].querySelector('p').innerText = document.getElementsByClassName("file_itemInner-loading")[i].getAttribute('name');
      document.getElementsByClassName("file_itemInner-loading")[i].querySelector('i').style.display = 'none';

      currentImageP.style.animation = 'photoGhost_anime 3s infinite';
      currentImageP.style.animationDelay = anime.random(-18,-1)+'s';
      currentImageP.style.background = '#7f7f7f';  
      currentimage.setAttribute("src", PhotoApi_url+requestId+uploadFiles_Name[i]);
      currentimage.setAttribute("alt", './images/warningIcon.png');

      document.getElementsByClassName("file_itemInner-loading")[i].querySelector('img').addEventListener('load', function() {
      currentImageP.style.animation = 'none';
      currentImageP.style.background = 'transparent';    
      currentimage.style.display = "block";
      anime({
        targets: currentimage,
        opacity: 0.8,
        duration: 100,
        easing: 'linear'
      })
    }); 


    let getImagesElem = document.getElementsByClassName("file_item")[i];
    imgData_Arr.push({
    location: './uploads/'+requestId+uploadFiles_Name[i],
    name: handFiles[i].name,
    data_name: getImagesElem.getAttribute("data"),
    background: backgroundColor_arr[backgroundColor_arrCounter],
    alphabet: alphabet_arr[alphabet_arrCounter].name,
    alphabetShort: alphabet_arr[alphabet_arrCounter].short,
    size: size_Counter,
    file_size: handFiles[i].size
  });

    uploadedFiles.push(uploadFiles_Name[i]);
    }
  } 

  // delete upload images after hour
  var waitDelete = setInterval(function(){
    imgData_Arr.splice(0, uploadLength);
    document.querySelectorAll('div').forEach(Element => {
      for (let i = 0; i < uploadedFiles.length; i++) {
        if (uploadedFiles[i] == Element.getAttribute('data')) {
          Element.remove();
        }
      }
    });
      if (imgData_Arr.length < 1) {
        fileText.style.display = 'flex';
      }
    clearInterval(waitDelete);
  }, 3600000);//3600000


  document.querySelectorAll('.file_itemInner-loading').forEach(Element => {
    Element.classList.remove('file_itemInner-loading');
  })
  uploadFiles_sizeSum = 0;
  for (let i = 0; i < imgData_Arr.length; i++) {
    uploadFiles_sizeSum += imgData_Arr[i].file_size;
  }
  
  document.getElementById("dragNdrop_size").innerText = bytesToSize(uploadFiles_sizeSum) + " / 50MB";
handFiles = [];
uploadFiles_Name = []
clickChecker = false;
document.getElementById("select_all").classList.add("file_areaButton");
document.getElementById("select_all").classList.remove("file_areaButton_notAllowed");
}



/*
           _           _                          
  ___  ___| | ___  ___| |_    __ _ _ __ ___  __ _ 
 / __|/ _ \ |/ _ \/ __| __|  / _` | '__/ _ \/ _` |
 \__ \  __/ |  __/ (__| |_  | (_| | | |  __/ (_| |
 |___/\___|_|\___|\___|\__|  \__,_|_|  \___|\__,_|
*/
  /*select file -------------------------------------------------------------------------------*/
  /*select file -------------------------------------------------------------------------------*/
  /*select file -------------------------------------------------------------------------------*/
  var selectFileArr = [];
  var selectTarget;
  var select_name;
  function selectFile(event) {
    selectTarget = event.target;
    select_DataName = selectTarget.getAttribute('data');
    select_name = selectTarget.getAttribute('name');
    select_reqID = selectTarget.getAttribute("reqid");

    if (selectTarget.firstChild.classList.contains('file_item-select') == true) {
      for (let i = 0; i < selectFileArr.length; i++) {
        if (select_name == selectFileArr[i].name) {
          selectFileArr.splice(i, 1);
        }
      }
      selectTarget.firstChild.classList.remove('file_item-select');
    } else {
      selectFileArr.push({
      target: selectTarget,
      data_name : select_DataName,
      name : select_name,
      location: './uploads/'+select_reqID+select_DataName
    });
    selectTarget.firstChild.classList.add('file_item-select');
   }
   if (selectFileArr.length < 1) {
    document.getElementById('select_delete').classList.add("file_areaButton_notAllowed");
    document.getElementById('select_delete').classList.remove("file_areaButton");
    document.getElementById('select_edit').classList.add("file_areaButton_notAllowed");
    document.getElementById('select_edit').classList.remove("file_areaButton");
    document.getElementById('select_anime').classList.add("file_areaButton_notAllowed");
    document.getElementById('select_anime').classList.remove("file_areaButton");
    document.getElementById("deselect_all").classList.remove("file_areaButton");
    document.getElementById("deselect_all").classList.add("file_areaButton_notAllowed");
   } if (selectFileArr.length >= 2) {
    document.getElementById('select_anime').classList.add("file_areaButton");
    document.getElementById('select_anime').classList.remove("file_areaButton_notAllowed");
   } if (selectFileArr.length < 2) {
    document.getElementById('select_anime').classList.add("file_areaButton_notAllowed");
    document.getElementById('select_anime').classList.remove("file_areaButton");
   } if (selectFileArr.length > 0) {
    document.getElementById('select_delete').classList.add("file_areaButton");
    document.getElementById('select_delete').classList.remove("file_areaButton_notAllowed");
    document.getElementById('select_edit').classList.add("file_areaButton");
    document.getElementById('select_edit').classList.remove("file_areaButton_notAllowed");
    document.getElementById("deselect_all").classList.add("file_areaButton");
    document.getElementById("deselect_all").classList.remove("file_areaButton_notAllowed");
    document.getElementById("select_all").classList.add("file_areaButton");
    document.getElementById("select_all").classList.remove("file_areaButton_notAllowed");
   } if (selectFileArr.length >= document.getElementsByClassName("file_item").length) {
    document.getElementById("select_all").classList.remove("file_areaButton");
    document.getElementById("select_all").classList.add("file_areaButton_notAllowed");
   } if (selectFileArr.length < document.getElementsByClassName("file_item").length) {
    document.getElementById("select_all").classList.add("file_areaButton");
    document.getElementById("select_all").classList.remove("file_areaButton_notAllowed");
   }
  }
  /*select all -------------------------------------------------------------------------------*/
  /*select all -------------------------------------------------------------------------------*/
  /*select all -------------------------------------------------------------------------------*/
  function selctAllFiles() {
    selectFileArr = [];
    document.querySelectorAll(".file_item").forEach(Element => {
      Element.firstChild.classList.add("file_item-select");
      selectFileArr.push({
        target: Element,
        data_name : Element.getAttribute('data'),
        name : Element.getAttribute('name'),
        location: './uploads/'+Element.getAttribute("reqid")+Element.getAttribute('data')
      });
    })
    document.getElementById('select_delete').classList.add("file_areaButton");
    document.getElementById('select_delete').classList.remove("file_areaButton_notAllowed");
    document.getElementById('select_edit').classList.add("file_areaButton");
    document.getElementById('select_edit').classList.remove("file_areaButton_notAllowed");
    document.getElementById('select_anime').classList.add("file_areaButton");
    document.getElementById('select_anime').classList.remove("file_areaButton_notAllowed");
    
    document.getElementById("deselect_all").classList.add("file_areaButton");
    document.getElementById("deselect_all").classList.remove("file_areaButton_notAllowed");
    document.getElementById("select_all").classList.remove("file_areaButton");
    document.getElementById("select_all").classList.add("file_areaButton_notAllowed");
  }
  document.getElementById("select_all").addEventListener('click', selctAllFiles)

  /*deselect all -------------------------------------------------------------------------------*/
  /*deselect all -------------------------------------------------------------------------------*/
  /*deselect all -------------------------------------------------------------------------------*/
  function deselctAllFiles() {
    document.querySelectorAll(".file_item").forEach(Element => {
      Element.firstChild.classList.remove("file_item-select");
    });
    document.getElementById('select_delete').classList.add("file_areaButton_notAllowed");
    document.getElementById('select_delete').classList.remove("file_areaButton");
    document.getElementById('select_edit').classList.add("file_areaButton_notAllowed");
    document.getElementById('select_edit').classList.remove("file_areaButton");
    document.getElementById('select_anime').classList.add("file_areaButton_notAllowed");
    document.getElementById('select_anime').classList.remove("file_areaButton");

    document.getElementById("select_all").classList.add("file_areaButton");
    document.getElementById("select_all").classList.remove("file_areaButton_notAllowed");
    document.getElementById("deselect_all").classList.remove("file_areaButton");
    document.getElementById("deselect_all").classList.add("file_areaButton_notAllowed");
    selectFileArr = [];
  }
  document.getElementById("deselect_all").addEventListener('click', deselctAllFiles)

  /*drag drop delete -------------------------------------------------------------------------------*/
  /*drag drop delete -------------------------------------------------------------------------------*/
  /*drag drop delete -------------------------------------------------------------------------------*/


  var a = 0;
  let deleteImg_data = [];
  async function deleteImg() {
  if (clickChecker == false) {
    clickChecker = true;
    deleteImg_data = [];

    document.querySelectorAll('.file_item-select').forEach(Element => {
      let reqID = Element.parentElement.getAttribute('reqid');
      let photoID = Element.parentElement.getAttribute('data');
      Element.classList.remove('file_item-select');
      Element.parentElement.classList.add('file_itemInner-loading');
      Element.querySelector('.file_itemImg').style.display = 'none';
      Element.querySelector('.file_itemImg').style.visibility = 'hidden';
      Element.querySelector('i').style.display = 'flex';
      Element.querySelector('.ImgContainer').classList.add('ImgContainer-spin');
      Element.querySelector('.ImgContainer-spin').style.animationDelay = anime.random(-18,-1)+'s';
      Element.querySelector('p').innerText = 'Deleting...';
      deleteImg_data.push({
        deleteID: reqID+photoID,
        reqId: reqID,
        data_name: photoID
      })
      Element.classList.add('file_itemInner_deleting');
    });

    let deleteImg_opts = {
      method: 'POST',
      mode: 'cors', 
      cache: 'no-cache', 
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json'
      },
      redirect: 'follow', 
      referrerPolicy: 'no-referrer',
      body: JSON.stringify(deleteImg_data)
    }
    try {
      const response = await fetch('/deleteImg', deleteImg_opts)
      if (response.ok) {
        return delteImg_innerFunc();
      } else {
        document.getElementById('dragNdrop_iPara').innerText = "Something went wrong :(";
        return uploadError();
      }
      } catch {
        document.getElementById('dragNdrop_iPara').innerText = "Something went wrong :(";
        return uploadError();
        }
  }
}

function delteImg_innerFunc() {

  document.querySelectorAll('.file_itemInner_deleting').forEach(Element => {
    Element.parentElement.remove();
  });


  imgData_Arr = [];
  document.querySelectorAll('.file_item').forEach(Element => {

    let af_reqID = Element.getAttribute('reqid');
    let af_name = Element.getAttribute('name');
    let af_dataName = Element.getAttribute('data');
    let af_background = Element.getAttribute('background');
    let af_alphabet = Element.getAttribute('alphabet');
    let af_alphabetShort = Element.getAttribute('alphabetshort');
    let af_PhotoSize = Element.getAttribute('photosize');
    let af_fileSize = Element.getAttribute('filesize');

    imgData_Arr.push({
      location: './uploads/'+af_reqID+af_dataName,
      name: af_name,
      data_name: af_dataName,
      background: af_background,
      alphabet: af_alphabet,
      alphabetShort: af_alphabetShort,
      size: af_PhotoSize,
      file_size: parseInt(af_fileSize)
    });

  });
  
//   let x = 0;
//   function test() {
//   for (let i = 0; i < deleteImg_data.length; i++) {
//     for (let k = 0; k < imgData_Arr.length; k++) {
//       if (deleteImg_data[i].data_name === imgData_Arr[k].data_name) {
//         imgData_Arr[k].data_name = 'deleted';
//         imgData_Arr[k].location = 'deleted';
//         console.log('yes');
//       }
//     }
//     if ((i+1) == deleteImg_data.length && x < 5) {
//       x++;
//       console.log('ok?');
//       return test();
//     }
//   }
// }
// test();
  // let newarr = imgData_Arr.filter(a => a.data_name !== 'deleted');
  // imgData_Arr = newarr;


  if (imgData_Arr.length < 1) {
    fileText.style.display = "flex";
    imgData_Arr = [];
    document.querySelectorAll('.filearebP').forEach(Element => {
      Element.classList.add("file_areaButton_notAllowed");
      Element.classList.remove("file_areaButton");
    });
  } else {
    document.querySelectorAll('.filearebP').forEach(Element => {
      Element.classList.add("file_areaButton_notAllowed");
      Element.classList.remove("file_areaButton");
    });
    document.getElementById("select_all").classList.add("file_areaButton");
    document.getElementById("select_all").classList.remove("file_areaButton_notAllowed");
  }


  selectFileArr = [];
  uploadFiles_sizeSum = 0;

  for (let i = 0; i < imgData_Arr.length; i++) {
  uploadFiles_sizeSum += imgData_Arr[i].file_size;
  }

  document.getElementById("dragNdrop_size").innerText = bytesToSize(uploadFiles_sizeSum) + " / 50MB";
  clickChecker = false; 
}
 document.getElementById("select_delete").addEventListener('click', deleteImg)





  /*settings menu -------------------------------------------------------------------------------*/
  /*settings menu -------------------------------------------------------------------------------*/
  /*settings menu -------------------------------------------------------------------------------*/
  function openSettingsMenu() {
    document.querySelector(".selectedListP").innerHTML = '';
    let Sphoto_name;
    let Dphoto_name;
    let photo_backColor;
    let photo_alphabetShort;
    let photo_alphabet;
    let photo_size;
    let Lphoto;
    for (let i = 0; i < selectFileArr.length; i++) {
      for (let a = 0; a < imgData_Arr.length; a++) {
        if (selectFileArr[i].data_name == imgData_Arr[a].data_name) {
          photo_backColor = imgData_Arr[i].background;
          photo_alphabetShort = imgData_Arr[i].alphabetShort;
          photo_alphabet = imgData_Arr[i].alphabet;
          photo_size = imgData_Arr[i].size;
        }
      }
      Sphoto_name = selectFileArr[i].name;
      Dphoto_name = selectFileArr[i].data_name;
      Lphoto = selectFileArr[i].location;
      let photos_Selected_p = document.createElement('div');
      photos_Selected_p.classList.add("settingsList_item");
      photos_Selected_p.setAttribute("s_name", Sphoto_name);
      photos_Selected_p.setAttribute("s_data", Dphoto_name);
      photos_Selected_p.innerHTML = 
      `<div class="settingsList_innerNameNnIMG">
      <div class="settingsList_ImgP"><img src='${Lphoto}'></div>
      <p>${Sphoto_name}</p>
      </div>
      <div class="settingsList_innerData">
      <div class="FiiR_backcolorP"><div class="FiiR_backcolor" style="background-color: ${photo_backColor};"></div></div>
      <pre class="photo_alphabet" id="${photo_alphabet}">${photo_alphabetShort}</pre>
      <pre class="photo_size">${photo_size}</pre>
      </div>`;
      document.querySelector(".selectedListP").append(photos_Selected_p);

      document.getElementsByClassName("settingsList_ImgP")[i].querySelector('img').addEventListener('load', function() {
        let loadSettingsImg_P = document.getElementsByClassName("settingsList_ImgP")[i];
        let loadSettingsImg = document.getElementsByClassName("settingsList_ImgP")[i].querySelector('img');
        loadSettingsImg_P.style.animation = 'none';
        loadSettingsImg.style.display = "block";
        anime({
          targets: loadSettingsImg,
          opacity: 0.8,
          duration: 100,
          easing: 'linear'
        })
      }); 
    }

    // open animation
    var openSettings_on = anime.timeline({
      easing: 'linear',
    });
    openSettings_on
    .add ({
      targets: '.fileareaP',
      opacity: 0,
      duration: 150,
      complete: function() {
        document.querySelector('.settings_p').style.display = "flex";
        document.getElementById('settings_header').style.display = "flex";
        document.querySelector('.fileContainer').style.display = "none";
        document.getElementById('images_header').style.display = "none";
      }
    })
    .add ({
      targets: '.fileareaP',
      opacity: 1,
      duration: 150,
    })
  }
  document.getElementById("select_edit").addEventListener('click', openSettingsMenu);


  function closeSettingsMenu() {
    deselctAllFiles();
    var openSettings_on = anime.timeline({
      easing: 'linear',
    });
    openSettings_on
    .add ({
      targets: '.fileareaP',
      opacity: 0,
      duration: 150,
      complete: function() {
        document.querySelector('.settings_p').style.display = "none";
        document.getElementById('settings_header').style.display = "none";
        document.querySelector('.fileContainer').style.display = "block";
        document.getElementById('images_header').style.display = "flex";
      }
    })
    .add ({
      targets: '.fileareaP',
      opacity: 1,
      duration: 150,
    })
  }
  //shufle settings ----------------------------------------------------------------------------------------------------
  function shuffleSettings() {
    for (let i = 0; i < selectFileArr.length; i++) {
    let randoBackground = anime.random(0, (alphabet_arr.length-1));
    let randoAlphabet = anime.random(0, (alphabet_arr.length-1));
    let randoSize = anime.random(1, 10);
      for (let a = 0; a < imgData_Arr.length; a++) {
      if (selectFileArr[i].data_name == imgData_Arr[a].data_name) {
        imgData_Arr[a].background = backgroundColor_arr[randoBackground];
        imgData_Arr[a].alphabetShort = alphabet_arr[randoAlphabet].short;
        imgData_Arr[a].alphabet = alphabet_arr[randoAlphabet].name;
        imgData_Arr[a].size = randoSize;

        document.querySelector(`[data="${imgData_Arr[a].data_name}"]`)
        .setAttribute("background", imgData_Arr[a].background);

        document.querySelector(`[data="${imgData_Arr[a].data_name}"]`)
        .setAttribute("alphabetshort", imgData_Arr[a].alphabetShort);
        document.querySelector(`[data="${imgData_Arr[a].data_name}"]`)
        .setAttribute("alphabet", imgData_Arr[a].alphabet);

        document.querySelector(`[data="${imgData_Arr[a].data_name}"]`)
        .setAttribute("photosize", imgData_Arr[a].size);
    }
  }
  document.getElementsByClassName("FiiR_backcolor")[i].style.backgroundColor = backgroundColor_arr[randoBackground];
  document.getElementsByClassName("photo_alphabet")[i].innerText = alphabet_arr[randoAlphabet].short;
  document.getElementsByClassName("photo_size")[i].innerText = randoSize;
}
  }
  document.getElementById("back_settings").addEventListener('click', closeSettingsMenu);
  document.getElementById("shuffle_settings").addEventListener('click', shuffleSettings);
  




// /** First we get all the non-loaded image elements **/
// var lazyImages_P = document.querySelector('.fileareaP');
// var lazyImages = [].slice.call(document.querySelectorAll(".file_item"));
// observer = {
//   root: document.querySelector('.fileareaP'),
//   rootMargin: "0px",
//   threshold: 0.5
// }

// /** Then we set up a intersection observer watching over those images and whenever any of those becomes visible on the view then replace the placeholder image with actual one, remove the non-loaded class and then unobserve for that element **/
// let lazyImageObserver = new IntersectionObserver(function(entries, observer) {
//     entries.forEach(function(entry) {
//         if (entry.isIntersecting) {
//             // let lazyImage = entry.target;
//             // lazyImage.src = lazyImage.dataset.src;
//             // lazyImage.classList.remove("lazy");
//             // lazyImageObserver.unobserve(lazyImage);
//             console.log('target');
//         }
//     });
// });

// /** Now observe all the non-loaded images using the observer we have setup above **/
// lazyImages.forEach(function(lazyImage) {
//     lazyImageObserver.observe(lazyImage);
// });




/*
            _               _ _   
  ___ _   _| |__  _ __ ___ (_) |_ 
 / __| | | | '_ \| '_ ` _ \| | __|
 \__ \ |_| | |_) | | | | | | | |_ 
 |___/\__,_|_.__/|_| |_| |_|_|\__|
                                  
*/

// loadbar start ani onlick >>>
function submit_loadbarStartAni() {
    if (clickChecker == false) {
    clickChecker = true;
    document.querySelector('.loadbarText').style.opacity = "0";
    document.querySelector('.loadbar_p').style.opacity = "0";
    if (document.querySelector('.loadbar_p-Span').classList.contains("loadbar_p-SpanErr")) {
        document.querySelector('.loadbar_p-Span').classList.remove("loadbar_p-SpanErr")
        document.querySelector('.loadbarText').classList.remove("loadbarText_err");
    }
    anime ({
        targets: ".loadbar_p-Span",
        width: "0",
        duration: 0
    })
    anime ({
        targets: ".loadbar_p",
        opacity: "1",
        duration: 100,
        complete: submit_check
    })
 }
}

function submitLoad_Ani() {
  anime({
      targets: ".loadbar_p-Span",
      width: function() {
          return (submit_checklist*submit_checklist+1) * (100 / 27)+"%";
      },
      duration: function() {
          return anime.random(750, 900);
      },
      delay: function() {
          return anime.random(0, 500);
      },
      complete: function() {
        if (imgData_Arr.length < 1) {
          submit_checklist = 5
          return submit_check();
        } else {
          return submit_checklist++,
          submit_check();
           }
      },
      easing: 'easeOutQuart'
  })
}

function submitFinish_Ani() {

  var loadbarTl = 
  anime.timeline({
  });
  loadbarTl
  .add ({
  targets: ".loadbar_p-Span",
  width: "97%",
  duration: anime.random(500, 600),
  easing: 'easeInExpo',
  })
  .add ({
  targets: ".loadbar_p-Span",
  width: "100%",
  duration: 400,
  easing: 'easeInExpo',
  complete: function() {
      loadBar_text.innerText = "done";
  }
  })
  .add ({
  targets: ".loadbar_p",
  opacity: 0,
  duration: 100,
  easing: 'linear',
  })
  .add ({
  targets: ".loadbar_p-Span",
  width: "0",
  duration: 50,
  easing: 'linear',
  complete: function() {
    document.querySelectorAll(".file_item").forEach(Element => {
      Element.remove();
    });
    fileText.style.display = "flex";
    // scroll to bottom
    document.querySelector(".preP_outer").scrollTo(0, 
    document.querySelector(".preP_outer").scrollHeight);
    // file size counter
    uploadFiles_sizeSum = 0;
    for (let i = 0; i < imgData_Arr.length; i++) {
    uploadFiles_sizeSum += imgData_Arr[i].file_size;
    }
    document.getElementById("dragNdrop_size").innerText = bytesToSize(uploadFiles_sizeSum) + " / 50MB";

      loadBar_text.style.opacity = "0";
      submit_checklist = 0;
      imgData_Arr = [];
      clickChecker = false;
  }
  })

}

function submit_err() {
  loadBar_text.style.opacity = "0.9";
  submit_checklist = 0;
  anime ({
      targets: ".submitbutton_p",
      translateX: [
          {value: -18},
          {value: 16},
          {value: -12},
          {value: 12},
          {value: -9},
          {value: 7},
          {value: 0}
      ],
      loop: false,
      duration: 400,
      easing: "easeInOutBack"
  })
  anime ({
      targets: ".submitErr",
      opacity: [
          {value: 1},
          {value: 1},
          {value: 0}
      ],
      loop: false,
      duration: 800,
      easing: "linear",
      complete: function() {
          clickChecker = false;
      }
  })
  document.querySelector('.loadbarText').classList.add("loadbarText_err");
  document.querySelector(".loadbar_p-Span").classList.add("loadbar_p-SpanErr");
  anime ({
      targets: ".loadbar_p-Span",
      width: "100%",
      loop: false,
      duration: 0,
      easing: "linear"
      })
}


/*
                          _                    _    
   ___ __ _ ___  ___     | |__  _ __ ___  __ _| | __
  / __/ _` / __|/ _ \    | '_ \| '__/ _ \/ _` | |/ /
 | (_| (_| \__ \  __/_   | |_) | | |  __/ (_| |   < 
  \___\__,_|___/\___( )  |_.__/|_|  \___|\__,_|_|\_\
                    |/                              
*/
let submit_checklist = 0;
let uploaded_files_counter = 0;
var loadBar_text = document.querySelector('.loadbarText');
function submit_check() {
//-----------------------------------------------------------
    switch(submit_checklist) {
        case 0:
          if (imgData_Arr < 1) {
            loadBar_text.innerText = "No images uploaded";
            return submit_err();
          } 
        loadBar_text.innerText = "Sending request...";
        loadBar_text.style.opacity = "0.9";
        if (document.querySelector('.settings_p').style.display == "flex") {
          closeSettingsMenu();
        }
        selectFileArr = [];
        document.querySelectorAll(".filearebP").forEach(Element => {
          Element.classList.remove("file_areaButton");
          Element.classList.add("file_areaButton_notAllowed");
        });
        document.querySelectorAll(".file_item").forEach(Element => {
          Element.classList.remove("file_item-select");
          Element.firstChild.classList.remove("file_item-select");
          Element.classList.add("file_item-converting");
        });
        anime({
            targets: ".loadbar_p-Span",
            width: function() {
            return anime.random(2, 4)+"%";
            },
            duration: function() {
            return anime.random(500, 600);
            },
            complete: function() {
            return submit_checklist++,
            submit_check();
            },
            easing: 'easeInOutBack'
         })
        break;
        case 1:
        // start ascii loading ani
        document.querySelector('.noUpload_container').style.opacity = '0';
        playAsciiLoading_ani_startLoad() 


        if (imgData_Arr.length > 75) {
          loadBar_text.innerText = "Too many files!, Maximum allowed is 75.";
          return submit_err();
        } else {
          submitLoad_Ani();
        }
        break;
        case 2:
        // send aalib data >>>
        loadBar_text.innerText = "converting to ascii...";
        return uploadImgs_loadAni();
        break;
        case 3:
        //---------------------------------------------------------------------
        // end load and play ani >>>
        loadBar_text.innerText = "finishing up";
        submitFinish_Ani();
        break;
        default: 
        defaultErr = true;
        loadBar_text.style.opacity = "0.9";
        loadBar_text.innerText = "Error";
        return submit_err();   
    }


}

/*
                                _     _                         _ _ 
   ___ ___  _ ____   _____ _ __| |_  | |_ ___     __ _ ___  ___(_|_)
  / __/ _ \| '_ \ \ / / _ \ '__| __| | __/ _ \   / _` / __|/ __| | |
 | (_| (_) | | | \ V /  __/ |  | |_  | || (_) | | (_| \__ \ (__| | |
  \___\___/|_| |_|\_/ \___|_|   \__|  \__\___/   \__,_|___/\___|_|_|
                                                                    
*/

  let i_asciiImg_c = 0;
  let uploadedDiv_p;
  function aalib_sendPath() {
  let aalibData = {
    imgLinks: imgData_Arr,
    i: i_asciiImg_c,
    reqId: requestId,
  }
  

  let i_asciiConvertLoad = 0;

  let xhr = new XMLHttpRequest();
  xhr.open('POST', '/');
  xhr.setRequestHeader('content-type', 'application/json');

  var waitLoad = setInterval(function(){

    loaderGetWidth = document.querySelector(".loadbar_p-Span").style.width;
    loaderGetWidth_makeInt = parseInt(loaderGetWidth);
    LoadWidth = (loaderGetWidth_makeInt) + ((imgData_Arr.length+i_asciiConvertLoad) / (imgData_Arr.length)) + "%";

    if(i_asciiConvertLoad == 6 || xhr.response) {
      clearInterval(waitLoad);
    } else {
    anime({
      targets: ".loadbar_p-Span",
      width: function() {
          return LoadWidth;
      },
      duration: 600,
      easing: 'easeOutQuart',
      complete: function() {
        i_asciiConvertLoad++;
      }
    })
   }
  }, 2100);


  xhr.onload = function() {
    if (i_asciiImg_c < 1) {
      let uploadedDiv_p = document.createElement('div');
      uploadedDiv_p.classList.add("preP");
      document.querySelector(".preP_outer").append(uploadedDiv_p);
      // if (animateCheckbox.checked == true) {
      //   uploadedDiv_p.classList.add("preP_anime");
      // }
    } 

    let preP_counter = document.getElementsByClassName("preP").length;
    uploadedDiv_p = document.getElementsByClassName("preP")[preP_counter-1];

    let uploadDiv = document.createElement("div");
    uploadDiv.classList.add("pre_container");
    uploadDiv.innerHTML = xhr.response;
    uploadedDiv_p.append(uploadDiv);



    uploadDiv.classList.add("pre_item");
    uploadDiv.setAttribute("name", imgData_Arr[i_asciiImg_c].name);
    uploadDiv.setAttribute("onclick", 'item_click(event)');
    // // if (animateCheckbox.checked == true) {
    // //   uploadedDiv_p.classList.add("pre_item");
    // //   uploadedDiv_p.setAttribute("name", 'animation');
    // //   uploadedDiv_p.setAttribute("onclick", 'item_click(event)');
    // //   uploadDiv.classList.add("pre_container_absolute");
    // //   uploadDiv.classList.add("pre_container_anime");

    // //   if ((i_asciiImg_c) < 1) {
    // //   uploadedDiv_p.getElementsByClassName("pre_container")[0]
    // //   .classList.remove("pre_container_absolute");
    // //   }
    // // } else if (animateCheckbox.checked == false) {
    //   uploadDiv.classList.add("pre_item");
    //   uploadDiv.setAttribute("name", uploadFiles_arr[i_asciiImg_c].name);
    //   uploadedDiv_p.setAttribute("onclick", 'item_click(event)');
    // }

    if ((i_asciiImg_c+1) < imgData_Arr.length) {

    let animFileDone = document.getElementsByClassName("file_item")[i_asciiImg_c];
    anime ({
      targets: animFileDone,
      opacity: 0.2,
      scale: 0.98,
      translateY: [
        {value: -9},
        {value: 7},
        {value: 0}
      ],
      duration: 250,
      easing: 'easeInOutBack'
    })

    return i_asciiImg_c++,
    uploadImgs_loadAni();
    }
    
    
    if((i_asciiImg_c+1) == imgData_Arr.length) {
      playAsciiLoading_ani_close();
      imgData_Arr = [];
      let animFileDone = document.getElementsByClassName("file_item")[i_asciiImg_c];
      anime ({
        targets: animFileDone,
        opacity: 0.2,
        scale: 0.98,
        translateY: [
          {value: -9},
          {value: 7},
          {value: 0}
        ],
        duration: 250,
        easing: 'easeInOutBack'
      })
      // // animate area
      // if (animateCheckbox.checked == true) {
      //   asciiAnime_p();
      // }


      i_asciiImg_c = 0;
      return submit_checklist++,
      submit_check();
    } else {
    i_asciiImg_c = 0
    uploadFiles_arr = [];
    loadBar_text.innerText = "Something went wrong :(, try refreshing and trying again";
    submit_err();
  }


}
xhr.send(JSON.stringify(aalibData));

  }
// animate area
function asciiAnime_p() {
let asciiAnime_secCounter = document.getElementsByClassName("preP_anime").length;
asciiAnime_secCounter = asciiAnime_secCounter - 1;
if (asciiAnime_secCounter < 0) {
  asciiAnime_secCounter = 0;
}
let ascii_container = document.getElementsByClassName("preP_anime")[asciiAnime_secCounter];
var asciiAnime_counter = 0;
var time_converted = dur_txt.innerText.replace(/ms/g, '');
var asciiAnime_Length;
function asciiAnime() {
    asciiAnime_Length = ascii_container.children.length;
    anime ({
      targets: ascii_container.children[asciiAnime_counter],
      easing: 'linear',
      duration: time_converted,
      loop: false,
      complete: function() {
        ascii_container.children[asciiAnime_counter].style.visibility = 'hidden';
        asciiAnime_counter++
        asciiAnime();
        ascii_container.children[asciiAnime_counter].style.visibility = 'visible';
      }
    })
    if (asciiAnime_counter >= asciiAnime_Length) {
      asciiAnime_counter = 0;
    }
  }
  asciiAnime();
}

let loaderGetWidth = document.querySelector(".loadbar_p-Span").style.width;
let loaderGetWidth_makeInt = parseInt(loaderGetWidth);
let LoadWidth = loaderGetWidth_makeInt + (50 / imgData_Arr.length) + "%";
function uploadImgs_loadAni() {
  loadBar_text.innerHTML = 
  `Converting photos <span class='Loadcounter'>`+(i_asciiImg_c+1)+" / "+imgData_Arr.length+
  "</span>\n <span class='fileName_loader'>"+imgData_Arr[i_asciiImg_c].name+
  "</span><span class='fileName_loaderIconP'><i class='icon-ccw-1 icon_innerLoad'></i></span>";
  loaderGetWidth = document.querySelector(".loadbar_p-Span").style.width;
  loaderGetWidth_makeInt = parseInt(loaderGetWidth);
  LoadWidth = loaderGetWidth_makeInt + (50 / imgData_Arr.length) + "%";
  anime({
    targets: ".loadbar_p-Span",
    width: function() {
        return LoadWidth;
    },
    duration: function() {
      return anime.random(300, 600);
    },
    delay: function() {
        return anime.random(0, 250);
    },
    complete: function() {
      return aalib_sendPath();
    },
    easing: 'easeOutQuart'
})
}

/* 
                                                     _           _   
  _ __  _ __ ___     __ _ _ __ ___  __ _    ___  ___| | ___  ___| |_ 
 | '_ \| '__/ _ \   / _` | '__/ _ \/ _` |  / __|/ _ \ |/ _ \/ __| __|
 | |_) | | |  __/  | (_| | | |  __/ (_| |  \__ \  __/ |  __/ (__| |_ 
 | .__/|_|  \___|   \__,_|_|  \___|\__,_|  |___/\___|_|\___|\___|\__|
 |_|                                                                 
*/
// click on img / animation ---------------------------------------------------------
var itemClick_elem;
var itemClick_name;
var item_clickOk = true;
var itemHasbeenClicked = false;
function item_click(event) {
  if (item_clickOk == true) {
  item_clickOk = false;

itemClick_elem = event.target;
itemHasbeenClicked = itemClick_elem.classList.contains('pre_item_click');
switch(itemHasbeenClicked) {
  case false:
      anime ({
        targets: '.dd_clicked',
        begin: function() {
          document.querySelector('.dd_clicked').style.display = 'flex';
          document.querySelectorAll('.pre_item_click').forEach(Element => {
            Element.classList.remove('pre_item_click');
            Element.classList.add('pre_item');
          });
          itemClick_name = itemClick_elem.getAttribute('name');
          itemClick_elem.classList.remove('pre_item');
          itemClick_elem.classList.add('pre_item_click');
          if (itemClick_name == 'animation') {
            document.querySelector('.dd_column_gifNimg').innerText = 'download gif';
          } else {
            document.querySelector('.dd_column_gifNimg').innerText = 'download image';
          }
          document.querySelector('.img_selected').innerText = itemClick_name;
        },
        opacity: 1,
        duration: 100,
        easing: 'easeOutQuart',
        complete: function() {
          item_clickOk = true;
        }
      })
    break;
    case true:
    default:
      deselect_itemClick();
    }

            // deselect
            document.getElementById('dd_des').addEventListener('click', deselect_itemClick) 
            // delete
            document.getElementById('dd_delete').addEventListener('click', delete_itemClick) 
 }
}


function deselect_itemClick() {
  item_clickOk = false;
  anime ({
    targets: '.dd_clicked',
    begin: function() {
      document.querySelectorAll('.pre_item_click')
      .forEach(Element => {
        Element.classList.remove('pre_item_click');
        Element.classList.add('pre_item');
      });
    },
    opacity: 0,
    duration: 100,
    easing: 'easeOutQuart',
    complete: function() {
      document.querySelector('.dd_clicked').style.display = 'none';
      item_clickOk = true;
    }
  })
}
let preItem_counter;
let noUpload_c = document.querySelector('.noUpload_container');
function delete_itemClick() {
  item_clickOk = false;
  itemClick_elem.remove();
  preItem_counter = document.getElementsByClassName('pre_container').length;
  anime ({
    targets: '.dd_clicked',
    opacity: 0,
    duration: 150,
    easing: 'linear',
    complete: function() {
      document.querySelector('.dd_clicked').style.display = 'none';
      if (preItem_counter < 13) {
        document.querySelector('.asciiLoading_ani_P').style.display = "flex";
        document.querySelector('.preP_outer-inner ').style.display = "block";
        anime ({
          targets: '.noUpload_container',
          opacity: 1,
          duration: 800,
          easing: 'linear',
          complete: function() {
            item_clickOk = true;
          }
        })
      } else {
        item_clickOk = true;
      }
    }
  })
}

  




//background color area----------------------------------------------------
//color picker get input >>> 
let colorInput_value = document.querySelector(".inputColor");
let colorInputLabel = document.querySelector(".labelInput_Color");
function getColorInput_txt() {
    colorInput_value = document.querySelector(".inputColor");
    colorInputLabel = document.querySelector(".labelInput_Color");
    if (isColor(colorInputLabel.value) == false) {
      colorInputLabel.value = colorInput_value.value.toString();
    }
    backgroundColor_arr[backgroundColor_arrCounter] = colorInputLabel.value;
    colorInput_value.value = backgroundColor_arr[backgroundColor_arrCounter];
    colorInputLabel.value = backgroundColor_arr[backgroundColor_arrCounter];
    runBackground();
}
function getColorInput_input() {
  colorInput_value = document.querySelector(".inputColor");
  colorInputLabel = document.querySelector(".labelInput_Color");
  colorInputLabel.value = colorInput_value.value.toString();
  backgroundColor_arr[backgroundColor_arrCounter] = colorInputLabel.value;
  colorInput_value.value = backgroundColor_arr[backgroundColor_arrCounter];
  colorInputLabel.value = backgroundColor_arr[backgroundColor_arrCounter];
  runBackground();
}
document.querySelector(".labelInput_Color")
.addEventListener("click", getColorInput_txt);
document.querySelector(".labelInput_Color")
.addEventListener("change", getColorInput_txt);
document.querySelector(".inputColor")
.addEventListener("click", getColorInput_input);
document.querySelector(".inputColor")
.addEventListener("change", getColorInput_input);

//check if color is valid >>>
function isColor(strColor){
    var s = new Option().style;
    s.color = strColor;
    var test1 = s.color == strColor;
    var test2 = /^#[0-9A-F]{6}$/i.test(strColor);
    if(test1 == true || test2 == true){
      return true;
    } else{
      return false;
    }
  }


let backgroundColor_arrCounter = 2;
const backgroundColor_arr = [
  "#787878",
  "#000000",
  "#222020",
  "#ffffff",
  "#5de856",
  "#8b56e8",
  "#5695e8",
  "#e85656",
  "#e8b756",
  "#e6e856",
  "#b0173d"
];
document.getElementById("background_Next")
.addEventListener('click', function() {
  backgroundColor_arrCounter++;
  if (backgroundColor_arrCounter >= backgroundColor_arr.length) {
    backgroundColor_arrCounter = 0;
    colorInput_value.value = backgroundColor_arr[backgroundColor_arrCounter];
    colorInputLabel.value = backgroundColor_arr[backgroundColor_arrCounter];
    runBackground();
  } else {
    colorInput_value.value = backgroundColor_arr[backgroundColor_arrCounter];
    colorInputLabel.value = backgroundColor_arr[backgroundColor_arrCounter];
    runBackground();
  }
})
document.getElementById("background_before")
.addEventListener('click', function() {
  backgroundColor_arrCounter--;
  if (backgroundColor_arrCounter < 0) {
    backgroundColor_arrCounter = backgroundColor_arr.length-1;
    colorInput_value.value = backgroundColor_arr[backgroundColor_arrCounter];
    colorInputLabel.value = backgroundColor_arr[backgroundColor_arrCounter];
    runBackground();

  } else {
    colorInput_value.value = backgroundColor_arr[backgroundColor_arrCounter];
    colorInputLabel.value = backgroundColor_arr[backgroundColor_arrCounter];
    runBackground();
  }
})
function runBackground() {
  for (let i = 0; i < selectFileArr.length; i++) {
    for (let a = 0; a < imgData_Arr.length; a++) {
    if (selectFileArr[i].data_name == imgData_Arr[a].data_name) {
      imgData_Arr[a].background = colorInput_value.value;

      document.querySelector(`[data="${imgData_Arr[a].data_name}"]`)
      .setAttribute("background", imgData_Arr[a].background)
      }
    }
    document.getElementsByClassName("FiiR_backcolor")[i].style.backgroundColor = colorInput_value.value;
  }
}
document.getElementById("background_shuffle")
.addEventListener('click', function() {
  for (let i = 0; i < selectFileArr.length; i++) {
        let randoBackground = anime.random(0, (backgroundColor_arr.length-1));
    for (let a = 0; a < imgData_Arr.length; a++) {
    if (selectFileArr[i].data_name == imgData_Arr[a].data_name) {
      imgData_Arr[a].background = backgroundColor_arr[randoBackground];

      document.querySelector(`[data="${imgData_Arr[a].data_name}"]`)
      .setAttribute("background", imgData_Arr[a].background);
      }
    }
    document.getElementsByClassName("FiiR_backcolor")[i].style.backgroundColor = backgroundColor_arr[randoBackground];
  }
});

//alphabet area----------------------------------------------------
let alphabet_arrCounter = 2;
const alphabet_arr = [
  {
    short: '██',
    name: 'solid'
  },
  {
    short: '1-9',
    name: 'numbers'
  },
  {
    short: '01',
    name: 'binary'
  },
  {
    short: '##',
    name: 'bits'
  },
  {
    short: '░░▒▒',
    name: 'greyscale'
  },
  {
    short: '▖▚',
    name: 'blocks'
  },
  {
    short: '@%Az',
    name: 'standard'
  },
  {
    short: 'a-z',
    name: 'letters_LowerCase'
  },
  {
    short: 'A-Z',
    name: 'letters_UpperCase'
  },
  {
    short: 'Aa-Zz',
    name: 'letters_Both'
  }
];
document.getElementById("alphabet_Next")
.addEventListener('click', function() {
  alphabet_arrCounter++;
  if (alphabet_arrCounter >= alphabet_arr.length) {
    alphabet_arrCounter = 0;
    runAlphabet();
  } else {
    runAlphabet(); 
  }
})
document.getElementById("alphabet_before")
.addEventListener('click', function() {
  alphabet_arrCounter--;
  if (alphabet_arrCounter < 0) {
    alphabet_arrCounter = alphabet_arr.length-1;
    runAlphabet();
  } else {
    runAlphabet();
  }
})
function runAlphabet() {
  document.querySelector('.alphaBet_txt').innerText 
  = alphabet_arr[alphabet_arrCounter].short;
  for (let i = 0; i < selectFileArr.length; i++) {
    for (let a = 0; a < imgData_Arr.length; a++) {
    if (selectFileArr[i].data_name == imgData_Arr[a].data_name) {
        imgData_Arr[a].alphabetShort = alphabet_arr[alphabet_arrCounter].short;
        imgData_Arr[a].alphabet = alphabet_arr[alphabet_arrCounter].name;

        document.querySelector(`[data="${imgData_Arr[a].data_name}"]`)
        .setAttribute("alphabetshort", imgData_Arr[a].alphabetShort);
        document.querySelector(`[data="${imgData_Arr[a].data_name}"]`)
        .setAttribute("alphabet", imgData_Arr[a].alphabet);
      }
    }
    document.getElementsByClassName("photo_alphabet")[i].innerText = alphabet_arr[alphabet_arrCounter].short;
  }
}
// alphabet shuffle -------------------------------------------------------------------------------
document.getElementById("alphabet_shuffle")
.addEventListener('click', function() {
  for (let i = 0; i < selectFileArr.length; i++) {
        let randoAlphabet = anime.random(0, (alphabet_arr.length-1));
    for (let a = 0; a < imgData_Arr.length; a++) {
    if (selectFileArr[i].data_name == imgData_Arr[a].data_name) {
        imgData_Arr[a].alphabetShort = alphabet_arr[randoAlphabet].short;
        imgData_Arr[a].alphabet = alphabet_arr[randoAlphabet].name;

        document.querySelector(`[data="${imgData_Arr[a].data_name}"]`)
        .setAttribute("alphabetshort", imgData_Arr[a].alphabetShort);
        document.querySelector(`[data="${imgData_Arr[a].data_name}"]`)
        .setAttribute("alphabet", imgData_Arr[a].alphabet);
      }
    }
    document.getElementsByClassName("photo_alphabet")[i].innerText = alphabet_arr[randoAlphabet].short;
  }
});
document.querySelector('.alphaBet_txt').addEventListener('click', function() {
  runAlphabet();
})

//size area----------------------------------------------------
let size_Counter = 6;
document.getElementById("Size_Next")
.addEventListener('click', function() {
  size_Counter++;
  if (size_Counter >= 11) {
    size_Counter = 1;
    runSize();
  } else {
    runSize();
  }
})
document.getElementById("Size_before")
.addEventListener('click', function() {
  size_Counter--;
  if (size_Counter < 1) {
    size_Counter = 10;
    runSize();
  } else {
    runSize();
  }
})
function runSize() {
  document.querySelector('.Size_txt').innerText 
  = size_Counter;
  for (let i = 0; i < selectFileArr.length; i++) {
    for (let a = 0; a < imgData_Arr.length; a++) {
    if (selectFileArr[i].data_name == imgData_Arr[a].data_name) {
        imgData_Arr[a].size = size_Counter;

        document.querySelector(`[data="${imgData_Arr[a].data_name}"]`)
        .setAttribute("photosize", imgData_Arr[a].size);
      }
    }
    document.getElementsByClassName("photo_size")[i].innerText = size_Counter;
  }
}
// size shuffle -------------------------------------------------------------------------------
document.getElementById("Size_shuffle")
.addEventListener('click', function() {
  for (let i = 0; i < selectFileArr.length; i++) {
        let randoSize = anime.random(1, 10);
    for (let a = 0; a < imgData_Arr.length; a++) {
    if (selectFileArr[i].data_name == imgData_Arr[a].data_name) {
        imgData_Arr[a].size = randoSize;

        document.querySelector(`[data="${imgData_Arr[a].data_name}"]`)
        .setAttribute("photosize", imgData_Arr[a].size);
      }
    }
    document.getElementsByClassName("photo_size")[i].innerText = randoSize;
  }
});
document.querySelector('.Size_txt').addEventListener('click', function() {
  runSize();
})


//animate area ----------------------------------------
// const animateCheckbox = document.getElementById("animate_check");
// let checkStatus_animate = true;
// animateCheckbox.addEventListener('click', function() {
//   if (checkStatus_animate == true) {
//     checkStatus_animate = false;
//   switch (animateCheckbox.checked) {
//     case true:
//     document.querySelector('.Radioicon_container').style.opacity
//     = 0.6;
//     document.getElementById("animateSettings")
//     .classList.remove('animateSettings_off');
//     anime ({
//       targets: "#animateSettings",
//       translateY: [
//         {value: -6},
//         {value: 4},
//         {value: -3},
//         {value: 2},
//         {value: 0}
//       ],
//       duration: 300,
//       easing: 'easeOutInBack',
//       complete: function() {
//         checkStatus_animate = true;
//       }
//     })
//     break;
//     default:
//       document.querySelector('.Radioicon_container').style.opacity
//       = 0;
//       document.getElementById("animateSettings")
//       .classList.add('animateSettings_off');
//       anime ({
//         targets: "#animateSettings",
//         translateY: [
//           {value: -7},
//           {value: 5},
//           {value: -4},
//           {value: 3},
//           {value: 0}
//         ],
//         duration: 360,
//         easing: 'easeOutInBack',
//         complete: function() {
//           checkStatus_animate = true;
//         }
//       })
//   }
// }
// });

//buttons -animate
// let animateDur_arrCounter = 100;
// const dur_txt = document.querySelector('.nDur_text');
// document.getElementById("dur_Next")
// .addEventListener('click', function() {
//   animateDur_arrCounter = animateDur_arrCounter+50;
//   if (animateDur_arrCounter > 10000) {
//     animateDur_arrCounter = 10000;
//     dur_txt.innerText = animateDur_arrCounter+"ms";
//   } else {
//     dur_txt.innerText = animateDur_arrCounter+"ms";
//   }
// })
// document.getElementById("dur_before")
// .addEventListener('click', function() {
//   animateDur_arrCounter = animateDur_arrCounter-50;
//   if (animateDur_arrCounter < 50) {
//     animateDur_arrCounter = 50;
//     dur_txt.innerText = animateDur_arrCounter+"ms";
//   } else {
//     dur_txt.innerText = animateDur_arrCounter+"ms";
//   }
// })


/*no upload & loading ascii anim ----------------------------------------------*/
/*no upload & loading ascii anim ----------------------------------------------*/
/*no upload & loading ascii anim ----------------------------------------------*/

function playAsciiLoading_ani_startLoad() {
  document.querySelector('.preP_outer-inner ').style.display = "none";
  document.querySelector('.loading_backdrop').style.display = "flex";
  document.querySelector('.asciiLoading_ani_P').style.display = "flex";
    anime ({
      targets: '.loading_backdrop',
      opacity: 1,
      duration: 900,
      easing: 'linear'
    })
    anime ({
      targets: '.loading_Container',
      opacity: 1,
      duration: 900,
      delay: 300,
      easing: 'linear'
    })
}

function playAsciiLoading_ani_close() {
  anime ({
    targets: '.loading_backdrop',
    opacity: 0,
    duration: 900,
    easing: 'linear',
    complete: function() {
      document.querySelector('.loading_backdrop').style.display = "none";
      document.querySelector('.asciiLoading_ani_P').style.display = "none";
    }
  })
  anime ({
    targets: '.loading_Container',
    opacity: 0,
    duration: 900,
    easing: 'linear'
  })
}




anime ({
  targets: '.loading_letters',
  translateY: [
      {value: 9},
      {value: -6},
      {value: 0}
  ],
  easing: 'easeInOutBack',
  delay: anime.stagger(150),
  duration: 300,
  loop: true
})


document.querySelector(".submitbutton")
.addEventListener("click", submit_loadbarStartAni);