/**
 * Created by zhagtingjiang on 2018/12/19.
 */
function readFileList(path,filesList,str) {
    var fs = require('fs');
    var files = fs.readdirSync(path);
    var ingnor = ['node_modules','bower_components','static'];
    files.forEach(function(itm){
        var stat = fs.statSync(path + itm);
        if (stat.isDirectory() && ingnor.indexOf(itm)===-1) {
            //递归读取文件
            readFileList(path + itm + "/", filesList,str);
        } else {
            if(itm.endsWith(str)){
                var pathItem = path+itm;
                pathItem = pathItem.slice(2);
                filesList.push(pathItem);
            }
        }
    });
    return filesList;
}


var components = readFileList('./',[],'.js');
console.log(components);