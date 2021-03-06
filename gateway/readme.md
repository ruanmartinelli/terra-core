# Gateway

Gateway is a simple lua script that connects to one or more Terra networks. 
It listens to incoming data from the sensors using [tossam](http://www.inf.ufg.br/~brunoos/tossam/) and pushes 
it forward to the main application (terra-core) via a Publisher/Subscriber interface built with ZeroMQ.

## Dia

Dia (or Terra Dia) is a program that breaks .vmx code into pieces and sends it to the base station node. The main use case here is to inject the "sendMsg" code, which will make the sensors send messages periodically to all listeners. Credits goes to Felipe Ribeiro who built this as his final course assignment.

## Simulation

Simulating a Terra network is a work in progress and very experimental yet. 
The Terra network is created on pre-configured Ubuntu VM and can be done by following the steps below:

1. Open the VM

2. Start the networks

```
    cd ~/TerraNG/sim/Net
    sh run.sh
```

3. Inject the "sendMsg" code into the nodes
```
    cd ~/terra-core/src/gateway/dia
    sh run-dia.sh
```

This will spawn 10 sensor networks in ports 9002 to 9012. 
Each network contains 3 sensors where one is the base station and the other two are ordinary nodes with IDs 11 and 4.

The VM is also configured to run on a static IP so it can be accessed externally by the Gateway or any other application. 
The default IP address is 192.168.1.115.
