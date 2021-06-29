local socket = require("socket.core")
local json = require("json")

local connection
local version = "1.4"
local host = "127.0.0.1"
local port = 8081
local connected = false
local stopped = false

local active_text = ""
local text_timer = 18
local retry_timer = 0

--- Read a number of bytes starting at a given address.
function read(address, number)
    bytes = {}

    for i = 0, number - 1 do
        table.insert(bytes, mainmemory.read_u8(address + i))
    end

    return bytes
end

--- Write a list of bytes to memory starting at a given address.
function write(address, bytes)
    for i, byte in ipairs(bytes) do
        mainmemory.write_u8(address + i - 1, byte)
    end
end

function parse_command(buffer)
    local command = json.decode(buffer)
    local response = {}

    -- Add the uuid to our response.
    response["uuid"] = command.uuid

    if command.type == 0 then -- READ
        response["type"] = 1 -- 1 is for DATA.
        response["data"] = {}
        response["data"]["bytes"] = read(command.data.address, command.data.bytes)

    elseif command.type == 1 then -- WRITE
        response["type"] = 0 -- 0 is for ACK.
        response["data"] = {}
        write(command.data.address, command.data.values)

    elseif command.type == 2 then -- PING
        response["type"] = 2 -- 2 is for PONG.
        response["data"] = {}

    elseif command.type == 3 then -- ALERT
        response["type"] = 0 -- 0 is for ACK.
        response["data"] = {}
        active_text = command.data.message;
        text_timer = command.data.timeout;

    end

    connection:send(json.encode(response))
end

--- Our event listener for commands.
function on_command(buffer)
    if pcall(parse_command, buffer) then
        -- Do nothing! Everything worked.
    else
        console.log("Error while interpreting buffer or sending response.")
    end
end

--- Stringify an object, to make it easier to read in console.
function stringify(o)
    if type(o) == 'table' then
        local s = '{ '
        for k,v in pairs(o) do
            if type(k) ~= 'number' then k = '"'..k..'"' end
            s = s .. '['..k..'] = ' .. dump(v) .. ','
        end
        return s .. '} '
    else
        return tostring(o)
    end
end

--- Our main loop.
function main()
    if stopped then
        return nil
    end

    if not connected then
        -- Do not attempt if we haven't reset our retry timer.
        if retry_timer > 0 then
            retry_timer = retry_timer - 1
            return
        end

        console.log("Ocarinaverse Luabridge v" .. version)
        console.log("Attempting to connect to Bridge Server at " .. host .. ":" .. port .. ".")

        connection, err = socket:tcp()
        if err ~= nil then
            console.log("Error: ", err)
            return
        end

        local return_code, error_message = connection:connect(host, port)
        if return_code == nil then
            console.log("Error while connecting:", error_message)
            --stopped = true
            connected = false
            console.log("Will retry to connect in 5 seconds...")
            retry_timer = 300 -- 300 = 60 FPS * 5
            return
        end

        connection:settimeout(0)
        connected = true
        console.log("Connected to Bridge Server!")
        return
    end

    local buffer, status = connection:receive("*l")
    if buffer then
        on_command(buffer)
    end

    if status == "closed" then
        console.log("Connection to Bridge Server was closed.")
        console.log("Will retry to connect in 5 seconds...")
        retry_timer = 300 -- 300 = 60 FPS * 5

        text_timer = 300
        active_text = "Lost connection to Bridge Server."

        connection:close()
        connected = false
        return
    end
end

--- Draw text to the screen!
function draw_gui()
    -- Messages
    gui.drawString(0, 237, active_text, null, null, null, null, null, "top")

    -- Connected Message
    local conn_text, conn_color
    if connected then
        conn_text = "Ready"
        conn_color = "lime"
    else
        conn_text = "Disconnected"
        conn_color = "red"
    end

    gui.drawString(320, 237, conn_text, conn_color, null, null, null, "right", "top")

    if text_timer > 0 then
        text_timer = text_timer - 1
    end

    if text_timer == 0 then
        active_text = ""
    end
end

--- Game loop
gui.DrawNew("emu", true)
while true do
    main()

    draw_gui()

    emu.frameadvance()
end
