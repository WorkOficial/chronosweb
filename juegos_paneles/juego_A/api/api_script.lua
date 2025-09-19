--!strict
--[[
    Chronos Shield: Conexión con el Panel
    Instrucciones:
    1. Coloca este script en ServerScriptService.
    2. Reemplaza "TU_API_KEY_AQUI" con tu API key del panel.
]]--

local HttpService = game:GetService("HttpService")

local API_KEY = "TU_API_KEY_AQUI"
local PANEL_URL = "https://tu-dominio.com/api/v1"

local function sendLog(logType, data)
    local headers = {
        ["Content-Type"] = "application/json",
        ["Authorization"] = "Bearer " .. API_KEY
    }

    local body = HttpService:JSONEncode({
        type = logType,
        payload = data
    })

    local success, response = pcall(function()
        return HttpService:PostAsync(PANEL_URL, body, Enum.HttpContentType.ApplicationJson, false, headers)
    end)

    if not success then
        warn("Chronos Shield: Error al enviar log: " .. response)
    end
end

-- Ejemplo de uso
game.Players.PlayerAdded:Connect(function(player)
    sendLog("player_join", {
        userId = player.UserId,
        name = player.Name,
        ipAddress = "192.168.1.1",
        device = "PC"
    })
end)