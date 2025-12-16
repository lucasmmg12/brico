# Test con Authorization Header
$url = "https://fhfacchqwvzpkmxlleri.supabase.co/functions/v1/crear-pedido-whatsapp"
$anonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZoZmFjY2hxd3Z6cGtteGxsZXJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQzMTQ5MjQsImV4cCI6MjA0OTg5MDkyNH0.hNMOdCGTyuPbNOILgxsxkZWPtYPNLjlPXaOPLGcZQzU"

$headers = @{
    "Authorization" = "Bearer $anonKey"
    "Content-Type"  = "application/json"
}

$body = @{
    historial        = @(
        @{ from = "Cliente"; body = "Hola, quiero la PROMO 1 XL" },
        @{ from = "Agente"; body = "Tu nombre?" },
        @{ from = "Cliente"; body = "Lucas Marinero" },
        @{ from = "Agente"; body = "Tu DNI?" },
        @{ from = "Cliente"; body = "12345678" },
        @{ from = "Agente"; body = "Total 15000. Confirmas?" },
        @{ from = "Cliente"; body = "Si" }
    )
    cliente_telefono = "5492645438114"
} | ConvertTo-Json -Depth 10

Write-Host "Probando con Authorization..." -ForegroundColor Cyan

try {
    $response = Invoke-RestMethod -Uri $url -Method Post -Headers $headers -Body $body
    Write-Host "EXITO!" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 10
}
catch {
    Write-Host "ERROR:" -ForegroundColor Red
    Write-Host $_.Exception.Message
    if ($_.Exception.Response) {
        $stream = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($stream)
        Write-Host $reader.ReadToEnd()
    }
}

Read-Host "Enter"
