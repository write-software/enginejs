/****************************************************************
 *
 * The author of this software is Steve Egginton.
 *
 * Copyright (c) 2018 The Write Software Company Limited.
 *
 * Permission to use, copy, modify, and distribute this software for any
 * purpose without fee is hereby granted, provided that this entire notice
 * is included in all copies of any software which is or includes a copy
 * or modification of this software and in all copies of the supporting
 * documentation for such software.
 *
 * THIS SOFTWARE IS BEING PROVIDED "AS IS", WITHOUT ANY EXPRESS OR IMPLIED
 * WARRANTY.  IN PARTICULAR, NEITHER THE AUTHOR NOR WRITE SOFTWARE MAKES ANY
 * REPRESENTATION OR WARRANTY OF ANY KIND CONCERNING THE MERCHANTABILITY
 * OF THIS SOFTWARE OR ITS FITNESS FOR ANY PARTICULAR PURPOSE.
 *
 ***************************************************************/
//Reach object
//multi platform normaliser!

reach = {
    deviceUUID: 'pc',
	fetchList: [],
	localFiles: [],
	localDir: "",
	platformType: "browser",
	ready: false,
	onReady:function() {
	},
    takeSnapshot: function (callback)
    {
        var win = reach.node.gui.Window.get();
    
        win.capturePage(function(buffer)
        {
            var img = new Image();
            var rect = { width:$engine.pgWidth, height:$engine.pgHeight };

            img.onload = function() 
            {
                var canvas = document.createElement('canvas');
                canvas.width  = rect.width;
                canvas.height = rect.height;

                canvas.getContext('2d').drawImage(img, 0, 0);

                if (callback) callback(canvas.toDataURL('image/jpeg', 0.4));
            }            
            img.src = buffer;
        }, { format : 'jpg', datatype : 'datauri'} );
    },
    showDebugger:function()
    {
        if (reach.node)
            reach.node.gui.Window.get().showDevTools();
    },	
    init: function() {      
		if(typeof(Cordova) != 'undefined') {
			reach.platformType = "Cordova";
			reach.deviceUUID = $engine.getLocal("deviceUUID", $engine.guid());
			$engine.storeLocal("deviceUUID", reach.deviceUUID);
			document.addEventListener("deviceready", reach.onDeviceReady, false);
		}
		else if(typeof(nw) != 'undefined') {
			reach.platformType = "node";
            try
            {
    			reach.node = {
    				fs: require("fs"),
    				http: require('http'),
    				https: require('https'),
    				childProcess: require('child_process'),
    				path: require("path"),
    				net: require("net"),
    				util: require("util"),
                    gui: require('nw.gui')
    			};
            }
            catch(e)
            {
                alert(e.messaged)
            }
			var dir = nw.App.dataPath + "/_store/";
			reach.node.fs.mkdir(dir, function(){
				//lets get some system information that may be useful for debugging purposes
				var os = require('os');
				//not putting this on the reach object as we're not going to use it afterwards!
				var systemInfo = {
					architecture: os.arch(),
					cpus: os.cpus(),
					freemem: os.freemem(),			//this could be useful to check periodicaly if performance issues are found!
					homedir: os.homedir(),
					hostname: os.hostname(),
					loadAverages: os.loadavg(),
					network: os.networkInterfaces(),
					platform: os.platform(),
					release: os.release(),
					tempdir: os.tmpdir(),
					totalmem: os.totalmem(),
					type: os.type(),
					uptime: os.uptime()
				};
				reach.fs.writeFile("sysinfo.json",JSON.stringify(systemInfo),function(){
				},function(err){
				});
			}, function(err){});
			reach.localDir = dir;
			reach.getFiles();
            function puts(error, stdout, stderr) 
            {
                var sOutput = stdout.toString();
                
                var p = sOutput.lastIndexOf(" ");
                sOutput = sOutput.substr(p+1);
                reach.deviceUUID = sOutput;
            }
            try
            {
                reach.node.childProcess.exec("vol", puts);
            }
            catch(e)
            {
            }
            try
            {
                var win = reach.node.gui.Window.get();
         //       setTimeout(function() { win.setAlwaysOnTop(true) },2000); 
         //       setTimeout(function() { win.setAlwaysOnTop(true) },5000); 
            }
            catch(e)
            {
            }
		}
		else if(typeof(system) != 'undefined') {
			reach.platformType = "webclient";
			reach.ready = true;
			reach.onReady();
		}
		else{
			reach.ready = true;
			reach.onReady();
		}
	},
	runApp: function(command,background,options,callback,errorCallback) {
		options = options || {};
		switch(reach.platformType) {
			case 'Cordova':
				errorCallback && errorCallback("Not supported");
				//todo add in support via intents
				break;
			case 'node':
				if(background) {
					var process = reach.node.childProcess.exec('start "" /B /MIN ' + command ,options);
					process.on('error', function(err){
						errorCallback && errorCallback('Failed to start child process ' + err.toString());
					});
					process.on('close', function(code){
						if (code !== 0) {
							errorCallback && errorCallback('ps process exited with code ' + code);
						}
						else {
							callback && callback();
						}
					});
					return;
				}
				reach.node.childProcess.exec(command,options,function(error, stdout, stderr){
					if (error !== null) {
						return errorCallback && errorCallback(error);
					}
					callback && callback(stdout);
				});
				break;
			case 'webclient':
				system.run(command,background ? 0:1);
				callback && callback();
				break;
			default:
				errorCallback("Not supported");
		}
	},
    data:
    {
        today: new Date()
    },
    fn:
    {

    },
	storeData: function(name,data,cb) {
		switch(reach.platformType) {
			case 'Cordova':
			case 'node':
			case 'webclient':
				reach.fs.writeFile(name + ".data",data,cb,cb);
				break;
			default:
				$engine.storeLocal(name, data);
				cb && cb();
		}
	},
	restoreData: function(name,cb,sDefault) {
		switch(reach.platformType) {
			case 'Cordova':
			case 'node':
			case 'webclient':
				reach.fs.readFile(name + ".data",function(data){
					cb && cb(data);
				},function()
                {
                    cb & cb(sDefault);
                });
				break;
			default:
				var data = $engine.getLocal(name, sDefault);
				cb && cb(data);
		}
	},
	storeDS: function(name,ds,cb) {
		switch(reach.platformType) {
			case 'Cordova':
			case 'node':
			case 'webclient':
				reach.fs.writeFile(name + ".json",ds.toJSON(),cb,cb);
				break;
			default:
                try
                {
    				$engine.storeLocal(name, ds.toJSON());
	       			cb && cb();
                }
                catch(e)
                {
                    debugger;
                }
		}
	},
	getDS: function(name,ds,cb) {
		switch(reach.platformType) {
			case 'Cordova':
			case 'node':
			case 'webclient':
				reach.fs.readFile(name + ".json",function(data){
					ds.load(data);
					cb && cb();
				},cb);
				break;
			default:
				var data = $engine.getLocal(name, "[]");
				ds.load(data);
				cb && cb();
		}
	},
	toFetch: function(ds) {
		for(var i=0; i<reach.fetchList.length; i++) {
			if(reach.fetchList[i] == ds) return;	//already in fetchlist!
		}
		reach.fetchList.push(ds);
	},
	updateFileList: function(fileList) {
		reach.fs.writeFile("filelist.json", JSON.stringify(fileList), function(){
			reach.localFiles = fileList;
			var logo = reach.getImageURL('logo.png'); 
            if (logo.substr(0,10) == "../images/")
                logo = null;   
//			if(logo) $get('companyLogo').setSrc(logo + "?" + (new Date().valueOf()));
			reach.ready = true;
			reach.onReady();
		},function(err){
			alert(err.toString())
		});
	},
	getLocalFile: function(name) {
		for(var j=0; j<reach.localFiles.length; j++) {
			if(reach.localFiles[j].shortname == name && reach.localFiles[j].hasOwnProperty('localname')) {
				return reach.localFiles[j].localname;
			}
		}
		return false;
	},
	getFile: function(list,i) {
		var wgt = $get('lbWhoAmI');
		if(i == list.length) {
    		if(wgt) wgt.setText("Downloading images for offline use, complete");
			reach.updateFileList(list);
			return;
		}
		if(wgt) wgt.setText("Downloading images for offline use, image " + i + " of " + list.length  + " ("+list[i].shortname+")");
		var add = true;
		for(var j=0; j<reach.localFiles.length; j++) {
			if(reach.localFiles[j].filename == list[i].filename && reach.localFiles[j].modified == list[i].modified) {
				add = false;
				break;
			}
		}
		if(add) {
			if(list[i].folder) {
				reach.fs.makeFolder(list[i].shortname, function(){
					i++;
					reach.getFile(list,i);
				}, function(){
					i++;
					reach.getFile(list,i);
				});
				return;
			}
			var subFolder = "";
			subFolder = list[i].shortname.substr(list[i].shortname.lastIndexOf('/')+1);
            var getObj = {
                command: "getFile",
                token: $engine.token,
                device: $engine.deviceid,
                account: $engine.account,
                pincode: $engine.pincode,
                fileName: list[i].filename
            }
            var getStr = $.param(getObj);
            reach.fs.downloadFile($engine.serverURL + "?" + getStr, list[i].shortname, function(resp) {
				list[i].localname = resp;
				i++;
				reach.getFile(list,i);
			}, function(err) {
				list.splice(i,1);	//we didn't get this one so remove it from the list for now
				reach.getFile(list,i);
			})
		}
		else{
			reach.fs.getFilePath(list[i].shortname, function(resp) {
				list[i].localname = resp;
				i++;
				reach.getFile(list,i);
			}, function() {
				i++;
				reach.getFile(list,i);
			});
		}
	},
	getFiles: function() {
		reach.fs.readFile("filelist.json", function(list){
			reach.localFiles = JSON.parse(list);
			$engine.ajax({
				url:$engine.serverURL,
                timeout:5000,
				params:{
					command:'getFileList',
                    account:$engine.account,
                    pincode:$engine.pincode
				},
				success: function(response) {
					if(response.success) {
						reach.getFile(response.results,0);
					}
				},
				error: function(jqXHR, errText, err) {
					if((err == "timeout"  || err == "") && jqXHR.readyState == 0) {
						//appears we are offline
						reach.ready = true;
						reach.onReady();
					} 
				}
			})
		}, function(){
			$engine.ajax({
				url:$engine.serverURL,
                timeout:5000,
				params:{
					command:'getFileList',
                    account:$engine.account,
                    pincode:$engine.pincode
				},
				success: function(response) {
					if(response.success) {
						reach.getFile(response.results,0);
					}
				},
				error: function(jqXHR) {
                    debugger;
					if(err == "timeout" && jqXHR.readyState == 0) {
						//appears we are offline
						$engine.warning($tr("Please ensure online and restart to perform initial prime"));
						reach.ready = true;
						reach.onReady();
					} 
				}
			})
		})
	},
	getLocalFilePath: function() {
		switch(reach.platformType) {
			case 'Cordova':
				var path = reach.localDir;
				return path;
			case 'node':
				var path =  reach.localDir;
				path = path.replace(/\\/g, "/");				
				return encodeURI("file:///" + path);
			case 'webclient':
			default:
		}
		return false;
	},
	getImageURL: function(name,path) {
		switch(reach.platformType) {
			case 'Cordova':
				var ret = reach.getLocalFile(name);
				if(ret) return ret;
				break;
			case 'node':
				var ret = reach.getLocalFile(name);
				if(ret) return "file:///" + reach.localDir + ret;
				break;
			case 'webclient':
			default:
		}
        if (path == null) path = "../images/";
		return path + name;
	},
	exitApp: function() {
		switch(reach.platformType) {
			case 'Cordova':
				navigator && navigator.app && navigator.app.exitApp();
				navigator && navigator.device && navigator.device.exitApp();
				break;
			case 'node':
                var win = reach.node.gui.Window.get();
                win.on("close",function()
                {
                    GUI.App.quit();
    				nw.App.quit();
                });
                win.close(true)
				break;
			case 'webclient':
				system.exit();
				break;
			default:
		}
		window.close();
		alert("Not supported");
	},
	socket : function() {
		var support = function() {				
			switch(reach.platformType) {
				case 'Cordova':
				case 'node':
					return true;
				case 'webclient':
				default:
					return false;
			}
		}
		var createSocket =  function() {
			if(!support()) return false;
			switch(reach.platformType) {
				case 'Cordova':
					return new Socket();
					break;
				case 'node':
					return new reach.node.net.Socket();
					break;
			}
		}
		var socket = createSocket();
		if(!socket) return false;
		var sock = this;
		return {
			connect: function(ip,port,cb,ecb) {
				switch(reach.platformType) {
					case 'Cordova':
						//experimental socket timeouts!
						if(socket.hasOwnProperty('timeout')) {
							var timer = setTimeout(function(){
								socket = null;
								ecb && ecb("Timeout");
							},socket.timeout);
							socket.open(ip,port,function(){
								if(socket != null && cb) cb();
								clearTimeout(timer);
							},function(err){
								if(socket != null && ecb) ecb(err);
								clearTimeout(timer);
							});
							return;
						}
						socket.open(ip,port,cb,ecb);
						break;
					case 'node':
						socket.on('connect', function() {
							cb && cb();
						});
						socket.on('error', function(err) {
							ecb && ecb(err);
						});
						socket.on('timeout', function(err) {
							ecb && ecb("timeout reached");
							socket.destroy();
						});
						socket.connect(port, ip);
						break;
				}
			},
			send: function(data, cb, ecb) {
				switch(reach.platformType) {
					case 'Cordova':
						var dataArray = new Uint8Array(data.length);
						for (var i = 0; i < dataArray.length; i++) {
						  dataArray[i] = data.charCodeAt(i);
						}
						socket.write(dataArray, function(){
							cb && cb();
						}, function(err){
							ecb && ecb(err);
						});
						break;
					case 'node':
						socket.write(data, function(err){
							if(err) ecb && ecb(err);
							else cb && cb();
						});
						socket.end();
						break;
				}
			},
			"close": function() {
				switch(reach.platformType) {
					case 'Cordova':
						socket.shutdownWrite();
						socket = null;
						sock = null;
						break;
					case 'node':
						socket.destroy();
						socket = null;
						sock = null;
						break;
				}
			},
			"setTimeout" : function(timeout, cb) {
				switch(reach.platformType) {
					case 'Cordova':
						socket.timeout = timeout;
						cb && cb();
						break;
					case 'node':
						socket.setTimeout(timeout, function(){
							cb && cb();
						});
						break;
				}
			}
		}
	},
    fs:
    {
        execPath: function()
        {
			switch(reach.platformType) {
				case 'node':
                    return reach.node.path.dirname(process.execPath) + "\\";
                break;        
			}
            return "";
        },
        errorHandler: function(fileName, ecb, e) {  
			var msg = '';
			switch (e.code) {
				case FileError.QUOTA_EXCEEDED_ERR:
					msg = 'Storage quota exceeded';
					break;
				case FileError.NOT_FOUND_ERR:
					msg = 'File not found';
					break;
				case FileError.SECURITY_ERR:
					msg = 'Security error';
					break;
				case FileError.INVALID_MODIFICATION_ERR:
					msg = 'Invalid modification';
					break;
				case FileError.INVALID_STATE_ERR:
					msg = 'Invalid state';
					break;
				default:
					msg = 'Unknown error';
					break;
			};
			if(ecb) ecb(fileName,msg,e.code);
			console.log('Error (' + fileName + '): ' + msg);
		},
        removeFile: function(fileName, cb, ecb) {
			switch(reach.platformType) {
				case 'Cordova':
					var pathToFile = cordova.file.dataDirectory + fileName;
					window.resolveLocalFileSystemURL(pathToFile, function (fileEntry) {
						fileEntry.remove(function () {
							cb && cb()
						}, reach.fs.errorHandler.bind(null, fileName, ecb));
					}, reach.fs.errorHandler.bind(null, fileName, ecb));
					break;
				case 'node':
					var pathToFile = reach.localDir + fileName;
					reach.node.fs.unlink(pathToFile, function (err) {
						if (err) {
							ecb && ecb(fileName,err);
							return;
						}
						cb && cb();
					});
					break;
				default:
					ecb && ecb("Not supported");
			}
		},
        readFile: function(fileName, cb, ecb) {
			switch(reach.platformType) {
				case 'Cordova':
					var pathToFile = cordova.file.dataDirectory + fileName;
					window.resolveLocalFileSystemURL(pathToFile, function (fileEntry) {
						fileEntry.file(function (file) {
							var reader = new FileReader();
							reader.onload = function (e) {
								cb && cb(e.target.result);
							};
							reader.onerror = reach.fs.errorHandler.bind(null, fileName, ecb);
							reader.readAsText(file);
						}, reach.fs.errorHandler.bind(null, fileName, ecb));
					}, reach.fs.errorHandler.bind(null, fileName, ecb));
					break;
				case 'node':
					var pathToFile = reach.localDir + fileName;
					reach.node.fs.readFile(pathToFile, function (err, data) {
						if (err) {
							ecb && ecb(fileName,err,"");
							return;
						}
						cb && cb(String(data));
					});
					break;
				default:
					ecb && ecb("Not supported");
			}
		},
		makeFolder: function(folder, cb, ecb) {
			switch(reach.platformType) {
				case 'Cordova':
					window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function (directoryEntry) {
						directoryEntry.getDirectory(folder, {create: true, exclusive: false}, cb, reach.fs.errorHandler.bind(null, folder, ecb));
					});
					break;
				case 'node':
					reach.node.fs.mkdir(reach.localDir + folder,function(err){
						if(err){
							ecb && ecb("Error creating directory " + err.toString());
						}
						else {
							cb && cb();
						}
					});
					break;
				case 'webclient':
				default:
					ecb && ecb("Not supported");
			}
		},
		writeFile: function(fileName, data, cb, ecb) {
			switch(reach.platformType) {
				case 'Cordova':
					window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function (directoryEntry) {
						directoryEntry.getFile(fileName, { create: true }, function (fileEntry) {
							fileEntry.createWriter(function (fileWriter) {
								fileWriter.onwrite = function (e) {
									console.log('Write of file "' + fileName + '"" completed.');
									cb && cb();
								};
								fileWriter.onerror = function (e) {
									console.log('Write failed: ' + e.toString());
									reach.fs.errorHandler.bind(null, fileName, ecb);
								};
								try{
									var blob = new Blob([data], { type: 'text/plain' });
									fileWriter.write(blob);
								} catch(e){
									//some older versions of Android don't support the Blob
									//so we just send the data to the filewriter!
									fileWriter.write(data);
								}
							}, reach.fs.errorHandler.bind(null, fileName, ecb));
						}, reach.fs.errorHandler.bind(null, fileName, ecb));
					}, reach.fs.errorHandler.bind(null, fileName, ecb));
					break;
				case 'node':
					reach.node.fs.writeFile(reach.localDir + fileName,data, function (err) {
						if (err) {
							ecb && ecb(fileName,err,"");
							return;
						}
						cb && cb();
					});
					break;
				case 'webclient':
					system.writefile(fileName,data);
					cb && cb();
					break;
				default:
					ecb && ecb(fileName,err,"");
			}
		},
		getFilePath: function(fileName, cb, ecb) {
			switch(reach.platformType) {
				case 'Cordova':
					var pathToFile = cordova.file.dataDirectory + fileName;
					window.resolveLocalFileSystemURL(pathToFile, function (fileEntry) {
						cb(fileEntry.toInternalURL());
					}, reach.fs.errorHandler.bind(null, fileName, ecb));
					break;
				case 'node':
					cb && cb(fileName);
					break;
				case 'webclient':
				default:
					ecb && ecb("Not supported");
			}
		},
		downloadFile: function(url, saveAs, callback, errorcallback) {
			if(typeof(Cordova) != 'undefined') {
				var fileTransfer = new FileTransfer();
				if(!fileTransfer) return errorcallback("Filetransfer not available");
				var fileName = url.substr(url.lastIndexOf('/')+1);
				var uri = encodeURI(url);
				var folder = cordova.file.dataDirectory;
				if(saveAs) fileName = saveAs;
				var fileURL = folder + fileName;
				var fileTransferErrors = [
					FileTransferError.FILE_NOT_FOUND_ERR = "File not found",
					FileTransferError.INVALID_URL_ERR = "Invalid URL",
					FileTransferError.CONNECTION_ERR = "Connection Error",
					FileTransferError.ABORT_ERR = "Aborted",
					FileTransferError.NOT_MODIFIED_ERR = "Not modified"
				];

				fileTransfer.download(
					uri,
					fileURL,
					function(entry) {
						console.log("download complete: " + entry.toURL());
						callback && callback(entry.toInternalURL());
					},
					function(error) {
						console.log("download error source " + error.source);
						console.log("download error target " + error.target);
						console.log("upload error code" + error.code);
						errorcallback && errorcallback("Download error - " + fileTransferErrors[error.code]);
					},
					false,
					{
						headers: {
						}
					}
				);
			}
			else if(typeof(nw) != 'undefined') {
				var fileName = url.substr(url.lastIndexOf('/')+1);
				var uri = encodeURI(url);
				var folder = reach.localDir;
				if(saveAs) fileName = saveAs;
				var fileURL = folder + fileName;       
				var file = reach.node.fs.createWriteStream(fileURL);
                if ($engine.secure == "Y")
                {
    				var request = reach.node.https.get(uri, function(response) {
    					response.pipe(file);
    					file.on('finish', function() {
    						file.close(function(){
    							callback && callback(fileName);
    						});
    					});
    				}).on('error', function(err) { // Handle errors
    					reach.node.fs.unlink(fileURL); // Delete the file async. (But we don't check the result)
    					if (errorcallback) errorcallback(err.toString());
    				});
                }
                else
                {
    				var request = reach.node.http.get(uri, function(response) {
    					response.pipe(file);
    					file.on('finish', function() {
    						file.close(function(){
    							callback && callback(fileName);
    						});
    					});
    				}).on('error', function(err) { // Handle errors
    					reach.node.fs.unlink(fileURL); // Delete the file async. (But we don't check the result)
    					if (errorcallback) errorcallback(err.toString());
    				});
                }
			}
		}
    },
    playAudio: function ()
    {
        if ($engine.preferences.sound != "Y") return;
        try
        {
            ion.sound.play("beep5");
        }
        catch (e)
        {
        }
    },
	//Cordova specific only!
    keyboardShowHandler: function(e)
    {
        SoftKeyboard.hide();
    },
    presentation:{
        onerror:function(msg)
        {
        },
        onmessage:function(msg)
        {
        },
        onstatechange:function(state)
        {
        },
        start:function(available,unavailable)
        {
            if (navigator.presentation)
            {
                navigator.presentation.onavailablechange = function(screenEvent)
                {
                    if(screenEvent.available)
                    {
                        reach.session = navigator.presentation.requestSession("display.html");
                        reach.session.onmessage = function(msg)
                        {
                            reach.presentation.onmessage(msg);
                        };
                        reach.session.onstatechange = function()
                        {
                            reach.presentation.onstatechange(reach.session.state);
                        }
                        if (available) available();
                    }
                    else if (unavailable) unavailable();
                };  
            }
            else
                reach.presentation.onerror("presentation not available");
                if (unavailable) unavailable();
        },
        send:function(msg)
        {
            if (reach.session)
            {
                reach.session.postMessage(msg);
            }
            else
                reach.presentation.onerror("no session available")
        }
    },
    onDeviceReady: function ()
    {
        try
        {
            document.addEventListener("online", reach.onLine, false);
            document.addEventListener("offline", reach.offLine, false);
			document.addEventListener("resume", reach.resume, false);
			document.addEventListener("pause", reach.pause, false);
            reach.deviceName = device.name;
            reach.deviceUUID = device.uuid;
            reach.devicePlatform = device.platform;
            reach.deviceVersion = device.version;
            reach.connectionType = navigator.network.connection.type;
			reach.resume();
			reach.getFiles();
			reach.localDir = cordova.file.dataDirectory;
        }
        catch (e)

        {
			alert("device ready error caught");
			alert(e.toString());
		}
    },
    override:
    {},
    onBackButton: function (e)
    {
        try
        {
            if (reach.override.onBackButton)
                reach.override.onBackButton(e);
        }
        catch (e)
        {}

    },
    onMenuButton: function ()
    {
        try
        {
            if (reach.override.onMenuButton) reach.override.onMenuButton();
        }
        catch (e)
        {}
        return false
    },
    onSearchButton: function ()
    {
        try
        {
            if (reach.override.onSearchButton) reach.override.onSearchButton();
        }
        catch (e)
        {}
        return false
    },
    onBatteryStatus: function ()
    {
        return; //Removed following code as not currently interested!
        try
        {
            if (reach.override.onBatteryStatus) reach.override.onBatteryStatus();
            reach.batteryLevel = info.level;
            reach.isPlugged = info.isPlugged;
        }
        catch (e)
        {}
    },
    onLine: function ()
    {
        try
        {
            reach.online = true;
            if (reach.override.onLine) reach.override.onLine();
        }
        catch (e)
        {}
        reach.online = true;
		while(reach.fetchList.length > 0) {
			ds = reach.fetchList.shift();	//remove the item
			ds.fetch();						//fetch the store
		}
        $engine.setOnline(true);    
    },
    offLine: function ()
    {
        try
        {
            reach.online = false;
            if (reach.override.offLine) reach.override.offLine();
        }
        catch (e)
        {}
        reach.online = false;
        $engine.setOnline(false);    
    },
	resume: function(){
		if(navigator.connection.type == Connection.NONE) reach.offLine();
		else reach.onLine();
	},
	pause:function(){
		$engine.store();//this should ensure that whatever is stored is up to date!
	},
    camera: function (onSuccess, onFail, options)
    {
        try
        {
            navigator.camera.getPicture(onSuccess, onFail, options);
        }
        catch (e)
        {}
    },
    connectionType: function ()
    {
        try
        {
            return navigator.network.connection.type;
        }
        catch (e)
        {}
    },
    scanBarcode: function (success, failed)
    {
        var scanner = cordova.require("cordova/plugin/BarcodeScanner");

        scanner.scan(
            function (result)
            {
                success(result);
            },
            function (error)
            {
                failed(error);
            }
        );
    }
};
