# Test Webhook - Crear Pedido con OpenAI
$url = "https://fhfacchqwvzpkmxlleri.supabase.co/functions/v1/crear-pedido-whatsapp"
$anonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZoZmFjY2hxd3Z6cGtteGxsZXJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQzMTQ5MjQsImV4cCI6MjA0OTg5MDkyNH0.hNMOdCGTyuPbNOILgxsxkZWPtYPNLjlPXaOPLGcZQzU"

$headers = @{
    "Content-Type"  = "application/json"
    "apikey"        = $anonKey
    "Authorization" = "Bearer $anonKey"
}

$body = @{
    historial        = @(
        @{ from = "Cliente"; body = "Hola, quiero comprar la PROMO 1 XL (Paleta Azul)" },
        @{ from = "Agente"; body = "Perfecto! Cual es tu nombre completo?" },
        @{ from = "Cliente"; body = "Lucas Marinero" },
        @{ from = "Agente"; body = "Excelente Lucas. Me pasas tu DNI?" },
        @{ from = "Cliente"; body = "12345678" },
        @{ from = "Agente"; body = "Genial! El total es 15000 pesos. Confirmas la compra?" },
        @{ from = "Cliente"; body = "Si, confirmo" }
    )
    cliente_telefono = "5492645438114"
} | ConvertTo-Json -Depth 10

Write-Host "Enviando pedido de prueba..." -ForegroundColor Cyan
Write-Host "URL: $url" -ForegroundColor Gray
Write-Host ""

try {
    $response = Invoke-RestMethod -Uri $url -Method Post -Headers $headers -Body $body -ContentType "application/json"
    
    Write-Host "Pedido creado exitosamente!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Respuesta:" -ForegroundColor Yellow
    $response | ConvertTo-Json -Depth 10
    
}
catch {
    Write-Host "Error al crear pedido:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host ""
        Write-Host "Detalles:" -ForegroundColor Yellow
        Write-Host $responseBody -ForegroundColor Gray
    }
}

Write-Host ""
Write-Host "Presiona Enter para salir..."
Read-Host
