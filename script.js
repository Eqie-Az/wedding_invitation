/* =========================================================
   WEDDING INVITATION — script.js
   Semua data yang perlu diubah ada di WEDDING_CONFIG di bawah.
   ========================================================= */

const WEDDING_CONFIG = {
  coupleName: "Muhammad Wiranto & Aulia Fairouz Zahwa",

  // Format wajib ISO 8601 dengan offset zona waktu, contoh WIB (+07:00)
  eventDate: "2026-09-19T09:00:00+07:00",
  eventTime: "09.00 - 18.00 WIB",

  // Kosongkan string di bawah ini jika data belum tersedia.
  address: "Sabit Ayam potong, RT.004/RW.004, Pejawan, Gerongan, Kec. Kraton, Pasuruan, Jawa Timur 67151",
  mapsUrl: "https://www.google.com/maps/place/Sabit+Ayam+potong/@-7.6113213,112.8566309,17z/data=!3m1!4b1!4m6!3m5!1s0x2dd7c57aeb4f25ff:0xfa48af97daaef99e!8m2!3d-7.6113213!4d112.8592058!16s%2Fg%2F11yx_6nzbd?hl=id&entry=ttu&g_ep=EgoyMDI2MDkwMi4wIKXMDSoASAFQAw%3D%3D",

  images: {
    couple: "assets/images/couple.jpeg",
    bride: "assets/images/bride.jpeg",
    groom: "assets/images/groom.jpeg"
  },

  messages: {
    addressPending: "Alamat acara akan segera diperbarui.",
    countdownFinished: "Hari bahagia telah tiba."
  }
};

