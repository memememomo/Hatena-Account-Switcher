getSwitchSession(function(session) {
                     if (session != null) {
                         if (location.href == "http://www.hatena.ne.jp/") {
                             var a_list = document.getElementsByTagName('a');

                             var flag = 0;
                             for (var i = 0; i < a_list.length; i++) {
                                 if (a_list[i].href.match(/\/login/)) {
                                     location.href = a_list[i];
                                     flag = 1;
                                     break;
                                 }
                             }

                             if (!flag) {
                                 removeSwitchSession(function(){});
                             }
                         } else if (location.href.match(/www.hatena.ne.jp\/login/)) {
                             removeSwitchSession(function(){});
                             getPasswordByUser(session, function(password) {
                                     document.getElementById('login-name').value = session;
                                     document.getElementsByName('password')[0].value = password;
                                     document.getElementsByTagName('form')[0].submit();
                                 });
                         }
                     } else {
                         var a_list = document.getElementsByTagName('a');
                         for (var i=0; i < a_list.length; i++) {
                             if (a_list[i].href.match(/www.hatena.ne.jp\/logout/)) {
                                 displayMenu(a_list[i]);
                             }
                         }
                     }
                 });


function displayMenu(elm) {
    var callback = function(response) {
        var switch_link = document.createElement('a');
        switch_link.href = '#user_menu';
        switch_link.innerHTML = "<u>more</u>" + "<small>▼</small>";

        var menu = document.createElement('span');
        menu.id = 'moreAccounts';
        menu.style = "right: 5px; left:auto; top:24px;visibility: hidden; width:150px;"
        menu.addEventListener('click', function() {
                                  document.getElementById('moreAccounts').style.visibility = 'hidden;';
                              });

        var u = document.createElement('ul');
        for (var i = 0; i < response.length; i++) {
            var user = response[i];
            var m = document.createElement('a');
            m.href = '#user_menu';
            m.name = 'user_menu';
            m.innerHTML = user;
            m.addEventListener('click', createCallback(user));

            var l = document.createElement('li');
            l.appendChild(m);
            u.appendChild(l);
        }
        menu.appendChild(u);


        var replace = document.createElement('span');
        replace.appendChild(switch_link);

        elm.parentNode.replaceChild(replace, elm);
        document.getElementsByTagName('body')[0].appendChild(menu);
    };

    getAccountsFromStore(callback);
}

function createCallback(user) {
    return function() {
        storeSwitchSession(user, function() { location.href = 'http://www.hatena.ne.jp/logout'; });
    };
}

function getAccountsFromStore(callback) {
    log("getting the list of account from the local store");
    chrome.extension.sendRequest({action: "getAccounts"}, callback);
}


function getSwitchSession(callback) {
    chrome.extension.sendRequest({action: "getSwitchSession"}, callback);
}

function storeSwitchSession(user,callback) {
    eval("var req = { action: \"storeSwitchSession\", account: \"" + user + "\"};");
    chrome.extension.sendRequest(req, callback);
}

function getPasswordByUser(user, callback) {
    eval("var req = { action: \"getPasswordByUser\", account: \"" + user + "\"};");
    chrome.extension.sendRequest(req, callback);
}

function removeSwitchSession(callback) {
    chrome.extension.sendRequest({action: "removeSwitchSession"}, callback);
}

function log(msg) {
    console.info(msg);
}

function getItem(key) { return getStorage().getItem(key); }
function setItem(key, map) { return getStorage().setItem(key, map); }
function removeItem(key) { return getStorage().removeItem(key); }
function getStorage() { return window.localStorage; }

