var fs = require('fs');
var stringSearcher = require('string-search');
var path="/usr/share/applications";

 var apps = new Array();

//fs.readdir(path, (err, files) => {
  //files.forEach(file => {
 //console.log("\n\n"+file+"\n\n");
    //if(fs.lstatSync(path+"/"+file).isFile())
    fs.readFile("/usr/share/applications/cinnamon-control-center.desktop",{encoding: "utf8"}, function read(err, data) {
    if (err) {
       console.log(err)
    }

    content = data;
    var nameapp="";
    stringSearcher.find(content, '^Name').then(function(resultArr) {
    //resultArr => [ {line: 1, text: 'This is the string to search text in'} ]
    nameapp=resultArr[0].text.replace("Name=","");
    console.log(nameapp);
    if(!apps[nameapp])
        apps[nameapp]=""; 
    
  });
    stringSearcher.find(content, '^Exec')
  .then(function(resultArr) {
    //resultArr => [ {line: 1, text: 'This is the string to search text in'} ] 
      if(resultArr[0].text){
    var s=resultArr[0].text.replace("Exec=","");
    if(s.indexOf('%')>0)
    s=s.substring(0, s.indexOf('%'));
    apps[nameapp]=s; 
    }
    console.log(apps);
    

    //console.log(apps);
  });


    // Invoke the next step here however you like
    //console.log(content);   // Put all of the code here (not the best solution)
             // Or put the next step in a function and invoke it
});
   // console.log(file);
 // });
console.log(apps);
//})

