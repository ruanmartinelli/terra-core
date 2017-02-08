// chart
var chart
var chartData, chartOptions
var data;

data = [
    ['Time', 'Event'],
    [new Date(), 10]
]

chartOptions = {}
chartOptions.title = 'Network readings'
chartOptions.curveType == 'function'
chartOptions.legend = { position: 'bottom' }
chartOptions.colors = ['red']
chartOptions.backgroundColor = 'black'

chartOptions.legend = { textStyle: { color: 'white' } }
chartOptions.titleTextStyle = { color: 'white' }
chartOptions.hAxis = { textStyle: { color: 'white' }, titleTextStyle: { color: 'white' }, format: 'mm:ss' }
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
var delays = []

socket.on('message', function (message) {
    var now = new Date().getTime()
    var text = ''
    var average_delay = 0;

    if (message.gateway_time) {
        delays.push(now - message.gateway_time)
        average_delay = delays.reduce((sum, a) => sum + a, 0) / delays.length
        $('#average-delay').text(average_delay.toFixed(0) + 'ms')
    }

    if (message.port && message.id_mote && message.value) {
        text = '[' + message.port + ' / ' + message.id_mote + '] temperature: ' + message.value
        $('#events').append($('<li>').text(text))
    }

    // push to chart
    if (message.value) {

        data.push([new Date(), message.value])

        if (data.length > 15) {
            let header = data[0]

            data.shift()
            data.shift()
            data.unshift(header)
        }

        drawChart()
    }

})