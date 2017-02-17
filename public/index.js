/* -------------------------------------
                 Chart
---------------------------------------*/
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

var googleChartLoaded = false

google.charts.load('current', { 'packages': ['corechart'] })
google.charts.setOnLoadCallback(drawChart)

function drawChart() {
    googleChartLoaded = true

    chartData = google.visualization.arrayToDataTable(data)

    chart = new google.visualization.LineChart(document.getElementById('chart'))

    chart.draw(chartData, chartOptions)
}

/* -------------------------------------
            Socket.io
---------------------------------------*/
var socket = io('http://localhost:3000')
var delays = []
var message_count = 0

socket.on('message', function (message) {
    var now = new Date().getTime()
    var text = ''
    var average_delay = 0;
    message_count++

    if (message.gateway_time) {
        delays.push(now - message.gateway_time)
        average_delay = delays.reduce((sum, a) => sum + a, 0) / delays.length
        $('#average-delay').text(average_delay.toFixed(0) + 'ms')
    }

    if (message.port && message.id_mote && message.value) {
        text = '[' + message.port + ' / ' + message.id_mote + '] \t\t temperature: ' + message.value


        if (message_count > 10) $('#events li').first().remove()

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
        if (googleChartLoaded) drawChart()
    }

})

/* -------------------------------------
               API Calls
---------------------------------------*/
var loading = false

function getStats(delay, callback) {
    loading = true
    $.get('/api/event/stats', function (data) {

        // adds a tiny delay before
        // displaying the new data
        // why? because the api call
        // is too fast and my cool animation
        // does not play well =(
        setTimeout(function () {
            loading = false
            $('#average-temperature').text(data.averageValue.toFixed(0) + ' °c')
            $('#max-temperature').text(data.maxValue + ' °c')
            $('#min-temperature').text(data.minValue + ' °c')
            $('#message-count').text(data.messageCount.toLocaleString('en-US') + '')

            if (callback) callback()
        }, delay)
    })
}

getStats(0)

$('.stats-item').click(function () {
    $('.stats-item').addClass('loading-cover')

    if (!loading) {
        getStats(3000, function () {
            $('.stats-item').removeClass('loading-cover')
        })
    }

})