// ---- build tapered sun rays into an SVG <g> ----
function rays(group, cx, cy, rIn, rOut, count, fill, bw) {
  if (!group) return;
  let d = "";
  for (let i = 0; i < count; i++) {
    const a = (i * Math.PI * 2) / count - Math.PI / 2;
    const tx = cx + rOut * Math.cos(a), ty = cy + rOut * Math.sin(a);
    const b1x = cx + rIn * Math.cos(a - bw), b1y = cy + rIn * Math.sin(a - bw);
    const b2x = cx + rIn * Math.cos(a + bw), b2y = cy + rIn * Math.sin(a + bw);
    d += `<path d="M${b1x.toFixed(1)} ${b1y.toFixed(1)} L${tx.toFixed(1)} ${ty.toFixed(1)} L${b2x.toFixed(1)} ${b2y.toFixed(1)} Z" fill="${fill}"/>`;
  }
  group.innerHTML = d;
}

rays(document.getElementById("ray-set"), 200, 200, 152, 188, 16, "#EAA24B", 0.06); // hero
rays(document.getElementById("g40"), 20, 20, 11, 16, 12, "#E2A368", 0.08);         // nav/footer glyph
rays(document.getElementById("raysLg"), 100, 100, 54, 74, 12, "#EAA24B", 0.07);    // phone mockup

// ---- nav background on scroll ----
const nav = document.getElementById("nav");
const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 40);
onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

// ---- reveal on scroll ----
const io = new IntersectionObserver(
  (entries) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        e.target.classList.add("in");
        io.unobserve(e.target);
      }
    }
  },
  { threshold: 0.14, rootMargin: "0px 0px -8% 0px" },
);
document.querySelectorAll(".reveal").forEach((el, i) => {
  el.style.transitionDelay = (i % 3) * 80 + "ms";
  io.observe(el);
});

// ---- desktop PWA install: if the browser supports it, let the Windows button install ----
let deferredPrompt = null;
const winBtn = document.getElementById("winDownload");
const winNote = document.getElementById("winNote");
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
  if (winBtn) {
    winBtn.textContent = "Install on Windows";
    winBtn.href = "#";
    if (winNote) winNote.textContent = "Installs as a desktop app · works offline";
    winBtn.addEventListener("click", async (ev) => {
      ev.preventDefault();
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      deferredPrompt = null;
    });
  }
});
