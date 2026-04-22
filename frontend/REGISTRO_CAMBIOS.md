# Cambios 15/04/2026

- Se corrigió el error `useState is not defined` en `StudyPractice.tsx`.
- Se añadió manejo para mostrar mensaje si no hay preguntas en modo práctica.
- Se mejoró la robustez del componente ante datos vacíos.
- Se validó visualmente el flujo de práctica y feedback de selección.
- Se subieron los cambios al repositorio remoto.

# Registro de cambios y correcciones

## 1. Instalación de dependencias

- Se instaló el paquete `jspdf` con el comando:
  ```bash
  npm install jspdf
  ```
- Se verificó que `jspdf` aparece correctamente en el archivo `package.json` bajo `dependencies`.

## 2. Uso de jspdf

- Se mostró un ejemplo de uso en el archivo `src/pages/generateCertificate.ts`:
  - Importación:
    ```typescript
    import jsPDF from "jspdf";
    ```
  - Ejemplo de generación de PDF:
    ```typescript
    const doc = new jsPDF();
    doc.text("CERTIFICADO PRL", 70, 40);
    doc.text(`Alumno: ${name}", 20, 80);
    doc.text(`Resultado: ${pct}%", 20, 100);
    doc.save("certificado.pdf");
    ```

## 3. Error y corrección: Supabase

- Error presentado al ejecutar el proyecto:
  ```
  [plugin:vite:import-analysis] Failed to resolve import "@supabase/supabase-js" from "src/shared/lib/supabase.ts". Does the file exist?
  ```
- Causa: El paquete `@supabase/supabase-js` no estaba instalado.
- Solución aplicada: Instalación del paquete con el comando:
  ```bash
  npm install @supabase/supabase-js
  ```
- Resultado: Instalación exitosa y el error de importación debería estar resuelto.

---

Este documento debe mantenerse actualizado con cada cambio relevante, error detectado y solución aplicada para facilitar el seguimiento y la colaboración en el proyecto.
