/* ============================================================
   NexusAI — Contact Form Logic
   script.jshttps://baikka-testlab.app.n8n.cloud/webhook/55036a0a-a866-478e-8fe7-bb6ce06c6a9b
   ============================================================ */

const N8N_URL = "https://baikka-testlab.app.n8n.cloud/webhook-test/contact-form"; // 🔁 Replace this

/**
 * Mark a field valid or invalid and return the result.
 */
function validate(id, condition) {
  const field = document.getElementById('f-' + id);
  if (!field) return condition;
  if (!condition) {
    field.classList.add('invalid');
    return false;
  }
  field.classList.remove('invalid');
  return true;
}

/**
 * Validate, send to n8n, show success screen.
 */
async function submitForm() {
  const name    = document.getElementById('fullName').value.trim();
  const email   = document.getElementById('email').value.trim();
  const company = document.getElementById('company').value.trim();
  const role    = document.getElementById('role').value.trim();
  const service = document.getElementById('service').value;
  const budget  = document.getElementById('budget').value.trim();

  const gmailRx = /^[a-zA-Z0-9._%+\-]+@gmail\.com$/i;

  const nameOk    = validate('name',    name.length > 1);
  const emailOk   = validate('email',   gmailRx.test(email));
  const serviceOk = validate('service', service !== '');
  const budgetOk  = validate('budget',  budget.length > 0);

  if (!nameOk || !emailOk || !serviceOk || !budgetOk) return;

  try {
    await fetch(N8N_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, company, role, service, budget }),
    });

    document.getElementById('formInner').classList.add('hide');
    document.getElementById('successOverlay').classList.add('show');

  } catch (err) {
    alert("Submission failed. Check connection and try again.");
  }
}

/**
 * Clear invalid state when user starts correcting input.
 */
function attachClearOnInput() {
  const fieldMap = {
    fullName : 'name',
    email    : 'email',
    service  : 'service',
    budget   : 'budget',
  };

  Object.entries(fieldMap).forEach(([elId, fieldKey]) => {
    const el = document.getElementById(elId);
    if (!el) return;
    el.addEventListener('input', () => {
      const field = document.getElementById('f-' + fieldKey);
      if (field) field.classList.remove('invalid');
    });
  });
}

document.addEventListener('DOMContentLoaded', attachClearOnInput);
