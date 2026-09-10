const ADMIN_EMAIL = 'tmattes04@gmail.com';

const MOBILES = {
  mobil1: 'Spülmobil 1',
  mobil2: 'Spülmobil 2'
};

const SETUP = [
  'Fahrzeug sicher abstellen, Handbremse und Stromanschluss prüfen.',
  'Frischwasser anschließen, Abwasserleitung sicher verlegen und Dichtigkeit prüfen.',
  'Maschine einschalten, Wasserstand und Reinigungsmittel prüfen.',
  'Probespülgang durchführen und Arbeitsplatz hygienisch vorbereiten.'
];

const TEARDOWN = [
  'Maschine ausschalten und abkühlen lassen.',
  'Grobsiebe, Filter und Spülräume reinigen.',
  'Frischwasser trennen und Restwasser vollständig ablassen.',
  'Abwasserleitung reinigen, Kabel verstauen und Fahrzeug abschließen.'
];

const TROUBLESHOOTING = [
  'Keine Stromversorgung: Sicherung, FI-Schalter und Anschlusskabel prüfen.',
  'Kein Wasserzulauf: Wasserhahn, Schlauch und Knickstellen prüfen.',
  'Wasser läuft nicht ab: Ablaufschlauch auf Knicke prüfen und Sieb reinigen.',
  'Spülergebnis schlecht: Dosierung, Temperatur, Siebe und Klarspüler kontrollieren.',
  'Undichtigkeit: Maschine ausschalten, Wasser schließen und Beauftragten informieren.'
];

const DISHES = [
  'Teller und Schalen vollständig, sauber und trocken',
  'Tassen, Gläser und Besteck sauber und sortiert',
  'Kisten und Transportboxen sauber und vollständig',
  'Arbeitsflächen, Abfall und Boden gereinigt',
  'Maschine, Filter und Siebe nach Anleitung gereinigt'
];

const MISSING_DISHES = [
  'Desserteller',
  'Essteller',
  'Tiefeteller',
  'Teelöffel',
  'Löffel',
  'Messer',
  'Gabeln',
  'Kuchengabeln',
  'Untertassen',
  'Tassen'
];

const $ = selector => document.querySelector(selector);
const esc = value => String(value ?? '').replace(/[&<>'"]/g, character => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  "'": '&#39;',
  '"': '&quot;'
}[character]));

const db = window.supabase?.createClient && window.DRK_SUPABASE?.url && window.DRK_SUPABASE?.publishableKey
  ? window.supabase.createClient(window.DRK_SUPABASE.url, window.DRK_SUPABASE.publishableKey)
  : null;

let signature;
let viewSerial = 0;

function shell(title, subtitle, body, kind = 'helper') {
  viewSerial += 1;
  $('#app').innerHTML = `
    <main class="shell ${kind}">
      <header class="brand">
        <div class="drk-mark" aria-label="Deutsches Rotes Kreuz">
          <span class="drk-cross" aria-hidden="true"></span>
          <span class="drk-wordmark">Deutsches<br>Rotes Kreuz</span>
        </div>
        <div class="brand-copy">
          <span class="brand-prefix">EINSATZ-APP</span>
          <h1>${esc(title)}</h1>
          <small>${esc(subtitle)}</small>
        </div>
        <div class="brand-unit"><span>o.V.</span> MOERS</div>
      </header>
      <div class="screen-content">${body}</div>
      <footer class="app-footer"><span>Deutsches Rotes Kreuz</span><span>Spülmobil · o.V. Moers</span></footer>
    </main>`;
  return viewSerial;
}

function home() {
  shell('DRK · Spülmobil', 'Bereitschaft · digitale Einsatzdokumentation', `
    <section class="hero welcome-hero">
      <p class="eyebrow">WILLKOMMEN</p>
      <h2>Welchen Bereich möchtest du öffnen?</h2>
      <p>Die Helfer-App ist ohne Anmeldung nutzbar. Der Manager ist nur für Beauftragte.</p>
      <div class="choice-grid">
        <button class="choice-card helper-choice" onclick="helperHome()">
          <span class="choice-code">01</span><strong>Helferbereich</strong><small>Anleitungen und Dienstabschluss</small><i aria-hidden="true">→</i>
        </button>
        <button class="choice-card admin-choice" onclick="adminLogin()">
          <span class="choice-code">02</span><strong>Beauftragter</strong><small>Manager und Dienstübersicht</small><i aria-hidden="true">→</i>
        </button>
      </div>
    </section>`);
}

