# Manual de Usuario - Módulo de Clientes

## 📋 Tabla de Contenidos
1. [Introducción](#introducción)
2. [Acceso al Módulo](#acceso-al-módulo)
3. [Filtros de Clientes](#filtros-de-clientes)
4. [Exportar Clientes](#exportar-clientes)
5. [Carga Masiva de Clientes](#carga-masiva-de-clientes)
6. [Gestión Individual de Clientes](#gestión-individual-de-clientes)
7. [Solución de Problemas](#solución-de-problemas)
8. [Preguntas Frecuentes](#preguntas-frecuentes)

---

## 🎯 Introducción

El **Módulo de Clientes** es una herramienta integral que permite gestionar de manera eficiente la base de datos de clientes de la organización. Ofrece funcionalidades completas para visualizar, filtrar, exportar e importar información de clientes de forma masiva.

### Funcionalidades principales:
- ✅ **Filtrado inteligente** por estado de cliente
- ✅ **Exportación** de datos a Excel
- ✅ **Importación masiva** desde archivos Excel/CSV
- ✅ **Gestión individual** de registros de cliente
- ✅ **Reportes de errores** detallados

---

## 🚪 Acceso al Módulo

1. **Inicia sesión** en el sistema con tus credenciales
2. Navega al **menú principal**
3. Selecciona **"Clientes"** en el panel de navegación
4. Se cargará automáticamente la vista de clientes con el filtro **"Todos"** activo

---

## 🔍 Filtros de Clientes

El sistema ofrece cuatro tipos de filtros para organizar la visualización de clientes:

### 📊 Tipos de Filtros Disponibles

| Filtro | Descripción | Icono |
|--------|-------------|-------|
| **Todos** | Muestra todos los clientes registrados | 📋 |
| **Activos** | Solo clientes con estado activo | ✅ |
| **Inactivos** | Solo clientes con estado inactivo | ⏸️ |
| **Eliminados** | Clientes marcados como eliminados | 🗑️ |

### 🎯 Cómo usar los filtros:

1. **Ubicación**: Los filtros se encuentran en el panel izquierdo de la pantalla
2. **Selección**: Haz clic en el filtro deseado
3. **Carga automática**: La lista se actualizará automáticamente
4. **Indicador visual**: El filtro activo se resalta en color

---

## 📤 Exportar Clientes

### 🎯 Propósito
Permite descargar la lista actual de clientes en formato Excel para análisis externo o respaldos.

### 📋 Pasos para exportar:

1. **Selecciona el filtro** deseado (Todos, Activos, Inactivos, Eliminados)
2. **Localiza el botón** "Exportar a Excel" en la parte superior
3. **Haz clic** en el botón de exportar
4. **Espera** a que se genere el archivo
5. **Descarga automática**: El archivo se descargará como `clientes_[filtro]_[fecha].xlsx`

### 📊 Contenido del archivo exportado:
- Nombre completo del cliente
- Tipo de documento
- Número de documento
- Correo electrónico
- Número de teléfono
- Estado del cliente
- Fecha de registro

---

## 📥 Carga Masiva de Clientes

### 🎯 Propósito
Permite importar múltiples clientes simultáneamente desde archivos Excel o CSV, ideal para migraciones de datos o actualizaciones masivas.

### 📋 Estructura del Archivo Requerida

El archivo debe contener **exactamente** estas columnas en este orden:

| Columna | Descripción | Ejemplo | Obligatorio |
|---------|-------------|---------|-------------|
| `nombre` | Nombre completo del cliente | Juan Pérez | ✅ |
| `tipo documento` | Tipo de identificación | CC, CE, TI, PP | ✅ |
| `documento` | Número de documento (único) | 12345678 | ✅ |
| `email` | Correo electrónico (único) | juan@email.com | ✅ |
| `phone` | Número de teléfono | 3001234567 | ✅ |

### 📄 Tipos de Documento Aceptados:
- **CC**: Cédula de Ciudadanía
- **CE**: Cédula de Extranjería
- **TI**: Tarjeta de Identidad
- **PP**: Pasaporte
- **Nit**: Número de Identificación Tributaria

### 🛠️ Proceso de Carga Masiva:

#### Paso 1: Preparar el archivo
1. **Descarga el archivo de ejemplo**:
   - Haz clic en "Cargar Clientes" en la parte superior
   - En el modal, busca "Descargar Ejemplo"
   - Descarga el archivo `ejemplo_clientes.csv`

2. **Prepara tus datos**:
   - Abre el archivo de ejemplo
   - Reemplaza los datos de ejemplo con tu información
   - **Mantén exactamente** la estructura de columnas
   - Guarda como Excel (.xlsx) o CSV (.csv)

#### Paso 2: Cargar el archivo
1. **Abre el modal de carga**:
   - Haz clic en el botón "Cargar Clientes"
   
2. **Revisa las instrucciones**:
   - Lee la información sobre la estructura requerida
   - Verifica que tu archivo cumple con los requisitos

3. **Selecciona tu archivo**:
   - Haz clic en "Seleccionar Archivo"
   - Escoge tu archivo Excel o CSV
   - Formatos aceptados: `.xlsx`, `.xls`, `.csv`

4. **Inicia la carga**:
   - Haz clic en "Cargar Archivo"
   - Observa la barra de progreso

#### Paso 3: Revisar resultados
1. **Resumen de importación**:
   - **Registros importados**: Cantidad de clientes agregados exitosamente
   - **Registros con errores**: Cantidad de registros que no se pudieron procesar

2. **Manejo de errores**:
   - Si hay errores, se mostrará una lista con los primeros 5
   - **Información de error**: Fila, tipo de error, datos del registro
   - **Descarga del reporte completo**: Botón para descargar Excel con todos los errores

### ⚠️ Errores Comunes y Soluciones:

| Error | Causa | Solución |
|-------|-------|----------|
| "El documento ya existe" | Número de documento duplicado | Verifica que el documento no esté registrado |
| "El email ya existe" | Correo electrónico duplicado | Usa un email diferente o actualiza el existente |
| "Campo requerido" | Información faltante | Completa todos los campos obligatorios |
| "Formato de email inválido" | Email mal formateado | Usa formato: usuario@dominio.com |
| "Tipo de documento inválido" | Tipo no reconocido | Usa: CC, CE, TI, PP, Nit |

### 📊 Reporte de Errores
Cuando ocurren errores durante la importación:

1. **Descarga automática**: El sistema genera un archivo Excel con todos los errores
2. **Información detallada**: Cada error incluye:
   - Número de fila del archivo original
   - Campo que causó el error
   - Descripción específica del problema
   - Datos completos del registro

3. **Corrección y reintento**:
   - Abre el archivo de errores
   - Corrige los problemas identificados
   - Vuelve a subir solo los registros corregidos

---

## 👤 Gestión Individual de Clientes

### ➕ Agregar Cliente Individual
1. Haz clic en "Agregar Cliente"
2. Completa el formulario con la información requerida
3. Haz clic en "Guardar"

### ✏️ Editar Cliente Existente
1. Localiza el cliente en la lista
2. Haz clic en el botón "Editar" (ícono de lápiz)
3. Modifica la información necesaria
4. Guarda los cambios

### 🗑️ Eliminar Cliente
1. Localiza el cliente en la lista
2. Haz clic en el botón "Eliminar" (ícono de papelera)
3. Confirma la acción en el diálogo

---

## 🛠️ Solución de Problemas

### Problema: "No se pueden cargar los clientes"
**Posibles causas:**
- Problemas de conectividad
- Sesión expirada
- Error del servidor

**Soluciones:**
1. Verifica tu conexión a internet
2. Refresca la página (F5)
3. Cierra sesión y vuelve a iniciar
4. Contacta al administrador del sistema

### Problema: "Error al exportar archivo"
**Soluciones:**
1. Verifica que no tengas archivos Excel abiertos con el mismo nombre
2. Asegúrate de tener permisos de escritura en la carpeta de descargas
3. Intenta con un filtro diferente

### Problema: "Archivo de carga masiva rechazado"
**Verificaciones:**
1. ✅ Formato de archivo: .xlsx, .xls, o .csv
2. ✅ Estructura de columnas correcta
3. ✅ Datos en formato válido
4. ✅ Tamaño de archivo menor a 10MB

### Problema: "Muchos errores en la importación"
**Recomendaciones:**
1. Descarga y revisa el reporte de errores completo
2. Corrige los problemas más comunes primero
3. Realiza importaciones en lotes más pequeños
4. Valida los datos antes de la importación

---

## ❓ Preguntas Frecuentes

### ❓ ¿Cuántos clientes puedo importar a la vez?
**R:** No hay límite específico, pero se recomienda importar en lotes de 500-1000 registros para mejor rendimiento.

### ❓ ¿Qué pasa si subo un cliente que ya existe?
**R:** El sistema detectará duplicados por documento y email, generando errores específicos que puedes revisar en el reporte.

### ❓ ¿Puedo modificar clientes importados masivamente?
**R:** Sí, una vez importados, los clientes se pueden editar individualmente como cualquier otro registro.

### ❓ ¿Se conserva un historial de las importaciones?
**R:** Sí, cada importación genera un reporte que puedes descargar y conservar para auditoría.

### ❓ ¿Qué hago si mi archivo tiene más columnas?
**R:** El sistema solo procesará las columnas requeridas. Columnas adicionales serán ignoradas.

### ❓ ¿Puedo deshacer una importación masiva?
**R:** No hay función automática de deshacer. Deberás eliminar manualmente los registros o contactar al administrador.

---

## 📞 Soporte Técnico

Para asistencia adicional o problemas no cubiertos en este manual:

- **Email**: soporte@empresa.com
- **Teléfono**: +57 xxx xxx xxxx
- **Horario**: Lunes a Viernes, 8:00 AM - 6:00 PM

---

## 📝 Historial de Versiones

| Versión | Fecha | Cambios |
|---------|-------|---------|
| 1.0 | 2025-09-29 | Manual inicial con todas las funcionalidades |

---

**Última actualización**: 29 de septiembre de 2025  
**Versión del sistema**: 1.0  
**Autor**: Equipo de Desarrollo