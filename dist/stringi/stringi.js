
  var Module = typeof Module !== 'undefined' ? Module : {};
  
  if (!Module.expectedDataFileDownloads) {
    Module.expectedDataFileDownloads = 0;
  }
  Module.expectedDataFileDownloads++;
  (function() {
    // When running as a pthread, FS operations are proxied to the main thread, so we don't need to
    // fetch the .data bundle on the worker
    if (Module['ENVIRONMENT_IS_PTHREAD']) return;
    var loadPackage = function(metadata) {
  
      var PACKAGE_PATH = '';
      if (typeof window === 'object') {
        PACKAGE_PATH = window['encodeURIComponent'](window.location.pathname.toString().substring(0, window.location.pathname.toString().lastIndexOf('/')) + '/');
      } else if (typeof process === 'undefined' && typeof location !== 'undefined') {
        // web worker
        PACKAGE_PATH = encodeURIComponent(location.pathname.toString().substring(0, location.pathname.toString().lastIndexOf('/')) + '/');
      }
      var PACKAGE_NAME = '../../dist/stringi/stringi.data';
      var REMOTE_PACKAGE_BASE = 'stringi.data';
      if (typeof Module['locateFilePackage'] === 'function' && !Module['locateFile']) {
        Module['locateFile'] = Module['locateFilePackage'];
        err('warning: you defined Module.locateFilePackage, that has been renamed to Module.locateFile (using your locateFilePackage for now)');
      }
      var REMOTE_PACKAGE_NAME = Module['locateFile'] ? Module['locateFile'](REMOTE_PACKAGE_BASE, '') : REMOTE_PACKAGE_BASE;
    
      var REMOTE_PACKAGE_SIZE = metadata['remote_package_size'];
      var PACKAGE_UUID = metadata['package_uuid'];
    
      function fetchRemotePackage(packageName, packageSize, callback, errback) {
        
        if (typeof process === 'object' && typeof process.versions === 'object' && typeof process.versions.node === 'string') {
          require('fs').readFile(packageName, function(err, contents) {
            if (err) {
              errback(err);
            } else {
              callback(contents.buffer);
            }
          });
          return;
        }
      
        var xhr = new XMLHttpRequest();
        xhr.open('GET', packageName, true);
        xhr.responseType = 'arraybuffer';
        xhr.onprogress = function(event) {
          var url = packageName;
          var size = packageSize;
          if (event.total) size = event.total;
          if (event.loaded) {
            if (!xhr.addedTotal) {
              xhr.addedTotal = true;
              if (!Module.dataFileDownloads) Module.dataFileDownloads = {};
              Module.dataFileDownloads[url] = {
                loaded: event.loaded,
                total: size
              };
            } else {
              Module.dataFileDownloads[url].loaded = event.loaded;
            }
            var total = 0;
            var loaded = 0;
            var num = 0;
            for (var download in Module.dataFileDownloads) {
            var data = Module.dataFileDownloads[download];
              total += data.total;
              loaded += data.loaded;
              num++;
            }
            total = Math.ceil(total * Module.expectedDataFileDownloads/num);
            if (Module['setStatus']) Module['setStatus']('Downloading data... (' + loaded + '/' + total + ')');
          } else if (!Module.dataFileDownloads) {
            if (Module['setStatus']) Module['setStatus']('Downloading data...');
          }
        };
        xhr.onerror = function(event) {
          throw new Error("NetworkError for: " + packageName);
        }
        xhr.onload = function(event) {
          if (xhr.status == 200 || xhr.status == 304 || xhr.status == 206 || (xhr.status == 0 && xhr.response)) { // file URLs can return 0
            var packageData = xhr.response;
            callback(packageData);
          } else {
            throw new Error(xhr.statusText + " : " + xhr.responseURL);
          }
        };
        xhr.send(null);
      };

      function handleError(error) {
        console.error('package error:', error);
      };
    
        var fetchedCallback = null;
        var fetched = Module['getPreloadedPackage'] ? Module['getPreloadedPackage'](REMOTE_PACKAGE_NAME, REMOTE_PACKAGE_SIZE) : null;

        if (!fetched) fetchRemotePackage(REMOTE_PACKAGE_NAME, REMOTE_PACKAGE_SIZE, function(data) {
          if (fetchedCallback) {
            fetchedCallback(data);
            fetchedCallback = null;
          } else {
            fetched = data;
          }
        }, handleError);
      
    function runWithFS() {
  
      function assert(check, msg) {
        if (!check) throw msg + new Error().stack;
      }
  Module['FS_createPath']("/", "usr", true, true);
Module['FS_createPath']("/usr", "lib", true, true);
Module['FS_createPath']("/usr/lib", "R", true, true);
Module['FS_createPath']("/usr/lib/R", "library", true, true);
Module['FS_createPath']("/usr/lib/R/library", "stringi", true, true);
Module['FS_createPath']("/usr/lib/R/library/stringi", "html", true, true);
Module['FS_createPath']("/usr/lib/R/library/stringi", "include", true, true);
Module['FS_createPath']("/usr/lib/R/library/stringi", "R", true, true);
Module['FS_createPath']("/usr/lib/R/library/stringi", "Meta", true, true);
Module['FS_createPath']("/usr/lib/R/library/stringi", "libs", true, true);
Module['FS_createPath']("/usr/lib/R/library/stringi", "help", true, true);

          /** @constructor */
          function DataRequest(start, end, audio) {
            this.start = start;
            this.end = end;
            this.audio = audio;
          }
          DataRequest.prototype = {
            requests: {},
            open: function(mode, name) {
              this.name = name;
              this.requests[name] = this;
              Module['addRunDependency']('fp ' + this.name);
            },
            send: function() {},
            onload: function() {
              var byteArray = this.byteArray.subarray(this.start, this.end);
              this.finish(byteArray);
            },
            finish: function(byteArray) {
              var that = this;
      
          Module['FS_createPreloadedFile'](this.name, null, byteArray, true, true, function() {
            Module['removeRunDependency']('fp ' + that.name);
          }, function() {
            if (that.audio) {
              Module['removeRunDependency']('fp ' + that.name); // workaround for chromium bug 124926 (still no audio with this, but at least we don't hang)
            } else {
              err('Preloading file ' + that.name + ' failed');
            }
          }, false, true); // canOwn this data in the filesystem, it is a slide into the heap that will never change
  
              this.requests[this.name] = null;
            }
          };
      
              var files = metadata['files'];
              for (var i = 0; i < files.length; ++i) {
                new DataRequest(files[i]['start'], files[i]['end'], files[i]['audio'] || 0).open('GET', files[i]['filename']);
              }
      
        
      function processPackageData(arrayBuffer) {
        assert(arrayBuffer, 'Loading data file failed.');
        assert(arrayBuffer instanceof ArrayBuffer, 'bad input to processPackageData');
        var byteArray = new Uint8Array(arrayBuffer);
        var curr;
        
          // Reuse the bytearray from the XHR as the source for file reads.
          DataRequest.prototype.byteArray = byteArray;
    
            var files = metadata['files'];
            for (var i = 0; i < files.length; ++i) {
              DataRequest.prototype.requests[files[i].filename].onload();
            }
                Module['removeRunDependency']('datafile_../../dist/stringi/stringi.data');

      };
      Module['addRunDependency']('datafile_../../dist/stringi/stringi.data');
    
      if (!Module.preloadResults) Module.preloadResults = {};
    
        Module.preloadResults[PACKAGE_NAME] = {fromCache: false};
        if (fetched) {
          processPackageData(fetched);
          fetched = null;
        } else {
          fetchedCallback = processPackageData;
        }
      
    }
    if (Module['calledRun']) {
      runWithFS();
    } else {
      if (!Module['preRun']) Module['preRun'] = [];
      Module["preRun"].push(runWithFS); // FS is not initialized yet, wait for it
    }
  
   }
   loadPackage({"files": [{"filename": "/usr/lib/R/library/stringi/NAMESPACE", "start": 0, "end": 6751}, {"filename": "/usr/lib/R/library/stringi/CITATION", "start": 6751, "end": 7372}, {"filename": "/usr/lib/R/library/stringi/LICENSE", "start": 7372, "end": 29374}, {"filename": "/usr/lib/R/library/stringi/AUTHORS", "start": 29374, "end": 31487}, {"filename": "/usr/lib/R/library/stringi/NEWS", "start": 31487, "end": 67350}, {"filename": "/usr/lib/R/library/stringi/DESCRIPTION", "start": 67350, "end": 68775}, {"filename": "/usr/lib/R/library/stringi/INDEX", "start": 68775, "end": 75239}, {"filename": "/usr/lib/R/library/stringi/html/00Index.html", "start": 75239, "end": 116912}, {"filename": "/usr/lib/R/library/stringi/html/R.css", "start": 116912, "end": 118247}, {"filename": "/usr/lib/R/library/stringi/include/stringi.h", "start": 118247, "end": 138026}, {"filename": "/usr/lib/R/library/stringi/include/stringi.cpp", "start": 138026, "end": 184922}, {"filename": "/usr/lib/R/library/stringi/R/stringi", "start": 184922, "end": 185980}, {"filename": "/usr/lib/R/library/stringi/R/stringi.rdb", "start": 185980, "end": 250841}, {"filename": "/usr/lib/R/library/stringi/R/stringi.rdx", "start": 250841, "end": 254074}, {"filename": "/usr/lib/R/library/stringi/Meta/features.rds", "start": 254074, "end": 254206}, {"filename": "/usr/lib/R/library/stringi/Meta/package.rds", "start": 254206, "end": 255451}, {"filename": "/usr/lib/R/library/stringi/Meta/links.rds", "start": 255451, "end": 257868}, {"filename": "/usr/lib/R/library/stringi/Meta/nsInfo.rds", "start": 257868, "end": 259582}, {"filename": "/usr/lib/R/library/stringi/Meta/Rd.rds", "start": 259582, "end": 264297}, {"filename": "/usr/lib/R/library/stringi/Meta/hsearch.rds", "start": 264297, "end": 268814}, {"filename": "/usr/lib/R/library/stringi/libs/stringi.so", "start": 268814, "end": 13015681}, {"filename": "/usr/lib/R/library/stringi/libs/icudt55l.dat", "start": 13015681, "end": 38924097}, {"filename": "/usr/lib/R/library/stringi/libs/LICENSE.txt", "start": 38924097, "end": 38942330}, {"filename": "/usr/lib/R/library/stringi/help/AnIndex", "start": 38942330, "end": 38951807}, {"filename": "/usr/lib/R/library/stringi/help/aliases.rds", "start": 38951807, "end": 38953743}, {"filename": "/usr/lib/R/library/stringi/help/paths.rds", "start": 38953743, "end": 38954631}, {"filename": "/usr/lib/R/library/stringi/help/stringi.rdb", "start": 38954631, "end": 39402421}, {"filename": "/usr/lib/R/library/stringi/help/stringi.rdx", "start": 39402421, "end": 39404728}], "remote_package_size": 39404728, "package_uuid": "da11a9bd-7e7e-4eb0-abda-8c25085369cf"});
  
  })();
  