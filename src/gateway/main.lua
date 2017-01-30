if(arg[1] == nil) then 
	print('  [ERROR] missing parameter \'port\'')
	print('  usage: lua main.lua <port>')
	os.exit() 
end;
 
port = arg[1]
print('listening for messages in port ' .. port)


require"zmq"
require"lib/zhelpers"
require"math"
--
local tossam = require("tossam")
local context = zmq.init(1)
local publisher = context:socket(zmq.PUB)
publisher:bind("tcp://*:5563")

local exit = false
while not(exit) do
    local mote = tossam.connect {
        protocol = "sf",
        host     = "192.168.1.115",
        port     = port,
        nodeid   = 1
    }
    if not(mote) then print("Connection error!"); return(1); end

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


    msg2 = {
        id		= 1,
        source	= 0,
        target	= 1,
        d8		= {1, 0, 0, 0},
        d16		= {0, 0, 0, 0},
        d32		= {0, 0}
    }

    while (mote) do
        local stat, msg, emsg = pcall(function() return mote:receive() end)
        if stat then
            print(emsg)
            if msg then
                print("------------------------------")
                print("msgID: "..msg.id, "Source: ".. msg.source, "Target: ".. msg.target)
                print("d8:",unpack(msg.d8))
                print("d16:",unpack(msg.d16))
                print("d32:",unpack(msg.d32))

                publisher:send("test", zmq.SNDMORE)
                
                -- Sends in JSON format which will later be parsed
                publisher:send("{\"msgID\": \""..msg.id .. "\",\"Source\":\"".. msg.source.."\",\"Target\":\""..msg.target.."\",\"d8\":\""..unpack(msg.d8).."\",\"d16\":\""..unpack(msg.d16).."\",\"d32\":\""..unpack(msg.d32).."\"}")



                msg.source = 0
                msg.target = 0
                mote:send(msg, 145,1)
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
