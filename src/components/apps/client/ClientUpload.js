import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Alert,
  Progress,
  Card,
  CardBody
} from 'reactstrap';

const ClientUpload = ({ isOpen, toggle, onUploadSuccess }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [alert, setAlert] = useState({ message: null, type: null });
  const [progress, setProgress] = useState(0);
  const [importResult, setImportResult] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setAlert({ message: null, type: null });
  };

  const resetForm = () => {
    setSelectedFile(null);
    setAlert({ message: null, type: null });
    setProgress(0);
    setImportResult(null);
    // Resetear el input file
    const fileInput = document.getElementById('file-upload');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedFile) {
      setAlert({
        message: 'Por favor seleccione un archivo',
        type: 'danger'
      });
      return;
    }

    // Validar tipo de archivo - ampliamos los tipos permitidos
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-excel', // .xls
      'application/excel', // .xls alternativo
      'application/x-excel', // .xls alternativo
      'application/x-msexcel', // .xls alternativo
      'text/csv', // .csv
      'text/comma-separated-values', // .csv alternativo
      'application/csv', // .csv alternativo
    ];

    // Validar también por extensión como fallback
    const fileName = selectedFile.name.toLowerCase();
    const allowedExtensions = ['.xlsx', '.xls', '.csv'];
    const hasValidExtension = allowedExtensions.some(ext => fileName.endsWith(ext));

    console.log('Validación de archivo:', {
      fileName: selectedFile.name,
      type: selectedFile.type,
      size: selectedFile.size,
      hasValidType: allowedTypes.includes(selectedFile.type),
      hasValidExtension
    });

    if (!allowedTypes.includes(selectedFile.type) && !hasValidExtension) {
      setAlert({
        message: `Tipo de archivo no válido. Archivo: ${selectedFile.type}. Solo se permiten archivos Excel (.xlsx, .xls) o CSV (.csv)`,
        type: 'danger'
      });
      return;
    }

    setUploading(true);
    setProgress(0);
    setAlert({ message: null, type: null });

    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Token de autenticación no encontrado');
      }

      const formData = new FormData();
      formData.append('file', selectedFile);

      // Debug: verificar que el archivo se está enviando correctamente
      console.log('Archivo a enviar:', {
        name: selectedFile.name,
        size: selectedFile.size,
        type: selectedFile.type,
        lastModified: selectedFile.lastModified
      });

      // Debug: verificar el FormData
      console.log('FormData entries:');
      Array.from(formData.entries()).forEach(([key, value]) => {
        console.log(key, value);
      });

      // Simular progreso (esto se puede mejorar con un endpoint que soporte progreso real)
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const response = await fetch(`${process.env.REACT_APP_URL_API}users/clients/import`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      clearInterval(progressInterval);
      setProgress(100);

      const data = await response.json();
      console.log('Respuesta de la API:', data);
      console.log('Status de la respuesta:', response.status, response.statusText);

      // Verificar si es un error real o una respuesta con información de importación
      const isImportResponse = 'imported_count' in data || 'failures' in data || 'error_file_url' in data;
      console.log('¿Es respuesta de importación?', isImportResponse, {
        hasImportedCount: 'imported_count' in data,
        hasFailures: 'failures' in data,
        hasErrorFileUrl: 'error_file_url' in data
      });
      
      if (!response.ok && !isImportResponse) {
        // Solo lanzar error si NO es una respuesta de importación
        let errorMessage = data.message || 'Error al cargar el archivo';
        
        // Si hay errores de validación específicos, mostrarlos
        if (data.errors) {
          const validationErrors = Object.values(data.errors).flat();
          errorMessage = validationErrors.join(', ');
        }
        
        throw new Error(errorMessage);
      }

      // Guardar información del resultado de importación
      setImportResult(data);
      
      // Debug: verificar la detección de errores
      console.log('Datos de importación:', {
        failures: data.failures,
        failuresLength: data.failures?.length,
        errorFileUrl: data.error_file_url,
        hasErrors: data.failures && data.failures.length > 0
      });

      // Determinar el tipo de alerta basado en si hay errores
      const hasErrors = data.failures && data.failures.length > 0;
      const alertType = hasErrors ? 'warning' : 'success';
      
      // Mensaje simple para el alert superior
      const alertMessage = hasErrors ? 
        'Archivo procesado. Ver resumen de importación abajo.' : 
        data.message || 'Archivo procesado exitosamente';
      
      setAlert({
        message: alertMessage,
        type: alertType
      });

      // Actualizar la vista de clientes después de éxito
      if (onUploadSuccess) {
        onUploadSuccess();
      }

      // No resetear automáticamente si hay errores para mostrar el reporte
      if (!hasErrors) {
        setTimeout(() => {
          resetForm();
          toggle();
        }, 2000);
      }

    } catch (err) {
      setAlert({
        message: `Error: ${err.message}`,
        type: 'danger'
      });
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const handleClose = () => {
    if (!uploading) {
      resetForm();
      toggle();
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / (k ** i)).toFixed(2))} ${sizes[i]}`;
  };

  const downloadExampleFile = () => {
    // Crear datos de ejemplo
    const exampleData = [
      ['nombre', 'tipo_documento', 'documento', 'email', 'phone'],
      ['Texaco', 'Nit', '12345678', 'juan.perez@email.com', '3001234567'],
      ['Maria Gonzalez', 'Cédula de Ciudadanía', '87654321', 'maria.gonzalez@email.com', '3109876543'],
      ['Iphone', 'Nit', '98765432', 'carlos.rodriguez@email.com', '3201234567'],
      ['Ana Lopez', 'Cédula de Ciudadanía', '11223344', 'ana.lopez@email.com', '3151234567'],
    ];

    // Convertir a CSV
    const csvContent = exampleData.map(row => row.join(',')).join('\n');
    
    // Crear blob y descargar
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'ejemplo_clientes.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadErrorReport = () => {
    console.log('Intentando descargar reporte de errores:', importResult?.error_file_url);
    if (importResult?.error_file_url) {
      const link = document.createElement('a');
      link.href = importResult.error_file_url;
      link.setAttribute('download', '');
      link.setAttribute('target', '_blank');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      console.error('No hay URL de archivo de errores disponible');
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={handleClose} size="lg" centered>
      <ModalHeader toggle={handleClose}>
        <i className="bi bi-cloud-upload me-2"></i>
        Cargar Clientes Masivamente
      </ModalHeader>
      
      <Form onSubmit={handleSubmit}>
        <ModalBody>
          {alert.message && (
            <Alert color={alert.type} className="mb-3">
              {alert.message}
            </Alert>
          )}

          {/* Información y instrucciones */}
          <div className="mb-4">
            <h6 className="text-primary mb-3">
              <i className="bi bi-info-circle me-2"></i>
              Instrucciones para la carga masiva
            </h6>
            
            <div className="bg-light p-3 rounded mb-3">
              <h6 className="mb-2">Estructura requerida del archivo:</h6>
              <ul className="mb-2 small">
                <li><strong>nombre:</strong> Nombre completo del cliente (requerido)</li>
                <li><strong>tipo documento:</strong> Tipo de documento: CC, CE, TI, PP, etc. (requerido)</li>
                <li><strong>documento:</strong> Número de documento de identidad (requerido, único)</li>
                <li><strong>email:</strong> Correo electrónico (requerido, único)</li>
                <li><strong>phone:</strong> Número de teléfono (requerido)</li>
              </ul>
              
              <div className="d-flex justify-content-between align-items-center">
                <small className="text-muted">
                  <i className="bi bi-file-earmark-excel me-1"></i>
                  Formatos soportados: .xlsx, .xls, .csv
                </small>
                <Button 
                  color="outline-primary" 
                  size="sm" 
                  onClick={downloadExampleFile}
                  type="button"
                >
                  <i className="bi bi-download me-1"></i>
                  Descargar Ejemplo
                </Button>
              </div>
            </div>
          </div>

          <Card className="border-2 border-dashed border-primary bg-light">
            <CardBody className="text-center p-4">
              <i className="bi bi-cloud-upload display-4 text-primary mb-3 d-block"></i>
              
              <h6 className="mb-3">Selecciona tu archivo de clientes</h6>
              
              <FormGroup>
                <Label for="file-upload" className="btn btn-primary btn-lg">
                  <i className="bi bi-folder-plus me-2"></i>
                  Seleccionar Archivo
                </Label>
                <Input
                  type="file"
                  id="file-upload"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileChange}
                  className="d-none"
                  disabled={uploading}
                />
              </FormGroup>

              {selectedFile && (
                <div className="mt-3">
                  <div className="d-flex align-items-center justify-content-center bg-white p-3 rounded border">
                    <i className="bi bi-file-earmark-excel text-success me-2 fs-4"></i>
                    <div className="text-start">
                      <div className="fw-bold">{selectedFile.name}</div>
                      <small className="text-muted">{formatFileSize(selectedFile.size)}</small>
                    </div>
                    <Button 
                      color="outline-danger" 
                      size="sm" 
                      className="ms-auto"
                      onClick={() => setSelectedFile(null)}
                      type="button"
                    >
                      <i className="bi bi-x"></i>
                    </Button>
                  </div>
                </div>
              )}

              {!selectedFile && (
                <div className="mt-3">
                  <small className="text-muted">
                    <i className="bi bi-info-circle me-1"></i>
                    Arrastra y suelta tu archivo aquí o haz clic para seleccionar
                  </small>
                </div>
              )}
            </CardBody>
          </Card>

          {uploading && (
            <div className="mt-3">
              <div className="d-flex justify-content-between mb-2">
                <span>Subiendo archivo...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} color="success" animated />
            </div>
          )}

          {/* Resumen de importación */}
          {importResult && (
            <div className="mt-4">
              <div className="bg-light p-3 rounded">
                <h6 className="mb-3">
                  <i className="bi bi-clipboard-data me-2"></i>
                  Resumen de Importación
                </h6>
                
                {/* Mostrar mensaje completo de la API */}
                {importResult.message && (
                  <div className="mb-3">
                    <div className={`alert alert-${importResult.failures && importResult.failures.length > 0 ? 'warning' : 'success'} mb-3`}>
                      <i className={`bi ${importResult.failures && importResult.failures.length > 0 ? 'bi-exclamation-triangle' : 'bi-check-circle'} me-2`}></i>
                      {importResult.message}
                    </div>
                  </div>
                )}
                
                {/* Debug: mostrar que se está renderizando */}
                {console.log('Renderizando resumen con:', importResult)}
                
                <div className="row mb-3">
                  <div className="col-md-6">
                    <div className="d-flex align-items-center">
                      <i className="bi bi-check-circle-fill text-success me-2"></i>
                      <span><strong>Importados:</strong> {importResult.imported_count || 0}</span>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="d-flex align-items-center">
                      <i className="bi bi-exclamation-triangle-fill text-warning me-2"></i>
                      <span><strong>Con errores:</strong> {importResult.failures?.length || 0}</span>
                    </div>
                  </div>
                </div>

                {importResult.failures && importResult.failures.length > 0 && (
                  <div className="mb-3">
                    <h6 className="text-warning mb-2">
                      <i className="bi bi-exclamation-triangle me-1"></i>
                      Errores encontrados:
                    </h6>
                    <div className="bg-white p-2 rounded border" style={{ maxHeight: '150px', overflowY: 'auto' }}>
                      {importResult.failures.slice(0, 5).map((failure) => (
                        <div key={`${failure.row}-${failure.attribute}-${failure.values?.documento || failure.values?.email || Math.random()}`} className="small mb-1">
                          <strong>Fila {failure.row}:</strong> {failure.errors?.join(', ')} 
                          {failure.values?.nombre && <span className="text-muted"> ({failure.values.nombre})</span>}
                        </div>
                      ))}
                      {importResult.failures.length > 5 && (
                        <div className="small text-muted">
                          ... y {importResult.failures.length - 5} errores más
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {importResult.error_file_url && (
                  <div className="text-center">
                    {console.log('Mostrando botón de descarga para URL:', importResult.error_file_url)}
                    <Button 
                      color="outline-warning" 
                      size="sm" 
                      onClick={downloadErrorReport}
                      type="button"
                    >
                      <i className="bi bi-download me-1"></i>
                      Descargar Reporte Completo de Errores
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </ModalBody>

        <ModalFooter>
          <Button 
            color="secondary" 
            type="button" 
            onClick={handleClose} 
            disabled={uploading}
          >
            {importResult ? 'Cerrar' : 'Cancelar'}
          </Button>
          
          {!importResult && (
            <Button 
              color="primary" 
              type="submit" 
              disabled={!selectedFile || uploading}
              className="d-flex align-items-center"
            >
              {uploading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Subiendo...
                </>
              ) : (
                <>
                  <i className="bi bi-upload me-2"></i>
                  Cargar Archivo
                </>
              )}
            </Button>
          )}
          
          {importResult && (
            <Button 
              color="success" 
              onClick={() => {
                resetForm();
                toggle();
              }}
              type="button"
            >
              <i className="bi bi-plus-circle me-2"></i>
              Cargar Otro Archivo
            </Button>
          )}
        </ModalFooter>
      </Form>
    </Modal>
  );
};

ClientUpload.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  onUploadSuccess: PropTypes.func,
};

export default ClientUpload;