angular
    .module('app', ['chart.js'])

angular
    .module('app')
    .controller('MainController', MainController)


MainController.$inject = ['$scope', '$http', '$timeout']

function MainController($scope, $http, $timeout) {

    const socket = io('localhost:3000')
    $scope.charts = []
    $scope.networks = []


    $http.get('/api/network')
        .then(res => res.data)
        .then(networks => {
            $scope.networks = networks

            createCharts()
        })

    /**
     * Socket.io
     */

    socket.on('message', (message) => {

        console.log('[New Message] ', message)

        $timeout(() => {
            $scope.charts[$scope.networks[0].id].data[0][1] = _.random(10, 100)
        },5000)

    })

    /**
     * Chart
     */
    const createCharts = () => {

        _.forEach($scope.networks, (network) => {

            let chart = {}
            chart.options = {}
            chart.labels = ["January", "February", "March", "April", "May", "June", "July"]
            chart.series = ['Series A']
            chart.data = [[65, 59, 80, 81, 56, 55, 40]]

            $scope.charts[network.id] = chart
        })
    }

}