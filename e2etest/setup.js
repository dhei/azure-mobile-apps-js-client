var rimraf = require('rimraf'),
    path = require('path'),
    fs = require('fs-sync'),
    execSync = require('child_process').execSync,
    config = require('./config');

function run(command) {
    var result = execSync(command, {
        encoding: 'utf8'
    });
    
    console.log(result);
}

function setupCordovaTests() {

    console.log('Starting Cordova setup');
    process.chdir(__dirname);

    // Clean up previous builds
    rimraf.sync('./cordova/www/generated');
    rimraf.sync('./cordova/platforms');
    rimraf.sync('./cordova/plugins');
    
    fs.copy('./shared', './cordova/www/generated/shared');
    fs.copy('./shared', './cordova/www/generated/shared');
    
    process.chdir('./cordova');
    
    console.log('Installing Cordova plugins..');
    
    if (!config.cordova.refreshOnly) {
        
        var plugin;
        for (var i in config.cordova.plugins) {
            var plugin = config.cordova.plugins[i];
            console.log('- Installing plugin ' + plugin)
            run('cordova plugin add ' + plugin);
        }

        console.log('Installing Cordova platforms..');
        
        if (config.cordova.platforms.windows && process.platform === 'win32') {
            console.log('Preparing for windows..');
            run('cordova platform add windows');
            run('cordova platform build windows');
        }
        
        if (config.cordova.platforms.android) {
            console.log('Preparing for android..');
            run('cordova platform add android');
            run('cordova platform build android');
        }
        
        if (config.cordova.platforms.ios && process.platform === 'darwin') {
            console.log('Preparing for ios..');
            run('cordova platform add ios');
            run('cordova platform build ios');
        }
        
        if (config.cordova.platforms.wp8 && process.platform === 'win32') {
            console.log('Preparing for wp8..');
            run('cordova platform add wp8');
            run('cordova platform build wp8');
        }
    } else {
        console.log('Skipping plugin and platform installation!');
    }
    
    console.log('Cordova setup done!');
}

function setupBrowserTests() {

    console.log('Starting Browser setup');
    
    process.chdir(__dirname);

    // Clean up previous builds
    rimraf.sync('./browser/generated');
    
    fs.copy('../dist', './browser/generated/dist');
    fs.copy('./shared', './browser/generated/shared');

    console.log('Browser setup done!');
}

function setupWinjsTests() {

    console.log('Starting WinJS setup..');

    process.chdir(__dirname);

    // Clean up previous builds
    rimraf.sync('./winjs/WinjsEndToEndTests/generated');
    
    fs.copy('../sdk/src/Generated/MobileServices.js', './winjs/WinjsEndToEndTests/generated/dist/MobileServices.js');
    fs.copy('./shared', './winjs/WinjsEndToEndTests/generated/shared');

    console.log('WinJS setup done!');
}


setupBrowserTests();
setupCordovaTests();
setupWinjsTests();
