const mobiles = { mobil1: 'Spülmobil 1', mobil2: 'Spülmobil 2' };
const setup = ['Fahrzeug sicher abstellen, Handbremse anziehen und Stromanschluss prüfen.','Frischwasser anschließen, Abwasserleitung sicher verlegen und Dichtigkeit prüfen.','Maschine einschalten, Wasserstand kontrollieren und Reinigungsmittel prüfen.','Probespülgang durchführen und Arbeitsplatz hygienisch vorbereiten.'];
const teardown = ['Maschine ausschalten und abkühlen lassen.','Grobsiebe, Filter und Spülräume reinigen.','Frischwasser trennen und Restwasser vollständig ablassen.','Abwasserleitung reinigen, Kabel sicher verstauen und Fahrzeug abschließen.'];
const dishes = ['Teller und Schalen vollständig, sauber und trocken','Tassen, Gläser und Besteck sauber und sortiert','Kisten/Transportboxen sauber, vollständig und verschlossen','Arbeitsflächen, Abfall und Boden gereinigt','Maschine, Filter und Siebe nach Anleitung gereinigt'];
let signatureCanvas;
const $ = (selector) => document.querySelector(selector);
const supabaseClient = window.supabase?.createClient && window.DRK_SUPABASE
  ? window.supabase.createClient(window.DRK_SUPABASE.url, window.DRK_SUPABASE.publishableKey)
  : null;

function renderRoleChoice() {
  $('#app').innerHTML = `<div class="shell helper welcome"><header class="brand"><div class="cross">✚</div><div><h1>DRK · Spülmobil</h1><small>Bereitschaft · digital organisiert</small></div></header><section class="card hero welcome-hero"><p class="eyebrow">WILLKOMMEN</p><h2>Was möchtest du öffnen?</h2><p class="muted">Wähle deinen Bereich für eine schnelle und passende Ansicht.</p><div class="choice-grid"><button class="choice-card helper-choice" onclick="showHelperWelcome()"><span>🧤</span><strong>Helfer</strong><small>Anleitung, Dienst und PDF</small></button><button class="choice-card admin-choice" onclick="showAdminWelcome()"><span>⚙</span><strong>Beauftragter</strong><small>Spülmobile verwalten</small></button></div></section></div>`;
}

function showHelperWelcome() {
  $('#app').innerHTML = `<div class="shell helper welcome"><header class="brand"><div class="cross">✚</div><div><h1>DRK · Spülmobil</h1><small>Helferbereich</small></div></header><section class="card hero welcome-hero"><p class="eyebrow">HELFERBEREICH</p><h2>Bereit für den Einsatz?</h2><p class="muted">Die Anleitungen sind jederzeit verfügbar. Den Dienstnachweis füllst du erst am Ende aus.</p><div class="choice-grid"><button class="choice-card helper-choice" onclick="showHelper()"><span>＋</span><strong>Dienst anlegen</strong><small>Endkontrolle, Unterschrift und PDF</small></button><button class="choice-card document-choice" onclick="showDocuments()"><span>▤</span><strong>Dokumente</strong><small>Aufbau- und Abbauanleitung</small></button></div><div class="actions"><button class="secondary" onclick="renderRoleChoice()">← Zurück</button></div></section></div>`;
}

function showAdminWelcome() {
  $('#app').innerHTML = `<div class="shell admin welcome"><header class="brand"><div class="cross">✚</div><div><h1>DRK · Spülmobil</h1><small>Bereich für Beauftragte</small></div></header><section class="card hero welcome-hero"><p class="eyebrow">BEAUFTRAGTER</p><h2>Spülmobile im Blick</h2><p class="muted">Öffne den Manager für die Übersicht der beiden Spülmobile und die Dienstverwaltung.</p><div class="choice-grid one"><button class="choice-card admin-choice" onclick="showAdminLogin()"><span>⚙</span><strong>Zum Manager</strong><small>Anmelden und Übersicht öffnen</small></button></div><div class="actions"><button class="secondary" onclick="renderRoleChoice()">← Zurück</button></div></section></div>`;
}

