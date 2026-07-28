(() => {
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const menuButton = $(".menu-toggle");
  const menu = $("#primary-nav");
  const closeMenu = () => { if (!menuButton || !menu) return; menu.classList.remove("open"); menuButton.setAttribute("aria-expanded","false"); document.body.classList.remove("menu-open"); };
  menuButton?.addEventListener("click", () => { const open = menuButton.getAttribute("aria-expanded") !== "true"; menuButton.setAttribute("aria-expanded", String(open)); menu.classList.toggle("open", open); document.body.classList.toggle("menu-open", open); });
  $$("#primary-nav a").forEach(a => a.addEventListener("click", closeMenu));

  const progress = $(".scroll-progress span");
  const topButton = $(".back-top");
  const onScroll = () => { const max = document.documentElement.scrollHeight - innerHeight; if (progress) progress.style.width = max > 0 ? Math.min(100, scrollY / max * 100) + "%" : "0"; topButton?.classList.toggle("visible", scrollY > 700); };
  addEventListener("scroll", onScroll, { passive: true }); onScroll();
  topButton?.addEventListener("click", () => scrollTo({ top: 0, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" }));

  const observer = "IntersectionObserver" in window ? new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("visible"); observer.unobserve(e.target); } }), { threshold: .12 }) : null;
  $$(".reveal").forEach(el => observer ? observer.observe(el) : el.classList.add("visible"));

  $$(".accordion-item button").forEach(button => button.addEventListener("click", () => { const panel = document.getElementById(button.getAttribute("aria-controls")); const open = button.getAttribute("aria-expanded") === "true"; button.setAttribute("aria-expanded", String(!open)); if (panel) panel.hidden = open; }));

  const zoneText = { entry: "Entry, identification checks and first-time wayfinding.", machines: "Physical machine areas with clear circulation and staff support.", tables: "Hosted table zones managed on location.", dining: "A separate room for food, alcohol-free drinks and conversation.", support: "Accessibility guidance, breaks and responsible gaming information." };
  $$("[data-zone]").forEach(button => button.addEventListener("click", () => { $$("[data-zone]").forEach(b => b.classList.remove("active")); $$("[data-zone-panel]").forEach(z => z.classList.remove("active")); button.classList.add("active"); const key = button.dataset.zone; $("[data-zone-panel='" + key + "']")?.classList.add("active"); const copy = $("#zone-copy"); if (copy) copy.textContent = zoneText[key]; }));
  $("[data-zone='entry']")?.click();

  $$("[data-event-filter]").forEach(button => button.addEventListener("click", () => { $$("[data-event-filter]").forEach(b => b.classList.remove("active")); button.classList.add("active"); const filter = button.dataset.eventFilter; $$("[data-event-type]").forEach(card => card.hidden = filter !== "all" && card.dataset.eventType !== filter); }));

  const cookieBanner = $(".cookie-banner");
  const cookieModal = $("#cookie-modal");
  const pref = $("#preference-cookie");
  let lastFocus = null;
  const readChoice = () => { try { return JSON.parse(localStorage.getItem("venueCookieChoice") || "null"); } catch { return null; } };
  const saveChoice = choice => { localStorage.setItem("venueCookieChoice", JSON.stringify(choice)); if (cookieBanner) cookieBanner.hidden = true; if (cookieModal) cookieModal.hidden = true; document.body.classList.remove("menu-open"); lastFocus?.focus?.(); };
  if (!readChoice() && cookieBanner) cookieBanner.hidden = false;
  $("[data-cookie='accept']")?.addEventListener("click", () => saveChoice({ essential: true, preferences: true, updated: new Date().toISOString() }));
  $("[data-cookie='reject']")?.addEventListener("click", () => saveChoice({ essential: true, preferences: false, updated: new Date().toISOString() }));
  const openPreferences = e => { lastFocus = e?.currentTarget || document.activeElement; const choice = readChoice(); if (pref) pref.checked = Boolean(choice?.preferences); if (cookieModal) cookieModal.hidden = false; document.body.classList.add("menu-open"); $(".modal-close")?.focus(); };
  $("[data-cookie='manage']")?.addEventListener("click", openPreferences);
  $$("[data-cookie-open]").forEach(b => b.addEventListener("click", openPreferences));
  $("[data-cookie='save']")?.addEventListener("click", () => saveChoice({ essential: true, preferences: Boolean(pref?.checked), updated: new Date().toISOString() }));
  const closeModal = () => { if (cookieModal) cookieModal.hidden = true; document.body.classList.remove("menu-open"); lastFocus?.focus?.(); };
  $(".modal-close")?.addEventListener("click", closeModal);
  cookieModal?.addEventListener("click", e => { if (e.target === cookieModal) closeModal(); });

  const planner = $("#visit-planner");
  planner?.addEventListener("submit", e => { e.preventDefault(); const status = $(".form-status", planner); const form = new FormData(planner); if (!form.get("confirm")) { if (status) status.textContent = "Confirm that this is a planning checklist, not a reservation."; planner.querySelector("[name=confirm]")?.focus(); return; } const topics = form.getAll("topic"); if (!topics.length) { if (status) status.textContent = "Select at least one planning topic."; planner.querySelector("[name=topic]")?.focus(); return; } const lines = ["Spin Casino — personal visit checklist", "Country: New Zealand", "Preferred date: " + (form.get("date") || "Not selected"), "", ...topics.map((x,i) => (i+1) + ". " + x), "", "Confirm the physical address, opening hours and service availability directly with the verified venue operator before travelling.", "This file is not a reservation or entry confirmation."]; const blob = new Blob([lines.join("\n")], { type: "text/plain" }); const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "spin-nz-visit-checklist.txt"; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000); if (status) status.textContent = "Your private checklist has been downloaded. No information was sent."; });

  document.addEventListener("keydown", e => { if (e.key === "Escape") { closeMenu(); if (cookieModal && !cookieModal.hidden) closeModal(); } if (e.key === "Tab" && cookieModal && !cookieModal.hidden) { const focusable = $$("button,input,[href]", cookieModal).filter(x => !x.disabled); if (!focusable.length) return; const first = focusable[0], last = focusable.at(-1); if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); } else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); } } });
})();