// clinica.js - Lógica interactiva para la demo clínica de OdontoPro

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // 1. CONFIGURACIÓN
  // ==========================================
  // Cambia este número por tu WhatsApp o el del cliente (código de país sin signos ni ceros iniciales)
  const WHATSAPP_PHONE = '5218100000000';

  // ==========================================
  // 2. COTIZADOR RÁPIDO DE TRATAMIENTOS
  // ==========================================
  const calcButtons = document.querySelectorAll('.calc-btn');
  const calcNameEl = document.getElementById('calcSelectedName');
  const calcPriceEl = document.getElementById('calcSelectedPrice');
  const calcTimeEl = document.getElementById('calcSelectedTime');
  const calcBookBtn = document.getElementById('calcBookBtn');
  const treatmentSelect = document.getElementById('treatmentCategory');

  // Estado del tratamiento inicial seleccionado
  let currentSelection = {
    name: 'Limpieza Profunda Ultrasónica',
    price: '650 - 850 MXN',
    time: '45 min'
  };

  calcButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remover estado activo de todos los botones
      calcButtons.forEach(b => {
        b.classList.remove('active', 'border-2', 'border-blue-600');
        b.classList.add('border', 'border-slate-200');
      });

      // Activar el botón presionado
      btn.classList.add('active', 'border-2', 'border-blue-600');
      btn.classList.remove('border-slate-200');

      // Leer datos desde los atributos data-*
      currentSelection.name = btn.getAttribute('data-name') || '';
      currentSelection.price = btn.getAttribute('data-price') || '';
      currentSelection.time = btn.getAttribute('data-time') || '';

      // Actualizar tarjeta resumen
      if (calcNameEl) calcNameEl.textContent = currentSelection.name;
      if (calcPriceEl) calcPriceEl.textContent = currentSelection.price;
      if (calcTimeEl) calcTimeEl.textContent = currentSelection.time;

      // Sincronizar automáticamente con el <select> del formulario inferior
      if (treatmentSelect) {
        if (currentSelection.name.includes('Limpieza')) {
          treatmentSelect.value = 'Limpieza y Chequeo General';
        } else if (currentSelection.name.includes('Ortodoncia')) {
          treatmentSelect.value = 'Ortodoncia / Alineadores';
        } else if (currentSelection.name.includes('Urgencia')) {
          treatmentSelect.value = 'Urgencia por Dolor';
        } else if (currentSelection.name.includes('Blanqueamiento')) {
          treatmentSelect.value = 'Blanqueamiento';
        } else {
          treatmentSelect.value = 'Otro Servicio';
        }
      }
    });
  });

  // Botón "Agendar con este estimado": scroll fluido hacia el formulario
  if (calcBookBtn) {
    calcBookBtn.addEventListener('click', () => {
      const target = document.getElementById('reservar');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // ==========================================
  // 3. SELECTOR DE SLOTS DE HORARIOS
  // ==========================================
  const slotButtons = document.querySelectorAll('.slot-btn');
  let selectedSlot = 'Mañana (09:00 - 12:30)';

  slotButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      slotButtons.forEach(b => {
        b.classList.remove('active', 'border-2', 'border-blue-600', 'bg-blue-50/50', 'text-blue-900');
        b.classList.add('border-slate-200', 'bg-slate-50', 'text-slate-700');
      });

      btn.classList.add('active', 'border-2', 'border-blue-600', 'bg-blue-50/50', 'text-blue-900');
      btn.classList.remove('border-slate-200', 'bg-slate-50', 'text-slate-700');

      selectedSlot = btn.getAttribute('data-slot') || 'Turno preferente no especificado';
    });
  });

  // ==========================================
  // 4. ENVÍO DEL FORMULARIO HACIA WHATSAPP
  // ==========================================
  const form = document.getElementById('clinicBookingForm');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('clientName')?.value.trim() || 'No indicado';
      const category = document.getElementById('treatmentCategory')?.value || currentSelection.name;
      const day = document.getElementById('preferredDay')?.value || 'Próxima disponibilidad';
      const notes = document.getElementById('extraNotes')?.value.trim();

      // Construcción del mensaje predefinido con saltos de línea
      let message = `¡Hola OdontoPro! Quiero agendar una cita de valoración:\n\n`;
      message += `• *Paciente:* ${name}\n`;
      message += `• *Motivo:* ${category}\n`;
      message += `• *Estimado cotizado:* ${currentSelection.price} (${currentSelection.time})\n`;
      message += `• *Día preferido:* ${day}\n`;
      message += `• *Turno:* ${selectedSlot}\n`;

      if (notes) {
        message += `• *Síntomas / Notas:* ${notes}\n`;
      }

      message += `\n¿Tienen espacio disponible para confirmar este turno?`;

      // Apertura de WhatsApp en pestaña nueva
      const encodedMsg = encodeURIComponent(message);
      const url = `https://wa.me/${WHATSAPP_PHONE}?text=${encodedMsg}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    });
  }
});