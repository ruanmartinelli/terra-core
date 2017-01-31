
FileMonitor = require "FileMonitor"

--Tossam
local tossam = require("tossam") 

local exit = false
while not(exit) do
local mote = tossam.connect {
  protocol = "sf",
  host     = "localhost",
  port     = 9002,
  nodeid   = 1
}
	if not(mote) then print("Connection error!"); return(1); end
  
  --tossam precisa registrar as tabelas que recebe dos sensores
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
  
--variaveis de controle
s_sourceDir = 'files_vmx'
s_posfix = '.vmx'
s_backupDir = 'backup'
n_sleepTimeS = 3;


while true do
  
  os.execute("sleep " .. tonumber(n_sleepTimeS))
  
  s_file , f_NewProg = FileMonitor.le_diretorio(s_sourceDir,s_posfix);
  print(type(s_file))
  
  --ProgBin.le_arquivo(f_NewProg)
  
  --newProgVer = msg_newProVer(ProgBin)
  
  
  
  
  while (mote) do

		local stat, msg, emsg = pcall(function() return mote:receive() end) 
		if stat then
      print("---------stat---------------------") 
			if msg then
				print("------------------------------") 
        for k, v in pairs( msg ) do
          print(k, v)
        end
        --deve continuar enviando enquanto pede-se novos blocos
        if msg(1) == 162 then
          msg_blk = {
            }
          
          mote:send(msg3,163)
        else
          break
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
          --caso entre aqui não é para desconectar, é para tentar conectar novamente até conseguir
					print("\nConnection closed!")
					exit = true --reconnect = true
					break 
				end
			end
		else
      --caso entre aqui não é para desconectar, é para tentar conectar novamente até conseguir
			print("\nreceive() got an error:"..msg)
			exit = true --reconnect = true
			break
		end
	end

	mote:unregister()
	mote:close() 
end

  
  --fim do codigo
  if s_file ~= nil then
    os.rename(s_sourceDir .. '/' .. s_file , s_backupDir .. '/' .. s_file )
  end
  
  print('loop');
  end