function helperHome() {
  shell('DRK · Spülmobil', 'Helferbereich · o.V. Moers', `
    <section class="hero welcome-hero">
      <p class="eyebrow">HELFERBEREICH</p>
      <h2>Bereit für den Einsatz?</h2>
      <p>Die Anleitung bleibt während des Einsatzes verfügbar. Den Dienst schließt du erst am Ende ab.</p>
      <div class="choice-grid">
        <button class="choice-card helper-choice" onclick="serviceForm()">
          <span class="choice-code">A</span><strong>Dienstabschluss</strong><small>Endkontrolle, Fehlmengen und Unterschrift</small><i aria-hidden="true">→</i>
        </button>
        <button class="choice-card document-choice" onclick="documents('helper')">
          <span class="choice-code">B</span><strong>Dokumentation</strong><small>Aufbau, Abbau und Fehlerhilfe</small><i aria-hidden="true">→</i>
        </button>
      </div>
      <div class="actions"><button class="secondary" onclick="home()">← Zurück</button></div>
    </section>`);
}

function steps(items) {
  return `<ol class="steps">${items.map(item => `<li>${esc(item)}</li>`).join('')}</ol>`;
}

function documents(back = 'helper', section = 'home') {
  const returnAction = back === 'admin' ? 'adminDashboard()' : 'helperHome()';
  const alternateAction = back === 'admin' ? 'adminDashboard()' : 'serviceForm()';
  const alternateLabel = back === 'admin' ? 'Manager' : 'Dienst anlegen';
  const navigation = `<nav class="menu">
    <button class="menu-item ${section === 'home' ? 'active' : ''}" onclick="documents('${back}')">Dokumentation</button>
    <button class="menu-item" onclick="${alternateAction}">${alternateLabel}</button>
  </nav>`;

  if (section === 'home') {
    shell('DRK · Spülmobil', 'Dokumentation · o.V. Moers', `
      ${navigation}
      <section class="hero library-intro">
        <p class="eyebrow">WISSEN AM EINSATZORT</p>
        <h2>Was benötigst du?</h2>
        <p>Wähle eine Anleitung aus. Alle Inhalte sind für die Nutzung am Handy optimiert.</p>
      </section>
      <div class="doc-grid">
        <button class="doc-card setup" onclick="documents('${back}','setup')"><span>01</span><strong>Aufbau</strong><small>Inbetriebnahme Schritt für Schritt</small></button>
        <button class="doc-card teardown" onclick="documents('${back}','teardown')"><span>02</span><strong>Abbau</strong><small>Reinigung und Sicherung</small></button>
        <button class="doc-card troubleshoot" onclick="documents('${back}','trouble')"><span>!</span><strong>Fehler beheben</strong><small>Schnelle Hilfe bei Störungen</small></button>
      </div>
      <div class="actions"><button class="secondary" onclick="${returnAction}">← Zurück</button></div>`);
    return;
  }

  const items = section === 'setup' ? SETUP : section === 'teardown' ? TEARDOWN : TROUBLESHOOTING;
  const heading = section === 'setup' ? 'Aufbau' : section === 'teardown' ? 'Abbau' : 'Fehler beheben';
  shell('DRK · Spülmobil', `${heading} · o.V. Moers`, `
    ${navigation}
    <section class="card document-page">
      <p class="eyebrow">DOKUMENTATION</p>
      <h2>${heading}</h2>
      ${steps(items)}
    </section>
    <div class="actions"><button class="secondary" onclick="documents('${back}')">← Alle Dokumente</button></div>`);
}

function localDate() {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0, 10);
}

