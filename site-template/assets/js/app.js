/* assets/js/app.js */
(function () {
  const C = window.SITE_CONFIG;
  if (!C) {
    console.error("SITE_CONFIG introuvable. Vérifie assets/js/config.js");
    return;
  }

  // Helpers
  const $ = (id) => document.getElementById(id);

  // Apply theme colors -> CSS variables (optionnel mais utile)
  if (C.theme) {
    const r = document.documentElement.style;
    if (C.theme.background) r.setProperty("--bg-main", C.theme.background);
    if (C.theme.cardBg) r.setProperty("--bg-card", C.theme.cardBg);
    if (C.theme.text) r.setProperty("--text", C.theme.text);
    if (C.theme.muted) r.setProperty("--muted", C.theme.muted);
    if (C.theme.primary) r.setProperty("--gold", C.theme.primary);
    if (C.theme.primaryHover) r.setProperty("--gold-hover", C.theme.primaryHover);
  }

  // Brand / footer
  $("footerBrand").textContent = C.brand?.name || "Entreprise";
  $("year").textContent = new Date().getFullYear();

  // Logo: image si définie, sinon texte
  const logoImg = $("logoImg");
  const logoText = $("logoText");
  if (C.brand?.logoImage) {
    logoImg.src = C.brand.logoImage;
    logoImg.alt = `Logo ${C.brand.name || ""}`.trim();
    logoImg.classList.remove("hidden");
    if (logoText) logoText.classList.add("hidden");
  } else {
    if (logoText) {
      logoText.textContent = C.brand?.logoText || "LOGO";
      logoText.classList.remove("hidden");
    }
    logoImg.classList.add("hidden");
  }

  // Hero content
  $("heroTitle").textContent = C.content?.hero?.title || "Votre Expert";
  $("heroSubtitle").textContent = C.content?.hero?.subtitle || "Professionnel & Réactif";
  $("heroServicesBtn").textContent = C.content?.hero?.ctaPrimaryText || "Appeler";
  if ($("heroCtaNote")) $("heroCtaNote").textContent = C.content?.hero?.ctaNote || "Réponse rapide • Devis gratuit";

  // Hero background image(s): supports single image or slideshow
  const heroBg = $("heroBg");
  const heroImages = Array.isArray(C.content?.hero?.heroImages) && C.content.hero.heroImages.length
    ? C.content.hero.heroImages
    : [C.content?.hero?.heroImage || "assets/images/hero.jpg"];
  const introLogoCfg = C.content?.hero?.introLogo || {};
  const introLogoEnabled = Boolean(introLogoCfg.enabled && introLogoCfg.image);
  const introLogoImage = introLogoCfg.image || "";
  const introLogoDuration = Math.max(1200, Number(introLogoCfg.durationMs) || 2800);

  const applyHeroZoomMode = (index) => {
    heroBg.classList.remove("is-zooming", "is-zooming-out");
    if (index % 2 === 1) {
      heroBg.classList.add("is-zooming-out");
    } else {
      heroBg.classList.add("is-zooming");
    }
  };

  const showHeroSlide = (src, opts = {}) => {
    const { intro = false, zoomIndex = 0 } = opts;
    heroBg.style.backgroundImage = `url("${src}")`;
    heroBg.classList.toggle("hero__bg--logoIntro", intro);
    if (intro) {
      heroBg.classList.remove("is-zooming", "is-zooming-out");
    } else {
      applyHeroZoomMode(zoomIndex);
    }
  };

  const preloaded = new Set();
  const preloadImage = (src) => {
    if (!src || preloaded.has(src)) return;
    preloaded.add(src);
    const img = new Image();
    img.decoding = "async";
    img.src = src;
  };

  const startHeroSlideshow = (startIndex = 0) => {
    let heroIndex = startIndex;
    const prefersReducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fadeDurationMs = 900;

    showHeroSlide(heroImages[heroIndex], { zoomIndex: heroIndex });
    preloadImage(heroImages[(heroIndex + 1) % heroImages.length]);

    if (heroImages.length <= 1) return;

    window.setInterval(() => {
      if (document.hidden) return;
      heroIndex = (heroIndex + 1) % heroImages.length;
      const nextImage = heroImages[heroIndex];

      if (prefersReducedMotion) {
        showHeroSlide(nextImage, { zoomIndex: heroIndex });
        preloadImage(heroImages[(heroIndex + 1) % heroImages.length]);
        return;
      }

      heroBg.style.setProperty("--hero-next-image", `url("${nextImage}")`);
      heroBg.classList.add("is-crossfading");
      window.setTimeout(() => {
        showHeroSlide(nextImage, { zoomIndex: heroIndex });
        heroBg.classList.remove("is-crossfading");
        heroBg.style.setProperty("--hero-next-image", "none");
        // Restart zoom animation for each slide, with mode based on image.
        void heroBg.offsetWidth;
        applyHeroZoomMode(heroIndex);
        preloadImage(heroImages[(heroIndex + 1) % heroImages.length]);
      }, fadeDurationMs);
    }, 10000);
  };

  if (introLogoEnabled) {
    showHeroSlide(introLogoImage, { intro: true });
    preloadImage(heroImages[0]);
    window.setTimeout(() => startHeroSlideshow(0), introLogoDuration);
  } else {
    startHeroSlideshow(0);
  }

  // Contact text
  const city = C.contact?.city || "";
  const addressLine = C.contact?.addressLine || "";
  const fullAddress = [addressLine, city].filter(Boolean).join(", ");

  if ($("cityBadge")) $("cityBadge").textContent = city || "—";
  if ($("addressBadge")) $("addressBadge").textContent = fullAddress || "—";
  $("addressTop").textContent = fullAddress || "—";
  $("addressBottom").textContent = fullAddress || "—";
  if ($("contactAddressSide")) $("contactAddressSide").textContent = fullAddress || "—";

  // Mini map (lazy-loaded for mobile performance)
  const mapQuery = encodeURIComponent(fullAddress || city || (C.brand?.name || "Entreprise"));
  const mapEmbedUrl = `https://www.google.com/maps?q=${mapQuery}&z=15&output=embed`;
  const mapAddressLabel = $("mapAddressLabel");
  const mapFrameWrap = $("mapFrameWrap");
  const miniMapSection = $("miniMap");
  let miniMapLoaded = false;

  if (mapAddressLabel) mapAddressLabel.textContent = fullAddress || city || "Notre adresse";

  const loadMiniMap = () => {
    if (miniMapLoaded || !mapFrameWrap) return;
    mapFrameWrap.innerHTML = `
      <iframe
        id="miniMapFrame"
        class="mapFrame"
        title="Carte de localisation"
        src="${escapeAttr(mapEmbedUrl)}"
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"
        allowfullscreen>
      </iframe>
      <button class="mapActivateBtn" id="mapActivateBtn" type="button" aria-label="Activer la carte">
        Cliquer pour interagir avec la carte
      </button>
    `;
    const mapFrame = $("miniMapFrame");
    const mapActivateBtn = $("mapActivateBtn");
    if (mapFrame) mapFrame.classList.add("mapFrame--locked");
    if (mapActivateBtn && mapFrame) {
      mapActivateBtn.addEventListener("click", () => {
        mapFrame.classList.remove("mapFrame--locked");
        mapActivateBtn.classList.add("hidden");
      });
    }
    miniMapLoaded = true;
  };

  // Load the map preview when section becomes visible (faster feel, still mobile-friendly).
  if (miniMapSection && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      const entry = entries[0];
      if (!entry?.isIntersecting) return;
      loadMiniMap();
      obs.disconnect();
    }, { threshold: 0.15 });
    observer.observe(miniMapSection);
  } else {
    loadMiniMap();
  }

  const addressTopEl = $("addressTop");
  if (addressTopEl) {
    addressTopEl.addEventListener("click", loadMiniMap, { passive: true });
  }

  // Phone + Email links
  const telHref = C.contact?.phoneE164 ? `tel:${C.contact.phoneE164}` : "#";
  const phoneText = C.contact?.phoneDisplay || "Téléphone";
  const email = C.contact?.email || "";
  $("heroServicesBtn").href = telHref;

  $("phoneLinkTop").href = telHref;
  $("phoneLinkTop").textContent = phoneText;

  $("phoneLinkBottom").href = telHref;
  $("phoneLinkBottom").textContent = phoneText;
  if ($("contactPhoneSide")) {
    $("contactPhoneSide").href = telHref;
    $("contactPhoneSide").textContent = phoneText;
  }
  if ($("contactCallBtnSide")) $("contactCallBtnSide").href = telHref;

  $("stickyCall").href = telHref;
  if ($("headerCallBtn")) $("headerCallBtn").href = telHref;

  const mailHrefTop = email ? `mailto:${email}` : "#";
  $("emailLinkTop").href = mailHrefTop;
  $("emailLinkTop").textContent = email || "Email";

  $("emailLinkBottom").href = mailHrefTop;
  $("emailLinkBottom").textContent = email || "Email";
  if ($("contactEmailSide")) {
    $("contactEmailSide").href = mailHrefTop;
    $("contactEmailSide").textContent = email || "Email";
  }

  // Contact note
  $("contactNote").textContent = C.content?.contactSection?.note || "Réponse rapide selon disponibilité.";

  // Scroll to form buttons
  const scrollToForm = () => {
    const el = $("formBox");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  $("scrollToFormBtn").addEventListener("click", scrollToForm);
  $("stickyQuote").addEventListener("click", scrollToForm);
  if ($("headerQuoteBtn")) $("headerQuoteBtn").addEventListener("click", scrollToForm);

  // Services
  const servicesRow = $("servicesRow");
  const services = C.content?.services || [];
  servicesRow.innerHTML = services.map((s, i) => {
    const isPhotoTile = Boolean(s.photoTile);
    const photoTileStyle = isPhotoTile
      ? ` style="--photo-scale:${Number.isFinite(Number(s.photoScale)) ? Number(s.photoScale) : 1.01};--photo-pos-x:${escapeAttr(s.photoPositionX || "50%")};--photo-pos-y:${escapeAttr(s.photoPositionY || "50%")};"`
      : "";
    return `
      <div class="serviceItem ${isPhotoTile ? "serviceItem--photo" : ""} ${isPhotoTile && s.photoFit === "contain" ? "serviceItem--photoContain" : ""}"${photoTileStyle}>
        ${s.icon ? `<img src="${escapeAttr(s.icon)}" alt="${escapeAttr(s.alt || s.title || `Service ${i+1}`)}" loading="lazy" decoding="async" fetchpriority="low" ${isPhotoTile ? "" : 'aria-hidden="true"'} />` : ""}
        ${isPhotoTile ? "" : `<span>${escapeHtml(s.title || `Service ${i+1}`)}</span>`}
      </div>
    `;
  }).join("");
  const serviceCards = [...servicesRow.querySelectorAll(".serviceItem")];
  if ("IntersectionObserver" in window && serviceCards.length) {
    serviceCards.forEach((card) => card.classList.add("is-reveal-ready"));
    const revealObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const index = serviceCards.indexOf(el);
        window.setTimeout(() => {
          el.classList.add("is-visible");
          el.classList.remove("is-reveal-ready");
        }, Math.max(0, index) * 120);
        obs.unobserve(el);
      });
    }, { threshold: 0.18, rootMargin: "0px 0px -8% 0px" });
    serviceCards.forEach((card) => revealObserver.observe(card));
  }

  // Gallery
  $("galleryTitle").textContent = C.content?.gallery?.title || "Nos Réalisations";
  $("galleryMoreBtn").textContent = C.content?.gallery?.moreButtonText || "Voir plus";

  const galleryGrid = $("galleryGrid");
  const galleryItems = C.content?.gallery?.items || [];
  galleryGrid.innerHTML = galleryItems.map((g) => `
    <figure class="galleryItem">
      <img src="${escapeAttr(g.image)}" alt="${escapeAttr(g.alt || "Réalisation")}" loading="lazy" decoding="async" fetchpriority="low" />
      <figcaption class="galleryItem__caption">${escapeHtml(g.caption || "")}</figcaption>
    </figure>
  `).join("");
  const galleryLightbox = $("galleryLightbox");
  const galleryLightboxImg = $("galleryLightboxImg");
  const galleryLightboxClose = $("galleryLightboxClose");
  const openLightbox = (src, alt) => {
    if (!galleryLightbox || !galleryLightboxImg) return;
    galleryLightboxImg.src = src;
    galleryLightboxImg.alt = alt || "Agrandissement de la réalisation";
    galleryLightbox.classList.remove("hidden");
    document.body.classList.add("lightbox-open");
  };
  const closeLightbox = () => {
    if (!galleryLightbox || !galleryLightboxImg) return;
    galleryLightbox.classList.add("hidden");
    galleryLightboxImg.src = "";
    galleryLightboxImg.alt = "";
    document.body.classList.remove("lightbox-open");
  };
  galleryGrid.addEventListener("click", (e) => {
    const img = e.target.closest(".galleryItem img");
    if (!img) return;
    openLightbox(img.currentSrc || img.src, img.alt);
  });
  if (galleryLightboxClose) galleryLightboxClose.addEventListener("click", closeLightbox);
  if (galleryLightbox) {
    galleryLightbox.addEventListener("click", (e) => {
      if (e.target === galleryLightbox) closeLightbox();
    });
  }
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLightbox();
  });

  // Testimonials slider
  $("testimonialsTitle").textContent = C.content?.testimonials?.title || "Avis de Nos Clients";
  const testimonialCard = $("testimonialCard");
  const testimonialItems = C.content?.testimonials?.items || [];
  const getInitials = (name) => {
    const words = String(name || "")
      .trim()
      .split(/\s+/)
      .filter(Boolean);
    if (!words.length) return "CL";
    const first = words[0]?.[0] || "";
    const second = words.length > 1 ? (words[words.length - 1]?.[0] || "") : "";
    return `${first}${second}`.toUpperCase();
  };

  if (testimonialItems.length <= 1) {
    const t = testimonialItems[0];
    testimonialCard.innerHTML = t ? `
      <div class="testimonialSlide">
        <div class="avatar">
          ${t.avatar
            ? `<img src="${escapeAttr(t.avatar)}" alt="" aria-hidden="true" />`
            : `<span class="avatar__initials" aria-hidden="true">${escapeHtml(getInitials(t.name || "Client"))}</span>`}
        </div>
        <div>
          <div class="stars">${"★".repeat(Math.min(5, Math.max(1, Number(t.rating || 5))))}</div>
          <p class="quote">“${escapeHtml(t.text || "")}”</p>
          <p class="who">— ${escapeHtml(t.name || "Client")}</p>
        </div>
      </div>
    ` : `
      <div class="testimonialSlide">
        <div>
          <div class="stars">★★★★★</div>
          <p class="quote">“Service impeccable ! Je recommande.”</p>
          <p class="who">— Client</p>
        </div>
      </div>
    `;
  } else {
    const slides = [...testimonialItems, testimonialItems[0]];
    testimonialCard.innerHTML = `
      <div class="testimonialSliderViewport">
        <div class="testimonialSliderTrack" id="testimonialTrack">
          ${slides.map((t) => `
            <article class="testimonialSlide">
              <div class="avatar">
                ${t.avatar
                  ? `<img src="${escapeAttr(t.avatar)}" alt="" aria-hidden="true" />`
                  : `<span class="avatar__initials" aria-hidden="true">${escapeHtml(getInitials(t.name || "Client"))}</span>`}
              </div>
              <div>
                <div class="stars">${"★".repeat(Math.min(5, Math.max(1, Number(t.rating || 5))))}</div>
                <p class="quote">“${escapeHtml(t.text || "")}”</p>
                <p class="who">— ${escapeHtml(t.name || "Client")}</p>
              </div>
            </article>
          `).join("")}
        </div>
      </div>
      <div class="testimonialProgress" aria-hidden="true">
        <span class="testimonialProgress__bar" id="testimonialProgressBar"></span>
      </div>
    `;

    const track = $("testimonialTrack");
    const progressBar = $("testimonialProgressBar");
    const slideCount = testimonialItems.length;
    let slideIndex = 0;

    const setSlide = () => {
      track.style.transform = `translateX(-${slideIndex * 100}%)`;
    };
    const restartProgress = () => {
      if (!progressBar) return;
      progressBar.classList.remove("is-running");
      void progressBar.offsetWidth;
      progressBar.classList.add("is-running");
    };

    restartProgress();

    const testimonialTimer = window.setInterval(() => {
      slideIndex += 1;
      setSlide();
      restartProgress();
    }, 5000);

    track.addEventListener("transitionend", () => {
      if (slideIndex !== slideCount) return;
      track.classList.add("is-resetting");
      slideIndex = 0;
      setSlide();
      window.setTimeout(() => {
        track.classList.remove("is-resetting");
      }, 30);
    });

    window.addEventListener("beforeunload", () => window.clearInterval(testimonialTimer), { once: true });
  }

  // Form: set name + redirect + labels + options
  const form = $("contactForm");
  const formName = C.form?.name || "demande";
  form.setAttribute("name", formName);
  form.querySelector("input[name='form-name']").value = formName;

  const formProvider = String(C.form?.provider || "netlify").toLowerCase();
  const formEndpoint = String(C.form?.endpoint || "").trim();
  const formEmailSubject = C.form?.emailSubject || "Message site internet - Nouveau devis";
  const success = C.form?.successRedirect || "/merci.html";
  form.setAttribute("action", success);
  const isNetlifyRuntime = /\.netlify\.app$/i.test(window.location.hostname);

  // Avoid POST errors on non-Netlify hosting when Netlify Forms is still configured.
  if (formProvider === "netlify" && !isNetlifyRuntime) {
    form.removeAttribute("data-netlify");
    form.removeAttribute("netlify-honeypot");
    const formNameInput = form.querySelector("input[name='form-name']");
    if (formNameInput) formNameInput.disabled = true;
    const botFieldInput = form.querySelector("input[name='bot-field']");
    if (botFieldInput) botFieldInput.disabled = true;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      window.location.href = success;
    });
  }

  if (formProvider === "formspree" && formEndpoint) {
    form.setAttribute("action", formEndpoint);
    form.removeAttribute("data-netlify");
    form.removeAttribute("netlify-honeypot");

    const formNameInput = form.querySelector("input[name='form-name']");
    if (formNameInput) formNameInput.disabled = true;
    const botFieldInput = form.querySelector("input[name='bot-field']");
    if (botFieldInput) botFieldInput.disabled = true;

    let subjectInput = form.querySelector("input[name='_subject']");
    if (!subjectInput) {
      subjectInput = document.createElement("input");
      subjectInput.type = "hidden";
      subjectInput.name = "_subject";
      form.appendChild(subjectInput);
    }
    subjectInput.value = formEmailSubject;

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const data = new FormData(form);
      try {
        const res = await fetch(formEndpoint, {
          method: "POST",
          body: data,
          headers: { "Accept": "application/json" }
        });
        if (res.ok) {
          window.location.href = success;
          return;
        }
      } catch (err) {
        // no-op: fallback below
      }
      // Fallback: standard submit if API response fails.
      HTMLFormElement.prototype.submit.call(form);
    });
  }

  const labels = C.form?.labels || {};
  if ($("labelName")) $("labelName").textContent = labels.name || "Votre Nom";
  if ($("labelPhone")) $("labelPhone").textContent = labels.phone || "Téléphone";
  if ($("labelEmail")) $("labelEmail").textContent = labels.email || "Votre Email";
  if ($("labelNeed")) $("labelNeed").textContent = labels.need || "Votre demande";
  if ($("labelMessage")) $("labelMessage").textContent = labels.message || "Message";
  if ($("submitBtn")) $("submitBtn").textContent = labels.submit || "Envoyer";

  const needInput = $("needInput");
  const needChoices = $("needChoices");
  const opts = C.form?.needOptions || ["Demande de devis", "Demande de rappel", "Renseignement", "Autre"];
  const setNeedValue = (value) => {
    if (needInput) needInput.value = value;
    if (!needChoices) return;
    [...needChoices.querySelectorAll(".needChoice")].forEach((btn) => {
      const active = btn.dataset.value === value;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-checked", active ? "true" : "false");
    });
  };

  if (needChoices) {
    needChoices.innerHTML = opts.map((o) => `
      <button type="button" class="needChoice" role="radio" aria-checked="false" data-value="${escapeAttr(o)}">
        ${escapeHtml(o)}
      </button>
    `).join("");

    needChoices.addEventListener("click", (e) => {
      const btn = e.target.closest(".needChoice");
      if (!btn) return;
      setNeedValue(btn.dataset.value || "");
    });
  }

  setNeedValue(opts[0] || "Demande de devis");

  // Sticky CTA label
  if (C.stickyCta?.callText) $("stickyCall").textContent = C.stickyCta.callText;
  if (C.stickyCta?.quoteText) $("stickyQuote").textContent = C.stickyCta.quoteText;
  if (C.stickyCta?.callText && $("headerCallBtn")) $("headerCallBtn").textContent = C.stickyCta.callText;
  if (C.stickyCta?.quoteText && $("headerQuoteBtn")) $("headerQuoteBtn").textContent = C.stickyCta.quoteText;

  // SEO injection from config (title/description/canonical/og)
  applySEO(C.seo);
  applyStructuredData(C);

  function applySEO(seo) {
    if (!seo) return;
    if (seo.title) document.title = seo.title;

    setMeta("meta[name='description']", seo.description);
    setAttr("link[rel='canonical']", "href", seo.url);

    setMeta("meta[property='og:title']", seo.title);
    setMeta("meta[property='og:description']", seo.description);
    setMeta("meta[property='og:image']", seo.ogImage);

    // keep twitter:card as is; optionally add title/desc/image
    setMeta("meta[name='twitter:title']", seo.title);
    setMeta("meta[name='twitter:description']", seo.description);
    setMeta("meta[name='twitter:image']", seo.ogImage);

    function setMeta(selector, value) {
      if (!value) return;
      const el = document.querySelector(selector);
      if (el) el.setAttribute("content", value);
      else {
        // create if missing
        const m = document.createElement("meta");
        if (selector.includes("property='")) {
          const prop = selector.match(/property='([^']+)'/)?.[1];
          if (prop) m.setAttribute("property", prop);
        } else if (selector.includes("name='")) {
          const name = selector.match(/name='([^']+)'/)?.[1];
          if (name) m.setAttribute("name", name);
        }
        m.setAttribute("content", value);
        document.head.appendChild(m);
      }
    }

    function setAttr(selector, attr, value) {
      if (!value) return;
      const el = document.querySelector(selector);
      if (el) el.setAttribute(attr, value);
    }
  }

  function applyStructuredData(cfg) {
    const seo = cfg?.seo || {};
    const contact = cfg?.contact || {};
    const brand = cfg?.brand || {};
    const serviceAreas = Array.isArray(contact.serviceAreas) ? contact.serviceAreas.filter(Boolean) : [];
    const serviceTypes = Array.isArray(seo.serviceTypes) ? seo.serviceTypes.filter(Boolean) : [];

    const data = {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": brand.name || "Entreprise locale",
      "description": seo.description || "",
      "url": seo.url || window.location.origin,
      "telephone": contact.phoneE164 || "",
      "email": contact.email || "",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": contact.addressLine || "",
        "addressLocality": contact.city || "",
        "addressCountry": "FR"
      },
      "areaServed": serviceAreas.map((cityName) => ({
        "@type": "City",
        "name": cityName
      })),
      "serviceType": serviceTypes
    };

    const clean = (obj) => JSON.parse(JSON.stringify(obj, (_, value) => {
      if (Array.isArray(value)) return value.filter(Boolean);
      return value;
    }));

    let script = document.getElementById("localBusinessJsonLd");
    if (!script) {
      script = document.createElement("script");
      script.type = "application/ld+json";
      script.id = "localBusinessJsonLd";
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(clean(data));
  }

  function escapeHtml(str) {
    return String(str ?? "").replace(/[&<>"']/g, (m) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
    }[m]));
  }

  function escapeAttr(str) {
    // minimal attribute escaping
    return String(str ?? "").replace(/"/g, "&quot;");
  }
})();

