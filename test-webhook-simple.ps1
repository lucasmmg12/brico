# Test Webhook - Version Simple
$url = "https://fhfacchqwvzpkmxlleri.supabase.co/functions/v1/crear-pedido-whatsapp"

$body = @{
    historial        = @(
        @{ from = "Cliente"; body = "Hola, quiero comprar la PROMO 1 XL (Paleta Azul)" },
        @{ from = "Agente"; body = "Perfecto! Cual es tu nombre completo?" },
        @{ from = "Cliente"; body = "Lucas Marinero" },
        @{ from = "Agente"; body = "Me pasas tu DNI?" },
        @{ from = "Cliente"; body = "12345678" },
        @{ from = "Agente"; body = "El total es 15000 pesos. Confirmas?" },
        @{ from = "Cliente"; body = "Si, confirmo" }
    )
    cliente_telefono = "5492645438114"
} | ConvertTo-Json -Depth 10

Write-Host "Probando webhook..." -ForegroundColor Cyan
Write-Host ""

try {
    $response = Invoke-RestMethod -Uri $url -Method Post -Body $body -ContentType "application/json"
    
    Write-Host "EXITO!" -ForegroundColor Green
    Write-Host ""
    $response | ConvertTo-Json -Depth 10
    
}
catch {
    Write-Host "ERROR:" -ForegroundColor Red
    Write-Host $_.Exception.Message
    
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        Write-Host $reader.ReadToEnd()
    }
}

Read-Host "Presiona Enter"
