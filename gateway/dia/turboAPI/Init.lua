local turbo = require("turbo")

local HelloNameHandler = class("HelloNameHandler", turbo.web.RequestHandler)

function HelloNameHandler:get()
    local name = self:get_argument("name", "Felipe")
    self:write({hello="json"})
end

function HelloNameHandler:post()
    local message = "You payload: " .. self.request.body
    local json = turbo.escape.json_decode(self.request.body)
    self:write(json.hello)
end

local app = turbo.web.Application:new({
    {"/disseminaaewfih", HelloNameHandler}
})

app:listen(8888)
turbo.ioloop.instance():start()
