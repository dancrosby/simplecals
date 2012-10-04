var webRoot = "./";
$.ui.autoLaunch = false; // By default, it is set to true and you're app will run right away.
                         // We set it to false to show a splashscree

/* This function runs when the body is loaded.*/
var init = function () {
    $.ui.backButtonText = "Back";// We override the back button text to always say "Back"
    window.setTimeout(function () {
        $.ui.launch(); 
    }, 1500);//We wait 1.5 seconds to call $.ui.launch after DOMContentLoaded fires
};

document.addEventListener("DOMContentLoaded", init, false);

/**
 * This function will get executed when $.ui.launch has completed
 */
$.ui.ready(function () {

    var calsLast24Hrs = 0;
    var maxCals = 2500;
    var history = [];
    var resetMilliseconds = 1000 * 60 * 60 * 24; // one day
    resetMilliseconds = 1000 * 5; // 5 seconds

    function renderTime() {
        var str = "";

        var currentTime = new Date();
        var hours = currentTime.getHours();
        var minutes = currentTime.getMinutes();
        var seconds = currentTime.getSeconds();

        if (minutes < 10) {
            minutes = "0" + minutes;
        }
        if (seconds < 10) {
            seconds = "0" + seconds;
        }
        str += hours + ":" + minutes + ":" + seconds;
        return str;
    }

    function renderHistory() {
        var minTimestamp = new Date().getTime() - resetMilliseconds;
        var numberToRemove = 0;

        $('#log').empty();
        
        var tmp = '<table class="log">';

        var historyLength = history.length;
        var totalCals = 0;
        for(var i = 0; i < historyLength; i++) {
            tmp += '<tr><td>Time</td><td>'
                + history[i].time
                + '</td><td>Cals</td><td>'
                + history[i].cals
                + '</td></tr>';

            if(history[i].timestamp < minTimestamp) {
                numberToRemove++;
            } else {
                totalCals += history[i].cals;
            }
        }

        for (i = 0; i < numberToRemove; i++) {
            console.log("Removing");
            history.shift();
        }

        tmp += '</table>';

        $('#log').html(tmp);

        calsLast24Hrs = totalCals;
    }

    function updateCals() {
        console.log("UIpdate cals");
        renderHistory();

        var calsLeft = maxCals - calsLast24Hrs;
        
        $('#last24').html(calsLast24Hrs);
        $('#leftMan').html(calsLeft);
        $('#overQuota').hide();
        if(calsLeft < 0) {
            //  TODO should work for both genders
            $('#overQuota').show();
        }
    }

    function addHistory(cals) {
        var timestamp = new Date().getTime();
        history.push({
            'timestamp': timestamp,
            'time': renderTime(timestamp),
            'cals': parseInt(cals, 10)
        });
    }

    $('#content').on("click", "#btnAdd", function() {
        var calsToAdd = $('#addCals').val();
        addHistory(calsToAdd);
        updateCals();
    });

    setInterval(updateCals, 500);
});


/* This code is used for appMobi native apps */
var onDeviceReady = function () {
    AppMobi.device.setRotateOrientation("portrait");
    AppMobi.device.setAutoRotate(false);
    webRoot = AppMobi.webRoot + "/";
    //hide splash screen
    AppMobi.device.hideSplashScreen();
};
