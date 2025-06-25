<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Comprobante de Venta #{{ $venta->id }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            font-size: 12px;
            line-height: 1.4;
        }
        .header {
            text-align: center;
            border-bottom: 2px solid #333;
            padding-bottom: 10px;
            margin-bottom: 20px;
        }
        .company-name {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 5px;
        }
        .company-info {
            font-size: 12px;
            color: #666;
        }
        .venta-info {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
        }
        .venta-details {
            flex: 1;
        }
        .venta-number {
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 5px;
        }
        .table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        .table th {
            background-color: #f3f4f6;
            border: 1px solid #d1d5db;
            padding: 8px;
            text-align: left;
            font-weight: bold;
        }
        .table td {
            border: 1px solid #d1d5db;
            padding: 8px;
        }
        .text-right {
            text-align: right;
        }
        .text-center {
            text-align: center;
        }
        .total-section {
            border-top: 2px solid #333;
            padding-top: 10px;
            margin-top: 20px;
        }
        .total-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 5px;
        }
        .total-final {
            font-size: 16px;
            font-weight: bold;
            border-top: 1px solid #333;
            padding-top: 5px;
        }
        .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 10px;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="company-name">SISTEMA GRAYCODE</div>
        <div class="company-info">
            Comprobante de Venta<br>
            Sistema de Gestión Comercial
        </div>
    </div>

    <div class="venta-info">
        <div class="venta-details">
            <div class="venta-number">Venta #{{ $venta->id }}</div>
            <div><strong>Comprobante:</strong> {{ $venta->comprobante_externo }}</div>
            <div><strong>Fecha:</strong> {{ \Carbon\Carbon::parse($venta->fecha)->format('d/m/Y H:i:s') }}</div>
        </div>
    </div>

    <table class="table">
        <thead>
            <tr>
                <th>Producto</th>
                <th>Talle</th>
                <th class="text-center">Cantidad</th>
                <th class="text-right">Precio Unit.</th>
                <th class="text-right">Subtotal</th>
            </tr>
        </thead>
        <tbody>
            @foreach($venta->detalles as $detalle)
            <tr>
                <td>{{ $detalle->producto->nombre }}</td>
                <td>{{ $detalle->producto->talle }}</td>
                <td class="text-center">{{ $detalle->cantidad }}</td>
                <td class="text-right">${{ number_format($detalle->precio_unitario, 2) }}</td>
                <td class="text-right">${{ number_format($detalle->cantidad * $detalle->precio_unitario, 2) }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="total-section">
        <div class="total-row">
            <span>Subtotal:</span>
            <span>${{ number_format($venta->total, 2) }}</span>
        </div>
        <div class="total-row">
            <span>IVA (0%):</span>
            <span>$0.00</span>
        </div>
        <div class="total-row total-final">
            <span>TOTAL:</span>
            <span>${{ number_format($venta->total, 2) }}</span>
        </div>
    </div>

    <div class="footer">
        <p>Este documento es un comprobante de venta generado automáticamente por el Sistema GrayCode.</p>
        <p>Fecha de impresión: {{ \Carbon\Carbon::now()->format('d/m/Y H:i:s') }}</p>
    </div>
</body>
</html>
