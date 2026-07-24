/* =============================================================
   MindPulse AI — Application Logic
   
   Responsibilities:
   • Navbar scroll behavior & mobile toggle
   • Range slider readout + track-fill updates
   • Field-level validation (on blur & input)
   • Form submission → API call → result rendering
   • Score counter + Pulse Ring animation
   • Intersection Observer for card entrance
   • Retake flow
   ============================================================= */

(() => {
  'use strict';

  // -------------------------------------------------
  // Constants
  // -------------------------------------------------
  const API_URL = 'http://127.0.0.1:8000/predict';
  const ANIM_DURATION = 1800;                       // ms for score counter + ring fill
  const CIRCUMFERENCE = 2 * Math.PI * 100;          // ≈ 628.32 (pulse ring radius = 100)

  // Score tiers — color, label, recommendations
  const TIERS = {
    excellent: {
      min: 8.0, color: '#00E676', colorClass: 'green',
      label: 'Excellent Mental Wellbeing',
      sub: 'Your lifestyle habits appear well-balanced.',
      recs: [
        'Keep up the consistent sleep schedule — it is doing you good.',
        'Continue balancing screen time with offline activities.',
        'Share what works for you with a friend who might benefit.',
      ],
    },
    moderate: {
      min: 6.0, color: '#4F8CFF', colorClass: 'blue',
      label: 'Moderate Mental Health',
      sub: 'You are doing okay, but a few adjustments could help.',
      recs: [
        'Try reducing screen time by 30 minutes before bed.',
        'Add a short walk or stretch break between study sessions.',
        'Set a consistent wind-down routine to improve sleep quality.',
        'Consider scheduling device-free meals.',
      ],
    },
    attention: {
      min: 4.0, color: '#FFB020', colorClass: 'amber',
      label: 'Needs Attention',
      sub: 'Some of your habits may be affecting your wellbeing.',
      recs: [
        'Prioritize getting 7–9 hours of sleep this week.',
        'Limit late-night scrolling — set a hard phone-down time.',
        'Try 20 minutes of light physical activity daily.',
        'Talk to a friend or mentor about how you are feeling.',
      ],
    },
    risk: {
      min: 0, color: '#FF4D6D', colorClass: 'red',
      label: 'High Risk',
      sub: 'Your current lifestyle patterns suggest significant strain.',
      recs: [
        'Consider talking to a counselor or someone you trust.',
        'Prioritize consistent sleep this week — even small improvements help.',
        'Cut back gradually on late-night scrolling.',
        'Try to include at least one short physical activity session per day.',
      ],
    },
  };

  // -------------------------------------------------
  // DOM References
  // -------------------------------------------------
  const $  = (s) => document.querySelector(s);
  const $$ = (s) => document.querySelectorAll(s);

  const navbar      = $('#navbar');
  const navToggle   = $('#nav-toggle');
  const navLinks    = $('#nav-links');
  const predictCard = $('#predict-card');
  const form        = $('#predict-form');
  const btnSubmit   = $('#btn-submit');
  const cardError   = $('#card-error');
  const resultSection = $('#result-section');

  // Sliders (id → { input, readout, fill, step, suffix })
  const SLIDERS = ['usage', 'study', 'activity', 'sleep'].map((key) => ({
    key,
    input:   $(`#field-${key}`),
    readout: $(`#readout-${key}`),
    fill:    $(`#fill-${key}`),
  }));

  // Fields that require validation (non-slider)
  const FIELDS = [
    { id: 'field-age',      errorId: 'error-age',      validate: validateAge },
    { id: 'field-gender',   errorId: 'error-gender',   validate: validateSelect },
    { id: 'field-country',  errorId: 'error-country',  validate: validateCountry },
    { id: 'field-academic', errorId: 'error-academic',  validate: validateSelect },
    { id: 'field-platform', errorId: 'error-platform',  validate: validateSelect },
    { id: 'field-purpose',  errorId: 'error-purpose',   validate: validateSelect },
    { id: 'field-unlocks',  errorId: 'error-unlocks',   validate: validateUnlocks },
    { id: 'field-stress',   errorId: 'error-stress',    validate: validateSelect },
  ];

  // Track which fields the user has interacted with (show errors only after first blur)
  const touched = new Set();

  // -------------------------------------------------
  // 1. Navbar — scroll background + mobile toggle
  // -------------------------------------------------
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  navToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    navToggle.classList.toggle('open', open);
    navToggle.setAttribute('aria-expanded', open);
  });

  // Close mobile nav when a link is clicked
  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  // -------------------------------------------------
  // 2. Intersection Observer — card entrance
  // -------------------------------------------------
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReducedMotion) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);     // one-time
        }
      });
    }, { threshold: 0.15 });
    observer.observe(predictCard);
  } else {
    // If motion is reduced, make card visible immediately
    predictCard.classList.add('visible');
  }

  // -------------------------------------------------
  // 3. Range Sliders — readout + track fill
  // -------------------------------------------------
  function updateSlider(slider) {
    const { input, readout, fill } = slider;
    const val  = parseFloat(input.value);
    const min  = parseFloat(input.min);
    const max  = parseFloat(input.max);
    const pct  = ((val - min) / (max - min)) * 100;

    // Fill bar
    fill.style.width = `${pct}%`;

    // Readout text
    readout.textContent = `${val.toFixed(1)} h`;

    // Position readout above thumb
    // thumb is ~20px wide, track has some padding from edges
    const thumbHalfWidth = 10;
    const trackWidth = input.offsetWidth;
    if (trackWidth > 0) {
      const pos = (pct / 100) * (trackWidth - thumbHalfWidth * 2) + thumbHalfWidth;
      readout.style.left = `${pos}px`;
    }
  }

  SLIDERS.forEach((slider) => {
    // Initial render
    updateSlider(slider);

    // Live update on drag
    slider.input.addEventListener('input', () => updateSlider(slider));
  });

  // Re-position readouts on resize (track width changes)
  window.addEventListener('resize', () => {
    SLIDERS.forEach(updateSlider);
  }, { passive: true });

  // -------------------------------------------------
  // 4. Validation
  // -------------------------------------------------
  function validateAge(el) {
    const v = parseInt(el.value, 10);
    if (isNaN(v) || v < 10 || v > 100) return 'Age must be between 10 and 100';
    return '';
  }

  function validateSelect(el) {
    if (!el.value) return 'Please make a selection';
    return '';
  }

  function validateCountry(el) {
    if (!el.value.trim()) return 'Please enter your country';
    return '';
  }

  function validateUnlocks(el) {
    const v = parseInt(el.value, 10);
    if (isNaN(v) || v < 0) return 'Please enter a positive number';
    return '';
  }

  /** Run validation on a single field; show error only if touched. Returns true if valid. */
  function checkField(field) {
    const el    = $(`#${field.id}`);
    const errEl = $(`#${field.errorId}`);
    const msg   = field.validate(el);
    const valid = msg === '';

    if (touched.has(field.id)) {
      errEl.textContent = msg;
      errEl.classList.toggle('show', !valid);
      el.classList.toggle('invalid', !valid);
    }

    return valid;
  }

  /** Validate all fields (marks all as touched). Returns true if every field is valid. */
  function validateAll() {
    let allValid = true;
    FIELDS.forEach((f) => {
      touched.add(f.id);
      if (!checkField(f)) allValid = false;
    });
    return allValid;
  }

  /** Silently check all validity (without showing errors) to enable/disable submit. */
  function updateSubmitState() {
    const allValid = FIELDS.every((f) => f.validate($(`#${f.id}`)) === '');
    btnSubmit.disabled = !allValid;
  }

  // Attach per-field listeners
  FIELDS.forEach((f) => {
    const el = $(`#${f.id}`);

    el.addEventListener('blur', () => {
      touched.add(f.id);
      checkField(f);
      updateSubmitState();
    });

    el.addEventListener('input', () => {
      if (touched.has(f.id)) checkField(f);
      updateSubmitState();
    });

    // Also handle 'change' for selects
    el.addEventListener('change', () => {
      touched.add(f.id);
      checkField(f);
      updateSubmitState();
    });
  });

  // -------------------------------------------------
  // 5. Form Submission
  // -------------------------------------------------
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Clear previous errors
    cardError.classList.remove('show');
    cardError.textContent = '';

    // Validate
    if (!validateAll()) return;

    // Build request body (keys must match API exactly)
    const body = {
      Age:                    parseInt($('#field-age').value, 10),
      Gender:                 $('#field-gender').value,
      Country:                $('#field-country').value.trim(),
      Academic_Level:         $('#field-academic').value,
      Most_Used_Platform:     $('#field-platform').value,
      Purpose_Of_Use:         $('#field-purpose').value,
      Avg_Daily_Usage_Hours:  parseFloat($('#field-usage').value),
      Daily_Unlocks:          parseInt($('#field-unlocks').value, 10),
      Study_Hours:            parseFloat($('#field-study').value),
      Physical_Activity_Hours:parseFloat($('#field-activity').value),
      Sleep_Hours_Per_Night:  parseFloat($('#field-sleep').value),
      Stress_Level:           $('#field-stress').value,
    };

    // Loading state
    btnSubmit.classList.add('loading');
    btnSubmit.disabled = true;

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errText = await res.text().catch(() => '');
        throw new Error(`Server responded with ${res.status}. ${errText}`);
      }

      const data = await res.json();
      const score = data.predicted_mental_health_score;

      // Show result
      showResult(score, body);

    } catch (err) {
      console.error('Prediction error:', err);
      cardError.textContent = "Couldn't reach the prediction service. Check that the backend is running.";
      cardError.classList.add('show');
    } finally {
      btnSubmit.classList.remove('loading');
      updateSubmitState();
    }
  });

  // -------------------------------------------------
  // 6. Show Result
  // -------------------------------------------------
  function showResult(score, inputData) {
    // Determine tier
    const tier =
      score >= TIERS.excellent.min ? TIERS.excellent :
      score >= TIERS.moderate.min  ? TIERS.moderate :
      score >= TIERS.attention.min ? TIERS.attention :
                                     TIERS.risk;

    // -- Interpretation text + color --
    const interpEl    = $('#interpretation');
    const interpSubEl = $('#interpretation-sub');
    interpEl.textContent = tier.label;
    interpEl.style.color = tier.color;
    interpSubEl.textContent = tier.sub;

    // -- Recommendations --
    const recList = $('#recommendations-list');
    recList.innerHTML = '';
    tier.recs.forEach((text) => {
      const li = document.createElement('li');
      const dot = document.createElement('span');
      dot.className = 'rec-dot';
      dot.style.background = tier.color;
      li.appendChild(dot);
      li.appendChild(document.createTextNode(text));
      recList.appendChild(li);
    });

    // -- Lifestyle summary strip --
    const summaryEl = $('#lifestyle-summary');
    summaryEl.innerHTML = buildSummaryHTML(inputData);

    // -- Show section, scroll into view --
    resultSection.classList.add('show');
    resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

    // -- Animate score counter + pulse ring --
    animateScore(score, tier.color);
  }

  /** Build the small icon + value pairs for the lifestyle strip */
  function buildSummaryHTML(d) {
    const items = [
      { label: 'Age',      value: d.Age },
      { label: 'Country',  value: d.Country },
      { label: 'Study',    value: `${d.Study_Hours}h` },
      { label: 'Sleep',    value: `${d.Sleep_Hours_Per_Night}h` },
      { label: 'Usage',    value: `${d.Avg_Daily_Usage_Hours}h` },
      { label: 'Stress',   value: d.Stress_Level },
    ];
    return items.map((item) => `
      <div class="summary-item">
        <span class="label">${item.label}</span>
        <span class="value">${item.value}</span>
      </div>
    `).join('');
  }

  // -------------------------------------------------
  // 7. Score Counter + Pulse Ring Animation
  // -------------------------------------------------
  function animateScore(targetScore, color) {
    const integerEl = $('#score-integer');
    const decimalEl = $('#score-decimal');
    const ringFill  = $('#pulse-ring-fill');

    // Set ring stroke color
    ringFill.style.stroke = color;

    // Target dashoffset: full - (score/10 * circumference)
    const targetOffset = CIRCUMFERENCE - (Math.min(targetScore, 10) / 10) * CIRCUMFERENCE;

    // Reset
    ringFill.style.transition = 'none';
    ringFill.style.strokeDashoffset = CIRCUMFERENCE;
    integerEl.textContent = '0';
    decimalEl.textContent = '.00';

    // Force reflow
    void ringFill.offsetWidth;

    // Animate ring via CSS transition
    ringFill.style.transition = `stroke-dashoffset ${ANIM_DURATION}ms cubic-bezier(0.16, 1, 0.3, 1)`;
    ringFill.style.strokeDashoffset = targetOffset;

    // Animate counter via JS
    const start = performance.now();
    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / ANIM_DURATION, 1);
      // Ease-out curve: 1 - (1 - t)^3
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = eased * targetScore;

      const intPart = Math.floor(current);
      const decPart = (current - intPart).toFixed(2).slice(1); // ".xx"

      integerEl.textContent = intPart;
      decimalEl.textContent = decPart;

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        // Final exact value
        const finalInt = Math.floor(targetScore);
        const finalDec = (targetScore - finalInt).toFixed(2).slice(1);
        integerEl.textContent = finalInt;
        decimalEl.textContent = finalDec;
      }
    }

    // If reduced motion, show instantly
    if (prefersReducedMotion) {
      const finalInt = Math.floor(targetScore);
      const finalDec = (targetScore - finalInt).toFixed(2).slice(1);
      integerEl.textContent = finalInt;
      decimalEl.textContent = finalDec;
      ringFill.style.transition = 'none';
      ringFill.style.strokeDashoffset = targetOffset;
    } else {
      requestAnimationFrame(tick);
    }
  }

  // -------------------------------------------------
  // 8. Retake
  // -------------------------------------------------
  $('#btn-retake').addEventListener('click', () => {
    resultSection.classList.remove('show');
    form.reset();
    touched.clear();

    // Reset validation UI
    FIELDS.forEach((f) => {
      $(`#${f.errorId}`).classList.remove('show');
      $(`#${f.id}`).classList.remove('invalid');
    });

    // Reset sliders
    SLIDERS.forEach(updateSlider);

    // Disable submit again
    btnSubmit.disabled = true;

    // Scroll to form
    predictCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });

  // -------------------------------------------------
  // 9. Initial state
  // -------------------------------------------------
  // Make sure sliders render correctly on page load (after fonts finish loading)
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => SLIDERS.forEach(updateSlider));
  }
  // -------------------------------------------------
  // 10. Hero Cursor-Interactive Effects
  // -------------------------------------------------
  // Only on fine-pointer devices (mouse) and when motion is not reduced
  const canHover  = window.matchMedia('(pointer: fine)').matches;
  const noMotion  = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (canHover && !noMotion) {
    const heroEl      = $('#hero');
    const cursorGlow  = $('#hero-cursor-glow');
    const heroBg      = heroEl ? heroEl.querySelector('.hero-bg') : null;
    const orbs        = [
      { el: $('#hero-orb-1'), intensity: 0.03 },
      { el: $('#hero-orb-2'), intensity: 0.02 },
      { el: $('#hero-orb-3'), intensity: 0.015 },
    ];

    // Current (lerped) position for smooth cursor follow
    let targetX = 0, targetY = 0;
    let currentX = 0, currentY = 0;
    let ticking = false;

    // Max parallax offset in px for the background layer
    const BG_MAX_OFFSET = 8;

    if (heroEl && cursorGlow) {
      heroEl.addEventListener('mousemove', (e) => {
        const rect = heroEl.getBoundingClientRect();
        // Mouse position relative to hero section
        targetX = e.clientX - rect.left;
        targetY = e.clientY - rect.top;

        if (!ticking) {
          ticking = true;
          requestAnimationFrame(updateCursorEffects);
        }
      });

      heroEl.addEventListener('mouseleave', () => {
        cursorGlow.classList.remove('active');
        // Reset background parallax smoothly
        if (heroBg) {
          heroBg.style.transition = 'transform 0.6s ease-out';
          heroBg.style.transform = 'translate(0, 0)';
        }
        orbs.forEach(({ el }) => {
          if (el) {
            el.style.transition = 'transform 0.6s ease-out';
          }
        });
      });

      heroEl.addEventListener('mouseenter', () => {
        cursorGlow.classList.add('active');
        if (heroBg) heroBg.style.transition = 'none';
        orbs.forEach(({ el }) => {
          if (el) el.style.transition = 'none';
        });
      });
    }

    function updateCursorEffects() {
      // Lerp for smooth follow (0.12 = ~12% per frame towards target)
      const lerp = 0.12;
      currentX += (targetX - currentX) * lerp;
      currentY += (targetY - currentY) * lerp;

      // 1. Cursor-following glow — positioned at lerped mouse coords
      if (cursorGlow) {
        cursorGlow.style.transform = `translate(${currentX - 250}px, ${currentY - 250}px)`;
      }

      // 2. Background parallax tilt
      if (heroBg && heroEl) {
        const rect = heroEl.getBoundingClientRect();
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        // Normalized -1 to 1
        const nx = (currentX - cx) / cx;
        const ny = (currentY - cy) / cy;
        const bgX = nx * BG_MAX_OFFSET;
        const bgY = ny * BG_MAX_OFFSET;
        heroBg.style.transform = `translate(${bgX}px, ${bgY}px)`;
      }

      // 3. Floating orbs parallax (different intensity per orb)
      if (heroEl) {
        const rect = heroEl.getBoundingClientRect();
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        orbs.forEach(({ el, intensity }) => {
          if (!el) return;
          const ox = (currentX - cx) * intensity;
          const oy = (currentY - cy) * intensity;
          // Combine with existing CSS animation offset
          el.style.transform = `translate(${ox}px, ${oy}px)`;
        });
      }

      // Keep looping as long as mouse is in hero
      if (cursorGlow.classList.contains('active')) {
        requestAnimationFrame(updateCursorEffects);
      }
      ticking = false;
    }
  }

})();
