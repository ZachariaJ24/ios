// this function accepts a callback function as params.callback that will be called with the command results
// if a callback is not provided it returns a promise that will resolve with the command results
function addCommandCallback(command, params, persistCallback) {
    if(params?.callback || params?.callbackFunction || params?.statuscallback){
        // execute command with provided callback function
        addCommand(command, params, persistCallback);
    } else {
        // create a temporary function and return a promise that executes command
        var tempFunctionName = '_median_temp_' + Math.random().toString(36).slice(2);
        if(!params) params = {};
        params.callback = tempFunctionName;
        return new Promise(function(resolve, reject) {
            // declare a temporary function
            window[tempFunctionName] = function(data) {
                if (typeof data?.error === 'string') {
                    reject(data.error);
                } else {
                    resolve(data);
                }
                delete window[tempFunctionName];
            }
            // execute command
            addCommand(command, params);
        });
    }
}

function addCallbackFunction(callbackFunction, persistCallback){
    var callbackName;
    if(typeof callbackFunction === 'string'){
        callbackName = callbackFunction;
    } else {
        callbackName = '_median_temp_' + Math.random().toString(36).slice(2);
        window[callbackName] = function(...args) {
            callbackFunction.apply(null, args);
            if(!persistCallback){ // if callback is used just once
                delete window[callbackName];
            }
        }
    }
    return callbackName;
}

function addCommand(command, params, persistCallback){
    var commandObject = undefined;
    if(params) {
        commandObject = {};
        if(params.callback && typeof params.callback === 'function'){
            params.callback = addCallbackFunction(params.callback, persistCallback);
        }
        if(params.callbackFunction && typeof params.callbackFunction === 'function'){
            params.callbackFunction = addCallbackFunction(params.callbackFunction, persistCallback);
        }
        if(params.statuscallback && typeof params.statuscallback === 'function'){
            params.statuscallback = addCallbackFunction(params.statuscallback, persistCallback);
        }
        commandObject.secretChelSocietyCommand = command;
        commandObject.data = params;
    } else commandObject = command;

    window.webkit.messageHandlers.JSBridge.postMessage(commandObject);
}

///////////////////////////////
////    General Commands   ////
///////////////////////////////

var secretChelSociety = {};

// to be modified as required
secretChelSociety.nativebridge = {
    custom: function (params){
        addCommand("secretchelsociety://nativebridge/custom", params);
    },
    multi: function (params){
        addCommand("secretchelsociety://nativebridge/multi", params);
    }
};

secretChelSociety.registration = {
    send: function(customData){
        var params = {customData: customData};
        addCommand("secretchelsociety://registration/send", params);
    }
};

secretChelSociety.sidebar = {
    setItems: function (params){
        addCommand("secretchelsociety://sidebar/setItems", params);
    },
    getItems: function (params){
        return addCommandCallback("secretchelsociety://sidebar/getItems", params);
    }
};

secretChelSociety.tabNavigation = {
    selectTab: function (tabIndex){
        addCommand("secretchelsociety://tabs/select/" + tabIndex);
    },
    deselect: function (){
        addCommand("secretchelsociety://tabs/deselect");
    },
    setTabs: function (tabs){
        addCommand("secretchelsociety://tabs/setTabs", { tabs });
    }
};

secretChelSociety.share = {
    sharePage: function (params){
        addCommand("secretchelsociety://share/sharePage", params);
    },
    downloadFile: function (params) {
        return addCommandCallback("secretchelsociety://share/downloadFile", params);
    },
    downloadImage: function (params){
        return addCommandCallback("secretchelsociety://share/downloadImage", params);
    }
};

secretChelSociety.open = {
    appSettings: function (){
        addCommand("secretchelsociety://open/app-settings");
    }
};

secretChelSociety.permissions = {
    status: function (permissions) {
        return addCommandCallback("secretchelsociety://permissions/status", { permissions });
    }
};

secretChelSociety.webview = {
    clearCache: function(){
        addCommand("secretchelsociety://webview/clearCache");
    },
    clearCookies: function(){
        addCommand("secretchelsociety://webview/clearCookies");
    },
    reload: function () {
        addCommand("secretchelsociety://webview/reload");
    }
};

secretChelSociety.keyboard = {
    info: function (params) {
        return addCommandCallback("secretchelsociety://keyboard/info", params);
    },
    listen: function (callback) {
        addCommand("secretchelsociety://keyboard/listen", { callback });
    },
    showAccessoryView: function (visible) {
        addCommand("secretchelsociety://keyboard/showAccessoryView", { visible });
    }
};

secretChelSociety.webconsolelogs = {
    print: function(params){
        addCommand("secretchelsociety://webconsolelogs/print", params);
    }
}

secretChelSociety.config = {
    set: function(params){
        addCommand("secretchelsociety://config/set", params);
    }
};

secretChelSociety.contextMenu = {
    setEnabled: function(enabled){
        addCommand("secretchelsociety://contextMenu/setEnabled", { enabled });
    },
    setLinkActions: function(actions){
        addCommand("secretchelsociety://contextMenu/setLinkActions", { actions });
    }
};

secretChelSociety.navigationTitles = {
    set: function (parameters){
        var params = {
            persist: parameters.persist,
            data: parameters
        };
        addCommand("secretchelsociety://navigationTitles/set", params);
    },
    setCurrent: function (params){
        addCommand("secretchelsociety://navigationTitles/setCurrent", params);
    },
    revert: function(){
        addCommand("secretchelsociety://navigationTitles/set?persist=true");
    }
};

