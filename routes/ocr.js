const router = require('express').Router();
const multer = require("multer");
var uploads = multer({dest:'./uploads/'});
const shell = require("shelljs");

var fs = require('fs-extra');
const vision = require('@google-cloud/vision');
// const toneAnalyzer = require("watson-developer-cloud/tone-analyzer/v3");
// const toneobj = require('../secret').t_analyser;

//const PDFImage = require("pdf-image").PDFImage;

//creates a client
const client = new vision.ImageAnnotatorClient();




function pdf_to_png(file,pgno=0){
    return new Promise((resolve,reject)=>{
       var pdfimage = new PDFImage(file);
        pdfimage.convertPage(pgno)
        .then((filepath)=>{
          resolve(filepath)
        })
        .catch((err)=>{
            console.log(err);
            reject(err);
        });
    })
}










// function analyze(text){
//     return new Promise((resolve,reject)=>{
//         var tone_analyzer = new toneAnalyzer(toneobj);
//   var params = {
//           'tone_input': text,
//           'content_type': 'text/plain'
//         };


//         tone_analyzer.tone(params,(err,response)=>{
//             if(err) reject(err);
//             else resolve(JSON.stringify(response,null,2));
//         });
//     });


// }


router.post('/',uploads.single('file'), (req,res,next)=>{
  //  console.log(req.file);
    if(req.file === undefined){
        var err = new Error('error');
        next(err);
    }
    fs.renameSync(req.file.path,"uploads/temp");

    let filepath = "uploads/temp";
        client
      .textDetection(filepath)
      .then((results) => {
    //    console.log(JSON.stringify(results));
        const detections = results[0].textAnnotations;
        var text = '';
        detections.forEach((datta) => {
            text+=datta.description+' ';

        });
        //req.session.file = req.file.path;

        // analyze(text)
        // .then((txt)=>{
          var i=0;
          var data='';
          //var tone = JSON.parse(text).document_tone.tones[0].tone_name;
          //console.log(tone);
        text=text.split("\n").join(" ").toLowerCase();



        fs.writeFileSync("temp.txt",text);
        shell.cd("./Trie");
        var data = shell.exec("./checker ../temp.txt").toString();

        fs.unlinkSync("../temp.txt");
        fs.unlinkSync("../" + filepath);
        var array = data.split("\n");
        if(array.length <= 1)
            return res.send("Some problem occurred <a href='/'>go back</a>");
        res.render("display",{data:array,text,tone:null});
        //});


        }).catch(err=>next(err));

      })




module.exports = router;