# Gateway

The gateway is a simple lua script that connects to one or more terra networks. 
It listens to incoming data from the sensors using [tossam](http://www.inf.ufg.br/~brunoos/tossam/) and pushes 
it forward to the main application (terra-core) via a Publisher/Subscriber interface built with ZeroMQ.

##Simulation

Simulating a terra network is a work in progress and very experimental yet. 
A good way to start is downloading the [terra virtual machine](http://www.inf.puc-rio.br/~abranco/files/Terra/TerraNG_v0.3.0.ova) and
 checking out the python script at ~/TerraNG/sim/Net/TerraSim.py.