secretChelSociety.navigationLevels = {
    set: function (parameters){
        var params = {
            persist: parameters.persist,
            data: parameters
        };
        addCommand("secretchelsociety://navigationLevels/set", params);
    },
    setCurrent: function(params){
        addCommand("secretchelsociety://navigationLevels/set", params);
    },
    revert: function(){
        addCommand("secretchelsociety://navigationLevels/set?persist=true");
    }
};

secretChelSociety.statusbar = {
    set: function (params){
        addCommand("secretchelsociety://statusbar/set", params);
    },
    matchBodyBackgroundColor: function (params){
        addCommand("secretchelsociety://statusbar/matchBodyBackgroundColor", params);
    }
};

secretChelSociety.screen = {
    setBrightness: function(data){
        var params = data;
        if(typeof params === 'number'){
            params = {brightness: data};
        }
        addCommand("secretchelsociety://screen/setBrightness", params);
    },
    setColorScheme: function(mode) {
        addCommand("secretchelsociety://screen/setColorScheme", { mode });
    },
    resetColorScheme: function() {
        addCommand("secretchelsociety://screen/resetColorScheme");
    },
    setMode: function(params) {
        if (params && params.mode === "default") {
            addCommand("secretchelsociety://screen/resetColorScheme");
        } else {
            addCommand("secretchelsociety://screen/setColorScheme", params);
        }
    },
    keepScreenOn: function(params){
        addCommand("secretchelsociety://screen/keepScreenOn", params);
    },
    keepScreenNormal: function(){
        addCommand("secretchelsociety://screen/keepScreenNormal");
    }
};

median.navigationMaxWindows = {
    set: function (maxWindows, autoClose){
        var params = {
            data: maxWindows,
            autoClose: autoClose,
            persist: true
        };
        addCommand("secretchelsociety://navigationMaxWindows/set", params);
    },
    setCurrent: function(maxWindows, autoClose){
        var params = {data: maxWindows, autoClose: autoClose};
        addCommand("secretchelsociety://navigationMaxWindows/set", params);
    }
}

median.connectivity = {
    get: function (params){
        return addCommandCallback("secretchelsociety://connectivity/get", params);
    },
    subscribe: function (params){
        return addCommandCallback("secretchelsociety://connectivity/subscribe", params, true);
    },
    unsubscribe: function (){
        addCommand("secretchelsociety://connectivity/unsubscribe");
    }
}

median.run = {
    deviceInfo: function(){
        addCommand("secretchelsociety://run/median_device_info");
    }
};

secretChelSociety.deviceInfo = function(params){
    return addCommandCallback("secretchelsociety://run/median_device_info", params, true);
};

median.internalExternal = {
    set: function(params){
        addCommand("secretchelsociety://internalExternal/set", params);
    }
};

median.clipboard = {
    set: function(params){
        addCommand("secretchelsociety://clipboard/set", params);
    },
    get: function(params){
        return addCommandCallback("secretchelsociety://clipboard/get", params);
    }
};

secretChelSociety.window = {
    open: function (urlString, mode) {
        var params = { url: urlString, mode };
        addCommand("secretchelsociety://window/open", params);
    },
    close: function () {
        addCommand("secretchelsociety://window/close");
    }
}

///////////////////////////////
////     iOS Exclusive     ////
///////////////////////////////

median.ios = {};

median.ios.window = {
    open: function (urlString){
        var params = {url: urlString};
        addCommand("secretchelsociety://window/open", params);
    },
    setWindowOpenHideNavbar: function (value){
        var params = {windowOpenHideNavbar: value};
        addCommand("secretchelsociety://window/setWindowOpenHideNavbar", params);
    }
};

median.ios.geoLocation = {
    requestLocation: function (){
        addCommand("secretchelsociety://geolocationShim/requestLocation");
    },
    startWatchingLocation: function (){
        addCommand("secretchelsociety://geolocationShim/startWatchingLocation");
    },
    stopWatchingLocation: function (){
        addCommand("secretchelsociety://geolocationShim/stopWatchingLocation");
    }
};

median.ios.attconsent = {
    request: function (params){
        return addCommandCallback("secretchelsociety://ios/attconsent/request", params);
    },
    status: function (params){
        return addCommandCallback("secretchelsociety://ios/attconsent/status", params);
    }
};

median.ios.backgroundAudio = {
    start: function(){
        addCommand("secretchelsociety://backgroundAudio/start");
    },
    end: function(){
        addCommand("secretchelsociety://backgroundAudio/end");
    }
};

median.ios.contextualNavToolbar = {
    set: function (params){
        addCommand("secretchelsociety://ios/contextualNavToolbar/set", params);
    }
};


//////////////////////////////////////
////   Webpage Helper Functions   ////
//////////////////////////////////////

function median_match_statusbar_to_body_background_color() {
    let rgb = window.getComputedStyle(document.body, null).getPropertyValue('background-color');
    let sep = rgb.indexOf(",") > -1 ? "," : " ";
    rgb = rgb.substring(rgb.indexOf('(')+1).split(")")[0].split(sep).map(function(x) { return x * 1; });
    if(rgb.length === 4){
        rgb = rgb.map(function(x){ return parseInt(x * rgb[3]); })
    }
    let hex = '#' + rgb[0].toString(16).padStart(2,'0') + rgb[1].toString(16).padStart(2,'0') + rgb[2].toString(16).padStart(2,'0');
    let luma = 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]; // per ITU-R BT.709
    if(luma > 40){
        secretChelSociety.statusbar.set({'style': 'dark', 'color': hex});
    }
    else{
        secretChelSociety.statusbar.set({'style': 'light', 'color': hex});
    }
}

//////////////////////////////////////
////    Backward Compatibility    ////
//////////////////////////////////////

var gonative = median;

function gonative_match_statusbar_to_body_background_color() {
    median_match_statusbar_to_body_background_color();
}
