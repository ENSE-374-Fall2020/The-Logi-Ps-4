console.log("file chartFunction.js loaded successfully");

var ctx = document.getElementById('squatChart').getContext('2d');
var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Squats', 'Pushups', 'Leg Curls', 'Weighted Squats'],
        datasets: [{
            label: 'Done This Week',
            data: [80, 40, 10, 20],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)'
            ],
            borderWidth: 1
        },
        {
            label: 'Goal',
            data: [300, 150, 60, 80],
            backgroundColor: [
                'rgba(255, 99, 132, 0.1)',
                'rgba(54, 162, 235, 0.1)',
                'rgba(255, 206, 86, 0.1)',
                'rgba(75, 192, 192, 0.1)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
});

var exerciseTypeCanvas = document.getElementById("exerciseTypeChart").getContext("2d");
var exerciseTypeChart = new Chart(exerciseTypeCanvas, {
    type: 'pie',
    data: {
        labels: ['Strength', 'Endurance'],
        datasets: [{
            label: '% of Exercise Type',
            // enter... EJS
            data: [34, 66],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {

    }
});

var distanceRunCanvas = document.getElementById('distanceRunChart').getContext('2d');
var distanceRunChart = new Chart(distanceRunCanvas, {
    type: 'line',
    data: {
        labels: ['Oct. 10', 'Oct. 12', 'Oct. 14', 'Oct. 15'],
        datasets: [{
            label: 'Distance (km)',
            data: [8, 5, 5, 12],

            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)'
            ],
            fill: false
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
});