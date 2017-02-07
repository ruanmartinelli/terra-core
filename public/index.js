// chart
var chart
var chartData, chartOptions
var data;

data = [
    ['Year', 'Event'],
    [new Date(), 1000]
]

chartOptions = {}
chartOptions.title = 'Network readings'
chartOptions.curveType == 'function'
chartOptions.legend = { position: 'bottom' }
chartOptions.colors = ['red']
chartOptions.backgroundColor = 'black'

chartOptions.legend = { textStyle: { color: 'white' } }
chartOptions.titleTextStyle = { color: 'white' }
chartOptions.hAxis = { textStyle: { color: 'white' }, titleTextStyle: { color: 'white' }, format: 'hh:mm:ss a' }
chartOptions.vAxis = { textStyle: { color: 'white' }, titleTextStyle: { color: 'white' } }

google.charts.load('current', { 'packages': ['corechart'] })
google.charts.setOnLoadCallback(drawChart)

function drawChart() {
    chartData = google.visualization.arrayToDataTable(data)

    chart = new google.visualization.LineChart(document.getElementById('chart'))

    chart.draw(chartData, chartOptions)
}

// socket.io
var socket = io('localhost:3000')

socket.on('message', function (message) {
    var text = 'Port: ' + message.port + ' | Source: ' + message.source

    // push to event log
    $('#events').append($('<li>').text(text))

    $('#average-delay').text((Math.floor(Math.random() * 50) + 400) + 'ms')

    // push to chart
    var random = Math.floor(Math.random() * 1200) + 400

    data.push([new Date(), random])

    if (data.length > 15) {
        let header = data[0]
        data.shift()
        data.shift()
        data.unshift(header)
    }

    drawChart()
})