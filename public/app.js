angular
    .module('app', [])

angular
    .module('app')
    .controller('MainController', MainController)


MainController.$inject = ['$scope', '$http']

function MainController($scope, $http) {

    $scope.networks = []

    $http.get('/api/network')
        .then(res => res.data)
        .then(networks => {
            $scope.networks = networks


        })

    /**
     * Socket.io
     */
    const socket = io('localhost:3000')

    socket.on('message', (message) => {
        // console.log(message)
    })
}