function serviceForm() {
  const missingInputs = MISSING_DISHES.map((item, index) => `
    <label>${esc(item)}
      <input name="missing_${index}" type="number" min="0" step="1" inputmode="numeric" value="0" aria-label="Fehlende ${esc(item)}">
    </label>`).join('');

  shell('DRK · Spülmobil', 'Dienstabschluss · o.V. Moers', `
    <nav class="menu">
      <button class="menu-item active" onclick="serviceForm()">Dienst anlegen</button>
      <button class="menu-item" onclick="documents('helper')">Dokumentation</button>
    </nav>
    <form id="service">
      <section class="card">
        <h2>Angaben zum Dienst</h2>
        <label>Spülmobil
          <select name="mobile" required>
            <option value="">Bitte auswählen</option>
            <option value="mobil1">Spülmobil 1</option>
            <option value="mobil2">Spülmobil 2</option>
          </select>
        </label>
        <div class="grid two">
          <label>Datum<input name="date" type="date" required></label>
          <label>Uhrzeit<input name="time" type="time" required></label>
        </div>
        <label>Verantwortliche Person<input name="name" required autocomplete="name"></label>
        <label>Zweite Person<input name="second" autocomplete="name" placeholder="Optional"></label>
        <label>Veranstaltung / Einsatzort<input name="place" required></label>
      </section>

      <section class="card">
        <h2>Endkontrolle</h2>
        <label class="check"><input type="checkbox" name="setup" required>Aufbau und Betrieb ordnungsgemäß durchgeführt</label>
        ${DISHES.map((item, index) => `<label class="check"><input type="checkbox" name="dish${index}" required>${esc(item)}</label>`).join('')}
        <label class="check"><input type="checkbox" name="teardown" required>Abbau nach Anleitung durchgeführt</label>
        <label>Allgemeine Bemerkungen / Schäden<textarea name="notes" placeholder="Optional"></textarea></label>
      </section>

      <section class="card">
        <h2>Fehlmengen Geschirr</h2>
        <p class="muted">Nur fehlende Teile eintragen. Wenn nichts fehlt, alle Felder auf 0 lassen.</p>
        <div class="missing-grid">${missingInputs}</div>
        <label>Bemerkungen zu Fehlmengen<textarea name="missing_notes" placeholder="Zum Beispiel: Beschädigung, Verlust oder Nachbestellung"></textarea></label>
      </section>

      <section class="card">
        <h2>Unterschrift</h2>
        <p class="muted">Bitte mit dem Finger unterschreiben.</p>
        <canvas id="signature" class="signature"></canvas>
        <div class="actions"><button type="button" class="secondary" onclick="clearSignature()">Unterschrift löschen</button></div>
      </section>

      <div class="actions">
        <button class="primary" type="submit">Dienst abschließen</button>
        <button class="secondary" type="button" onclick="helperHome()">Abbrechen</button>
      </div>
    </form>`);

  const form = $('#service');
  form.date.value = localDate();
  form.time.value = new Date().toTimeString().slice(0, 5);
  initSignature();
  form.onsubmit = submitService;
}

function initSignature() {
  signature = $('#signature');
  const context = signature.getContext('2d');
  const bounds = signature.getBoundingClientRect();
  const ratio = Math.max(window.devicePixelRatio || 1, 1);
  signature.width = Math.max(1, Math.round(bounds.width * ratio));
  signature.height = Math.max(1, Math.round(bounds.height * ratio));
  context.setTransform(ratio, 0, 0, ratio, 0, 0);

  let drawing = false;
  let lastPoint;
  const point = event => {
    const rect = signature.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  };

  signature.onpointerdown = event => {
    drawing = true;
    lastPoint = point(event);
    signature.setPointerCapture(event.pointerId);
    event.preventDefault();
  };
  signature.onpointermove = event => {
    if (!drawing) return;
    const nextPoint = point(event);
    context.beginPath();
    context.moveTo(lastPoint.x, lastPoint.y);
    context.lineTo(nextPoint.x, nextPoint.y);
    context.lineWidth = 2;
    context.lineCap = 'round';
    context.stroke();
    lastPoint = nextPoint;
    event.preventDefault();
  };
  signature.onpointerup = signature.onpointercancel = () => { drawing = false; };
}

function clearSignature() {
  if (signature) signature.getContext('2d').clearRect(0, 0, signature.width, signature.height);
}

function signed() {
  if (!signature) return false;
  return signature.getContext('2d').getImageData(0, 0, signature.width, signature.height).data.some(value => value !== 0);
}

function getMissingDishes(form) {
  return {
    posten: MISSING_DISHES.reduce((result, item, index) => {
      const value = Number.parseInt(String(form.get(`missing_${index}`) || '0'), 10);
      result[item] = Number.isFinite(value) && value > 0 ? value : 0;
      return result;
    }, {}),
    bemerkungen: String(form.get('missing_notes') || '').trim() || null
  };
}

