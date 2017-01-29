

local tossam = require("tossam") 

newVersionID = 81

local exit = false
while not(exit) do
local mote = tossam.connect {
  protocol = "sf",
  host     = "localhost",
  port     = 9002,
  nodeid   = 1
}
	if not(mote) then 
    print("Connection error!"); 
    return(1); 
  end

 

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
  
  
   mote:register [[ 
  nx_struct msg_serial [160] {
	nx_uint16_t versionId; 		
	nx_uint16_t blockLen; 		
	nx_uint16_t blockStart; 	
	nx_uint16_t startProg; 		
	nx_uint16_t endProg; 		
	nx_uint16_t nTracks; 		
	nx_uint16_t wClocks; 		
	nx_uint16_t asyncs; 		
	nx_uint16_t wClock0; 		
	nx_uint16_t gate0;	 		
	nx_uint16_t inEvts;	 		
	nx_uint16_t async0;	 		
} ;
	]]
  
  	mote:register [[ 
	  nx_struct msg_serial [162] { 
		nx_uint8_t reqOper;
		nx_uint16_t versionId;
		nx_uint16_t blockId;	
	  }; 
	]]
  
  
    	mote:register [[ 
	  nx_struct msg_serial [161] {   
		nx_uint16_t versionId;
		nx_uint16_t blockId;
    nx_uint8_t data[24];
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

msg3 = {
   versionId = newVersionID,
	 blockLen = 8,
	 blockStart = 3,
	 startProg = 90,
	 endProg = 245, 
	 nTracks = 2, 
	 wClocks = 1, 
	 asyncs = 0, 	
	 wClock0 = 0, 
	 gate0 = 8, 	
	 inEvts = 3,	
	 async0 = 8	
  }



--mote:send(msg2,145)
--mote:send(msg3,160)

	while (mote) do
print("while (mote) do");
		local stat, msg, emsg = pcall(function() return mote:receive() end) 
    
    print("return mote:receive()");
		if stat then
      print("---------stat---------------------") 
			if msg then
				print("------------------------------") 
        for k, v in pairs( msg ) do
   		print(k, v)
      end
      if msg(1) == 162 then 
        msg_blk = {
            versionId = newVersionID;
            blockId = msg();
            data[24];
          }
        mote:send(msg_blk,161)
      end
      
				--print("msgID: "..msg.id, "Source: ".. msg.source, "Target: ".. msg.target) 
				--print("d8:",unpack(msg.d8))
				--print("d16:",unpack(msg.d16))
				--print("d32:",unpack(msg.d32))

				--msg.source = 0
				--msg.target = 0
				--mote:send(msg, 145,1)
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


