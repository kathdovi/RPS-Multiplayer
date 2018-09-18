$(document).ready(function () {
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyDoihEuq076kLK01vlY4zwj7Y5UwgbwCNo",
        authDomain: "purple-keota-blizzard.firebaseapp.com",
        databaseURL: "https://purple-keota-blizzard.firebaseio.com",
        projectId: "purple-keota-blizzard",
        storageBucket: "purple-keota-blizzard.appspot.com",
        messagingSenderId: "722485398280"
    };

    firebase.initializeApp(config);

    // Create a variable to reference the database.
    var databaseref = firebase.database();

    // Whenever a user clicks the add-train button
    // Capture Button Click
    $(".add-train").on("click", function (event) {
        event.preventDefault();
        // Grabbed values from text boxes
        var trainname = $("#train-name").val().trim();
        var destination = $("#destination").val().trim();
        var time = $("#time").val().trim();
        var frequency = $("#frequency").val().trim();
        // Code for handling the push

        // Local obj to push to Firebase
        let trainToAdd = {
            trainname: trainname,
            destination: destination,
            time: time,
            frequency: frequency,
        }

        databaseref.ref().push(trainToAdd);

    });

    // Firebase watcher .on("child_added")
    databaseref.ref().on("child_added", function (snapshot) {

        // storing the snapshot.val() in a variable for convenience
        var sv = snapshot.val();

        // Get firebase vars
        var nameFB = (sv.trainname);
        var destFB = (sv.destination);
        var timeFB = (sv.time);
        var freqFB = (sv.frequency);

        // Calculate minutes till next train and time next train comes
        var firstTrain = moment(timeFB, "HH:mm");
        var timeDiff = moment().diff(moment(firstTrain), "minutes")
        console.log(timeDiff);
        if (timeDiff < 0) {
            var minutesTill = Math.abs(timeDiff) + 1;
            var nextTrain = moment().add(minutesTill, "minutes").format("hh:mm");
        } else {
            var timeLeft = timeDiff % freqFB
            var minutesTill = freqFB - timeLeft;
            var nextTrain = moment().add(minutesTill, "minutes").format("hh:mm");
        }

        // Change the HTML to reflect
        $('.train-sched').append("<tr>" +
            "<td class='col-3 train-val normal'>" + nameFB +
            "</td>" +
            "<td class='col-3 train-val normal'>" + destFB +
            "</td>" +
            "<td class='col-2 train-val normal'>" + freqFB +
            "</td>" +
            "<td class='col-2 train-val normal'>" + nextTrain +
            "</td>" +
            "<td class='col-2 train-val normal'>" + minutesTill + // Minutes Away Formula
            "</td>" +
            "</tr>");

    });

});