async function submitService(event) {
  event.preventDefault();
  if (!db) return alert('Datenbankverbindung fehlt. Bitte die veröffentlichte Seite erneut öffnen.');
  if (!signed()) return alert('Bitte unterschreiben.');

  const form = new FormData(event.target);
  const submitButton = event.target.querySelector('button[type="submit"]');
  if (submitButton?.disabled) return;
  if (submitButton) {
    submitButton.disabled = true;
    submitButton.textContent = 'Wird gespeichert …';
  }
  const kontrollen = {
    aufbau: form.get('setup') === 'on',
    abbau: form.get('teardown') === 'on',
    geschirr: DISHES.reduce((result, _, index) => {
      result[`punkt_${index + 1}`] = form.get(`dish${index}`) === 'on';
      return result;
    }, {}),
    fehlmengen: getMissingDishes(form)
  };

  try {
    const { error } = await db.from('spuel_dienste').insert({
      spuelmobil: form.get('mobile'),
      dienst_datum: form.get('date'),
      dienst_zeit: form.get('time'),
      verantwortliche_person: form.get('name'),
      zweite_person: form.get('second') || null,
      einsatzort: form.get('place'),
      kontrollen,
      bemerkungen: form.get('notes') || null,
      unterschrift: signature.toDataURL('image/png')
    });

    if (error) throw error;
    alert('Dienst wurde erfolgreich gespeichert.');
    helperHome();
  } catch (error) {
    alert(`Speichern fehlgeschlagen: ${error.message || 'Bitte Internetverbindung prüfen.'}`);
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.textContent = 'Dienst abschließen';
    }
  }
}

function adminLogin() {
  shell('DRK · Spülmobil', 'Beauftragtenbereich · o.V. Moers', `
    <section class="hero welcome-hero">
      <p class="eyebrow">ANMELDUNG</p>
      <h2>Manager öffnen</h2>
      <p>Nur berechtigte Personen können gespeicherte Dienste einsehen.</p>
      <form id="login">
        <label>E-Mail-Adresse<input name="email" type="email" required autocomplete="username"></label>
        <label>Passwort<input name="password" type="password" required autocomplete="current-password"></label>
        <div class="actions">
          <button class="primary">Anmelden</button>
          <button type="button" class="secondary" onclick="home()">Abbrechen</button>
        </div>
      </form>
    </section>`, 'admin');

  $('#login').onsubmit = async event => {
    event.preventDefault();
    if (!db) return alert('Datenbankverbindung fehlt. Bitte die veröffentlichte Seite erneut öffnen.');
    const form = new FormData(event.target);
    try {
      const { error } = await db.auth.signInWithPassword({
        email: form.get('email'),
        password: form.get('password')
      });
      if (error) return alert('E-Mail-Adresse oder Passwort ist nicht korrekt.');
      adminDashboard();
    } catch {
      alert('Anmeldung fehlgeschlagen. Bitte Internetverbindung prüfen und erneut versuchen.');
    }
  };
}

function serviceLabel(service) {
  return MOBILES[service.spuelmobil] || 'Spülmobil';
}

function serviceTime(service) {
  return String(service.dienst_zeit || '').slice(0, 5);
}

