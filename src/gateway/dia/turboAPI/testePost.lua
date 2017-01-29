local httpserver = require('turbo.httpserver')
local ioloop = require('turbo.ioloop')
local ioloop_instance = ioloop.instance()

function handle_request(request)
    local message = "You requested: " .. request.path
    request:write("HTTP/1.1 200 OK\r\nContent-Length:" .. message:len() .. "\r\n\r\n")
    request:write(message)
    request:finish()
end

http_server = httpserver.HTTPServer:new(handle_request)
http_server:listen(8888)
ioloop_instance:start()
