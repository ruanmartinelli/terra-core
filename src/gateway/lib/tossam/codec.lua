--
-- TOSSAM
-- author: Bruno Silvestre
-- e-mail: brunoos@inf.ufg.br
-- 

local re     = require("re")
local struct = require("struct")

local string = require("string")
local table  = require("table")

--------------------------------------------------------------------------------

local grammar = [==[
structs <- s {| struct+ (!. / error) |}
error <- {| {:pos: {} :} {:kind: . -> 'ERROR':} |}
struct <- {| s
             "nx_struct" S
             {:name: name :} s
             "[" s {:id: num :}  s "]" s
             {:block: block :} s
             ";" s
         |}
block  <- {|
            "{" s
            (scalar / array)+
            "}" s
          |}
scalar <- {|
             {:kind: "" -> "SCALAR" :}
             {:type: type :} S
             {:name: name :} s
             ";" s
           |}
array <- {|
             {:kind: "" -> "ARRAY" :}
             {:type: type :} s
             {:name: name :} s
             {:levels: levels :}
             ";" s
           |}
levels <- {| level+ |}
level  <- "[" s num s "]" s
type   <- {
            "nx_int8_t"     / "nx_int16_t"    /
            "nx_int32_t"    / "nx_int64_t"    /
            "nx_uint8_t"    / "nx_uint16_t"   /
            "nx_uint32_t"   / "nx_uint64_t"   /
            "nxle_int8_t"   / "nxle_int16_t"  /
            "nxle_int32_t"  / "nxle_int64_t"  /
            "nxle_uint8_t"  / "nxle_uint16_t" /
            "nxle_uint32_t" / "nxle_uint64_t" /
            "nx_float"
          }
name   <- { ([a-zA-Z] / "_") ([a-zA-Z0-9] / "_")* }
num    <- { [0-9]+ }
s      <- (%s / %nl)*
S      <- (%s / %nl)+
]==]

local format = {
   nx_int8_t     = ">i1",
   nx_int16_t    = ">i2",
   nx_int32_t    = ">i4",
   nx_int64_t    = ">i8",
   nx_uint8_t    = ">I1",
   nx_uint16_t   = ">I2",
   nx_uint32_t   = ">I4",
   nx_uint64_t   = ">I8",
   nxle_int8_t   = "<i1",
   nxle_int16_t  = "<i2",
   nxle_int32_t  = "<i4",
   nxle_int64_t  = "<i8",
   nxle_uint8_t  = "<I1",
   nxle_uint16_t = "<I2",
   nxle_uint32_t = "<I4",
   nxle_uint64_t = "<I8",
   nx_float      =   "f",
}

--------------------------------------------------------------------------------

local function check(def)
  def.vars = {}
  def.id = tonumber(def.id)
  for k, var in ipairs(def.block) do
    if def.vars[var.name] then
      return false
    end
    if var.kind == "ARRAY" then
      for i, j in ipairs(var.levels) do
        var.levels[i] = tonumber(j)
      end
    end
    def.vars[var.name] = var
  end
  return true
end

local function parser(str)
  local defs = re.match(str, grammar)
  local err = defs[#defs]
  if err.kind == "ERROR" then
    return nil, "Parser error at " .. tostring(err.pos)
  end
  for i, def in ipairs(defs) do
    if not def or not check(def) then
      return nil, "Parser error"
    end
  end
  return defs
end

--------------------------------------------------------------------------------

local function arraydec(levels, level, fmt, data, pos)
  local tb
  local size = levels[level]
  if #levels == level then
    tb = { struct.unpack(string.rep(fmt, size), data, pos) }
    pos = table.remove(tb, #tb)
  else
    tb = {}
    for i = 1, size do
      tb[i], pos = arraydec(levels, level+1, fmt, data, pos)
    end
  end
  return tb, pos
end

local function arrayenc(levels, level, fmt, value, data)
  local size = levels[level]
  if #levels == level then
    for i = 1, size do
      data[#data+1] = struct.pack(fmt, value[i])
    end
  else
    for i = 1, size do
      arrayenc(levels, level+1, fmt, value[i], data)
    end
  end
end

local function decode(def, data, pos)
  local fmt, value
  local payload = {}
  for k, field in ipairs(def.block) do
     if field.kind == "SCALAR" then
        value, pos = struct.unpack(format[field.type], data, pos)
     elseif field.kind == "ARRAY" then
        value, pos = arraydec(field.levels, 1, format[field.type], data, pos)
     else
        return nil
     end
     payload[field.name] = value
  end
  return payload
end

local function encode(def, payload)
  local fmt, value
  local data = {}
  for k, field in ipairs(def.block) do
     local value = payload[field.name]
     if field.kind == "SCALAR" and type(value) == "number" then
        data[#data+1] = struct.pack(format[field.type], value)
     elseif field.kind == "ARRAY" and type(value) == "table" then
        arrayenc(field.levels, 1, format[field.type], value, data)
     else
        return nil
     end
  end
  return table.concat(data)
end

--------------------------------------------------------------------------------
-- Module
return {
  parser = parser,
  encode = encode,
  decode = decode
}
