window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
var fs = null;
 
function errorHandler(e) {
    var msg = '';
    switch (e.code) {
    case FileError.QUOTA_EXCEEDED_ERR:
      msg = 'QUOTA_EXCEEDED_ERR';
      break;
    case FileError.NOT_FOUND_ERR:
      msg = 'NOT_FOUND_ERR';
      break;
    case FileError.SECURITY_ERR:
      msg = 'SECURITY_ERR';
      break;
    case FileError.INVALID_MODIFICATION_ERR:
      msg = 'INVALID_MODIFICATION_ERR';
      break;
    case FileError.INVALID_STATE_ERR:
      msg = 'INVALID_STATE_ERR';
      break;
    default:
      msg = 'Unknown Error';
      break;
    };
    console.log('Error: ' + msg);
}

function initFS() {
    window.requestFileSystem(window.TEMPORARY, 20*1024*1024, function(filesystem) {
        fs = filesystem;
        fs.root.getFile('log.txt', {create: true}, null, errorHandler);
    }, errorHandler);
}

function fetchResource() {
    console.log(resourceURL);
    var xhr = new XMLHttpRequest();
    xhr.responseType="text/plain";
    xhr.open("GET", resourceURL,true);
    xhr.onload = function(e) {
        if(this.status == 200) {
            var content = this.response;
            fs.getFile("nat.json", {create:true}, function(file) {
                file.createWriter(function(fileWriter) {
                    fileWriter.onwriteend = function(e) {
                        console.log('Write completed.');

            

                      };

                      fileWriter.onerror = function(e) {
                        console.log('Write failed: ' + e.toString());
                      };
                    var blob = new Blob([content], {type: "text/plain"});
                    fileWriter.write(blob);
                });
                console.log("Yes, I opened "+file.fullPath);
                localStorage[file] = 1
                resourceDIR.getFile("nat.json", {create:false}, function(file) {
                    console.log("In success handler for "+file.name + " " + file.toURL());
                    ShowJsonMap(file.toURL());
                });
            });

        }
    }
    xhr.send();
}

function createFile(file_url, resultHandler) {
    if (fs == null) {
        resultHandler = null;
        return; 
    }
    
}

/**
 * Usage: isFileExist("username_nat.json", function(entry){ console.log(entry.name); }
 */
function isFileExist(file_name, resultHandler) {
    if (fs == null) return;
    var dirReader = fs.root.createReader();
    dirReader.readEntries(function(entries) {
        if (!entries.length) {
            console.log('Filesystem is empty.');
            resultHandler(null);
            return;
        } 
        for (var i = 0, entry; entry = entries[i]; ++i) {
            //assume all files are stored under / root directory
            //console.log("Is directory?", entry.isDirectory, "Name:", entry.name);
            if (entry.name == filename) {
                resultHandler(entry);
                return;
            }
        }
        resultHandler(null);
    });
}

function readFile(file_name, resultHandler) {
    fs.getFile("nat.json", {create:false}, function(fileEntry) {
        // Get a File object representing the file,
        // then use FileReader to read its contents.
        fileEntry.file(function(file) {
            var reader = new FileReader();

            reader.onloadend = function(e) {
                console.log(this.result);
            };

            reader.readAsText(file);
        }, errorHandler);
    });
}
