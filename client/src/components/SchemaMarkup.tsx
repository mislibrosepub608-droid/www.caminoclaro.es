export function SchemaMarkup() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Camino Claro",
    "description": "Servicio de orientación y asesoramiento para peregrinos del Camino Francés",
    "url": "https://caminoclaro.manus.space",
    "telephone": "+34692576302",
    "email": "caminoclaro78@gmail.com",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Palás de Rei",
      "addressRegion": "Galicia",
      "addressCountry": "ES"
    },
    "areaServed": {
      "@type": "GeoShape",
      "name": "Camino Francés"
    },
    "priceRange": "€5-€30",
    "serviceType": "Asesoramiento y Orientación para Peregrinos"
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "¿Cuál es la mejor época para hacer el Camino Francés?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "La mejor época es abril-mayo y septiembre-octubre. Durante estos meses el clima es más agradable, hay menos lluvia y la naturaleza está en su esplendor."
        }
      },
      {
        "@type": "Question",
        "name": "¿Cuánto tiempo se necesita para completar el Camino?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "El Camino Francés tiene 780 km y normalmente se completa en 30-35 días caminando entre 20-25 km diarios."
        }
      },
      {
        "@type": "Question",
        "name": "¿Qué documentación necesito?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Necesitas la Credencial del Peregrino, pasaporte o DNI válido, y un seguro de viaje recomendado."
        }
      }
    ]
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Inicio",
        "item": "https://caminoclaro.manus.space"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Servicios",
        "item": "https://caminoclaro.manus.space/servicios"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Blog",
        "item": "https://caminoclaro.manus.space/blog"
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": "Calculadora",
        "item": "https://caminoclaro.manus.space/calculadora"
      }
    ]
  };

  return (
    <>
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(faqSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </script>
    </>
  );
}