function showHelper() {
  $('#app').innerHTML = `<div class="shell helper"><header class="brand"><div class="cross">✚</div><div><h1>DRK · Spülmobil</h1><small>Aufbau, Abbau und Dienstabschluss</small></div></header><div class="actions"><button class="secondary" type="button" onclick="renderRoleChoice()">← Bereich wechseln</button></div><section class="card hero"><h2>Spülmobil-Check</h2><p class="muted">Die Anleitung bleibt jederzeit verfügbar. Am Ende wird ein Dienstnachweis als PDF erzeugt.</p></section><section class="card"><h2>Aufbauanleitung</h2><ol class="steps">${setup.map(step => `<li>${step}</li>`).join('')}</ol></section><section class="card"><h2>Abbauanleitung</h2><ol class="steps">${teardown.map(step => `<li>${step}</li>`).join('')}</ol></section><form id="service"><section class="card"><h2>Dienstabschluss</h2><p class="muted">Bitte erst nach Ende des Dienstes ausfüllen.</p><label>Spülmobil</label><select name="mobile" required><option value="">Bitte auswählen</option><option value="mobil1">Spülmobil 1</option><option value="mobil2">Spülmobil 2</option></select><div class="grid two"><div><label>Datum</label><input name="date" type="date" required></div><div><label>Uhrzeit</label><input name="time" type="time" required></div></div><label>Verantwortliche Person</label><input name="name" autocomplete="name" required placeholder="Vor- und Nachname"><label>Zweite Person</label><input name="secondPerson" autocomplete="name" placeholder="Optional: Vor- und Nachname"><label>Veranstaltung / Einsatzort</label><input name="event" required placeholder="z. B. Sanitätsdienst Stadtfest"></section><section class="card"><h2>Endkontrolle bestätigen</h2><p class="muted">Alle Punkte müssen bestätigt werden.</p><label class="check"><input type="checkbox" name="setupOk" required>Aufbau und Betrieb wurden ordnungsgemäß durchgeführt.</label>${dishes.map((dish,index) => `<label class="check"><input type="checkbox" name="dish${index}" required>${dish}</label>`).join('')}<label class="check"><input type="checkbox" name="teardownOk" required>Abbau wurde nach der Anleitung durchgeführt.</label><label>Bemerkungen / Schäden</label><textarea name="notes" placeholder="Optional: Fehlmengen, Schäden oder Besonderheiten"></textarea></section><section class="card"><h2>Unterschrift</h2><p class="muted">Bitte mit dem Finger unterschreiben.</p><canvas id="signature" class="signature"></canvas><div class="actions"><button class="secondary" type="button" id="clear-signature">Unterschrift löschen</button></div></section><section class="notice">Es werden keine Dienste gespeichert. Die PDF wird nur auf diesem Handy erzeugt und kann anschließend über die Teilen-Funktion per E-Mail versendet werden.</section><div class="actions"><button class="primary" type="submit">PDF erzeugen und teilen</button></div></form></div>`;
  addHelperMenu();
  const form = $('#service');
  form.elements.date.value = new Date().toISOString().slice(0, 10);
  form.elements.time.value = new Date().toTimeString().slice(0, 5);
  initSignature();
  $('#clear-signature').addEventListener('click', clearSignature);
  form.addEventListener('submit', createAndSharePdf);
}

function showAdminLogin() {
  $('#app').innerHTML = `<div class="shell admin"><header class="brand"><div class="cross">✚</div><div><h1>DRK · Spülmobil</h1><small>Bereich für Beauftragte</small></div></header><div class="actions"><button class="secondary" type="button" onclick="renderRoleChoice()">← Bereich wechseln</button></div><section class="card hero"><h2>Anmeldung</h2><p class="muted">Dieser Bereich ist für den Spülmobilbeauftragten bestimmt.</p><form id="admin-login"><label>E-Mail-Adresse</label><input type="email" required autocomplete="username" placeholder="name@beispiel.de"><label>Passwort</label><input type="password" required autocomplete="current-password"><div class="actions"><button class="primary" type="submit">Anmelden</button></div></form></section></div>`;
  $('#admin-login').addEventListener('submit', async event => { event.preventDefault(); if (!supabaseClient) return alert('Die Datenbankverbindung konnte nicht geladen werden. Bitte die Seite online öffnen.'); const f = event.currentTarget.elements; const { error } = await supabaseClient.auth.signInWithPassword({ email: f[0].value, password: f[1].value }); if (error) return alert('Anmeldung fehlgeschlagen.'); showAdminOverview(); });
}

