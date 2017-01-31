file_wsn = require "file_wsn"

ProgBin = require "ProgBin"

tossam = require("tossam") 





function main()

  
  
  t_arquivos = file_wsn.le_diretorio ("files_vmx");
  --[[ Em um primeiro momento apenas um arquivo sera lido,
  neste caso o unico arquivo que sera lido sera o primeiro e ultimo, bastantando tratar apenas ele.
  ]]
  for _,arquivo in ipairs(t_arquivos) do
    f_arquivo_vmx = arquivo
  end
  
  if (f_arquivo_vmx == nil) then
    print ("arquivo não pode ser lido");
    os.exit();
  end;
  

  
  ProgBin.le_arquivo(f_arquivo_vmx)
  --print(math.floor(7.5/3.1)  )
  
  msg_newProVer = {
   versionId = 35,
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
  
  print(msg_newProVer.versionId)
	print('blockLen: ' .. msg_newProVer.blockLen )
	print('blockStar: ' .. msg_newProVer.blockStart)
	print(msg_newProVer.startProg)
	print('endProg: ' .. msg_newProVer.endProg  )
	print(msg_newProVer.nTracks  )
	print(msg_newProVer.wClocks  )
	print(msg_newProVer.asyncs   )
	print(msg_newProVer.wClock0  )
	print(msg_newProVer.gate0   )
	print(msg_newProVer.inEvts   )
	print(msg_newProVer.async0   ) 
  
print(" ")
  print('msg_newProVer: ' .. msg_newProVer.async0);
  print(" ")
  

for k, v in pairs( ProgBin.ProgData[3] ) do
   		print(k, v)
 end
	

  
  
end
main();