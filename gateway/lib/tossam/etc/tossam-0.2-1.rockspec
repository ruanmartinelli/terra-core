rockspec_format = "1.0"
package = "tossam"
version = "0.2-1"

description = {
  summary = "TinyOS Serial AM message for Lua",
  detailed = "",
  homepage = "http://www.inf.ufg.br/~brunoos/tossam/",
  license = "MIT/X11",
  maintainer = "Bruno Silvestre <brunoos@inf.ufg.br>",
}

source = {
  url = "http://www.inf.ufg.br/~brunoos/tossam/download/tossam-0.2.tar.gz",
}

dependencies = {
  "lua       == 5.1",
  "luars232  == 1.0.3-1",
  "bitlib    == 23-2",
  "lpeg      == 0.12-1",
  "struct    == 1.4-1",
  "luasocket == 3.0rc1-1",
}

build = {
  type = "builtin",
  modules = {
    ["tossam"]         = "tossam.lua",
    ["tossam.codec"]   = "codec.lua",
    ["tossam.hdlc"]    = "hdlc.lua",
    ["tossam.sf"]      = "sf.lua",
    ["tossam.serial"]  = "serial.lua",
    ["tossam.network"] = "network.lua",
  },
}
