--
-- TOSSAM
-- author: Bruno Silvestre
-- e-mail: brunoos@inf.ufg.br
--

local string = require("string")
local table  = require("table")
local io     = require("io")
local bit    = require("bit")

local band   = bit.band
local bor    = bit.bor
local bxor   = bit.bxor
local rshift = bit.rshift
local lshift = bit.lshift

--------------------------------------------------------------------------------

-- HDLC flags
local HDLC_SYNC   = 0x7E
local HDLC_ESCAPE = 0x7D
local HDLC_MAGIC  = 0x20

-- Framer-level message type
local SERIAL_PROTO_ACK            = 67
local SERIAL_PROTO_PACKET_ACK     = 68
local SERIAL_PROTO_PACKET_NOACK   = 69
local SERIAL_PROTO_PACKET_UNKNOWN = 255

local seqno = 42
local MTU   = 255

--- DEBUG
local function printf(str, ...)
  print(string.format(str, ...))
end

local function printb(data)
  for k, v in ipairs(data) do
    io.stdout:write(string.format("%X ", v))
  end
  io.stdout:write("\n")
end
---

local function checksum(data)
  local crc = 0
  for k, v in ipairs(data) do
    crc = band(bxor(crc, lshift(v, 8)), 0xFFFF)
    for i = 1, 8 do
      if band(crc, 0x8000) == 0 then
        crc = band(lshift(crc, 1), 0xFFFF)
      else
        crc = band(bxor(lshift(crc, 1), 0x1021), 0xFFFF)
      end
    end
  end
  return crc
end

local function lowrecv(port, buffer)
  while true do
    local data, err = port:read(1)
    if data then
      data = string.byte(data)
      if buffer.sync then
        if buffer.count >= MTU or (buffer.escape and data == HDLC_SYNC) then
          buffer.sync = false
        elseif buffer.escape then
          buffer.escape = false
          data = bxor(data, HDLC_MAGIC)
          buffer.count = buffer.count + 1
          buffer.data[buffer.count] = data
        elseif data == HDLC_ESCAPE then
          buffer.escape = true
        elseif data == HDLC_SYNC then
          local odata = buffer.data
          local count = buffer.count
          buffer.data = {}
          buffer.count  = 0
          if count > 2 then
            local b1 = table.remove(odata, count)
            local b2 = table.remove(odata, count-1)
            local crc = bor(lshift(b1, 8), b2)
            if crc == checksum(odata) then
              local kind = table.remove(odata, 1)
              return odata, kind
            end
          end
        else
          buffer.count = buffer.count + 1
          buffer.data[buffer.count] = data
        end
      elseif data == HDLC_SYNC then
        buffer.sync   = true
        buffer.escape = false
        buffer.data   = {}
        buffer.count  = 0
      end
    elseif err == "timeout" then
      return nil, "timeout"
    else
      buffer.sync   = false
      buffer.escape = false
      return nil, err
    end
  end
end

local function lowsend(port, str)
  local data = { string.byte(str, 1, #str) }

  table.insert(data, 1, SERIAL_PROTO_PACKET_ACK)
  table.insert(data, 2, seqno)
  seqno = ((seqno + 1) % 255)

  local crc = checksum(data) 
  data[#data+1] = band(crc, 0xFF)
  data[#data+1] = band(rshift(crc, 8))

  local pack = {HDLC_SYNC}
  for k, v in ipairs(data) do
    if v == HDLC_SYNC or v == HDLC_ESCAPE then
      pack[#pack+1] = HDLC_ESCAPE
      pack[#pack+1] = band(bxor(v, HDLC_MAGIC), 0xFF)
    else
      pack[#pack+1] = v
    end
  end
  pack[#pack+1] = HDLC_SYNC
  str = string.char(unpack(pack))
  return port:write(str)
end

local function send(buffer, str)
  local succ, errmsg = lowsend(buffer.port, str)
  if succ then
    local pack, kind = lowrecv(buffer.port, buffer)
    if kind == SERIAL_PROTO_ACK then
      return true, true
    elseif kind == SERIAL_PROTO_PACKET_NOACK then
      buffer.queue[#buffer.queue+1] = pack
    end
    return true, false
  end
  return false, errmsg
end

local function recv(buffer)
  if next(buffer.queue) then
    local data = table.remove(buffer.queue, 1)
    return string.char(unpack(data))
  end
  while true do
    local data, kind = lowrecv(buffer.port, buffer)
    if not data then
      return nil, kind
    elseif kind == SERIAL_PROTO_PACKET_NOACK then
      return string.char(unpack(data))
    end
  end
end

local function close(buffer)
  buffer.port:close()
end

local function settimeout(buffer, v)
  buffer.port:settimeout(v)
end

local meta = {
  __index = {
    recv       = recv,
    send       = send,
    close      = close,
    settimeout = settimeout,
  }
}

local function wrap(port)
  local buffer = {
    -- HDLC control
    data   = nil,
    count  = 0,
    escape = false,
    sync   = false,
    -- Received data
    queue  = {},
    -- Datasource
    port   = port,
  }

  return setmetatable(buffer, meta)
end

--------------------------------------------------------------------------------
-- Module
return { wrap = wrap }
