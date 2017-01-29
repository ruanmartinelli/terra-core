lfs = require ("lfs")

file_wsn = {};
--[[funcao que retorna o nome dos arquivos dentro de um diretorio ]]
function file_wsn.le_diretorio (path)
  files = {};
    for file in lfs.dir(path) do
        
        if file ~= "." and file ~= ".." then
            local f = io.open(path.. '/' ..file,'r')
            files[#files + 1] = f;            
        end
    end
    return files;
end


return file_wsn;
