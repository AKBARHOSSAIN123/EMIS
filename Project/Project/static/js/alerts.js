document.addEventListener('DOMContentLoaded', function() {
    var alertMessage = document.getElementById('alertMessage');
    var alertIcon = document.getElementById('alertIcon');
    var countdownStart = document.getElementById('countdownStart');
    var countdownEnd = document.getElementById('countdownEnd');
    var now = new Date().getTime();
    var startDateTime = new Date('{{ exam_data.start_time }}').getTime();
    var endDateTime = new Date('{{ exam_data.end_time }}').getTime();

   // var allowTimes = {{ exam_data.allow_leave_times | tojson | safe }};
    //var prohibitTimes = {{ exam_data.prohibited_times | tojson | safe }};

    var timerInterval = setInterval(function() {
        now = new Date().getTime();

        if (now < startDateTime) {
            // Countdown to exam start
            var timeRemaining = startDateTime - now;
            updateTimer(countdownStart, timeRemaining);
            countdownStart.style.display = 'block';
            countdownEnd.style.display = 'none';

            // Before exam starts
            alertMessage.innerHTML = 'Exam has not started yet.';
            alertIcon.innerHTML = '<i class="fas fa-info-circle"></i>';
            alertIcon.style.color = 'blue';
        } else if (now >= startDateTime && now < endDateTime) {
            // Countdown during exam
            var timeRemaining = endDateTime - now;
            updateTimer(countdownEnd, timeRemaining);
            countdownStart.style.display = 'none';
            countdownEnd.style.display = 'block';

            // During exam
            var currentMinute = new Date().getMinutes();
            if (prohibitTimes.includes(currentMinute)) {
                alertMessage.innerHTML = 'You cannot leave the room right now.';
                alertIcon.innerHTML = '<i class="fas fa-exclamation-circle"></i>';
                alertIcon.style.color = 'red';
            } else if (allowTimes.includes(currentMinute)) {
                alertMessage.innerHTML = 'You are allowed to leave the room.';
                alertIcon.innerHTML = '<i class="fas fa-check-circle"></i>';
                alertIcon.style.color = 'green';
            } else {
                alertMessage.innerHTML = 'No specific alerts at the moment.';
                alertIcon.innerHTML = '<i class="fas fa-info-circle"></i>';
                alertIcon.style.color = 'blue';
            }
        } else {
            // Exam ended
            clearInterval(timerInterval);
            countdownStart.style.display = 'none';
            countdownEnd.style.display = 'none';

            alertMessage.innerHTML = 'Exam has ended.';
            alertIcon.innerHTML = '<i class="fas fa-info-circle"></i>';
            alertIcon.style.color = 'blue';
        }
    }, 1000);

    function updateTimer(element, remainingTime) {
        var seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);
        var minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
        var hours = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

        element.innerHTML = 'Time Remaining: ' + hours + ':' + minutes + ':' + seconds;
    }
});