async function adminDashboard() {
  if (!db) return adminLogin();
  let session;
  try {
    ({ data: { session } } = await db.auth.getSession());
  } catch {
    alert('Anmeldestatus konnte nicht geprüft werden. Bitte Internetverbindung prüfen.');
    return adminLogin();
  }
  if (!session) return adminLogin();
  if (String(session.user?.email || '').toLowerCase() !== ADMIN_EMAIL) {
    await db.auth.signOut();
    return adminLogin();
  }

  const currentView = shell('DRK · Spülmobil', 'Manager · o.V. Moers', `
    <nav class="menu">
      <button class="menu-item active" onclick="adminDashboard()">Dienste</button>
      <button class="menu-item" onclick="documents('admin')">Dokumentation</button>
    </nav>
    <section class="manager-hero">
      <p class="eyebrow">DIENSTMANAGER</p>
      <h2>Alle abgeschlossenen Dienste</h2>
      <p>Tippe auf einen Eintrag, um Checkliste, Fehlmengen, Bemerkungen und Unterschrift zu sehen.</p>
    </section>
    <section id="services" class="service-list"><p class="muted">Dienste werden geladen …</p></section>
    <div class="actions"><button class="secondary" onclick="logout()">Abmelden</button></div>`, 'admin');

  let data;
  let error;
  try {
    ({ data, error } = await db
      .from('spuel_dienste')
      .select('*')
      .gte('loeschen_ab', new Date().toISOString())
      .order('erstellt_am', { ascending: false }));
  } catch {
    if (currentView === viewSerial && $('#services')) {
      $('#services').innerHTML = '<div class="notice">Dienste konnten nicht geladen werden. Bitte Internetverbindung prüfen.</div>';
    }
    return;
  }

  if (currentView !== viewSerial) return;
  const target = $('#services');
  if (!target) return;
  if (error) {
    target.innerHTML = '<div class="notice">Dienste konnten nicht geladen werden. Bitte Anmeldung und Datenbankrechte prüfen.</div>';
    return;
  }

  window.currentServices = data || [];
  target.innerHTML = data?.length ? data.map(service => `
    <button class="service-row" onclick="serviceDetail('${service.id}')">
      <span class="status done">${esc(serviceLabel(service))}</span>
      <strong>${esc(service.verantwortliche_person)}</strong>
      <small>${esc(service.dienst_datum)} · ${esc(serviceTime(service))} Uhr · ${esc(service.einsatzort)}</small>
      <b>›</b>
    </button>`).join('') : '<div class="empty-state">Noch keine Dienste vorhanden.</div>';
}

function dishCheckValue(kontrollen, index) {
  if (kontrollen.geschirr === true) return true;
  return Boolean(kontrollen.geschirr?.[`punkt_${index + 1}`]);
}

function allChecksConfirmed(kontrollen) {
  return Boolean(kontrollen.aufbau)
    && Boolean(kontrollen.abbau)
    && DISHES.every((_, index) => dishCheckValue(kontrollen, index));
}

function missingDishesHtml(kontrollen) {
  const missing = kontrollen?.fehlmengen;
  if (!missing?.posten) return '<p class="muted">Für diesen älteren Dienst wurden keine Fehlmengen erfasst.</p>';

  const rows = MISSING_DISHES.map(item => `
    <div><span>${esc(item)}</span><strong>${Number(missing.posten[item]) || 0}</strong></div>`).join('');
  return `<div class="missing-summary">${rows}</div>
    <p class="missing-note"><strong>Bemerkungen:</strong> ${esc(missing.bemerkungen || 'Keine Bemerkungen zu Fehlmengen')}</p>`;
}

function serviceDetail(id) {
  const service = (window.currentServices || []).find(item => item.id === id);
  if (!service) return adminDashboard();

  const kontrollen = service.kontrollen || {};
  const checks = [
    ['Aufbau und Betrieb', kontrollen.aufbau],
    ...DISHES.map((item, index) => [item, dishCheckValue(kontrollen, index)]),
    ['Abbau', kontrollen.abbau]
  ];
  const people = service.zweite_person
    ? `<strong>${esc(service.verantwortliche_person)}</strong><br>${esc(service.zweite_person)}`
    : `<strong>${esc(service.verantwortliche_person)}</strong>`;

  shell('DRK · Spülmobil', 'Dienstansicht · o.V. Moers', `
    <nav class="menu">
      <button class="menu-item active" onclick="serviceDetail('${service.id}')">Dienstansicht</button>
      <button class="menu-item" onclick="adminDashboard()">Alle Dienste</button>
    </nav>
    <section class="manager-hero">
      <p class="eyebrow">${esc(serviceLabel(service).toUpperCase())}</p>
      <h2>${esc(service.einsatzort)}</h2>
      <p>${esc(service.dienst_datum)} · ${esc(serviceTime(service))} Uhr</p>
    </section>
    <section class="card"><h2>Verantwortliche Personen</h2><p>${people}</p></section>
    <section class="card">
      <h2>Kontrollierte Punkte</h2>
      ${checks.map(([item, complete]) => `<div class="detail-check"><span>${complete ? '✓' : '–'}</span>${esc(item)}</div>`).join('')}
    </section>
    <section class="card"><h2>Fehlende Geschirrteile</h2>${missingDishesHtml(kontrollen)}</section>
    <section class="card"><h2>Allgemeine Bemerkungen</h2><p>${esc(service.bemerkungen || 'Keine Bemerkungen')}</p></section>
    <section class="card"><h2>Unterschrift</h2><img class="signature-view" src="${esc(service.unterschrift || '')}" alt="Unterschrift"></section>
    <div class="actions">
      <button class="primary" onclick="exportPdf('${service.id}')">PDF exportieren</button>
      <button class="secondary" onclick="adminDashboard()">← Alle Dienste</button>
    </div>`, 'admin');
}

