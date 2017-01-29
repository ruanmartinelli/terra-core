
lfs = require ("lfs")

local f = io.open("blink_tutorial.vmx",'r')

arqTotal = f:read("*a");

print(type(arqTotal))

linha1 = string.match(arqTotal, ".*[^\n]")

--print(linha1)

for w in string.gmatch(arqTotal, "%S+") do
  print(w .. " hello")
end
