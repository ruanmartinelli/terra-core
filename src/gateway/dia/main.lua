
FileMonitor = require "FileMonitor"

local tossam = require("tossam")

local turbo = require("turbo")
local Handler = class("Handler", turbo.web.RequestHandler)

ProgBin = require "ProgBin"

conf = require "conf"


--variaveis de controle
s_sourceDir =   conf.s_sourceDir; -- 'files_vmx'
s_posfix =      conf.s_posfix -- '.vmx'
s_backupDir =   conf.s_backupDir --'backup'
n_sleepTimeS =  conf.n_sleepTimeS;--3;
exit =          conf.exit -- false


local version_file = io.open("versionID.lua", "r")
vID = tonumber( version_file:read('*l')) ;
print ('vID do arquivo ' .. vID);
version_file:close()

function Handler:options()
  --if (config.turbo.CORS) then
    self:add_header('Access-Control-Allow-Methods', 'POST')
    self:add_header('Access-Control-Allow-Headers', 'content-type')
    self:add_header('Access-Control-Allow-Origin', '*')
  --end
end

function Handler:get()
  self:write("GET OK")
end

function Handler:post()
local json = turbo.escape.json_decode(self.request.body);
conteudo = json.conteudo;

enviou = false;
exit = false;

while not(exit) do

while not(mote) do


  print ('Tentando conectar');
  mote = tossam.connect
    {
    protocol = "sf",
    host     = "192.168.65.138",
    port     = 9002,
    nodeid   = 1
  }
  if mote then
    --tossam precisa registrar as tabelas que recebe e envia para os sensores
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

  print ('conexao bem sucedida');

  os.execute("sleep " .. tonumber(n_sleepTimeS))
else
  print ('conexão falhou, tentando novamente em ' .. n_sleepTimeS .. ' segundos')

  os.execute("sleep " .. tonumber(n_sleepTimeS))
end
end

  --local f = io.open("blink_tutorial.vmx",'r')
  --s_vmx = f:read("*a");
  s_vmx = conteudo;
  if s_vmx ~= nil then

    enviou = false;

    ProgBin:le_arquivo(s_vmx);

    vID = vID + 1;

  msg_newProVer = {
    --os valores precisam ser números e nao strings
   versionId = vID,
	 blockLen = ProgBin.numBlocks,
	 blockStart = ProgBin.blockStart,
	 startProg = ProgBin.startProg,
	 endProg = ProgBin.endProg,
	 nTracks = ProgBin.nTracks,
	 wClocks = ProgBin.wClocks,
	 asyncs = ProgBin.asyncs,
	 wClock0 = ProgBin.wClock0,
	 gate0 = ProgBin.gate0,
	 inEvts = ProgBin.inEvts,
	 async0 = ProgBin.async0
  }
  mote:send(msg_newProVer,160);
    --break
  else
    print('Nenhuma string no arquivo ' .. os.date());
  end

--end


  print('Enviou 160: ')
  for k, v in pairs( msg_newProVer ) do
          print(k, v)
        end

  while (mote) do

		local stat, msg, emsg = pcall(function() return mote:receive() end)
		if stat then
      print("")
      print("")
			if msg then
				print("---mensagem recebida---")
        for k, v in pairs( msg ) do
          print(k, v)
        end
        print("----------------------------------")
        --deve continuar enviando enquanto pede-se novos blocos
        if msg[1] == 162 then
          --checar versionId antes de começar a enviar
          if msg.versionId >= vID then
           -- version_file = io.open("versionID.lua", "w")
           -- version_file:write(msg.versionID .. '')
           -- version_file:close()

           -- vID = msg.versionID + 1;
          end

          msg_blk = {--carrega com progbin
            		versionId = vID;
                blockId = msg.blockId;
                data = ProgBin.ProgData[msg.blockId + 1];
            }

          mote:send(msg_blk,161)--envia o bloco
          print("Recebida Mensagem do tipo: " .. msg[1]) ;
          print('bloco ' .. msg.blockId .. ' enviado ' );
        else
           print("Recebida Mensagem do tipo: " .. msg[1]) ;
        end

        if msg[1] == 161 then
          if (msg.blockId + 1) == ProgBin.lastBlock then
          --ultima mensagem recebida
          print("ultima mensagem recebida, codigo carregado, versao " .. vID .. " em execução" ) ;

            version_file = io.open("versionID.lua", "w")
            version_file:write(vID .. '')

            version_file:close()

            enviou = true;

            break;
          end

        end


			else
				if emsg == "closed" then
          --caso entre aqui não é para desconectar, é para tentar conectar novamente até conseguir
					print("\nConnection closed!")
          	mote:unregister()
            mote:close()
            mote = nil;
					--exit = true --reconnect = true
					break
				end
			end
		else
      --caso entre aqui não é para desconectar, é para tentar conectar novamente até conseguir
			print("\nreceive() got an error:"..msg)
      	mote:unregister()
        mote:close()
        mote = nil;
			--exit = true --reconnect = true
			break
		end
	end





  --fim do envio, após carregar, o arquivo eh enviado para uma outra pasta de backup
    if enviou then
      exit = true;
    end


  end
  --[[
      local message = "You payload: " .. self.request.body
      local json = turbo.escape.json_decode(self.request.body)
      self:write(json.hello)]]--

    self:write("OK")
  end




  local app = turbo.web.Application:new({
      {"/filevmx", Handler}
  })

  app:listen(8888)
  turbo.ioloop.instance():start()
