document.addEventListener('DOMContentLoaded', () => {
  // ==========================================================================
  // CONFIGURA AQUÍ TU NÚMERO DE TELÉFONO CON CÓDIGO DE PAÍS (sin '+' ni espacios)
  // Ejemplo México (+52): '5218112345678' | España (+34): '34600112233'
  // ==========================================================================
  const MI_WHATSAPP = '5218112345678';

  // 1. Asignar enlace al Botón Flotante de WhatsApp
  const floatingBtn = document.getElementById('floatingWhatsApp');
  if (floatingBtn) {
    floatingBtn.href = `https://wa.me/${MI_WHATSAPP}?text=${encodeURIComponent('Hola, me gustaría conversar sobre una página web para mi negocio.')}`;
  }

  // 2. Control del Menú Móvil con Atributos de Accesibilidad
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
      mobileMenu.classList.toggle('hidden');
      mobileMenuBtn.setAttribute('aria-expanded', String(!isExpanded));
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // 3. Simulador Interactivo de Necesidades
  const bizTypeSelect = document.getElementById('bizType');
  const bizGoalSelect = document.getElementById('bizGoal');
  const simResult = document.getElementById('simResult');
  const sendSimWhatsAppBtn = document.getElementById('sendSimWhatsApp');

  function updateSimulation() {
    if (!bizTypeSelect || !bizGoalSelect || !simResult) return;

    const typeText = bizTypeSelect.options[bizTypeSelect.selectedIndex].text;
    const goalValue = bizGoalSelect.value;

    let recommendation = '';
    if (goalValue === 'no-web') {
      recommendation = `<strong>Servicio sugerido:</strong> <em>Sitio Web Multi-sección</em> o <em>Landing de Captación</em> para ${typeText}. Entrega lista en 10-14 días con catálogo claro de servicios/coberturas, cotizadores interactivos, contacto directo a WhatsApp y <strong>primer mes de soporte y mantenimiento incluido</strong>.`;
    } else if (goalValue === 'no-convierte') {
      recommendation = `<strong>Servicio sugerido:</strong> <em>Rediseño de Conversión</em> para ${typeText}: reestructuración visual persuasiva, simplificación de formularios y llamadas a la acción directas para transformar visitas en cotizaciones reales.`;
    } else {
      recommendation = `<strong>Servicio sugerido:</strong> <em>Rediseño & Mantenimiento Continuo</em> para ${typeText}: reconstrucción técnica con carga ultra veloz (&lt; 1s), optimización 100% móvil y plan de soporte mensual para que no toques código ni rompas el diseño.`;
    }

    simResult.innerHTML = recommendation;
  }

  if (bizTypeSelect && bizGoalSelect) {
    bizTypeSelect.addEventListener('change', updateSimulation);
    bizGoalSelect.addEventListener('change', updateSimulation);
    updateSimulation(); // Ejecutar al cargar la página
  }

  if (sendSimWhatsAppBtn) {
    sendSimWhatsAppBtn.addEventListener('click', () => {
      const typeText = bizTypeSelect.options[bizTypeSelect.selectedIndex].text;
      const goalText = bizGoalSelect.options[bizGoalSelect.selectedIndex].text;
      
      const message = `Hola, hice el diagnóstico en tu web.\n- Tipo de negocio: ${typeText}\n- Mi objetivo actual: ${goalText}\n¿Podrías decirme qué paquete de servicio se adaptaría mejor?`;
      window.open(`https://wa.me/${MI_WHATSAPP}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
    });
  }

  // 4. Acordeón Accesible de Preguntas Frecuentes (FAQ)
  const faqBtns = document.querySelectorAll('.faq-btn');

  faqBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const answer = btn.nextElementSibling;
      const icon = btn.querySelector('i');
      const isHidden = answer.classList.contains('hidden');

      // Cerrar las demás para mantener orden visual
      document.querySelectorAll('.faq-answer').forEach(a => a.classList.add('hidden'));
      document.querySelectorAll('.faq-btn').forEach(b => b.setAttribute('aria-expanded', 'false'));
      document.querySelectorAll('.faq-btn i').forEach(ic => ic.style.transform = 'rotate(0deg)');

      if (isHidden) {
        answer.classList.remove('hidden');
        btn.setAttribute('aria-expanded', 'true');
        if (icon) icon.style.transform = 'rotate(180deg)';
      }
    });
  });

  // 5. Formulario de Contacto hacia WhatsApp
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('formName').value.trim();
      const web = document.getElementById('formWeb').value.trim() || 'No tiene web todavía';
      const problem = document.getElementById('formMessage').value.trim();

      const message = `Hola, soy ${name}.\nWeb actual: ${web}\nNecesito resolver lo siguiente:\n${problem}`;
      window.open(`https://wa.me/${529515881087}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
    });
  }
});