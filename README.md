# EVOLEX · ETM Day 2026 — Growth Check

Landing independiente, sin modificar `evolex.cl`, NEXORA Academy ni EVOLEX Cyber Scan. Archivo público `index.html`, película original y logotipo; recepción de contactos mediante Cloudflare Pages Functions y D1.

## Publicación con GitHub + Cloudflare Pages

1. Crear un **repositorio nuevo**, preferentemente `evolex-etm-2026`, y subir el contenido completo de esta carpeta a la raíz del repositorio (incluidos `assets`, `functions`, `_routes.json`, `_headers`). Puede permanecer privado si el plan y configuración Cloudflare Pages lo permiten.
2. En Cloudflare Pages: **Create project → Connect to GitHub → seleccionar repo**. Framework preset: `None`; build command: vacío; output directory: `/` (o configuración equivalente para sitio estático en la raíz). Revisar que `functions/api/leads.js` se despliegue como Pages Function.
3. Crear una base de datos Cloudflare D1 separada, por ejemplo `evolex-etm-leads`. Ejecutar `migrations/0001_etm_leads.sql` **en la base correcta** y verificar las tablas.
4. Agregar en Pages > Settings > Functions > D1 database bindings un binding con nombre exacto **DB**, a esa base. Asegurar que se aplique al entorno de producción.
5. Crear un sitio Cloudflare Turnstile para el dominio público final. Sustituir `YOUR_TURNSTILE_SITE_KEY` en `index.html` por la clave de sitio. Agregar `TURNSTILE_SECRET` como secreto de Pages (no publicarlo en GitHub).
6. Revisar y aprobar `privacidad.html`: insertar correo de privacidad real, datos del responsable y política de retención aprobada. No lanzar el formulario antes.
7. Hacer **prueba real** de envío con autorización; verificar que `/api/leads` responde `ok: true` y que aparece la fila en D1 con nombre/correo de prueba. Borrar los datos de prueba luego. Probar envío fallido sin Turnstile, sin consentimiento y honeypot. Confirmar privacidad, seguridad y accesibilidad en iPhone.
8. Solo después de confirmar que la URL pública y el formulario funcionan, generar QR y enviar tarjeta a imprimir. La URL ideal sería subdominio independiente `etm.evolex.cl` **únicamente si** se autoriza y configura DNS, sin tocar el sitio web principal. Alternativa: URL propia `*.pages.dev` asignada por Cloudflare.
9. Designar responsable de seguimiento y respuesta de leads, y verificar manualmente D1 después del evento. No se ha integrado correo de notificación ni CRM: no prometer alertas automáticas.

## Protecciones

- El formulario está configurado deliberadamente para **no captar datos** hasta que Turnstile y D1 estén habilitados.
- No publicar `TURNSTILE_SECRET` ni exportar leads a repositorios.
- No reutilizar la base D1 de NEXORA.
- El proyecto representa una **startup ficticia** en un video narrativo; no declarar que es testimonio real.
- Video musical sujeto a la licencia Pixabay de la pista seleccionada y a cualquier reclamación Content ID aplicable; guardar comprobantes de licencia.

## Desarrollo local

Para revisar la interfaz, abrir `index.html` mediante un servidor web local, por ejemplo `python -m http.server 8000`. La función D1/Turnstile no se ejecuta en ese servidor y el formulario mostrará un mensaje de configuración pendiente. Para pruebas completas usar Cloudflare Pages / Wrangler con D1 configurado.