function exportPdf(id) {
  const service = (window.currentServices || []).find(item => item.id === id);
  if (!service) return;
  if (!window.jspdf?.jsPDF) {
    alert('Der PDF-Export konnte nicht geladen werden. Bitte Internetverbindung prüfen und die Seite neu öffnen.');
    return;
  }

  const { jsPDF } = window.jspdf;
  const documentPdf = new jsPDF();
  const kontrollen = service.kontrollen || {};
  const missing = kontrollen.fehlmengen;
  let y = 18;

  const ensureSpace = space => {
    if (y + space > 278) {
      documentPdf.addPage();
      y = 18;
    }
  };
  const heading = text => {
    ensureSpace(12);
    documentPdf.setFont(undefined, 'bold');
    documentPdf.setFontSize(14);
    documentPdf.text(text, 14, y);
    documentPdf.setFont(undefined, 'normal');
    documentPdf.setFontSize(11);
    y += 9;
  };
  const field = (label, value) => {
    const lines = documentPdf.splitTextToSize(String(value || '–'), 128);
    ensureSpace(Math.max(9, lines.length * 6 + 3));
    documentPdf.setFont(undefined, 'bold');
    documentPdf.text(`${label}:`, 14, y);
    documentPdf.setFont(undefined, 'normal');
    documentPdf.text(lines, 58, y);
    y += Math.max(9, lines.length * 6 + 3);
  };

  documentPdf.setFontSize(18);
  documentPdf.setFont(undefined, 'bold');
  documentPdf.text('DRK Spülmobil – Dienstnachweis', 14, y);
  documentPdf.setFont(undefined, 'normal');
  documentPdf.setFontSize(11);
  y += 14;

  field('Spülmobil', serviceLabel(service));
  field('Datum / Uhrzeit', `${service.dienst_datum} · ${serviceTime(service)} Uhr`);
  field('Verantwortlich', service.verantwortliche_person);
  field('Zweite Person', service.zweite_person || 'Keine');
  field('Einsatz', service.einsatzort);
  field('Endkontrolle', allChecksConfirmed(kontrollen) ? 'Vollständig bestätigt' : 'Nicht vollständig bestätigt');
  heading('Fehlmengen Geschirr');

  if (missing?.posten) {
    MISSING_DISHES.forEach((item, index) => {
      if (index % 2 === 0) ensureSpace(8);
      const x = index % 2 === 0 ? 14 : 108;
      documentPdf.setFont(undefined, 'bold');
      documentPdf.text(`${item}:`, x, y);
      documentPdf.setFont(undefined, 'normal');
      documentPdf.text(String(Number(missing.posten[item]) || 0), x + 59, y);
      if (index % 2 === 1 || index === MISSING_DISHES.length - 1) y += 7;
    });
    field('Bemerkungen Fehlmengen', missing.bemerkungen || 'Keine');
  } else {
    field('Fehlmengen', 'Für diesen älteren Dienst nicht erfasst');
  }

  field('Allgemeine Bemerkungen', service.bemerkungen || 'Keine');
  ensureSpace(49);
  documentPdf.setFont(undefined, 'bold');
  documentPdf.text('Unterschrift:', 14, y);
  documentPdf.setFont(undefined, 'normal');
  if (service.unterschrift) {
    try {
      documentPdf.addImage(service.unterschrift, 'PNG', 14, y + 4, 75, 35);
    } catch {
      documentPdf.text('Unterschrift konnte nicht eingebettet werden.', 14, y + 10);
    }
  }
  documentPdf.save(`DRK-Spuelmobil-${service.dienst_datum}.pdf`);
}

async function logout() {
  await db?.auth.signOut();
  window.currentServices = [];
  home();
}

home();
