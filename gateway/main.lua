if (arg[1] == 'default') then
	port = '10002'
	host = '192.168.2.202'
	nodeid = 20
else
	if (arg[1] == nil) then
		print('  [ERROR] missing parameter \'port\'')
		print('  usage: lua main.lua <port> <ip address> <nodeId>')
		os.exit()
	end;

	if(arg[2] == nil) then
		print('  [ERROR] missing parameter \'id address\'')
		print('  usage: lua main.lua <port> <ip address> <nodeId>')
		os.exit()
	end;

	if(arg[3] == nil) then
		print('  [ERROR] missing parameter \'nodeId\'')
		print('  usage: lua main.lua <port> <ip address> <nodeId>')
		os.exit()
	end;

	port = arg[1]
	host = arg[2]
	nodeid = arg[3]
end;

print(' -- listening for messages in port ' .. port)
print(' -- connecting to host ' .. host)

require"zmq"
require"lib/zhelpers"
require"math"

local json = require('cjson')
local tossam = require("tossam")
local context = zmq.init(1)
local publisher = context:socket(zmq.PUB)
local exit = false

publisher:bind("tcp://*:"..port)

while not(exit) do
    local mote = tossam.connect {
        protocol = "network",
        host     = host,
        port     = port,
        nodeid   = nodeid
    }
    if not(mote) then print("  ! connection error\n  ! aborting"); return(1); end

    mote:register [[
    nx_struct msg_serial [145] {
        nx_uint8_t id;
        nx_uint16_t source;
        nx_uint16_t target;
        nx_uint8_t  d8[4];
        nx_uint16_t d16[4];
        nx_uint32_t d32[2];
    };
    ]]

    while (mote) do
        local stat, msg, emsg = pcall(function() return mote:receive() end)
        if stat then
            print(emsg)
            if msg then
                msg.port = port
                msg.gateway_time = os.time() * 1000

                print("------------------------------")
                print("msgID: "..msg.id, "Source: ".. msg.source, "Target: ".. msg.target.." Port: "..msg.port)
                print("d8:",unpack(msg.d8))
                print("d16:",unpack(msg.d16))
                print("d32:",unpack(msg.d32))

                publisher:send("event", zmq.SNDMORE)
                publisher:send(json.encode(msg))

            else
                if emsg == "closed" then
                    print("\nConnection closed!")
                    exit = true
                    break
                end
            end
        else
            print("\nreceive() got an error:"..msg)
            exit = true
            break
        end
    end

    mote:unregister()
    mote:close()
end

publisher:close()
context:term()