function addHelperMenu() {
  document.querySelector('.brand').insertAdjacentHTML('afterend', '<nav class="menu"><button class="menu-item active" type="button" onclick="showHelper()">Dienst anlegen</button><button class="menu-item" type="button" onclick="showDocuments()">Dokumente</button></nav>');
}

function showDocuments() {
  $('#app').innerHTML = `<div class="shell helper"><header class="brand"><div class="cross">✚</div><div><h1>DRK · Spülmobil</h1><small>Dokumente</small></div></header><nav class="menu"><button class="menu-item" type="button" onclick="showHelper()">Dienst anlegen</button><button class="menu-item active" type="button" onclick="showDocuments()">Dokumente</button></nav><section class="card hero"><h2>Anleitungen</h2><p class="muted">Die folgenden Anleitungen sind auch während des Einsatzes verfügbar.</p></section><section class="card"><h2>Aufbauanleitung</h2><ol class="steps">${setup.map(step => `<li>${step}</li>`).join('')}</ol></section><section class="card"><h2>Abbauanleitung</h2><ol class="steps">${teardown.map(step => `<li>${step}</li>`).join('')}</ol></section><div class="actions"><button class="secondary" type="button" onclick="renderRoleChoice()">← Bereich wechseln</button></div></div>`;
}

function showAdminOverview() {
  $('#app').innerHTML = `<div class="shell admin"><header class="brand"><div class="cross">✚</div><div><h1>DRK · Spülmobil</h1><small>Beauftragtenübersicht</small></div></header><nav class="menu"><button class="menu-item active" type="button" onclick="showAdminOverview()">Übersicht</button><button class="menu-item" type="button" onclick="showAdminOverview()">Dienstmanager</button><button class="menu-item" type="button" onclick="showDocuments()">Dokumente</button></nav><section class="notice">Vorschau: Die Passwortprüfung wird erst mit einem sicheren Serverdienst aktiviert. Es werden weiterhin keine Dienste dauerhaft gespeichert.</section><section class="card hero"><h2>Spülmobile</h2><p class="muted">Schnellübersicht für die Beauftragung.</p><div class="grid two"><article class="entry"><span class="status done">Verfügbar</span><p><strong>Spülmobil 1</strong></p><p class="muted">Aufbau- und Abbauanleitung hinterlegt</p></article><article class="entry"><span class="status done">Verfügbar</span><p><strong>Spülmobil 2</strong></p><p class="muted">Aufbau- und Abbauanleitung hinterlegt</p></article></div></section><section class="card"><h2>Dienstmanager</h2><p class="muted">Hier erscheinen abgeschlossene Dienste, sobald eine Speicherung freigegeben und eingerichtet wird.</p><div class="entry"><span class="status">Keine gespeicherten Dienste</span><p>Die aktuelle datensparsame Version erzeugt nur die PDF auf dem Helfer-Handy und speichert keine Diensthistorie.</p></div></section><section class="card"><h2>Dokumente</h2><p class="muted">Aufbau- und Abbauanleitungen stehen im Menü „Dokumente“ bereit.</p><div class="actions"><button class="secondary" type="button" onclick="showDocuments()">Dokumente öffnen</button><button class="secondary" type="button" onclick="renderRoleChoice()">Abmelden</button></div></section></div>`;
}

function initSignature() {
  signatureCanvas = $('#signature');
  const context = signatureCanvas.getContext('2d');
  const rect = signatureCanvas.getBoundingClientRect();
  const scale = window.devicePixelRatio || 1;
  signatureCanvas.width = rect.width * scale;
  signatureCanvas.height = rect.height * scale;
  context.scale(scale, scale);
  let drawing = false, lastPoint;
  const point = event => { const box = signatureCanvas.getBoundingClientRect(); return { x: event.clientX - box.left, y: event.clientY - box.top }; };
  signatureCanvas.addEventListener('pointerdown', event => { drawing = true; lastPoint = point(event); signatureCanvas.setPointerCapture(event.pointerId); });
  signatureCanvas.addEventListener('pointermove', event => { if (!drawing) return; const currentPoint = point(event); context.beginPath(); context.moveTo(lastPoint.x, lastPoint.y); context.lineTo(currentPoint.x, currentPoint.y); context.lineWidth = 2; context.lineCap = 'round'; context.strokeStyle = '#17212b'; context.stroke(); lastPoint = currentPoint; });
  signatureCanvas.addEventListener('pointerup', () => { drawing = false; });
  signatureCanvas.addEventListener('pointercancel', () => { drawing = false; });
}

