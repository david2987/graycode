<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Reporte de Caja</title>
  <style>
    body { font-family: sans-serif; font-size: 14px; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    th, td { border: 1px solid #000; padding: 8px; text-align: left; }
    th { background: #eee; }
  </style>
</head>
<body>
  <h2>Reporte de Caja</h2>
  @if($desde || $hasta)
    <p>Rango: {{ $desde ?? '---' }} al {{ $hasta ?? '---' }}</p>
  @endif

  <table>
    <thead>
      <tr>
        <th>Fecha</th>
        <th>Tipo</th>
        <th>Monto</th>
        <th>Descripción</th>
      </tr>
    </thead>
    <tbody>
      @foreach ($movimientos as $m)
        <tr>
          <td>{{ \Carbon\Carbon::parse($m->fecha)->format('d/m/Y H:i') }}</td>
          <td>{{ ucfirst($m->tipo) }}</td>
          <td>${{ number_format($m->monto, 2, ',', '.') }}</td>
          <td>{{ $m->descripcion }}</td>
        </tr>
      @endforeach
    </tbody>
  </table>

  <h4 style="margin-top: 30px;">Resumen</h4>
  <p><strong>Ingresos:</strong> ${{ number_format($ingresos, 2, ',', '.') }}</p>
  <p><strong>Egresos:</strong> ${{ number_format($egresos, 2, ',', '.') }}</p>
  <p><strong>Saldo:</strong> ${{ number_format($saldo, 2, ',', '.') }}</p>
</body>
</html>
