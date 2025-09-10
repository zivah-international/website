# ZIVAH International - Verificación de Consolidación JavaScript
Write-Host "Verificando Consolidacion JavaScript..." -ForegroundColor Cyan

$errors = @()
$success = @()
$warnings = @()

Write-Host "`nVerificando estructura de archivos..." -ForegroundColor Yellow

# Verificar que main.js existe y contiene el código consolidado
if (Test-Path "js/main.js") {
    $success += "✅ js/main.js existe"
    Write-Host "  ✅ js/main.js existe" -ForegroundColor Green
    
    $mainContent = Get-Content "js/main.js" -Raw
    $size = (Get-Item "js/main.js").Length
    $sizeKB = [math]::Round($size/1024, 1)
    
    Write-Host "  Tamano: $sizeKB KB" -ForegroundColor Cyan
    
    # Verificar que contiene las funciones consolidadas
    $consolidatedSections = @(
        "COUNTRIES DATA - Consolidated from countries-data.js",
        "PERFORMANCE CONFIG - Consolidated from performance-config.js", 
        "SMOOTH LOADER LITE - Consolidated from smooth-loading-lite.js",
        "ENHANCED DROPDOWN - Consolidated from enhanced-dropdown.js",
        "FORM ENHANCEMENTS - Consolidated from form-enhancements.js"
    )
    
    foreach ($section in $consolidatedSections) {
        if ($mainContent -match [regex]::Escape($section)) {
            $success += "✅ Sección consolidada: $section"
            Write-Host "  ✅ $section" -ForegroundColor Green
        } else {
            $errors += "❌ Sección faltante: $section"
            Write-Host "  ❌ $section" -ForegroundColor Red
        }
    }
    
    # Verificar funciones críticas
    $criticalFunctions = @(
        "ECUADOR_EXPORT_COUNTRIES",
        "EnhancedCountryDropdown", 
        "SmoothLoaderLite",
        "initFormEnhancements",
        "ZIVAH_PERFORMANCE_CONFIG"
    )
    
    Write-Host "`nVerificando funciones criticas..." -ForegroundColor Yellow
    foreach ($func in $criticalFunctions) {
        if ($mainContent -match $func) {
            $success += "✅ Función disponible: $func"
            Write-Host "  ✅ $func" -ForegroundColor Green
        } else {
            $errors += "❌ Función faltante: $func"
            Write-Host "  ❌ $func" -ForegroundColor Red
        }
    }
    
} else {
    $errors += "❌ js/main.js no encontrado"
    Write-Host "  ❌ js/main.js no encontrado" -ForegroundColor Red
}

# Verificar que los archivos individuales fueron eliminados
Write-Host "`nVerificando eliminacion de archivos individuales..." -ForegroundColor Yellow
$deletedFiles = @(
    "js/countries-data.js",
    "js/enhanced-dropdown.js",
    "js/form-enhancements.js", 
    "js/performance-config.js",
    "js/smooth-loading-lite.js"
)

foreach ($file in $deletedFiles) {
    if (-not (Test-Path $file)) {
        $success += "✅ $file eliminado correctamente"
        Write-Host "  ✅ $file eliminado" -ForegroundColor Green
    } else {
        $warnings += "⚠️ $file aún existe"
        Write-Host "  ⚠️ $file aún existe" -ForegroundColor Yellow
    }
}

# Verificar referencias en HTML
Write-Host "`nVerificando referencias en HTML..." -ForegroundColor Yellow
if (Test-Path "index.html") {
    $htmlContent = Get-Content "index.html" -Raw
    
    # Verificar que solo referencia main.js
    $jsReferences = ([regex]'src="js/[^"]*\.js').Matches($htmlContent)
    
    if ($jsReferences.Count -eq 1 -and $jsReferences[0].Value -match "main\.js") {
        $success += "✅ HTML referencia solo main.js"
        Write-Host "  ✅ HTML referencia solo main.js" -ForegroundColor Green
    } else {
        $errors += "❌ HTML tiene referencias JS incorrectas"
        Write-Host "  ❌ Referencias JS en HTML:" -ForegroundColor Red
        foreach ($ref in $jsReferences) {
            Write-Host "    - $($ref.Value)" -ForegroundColor Red
        }
    }
    
    # Verificar que no hay referencias a archivos eliminados
    $oldReferences = @("countries-data.js", "enhanced-dropdown.js", "form-enhancements.js", "performance-config.js", "smooth-loading-lite.js")
    foreach ($oldFile in $oldReferences) {
        if ($htmlContent -match $oldFile) {
            $errors += "❌ HTML referencia archivo eliminado: $oldFile"
            Write-Host "  ❌ Referencia a $oldFile encontrada en HTML" -ForegroundColor Red
        }
    }
}

# Verificar sintaxis JavaScript
Write-Host "`nVerificando sintaxis JavaScript..." -ForegroundColor Yellow
try {
    $null = node -c "js/main.js" 2>&1
    if ($LASTEXITCODE -eq 0) {
        $success += "✅ Sintaxis JavaScript válida"
        Write-Host "  ✅ Sin errores de sintaxis" -ForegroundColor Green
    } else {
        $errors += "❌ Errores de sintaxis en JavaScript"
        Write-Host "  ❌ Errores de sintaxis detectados" -ForegroundColor Red
    }
} catch {
    $warnings += "⚠️ No se pudo verificar sintaxis (Node.js no disponible)"
    Write-Host "  ⚠️ Node.js no disponible para verificar sintaxis" -ForegroundColor Yellow
}

# Resumen final
Write-Host "`n" + "="*60 -ForegroundColor Cyan
Write-Host "RESUMEN DE CONSOLIDACION" -ForegroundColor Cyan
Write-Host "="*60 -ForegroundColor Cyan

Write-Host "`n✅ Éxitos: $($success.Count)" -ForegroundColor Green
Write-Host "⚠️  Advertencias: $($warnings.Count)" -ForegroundColor Yellow  
Write-Host "❌ Errores: $($errors.Count)" -ForegroundColor Red

if ($errors.Count -eq 0) {
    Write-Host "`nCONSOLIDACION EXITOSA!" -ForegroundColor Green
    Write-Host "✅ Todos los archivos JavaScript han sido consolidados correctamente" -ForegroundColor Green
    Write-Host "✅ El sitio web debería funcionar normalmente con un solo archivo JS" -ForegroundColor Green
} else {
    Write-Host "`nCONSOLIDACION INCOMPLETA" -ForegroundColor Red
    Write-Host "Se encontraron errores que deben ser corregidos:" -ForegroundColor Red
    foreach ($errorMsg in $errors) {
        Write-Host "  • $errorMsg" -ForegroundColor Red
    }
}

if ($warnings.Count -gt 0) {
    Write-Host "`n⚠️ Advertencias:" -ForegroundColor Yellow
    foreach ($warning in $warnings) {
        Write-Host "  • $warning" -ForegroundColor Yellow
    }
}

Write-Host "`nProximos pasos recomendados:" -ForegroundColor Cyan
Write-Host "  1. Probar el sitio web en navegador" -ForegroundColor White
Write-Host "  2. Verificar que todas las funcionalidades funcionan" -ForegroundColor White
Write-Host "  3. Ejecutar los scripts de despliegue actualizados" -ForegroundColor White
Write-Host "  4. Verificar que el formulario de cotizacion funciona" -ForegroundColor White

Write-Host "`nPara desplegar, ejecutar:" -ForegroundColor Cyan
Write-Host "  .\prepare-deployment.js" -ForegroundColor White
Write-Host "  .\create-deployment-zip.js" -ForegroundColor White