function clearSignature() { signatureCanvas.getContext('2d').clearRect(0, 0, signatureCanvas.width, signatureCanvas.height); }
function hasSignature() { return signatureCanvas.getContext('2d').getImageData(0, 0, signatureCanvas.width, signatureCanvas.height).data.some(value => value !== 0); }

async function createAndSharePdf(event) {
  event.preventDefault();
  if (!supabaseClient) return alert('Die Datenbankverbindung konnte nicht geladen werden. Bitte die Seite online öffnen.');
  if (!hasSignature()) return alert('Bitte unterschreiben Sie vor dem Abschließen.');
  const form = new FormData(event.currentTarget);
  const report = { mobile: mobiles[form.get('mobile')], date: form.get('date'), time: form.get('time'), name: form.get('name'), secondPerson: form.get('secondPerson') || 'Keine', event: form.get('event'), notes: form.get('notes') || 'Keine' };
  const { error } = await supabaseClient.from('spuel_dienste').insert({ spuelmobil: form.get('mobile'), dienst_datum: report.date, dienst_zeit: report.time, verantwortliche_person: report.name, zweite_person: form.get('secondPerson') || null, einsatzort: report.event, kontrollen: { aufbau: true, geschirr: true, abbau: true }, bemerkungen: form.get('notes') || null, unterschrift: signatureCanvas.toDataURL('image/png') });
  if (error) return alert(`Dienst konnte nicht gespeichert werden: ${error.message}`);
  alert('Dienst gespeichert. Die PDF wird im Manager exportiert.');
  showHelperWelcome();
  return;
  const { jsPDF } = window.jspdf;
  const documentPdf = new jsPDF();
  documentPdf.setFontSize(18); documentPdf.text('DRK Spülmobil – Dienstnachweis', 14, 18); documentPdf.setFontSize(11);
  let y = 32;
  [['Spülmobil', report.mobile],['Datum / Uhrzeit', `${report.date} · ${report.time} Uhr`],['Verantwortlich', report.name],['Zweite Person', report.secondPerson],['Einsatz', report.event],['Aufbau und Betrieb', 'Bestätigt'],['Geschirrkontrolle', 'Vollständig bestätigt'],['Abbau', 'Bestätigt'],['Bemerkungen', report.notes]].forEach(([label,value]) => { documentPdf.setFont(undefined,'bold'); documentPdf.text(`${label}:`,14,y); documentPdf.setFont(undefined,'normal'); documentPdf.text(String(value),60,y,{maxWidth:130}); y += Math.max(10, Math.ceil(documentPdf.getTextDimensions(String(value),{maxWidth:130}).h)+3); });
  documentPdf.text('Unterschrift:',14,y+6); documentPdf.addImage(signatureCanvas.toDataURL('image/png'),'PNG',14,y+10,75,35); documentPdf.setFontSize(8); documentPdf.text(`Erstellt am ${new Date().toLocaleString('de-DE')}`,14,285);
  const filename = `DRK-Spuelmobil-${report.date}-${report.name.replace(/\s+/g,'-')}.pdf`;
  const pdfFile = new File([documentPdf.output('blob')], filename, { type: 'application/pdf' });
  if (navigator.canShare && navigator.canShare({ files: [pdfFile] })) {
    try { await navigator.share({ files: [pdfFile], title: 'DRK Spülmobil – Dienstnachweis', text: 'Bitte diese PDF an tmattes04@gmail.com versenden.' }); }
    catch (error) { if (error.name !== 'AbortError') documentPdf.save(filename); }
  } else { documentPdf.save(filename); alert('Die PDF wurde heruntergeladen. Bitte als Anhang an tmattes04@gmail.com senden.'); }
}

renderRoleChoice();
