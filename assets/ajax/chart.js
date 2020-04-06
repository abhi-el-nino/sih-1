
let cityForm = $('#city-selector-form');

cityForm.submit(function (event) {
    event.preventDefault();

    $.ajax({
        type: 'POST',
        url: '/maps/chart',
        data: cityForm.serialize(),
        success: function (data) {
            addPieChart(data);
            addRadarChart(data);
            addBarChart(data);
        },
        error: function (err) {
            console.log(err);
        }
    })
})

function addBarChart(data) {
    $('#barChart').remove();
    $('#bar-chart-container').append('<canvas id="barChart" height="50px" width="50px"></canvas>');
    var ctx = document.getElementById('barChart').getContext('2d');
    var chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.bar.labels,
            datasets: [{
                label: "Population (millions)",
                backgroundColor: ["#3e95cd", "#8e5ea2", "#3cba9f", "#e8c3b9", "#c45850"],
                data: data.bar.areaData
            }]
        },
        options: {
            maintainAspectRatio: false,
            legend: {
                display: false
            },
            title: {
                display: true,
                fontSize: 20,
                text: "Area Under Cultivation For Top 5 Crops"
            },
        }
    });
}

function addRadarChart(data) {
    $('#radarChart').remove();
    $('#radar-chart-container').append('<canvas id="radarChart" height="50px" width="50px"></canvas>');
    var ctx = document.getElementById('radarChart').getContext('2d');
    var chart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: data.radar.labels,
            datasets: [{
                label: "2014",
                fill: true,
                backgroundColor: "rgba(179,181,198,0.2)",
                borderColor: "rgba(179,181,198,1)",
                pointBorderColor: "#fff",
                pointBackgroundColor: "rgba(179,181,198,1)",
                data: data.radar.production14Data
            }, {
                label: "2013",
                fill: true,
                backgroundColor: "rgba(255,99,132,0.2)",
                borderColor: "rgba(255,99,132,1)",
                pointBorderColor: "#fff",
                pointBackgroundColor: "rgba(255,99,132,1)",
                pointBorderColor: "#fff",
                data: data.radar.production13Data
            }]
        },
        options: {
            maintainAspectRatio: false,
            title: {
                display: true,
                fontSize: 20,
                text: "Variation In Production Of Major Crops Over Years"
            },
        }
    });
}

function addPieChart(data) {
    var color = [];
    for (let i = 0; i < data.pie.labels.length; i++) {
        var o = Math.round, r = Math.random, s = 255;
        let temp='rgba(' + o(r()*s) + ',' + o(r()*s) + ',' + o(r()*s) + ',' + 0.7 + ')';
        color.push(temp);
    }
    $('#pieChart').remove();
    $('#pie-chart-container').append('<canvas id="pieChart" height="50px" width="50px"></canvas>');
    var ctx = document.getElementById('pieChart').getContext('2d');
    var chart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: data.pie.labels,
            datasets: [{
                backgroundColor: color,
                borderColor: 'white',
                data: data.pie.productionData
            }]
        },
        options: {
            maintainAspectRatio: false,
            legend: {
                display: false
            },
            title: {
                display: true,
                fontSize: 20,
                text: "Various Crop's Production In The District"
            },
        }
    });
}