(function () {
  "use strict";

  /* ---------------------------------------------------
     Utility: safe query
  --------------------------------------------------- */
  function $(selector, scope) {
    return (scope || document).querySelector(selector);
  }
  function $all(selector, scope) {
    return Array.prototype.slice.call((scope || document).querySelectorAll(selector));
  }

  /* ---------------------------------------------------
     1. OPENING GATE
  --------------------------------------------------- */
  function initGate() {
    const gate = $("#gate");
    const openBtn = $("#openInvitation");
    const content = $("#content");

    if (!gate || !openBtn || !content) return;

    function openInvitation() {
      gate.classList.add("gate--hidden");
      content.hidden = false;
      document.body.style.overflow = "";
      // Move focus into the page for accessibility
      const hero = $("#home");
      if (hero) hero.setAttribute("tabindex", "-1");

      setTimeout(function () {
        gate.setAttribute("aria-hidden", "true");
      }, 700);

      // Klik ini adalah interaksi user, jadi browser mengizinkan audio diputar.
      const audio = $("#bgAudio");
      if (audio) {
        audio.play().catch(function () {
          // Kalau tetap diblokir (kasus jarang), tombol musik manual masih bisa dipakai.
        });
      }

      initReveal(); // start reveal observers only once content is visible
    }

    document.body.style.overflow = "hidden";
    openBtn.addEventListener("click", openInvitation);
  }

  /* ---------------------------------------------------
     2. FLOATING NAV — active link + smooth scroll fallback
  --------------------------------------------------- */
  function initNav() {
    const links = $all("[data-nav]");
    const sections = links
      .map(function (link) {
        const id = link.getAttribute("href");
        return id && id.charAt(0) === "#" ? $(id) : null;
      })
      .filter(Boolean);

    if (!("IntersectionObserver" in window) || sections.length === 0) return;

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          const id = "#" + entry.target.id;
          links.forEach(function (link) {
            const isNavLink = link.classList.contains("floatnav__link");
            if (!isNavLink) return;
            link.classList.toggle("is-active", link.getAttribute("href") === id);
          });
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );

    sections.forEach(function (section) {
      observer.observe(section);
    });
  }

  /* ---------------------------------------------------
     3. COUNTDOWN — realtime, safe against invalid dates
  --------------------------------------------------- */
  function initCountdown() {
    const els = {
      days: $("#cd-days"),
      hours: $("#cd-hours"),
      minutes: $("#cd-minutes"),
      seconds: $("#cd-seconds"),
      wrapper: $("#countdown"),
      message: $("#countdown-message")
    };

    if (!els.wrapper) return;

    const target = new Date(WEDDING_CONFIG.eventDate);
    const isValidDate = !isNaN(target.getTime());

    if (!isValidDate) {
      els.wrapper.hidden = true;
      if (els.message) {
        els.message.hidden = false;
        els.message.textContent = "Tanggal acara belum valid. Silakan periksa konfigurasi.";
      }
      console.error("WEDDING_CONFIG.eventDate tidak valid:", WEDDING_CONFIG.eventDate);
      return;
    }

    function pad(num) {
      return String(Math.max(0, num)).padStart(2, "0");
    }

    function render() {
      const now = new Date();
      const diffMs = target.getTime() - now.getTime();

      if (diffMs <= 0) {
        els.wrapper.hidden = true;
        if (els.message) {
          els.message.hidden = false;
          els.message.textContent = WEDDING_CONFIG.messages.countdownFinished;
        }
        clearInterval(timerId);
        return;
      }

      const totalSeconds = Math.floor(diffMs / 1000);
      const days = Math.floor(totalSeconds / 86400);
      const hours = Math.floor((totalSeconds % 86400) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      if (els.days) els.days.textContent = pad(days);
      if (els.hours) els.hours.textContent = pad(hours);
      if (els.minutes) els.minutes.textContent = pad(minutes);
      if (els.seconds) els.seconds.textContent = pad(seconds);
    }

    render();
    const timerId = setInterval(render, 1000);
  }

  /* ---------------------------------------------------
     4. LOCATION — address + maps button, safe when empty
  --------------------------------------------------- */
  function initLocation() {
    const addressEl = $("#address-text");
    const mapsBtn = $("#maps-btn");

    if (addressEl) {
      const address = (WEDDING_CONFIG.address || "").trim();
      addressEl.textContent = address.length > 0 ? address : WEDDING_CONFIG.messages.addressPending;
    }

    const mapEmbed = $("#map-embed");
    const mapFrame = $("#map-embed-frame");
    if (mapEmbed && mapFrame) {
      const address = (WEDDING_CONFIG.address || "").trim();
      if (address.length > 0) {
        // Peta dibuat otomatis dari alamat di atas — tidak perlu koordinat manual.
        mapFrame.src = "https://www.google.com/maps?q=" + encodeURIComponent(address) + "&z=16&output=embed";
        mapEmbed.hidden = false;
      } else {
        mapEmbed.hidden = true;
      }
    }

    if (mapsBtn) {
      const mapsUrl = (WEDDING_CONFIG.mapsUrl || "").trim();
      if (mapsUrl.length > 0) {
        mapsBtn.href = mapsUrl;
        mapsBtn.classList.remove("btn--disabled");
        mapsBtn.removeAttribute("aria-disabled");
      } else {
        mapsBtn.removeAttribute("href");
        mapsBtn.classList.add("btn--disabled");
        mapsBtn.setAttribute("aria-disabled", "true");
        mapsBtn.addEventListener("click", function (event) {
          event.preventDefault();
        });
      }
    }
  }

  /* ---------------------------------------------------
     4b. MUSIC TOGGLE — play/pause backsound
  --------------------------------------------------- */
  function initMusicToggle() {
    const btn = $("#musicToggle");
    const audio = $("#bgAudio");

    if (!btn || !audio) return;

    btn.addEventListener("click", function () {
      if (audio.paused) {
        audio.play().catch(function () {
          // Autoplay/permintaan play mungkin ditolak browser; abaikan dengan aman.
        });
      } else {
        audio.pause();
      }
    });

    audio.addEventListener("play", function () {
      btn.classList.add("is-playing");
      btn.setAttribute("aria-pressed", "true");
    });
    audio.addEventListener("pause", function () {
      btn.classList.remove("is-playing");
      btn.setAttribute("aria-pressed", "false");
    });
  }

  /* ---------------------------------------------------
     5. IMAGES — graceful fallback if a photo is missing
  --------------------------------------------------- */
  function initImageFallback() {
    $all("img").forEach(function (img) {
      img.addEventListener(
        "error",
        function () {
          img.closest(".hero__photo-frame, .person-card__frame") &&
            img.closest(".hero__photo-frame, .person-card__frame").classList.add("is-fallback");
        },
        { once: true }
      );
    });
  }

  /* ---------------------------------------------------
     6. REVEAL ON SCROLL (respects prefers-reduced-motion)
  --------------------------------------------------- */
  function initReveal() {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const targets = $all(".card, .couple-grid__divider");

    targets.forEach(function (el) {
      el.classList.add("reveal");
    });

    if (reduceMotion || !("IntersectionObserver" in window)) {
      targets.forEach(function (el) {
        el.classList.add("is-visible");
      });
      return;
    }

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    targets.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ---------------------------------------------------
     INIT — wrap everything so one failure doesn't crash all
  --------------------------------------------------- */
  function safeInit(name, fn) {
    try {
      fn();
    } catch (err) {
      console.error("Wedding invitation — error in " + name + ":", err);
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    safeInit("initGate", initGate);
    safeInit("initNav", initNav);
    safeInit("initCountdown", initCountdown);
    safeInit("initLocation", initLocation);
    safeInit("initMusicToggle", initMusicToggle);
    safeInit("initImageFallback", initImageFallback);
    // initReveal is triggered by initGate once the invitation opens
  });
})();