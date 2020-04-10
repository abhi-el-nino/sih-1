
$(document).ready(function () {

    $.ajax({
        type: 'GET',
        url: '/maps/markers',
        success: function (data) {
            addMarkers(data);
            chartDisplayFunction('DEHRADUN');
        },
        error: function (err) {
            console.log(err);
        }
    })

    function addMarkers(data) {
        for (i in data) {
            let marker = L.marker([data[i].Latitude, data[i].Longitude]).addTo(map);
            marker._icon.district = data[i].District;
            marker.bindTooltip(`${data[i].District}`).openTooltip();
            marker._icon.setAttribute("data-district", data[i].District);
        }
        addClickevent();
    }
    function addClickevent() {
        $('.leaflet-marker-icon').on('mouseenter', function (e) {
            var el = $(e.srcElement || e.target);
            district = el.attr('data-district');
            chartDisplayFunction(district);
        });
    }
});
    

function chartDisplayFunction(District) {
    $.ajax({
        type: 'GET',
        url: `/maps/chart?District=${District}`,
        success: function (data) {
            addPieChart(data, District);
            addRadarChart(data, District);
            addBarChart(data, District);
        },
        error: function (err) {
            console.log(err);
        }
    })
}

function addBarChart(data, District) {
    $('#barChart').remove();
    $('#bar-chart-container').append('<canvas id="barChart" height="50px" width="50px"></canvas>');
    var ctx = document.getElementById('barChart').getContext('2d');
    let gradient = ctx.createLinearGradient(0, 0, 0, 450);
    gradient.addColorStop(0.2, '#051937');
    gradient.addColorStop(0.4, '#004d7a');
    gradient.addColorStop(0.6, '#008793');
    gradient.addColorStop(0.8, '#00bf72');
    gradient.addColorStop(1, '#a8eb12');

    let barChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.bar.labels,
            datasets: [{
                label: "Area (acres)",
                backgroundColor: gradient,
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
                text: `Area Under Cultivation For Top 5 Crops(${District})`
            },
        }
    });
}

function addRadarChart(data, District) {
    $('#radarChart').remove();
    $('#radar-chart-container').append('<canvas id="radarChart" height="50px" width="50px"></canvas>');
    var ctx = document.getElementById('radarChart').getContext('2d');
    let radarChart = new Chart(ctx, {
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
                text: `Variation In Production Of Major Crops Over Years(${District})`
            },
        }
    });
}

function addPieChart(data, District) {
    var color = [];
    for (let i = 0; i < data.pie.labels.length; i++) {
        var o = Math.round, r = Math.random, s = 255;
        let temp = 'rgba(' + o(r() * s) + ',' + o(r() * s) + ',' + o(r() * s) + ',' + 0.7 + ')';
        color.push(temp);
    }
    $('#pieChart').remove();
    $('#pie-chart-container').append('<canvas id="pieChart" height="50px" width="50px"></canvas>');
    var ctx = document.getElementById('pieChart').getContext('2d');
    let pieChart = new Chart(ctx, {
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
                text: `Various Crop's Production In The District (${District})`
            },
        }
    });
}

