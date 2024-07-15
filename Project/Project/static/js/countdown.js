document.addEventListener('DOMContentLoaded', function() {
    var countdownStart = document.getElementById('countdownStart');
    var countdownEnd = document.getElementById('countdownEnd');
    var now = new Date().getTime();
    var startDateTime = new Date('{{ exam_data.start_time }}').getTime();
    var endDateTime = new Date('{{ exam_data.end_time }}').getTime();

    var timerInterval = setInterval(function() {
        now = new Date().getTime();

        if (now < startDateTime) {
            // Countdown to exam start
            var timeRemaining = startDateTime - now;
            updateTimer(countdownStart, timeRemaining);
            countdownStart.style.display = 'block';
            countdownEnd.style.display = 'none';
        } else if (now >= startDateTime && now < endDateTime) {
            // Countdown during exam
            var timeRemaining = endDateTime - now;
            updateTimer(countdownEnd, timeRemaining);
            countdownStart.style.display = 'none';
            countdownEnd.style.display = 'block';
        } else {
            // Exam ended
            clearInterval(timerInterval);
            countdownStart.style.display = 'none';
            countdownEnd.style.display = 'none';
        }
    }, 1000);

    function updateTimer(element, remainingTime) {
        var seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);
        var minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
        var hours = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

        element.innerHTML = 'Time Remaining: ' + hours + ':' + minutes + ':' + seconds;
    }
});
