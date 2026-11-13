import { useEffect, useRef, useState } from "react";
import "./App.css";

/* ============================================================
   DONNÉES : modifie ici tes textes et tes photos.
   Les images ci-dessous sont de vraies photographies d'intérieur.
   Tu peux les remplacer par tes propres fichiers dans public/images/.
   Exemple : "/images/mon-salon.jpg"
   ============================================================ */
const IMG = {
  hero: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2200&q=85",
  intro: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1800&q=85",
  featured: "https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=2200&q=85",
};

const PROJECTS = [
  {
    t: "Villa Atlas",
    c: "Résidence privée",
    y: "2024",
    img: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=85",
  },
  {
    t: "Appartement Médina",
    c: "Rénovation",
    y: "2023",
    img: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1000&q=85",
  },
  {
    t: "Maison Jasmin",
    c: "Salon & cuisine",
    y: "2024",
    img: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1000&q=85",
  },
  {
    t: "Riad Zitoun",
    c: "Hôtellerie",
    y: "2022",
    img: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=85",
  },
];

const SERVICES = [
  { t: "Conception d'intérieur", d: "Plans, ambiances et sélection de matières pour un projet cohérent.", i: "M3 20V9l9-6 9 6v11M9 20v-6h6v6" },
  { t: "Décoration sur mesure", d: "Mobilier, textiles et objets choisis pour votre façon d'habiter.", i: "M4 14a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v4H4zM6 10V8a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2" },
  { t: "Suivi de chantier", d: "Coordination des artisans et contrôle de chaque finition.", i: "M4 20 20 4M7 4l13 13M4 7l13 13" },
  { t: "Éclairage & art de vivre", d: "Lumières douces et détails qui transforment l'atmosphère.", i: "M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10c1 1 1 2 1 3h6c0-1 0-2 1-3a6 6 0 0 0-4-10z" },
];

const REVIEWS = [
  { id: 1, name: "Client ACT DÉCO", rating: 5, text: "Remplacez cet avis par vos vrais témoignages clients." },
  { id: 2, name: "Cliente ACT DÉCO", rating: 5, text: "Un accompagnement précis, élégant et attentif du début à la fin." },
];

const CONTACT = { whatsapp: "", email: "", phone: "", city: "Fès" }; // ex: whatsapp "212600000000"

const NAV = [
  ["intro", "Le studio"],
  ["projets", "Projets"],
  ["services", "Services"],
  ["avis", "Avis"],
  ["contact", "Contact"],
];

const STORE_KEY = "actdeco_reviews_v2";

/* ============================================================ */
function Reveal({ children, className = "", delay = 0, as: T = "div" }) {
  const ref = useRef(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) { setOn(true); return; }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setOn(true); io.disconnect(); }
    }, { threshold: 0.12 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <T ref={ref} className={`rv ${on ? "in" : ""} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </T>
  );
}

function Img({ src, alt, className = "" }) {
  return (
    <img
      className={className}
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
    />
  );
}

function loadReviews() {
  try {
    const s = JSON.parse(localStorage.getItem(STORE_KEY));
    if (Array.isArray(s)) return s;
  } catch { /* ignore */ }
  return REVIEWS;
}

export default function App() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [reviews, setReviews] = useState(loadReviews);
  const [form, setForm] = useState({ name: "", text: "", rating: 5 });
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 40);
    f();
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);
  useEffect(() => { document.body.style.overflow = open ? "hidden" : ""; }, [open]);

  const save = (next) => {
    setReviews(next);
    try { localStorage.setItem(STORE_KEY, JSON.stringify(next)); } catch { /* ignore */ }
  };

  const submit = (e) => {
    e.preventDefault();
    const name = form.name.trim();
    const text = form.text.trim();
    if (!name || !text) return;
    save([{ id: Date.now(), date: new Date().toLocaleDateString("fr-FR"), rating: form.rating, name, text, mine: true }, ...reviews]);
    setForm({ name: "", text: "", rating: 5 });
    setSent(true);
    setTimeout(() => setSent(false), 3500);
  };

  const remove = (id) => save(reviews.filter((r) => r.id !== id));

  const track = useRef(null);
  const slide = (d) => {
    const t = track.current;
    if (!t || !t.firstChild) return;
    t.scrollBy({ left: d * (t.firstChild.offsetWidth + 24), behavior: "smooth" });
  };

  const wa = CONTACT.whatsapp ? `https://wa.me/${CONTACT.whatsapp.replace(/\D/g, "")}` : "#contact";
  const avg = reviews.length ? (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1) : "–";

  return (
    <div className="site">
      <header className={`hdr ${scrolled ? "is-scrolled" : ""}`}>
        <a href="#top" className="logo" aria-label="ACT DÉCO">
          <svg viewBox="0 0 32 32" aria-hidden="true"><path d="M4 22 17 6h6L10 22zM15 28 29 11v7l-9 10zM4 12 12 3h5L4 17z" /></svg>
          <span>ACT DÉCO<small>Architecture d'intérieur</small></span>
        </a>
        <nav className={`nav ${open ? "open" : ""}`} aria-label="Navigation principale">
          {NAV.map(([id, label]) => (
            <a key={id} href={`#${id}`} onClick={() => setOpen(false)}>{label}</a>
          ))}
        </nav>
        <button className={`burger ${open ? "open" : ""}`} onClick={() => setOpen(!open)} aria-label="Menu" aria-expanded={open}>
          <span /><span />
        </button>
      </header>

      <main id="top">
        {/* HERO */}
        <section className="hero">
          <Img src={IMG.hero} alt="Intérieur signé ACT DÉCO" className="hero-bg" />
          <div className="hero-veil" />
          <div className="hero-txt">
            <p className="kicker">Studio d'architecture d'intérieur</p>
            <h1>Construire les intérieurs de demain</h1>
            <p className="lead">Conception et rénovation d'intérieurs pour votre maison ou votre entreprise.</p>
            <div className="hero-cta">
              <a href="#projets" className="btn">Voir les projets</a>
              <a href="#contact" className="btn ghost">Nous contacter</a>
            </div>
          </div>
        </section>

        {/* À PROPOS + SERVICES */}
        <section id="intro" className="about">
          <Reveal className="about-l">
            <p className="kicker dark">À propos</p>
            <h2>Une expertise en architecture d'intérieur</h2>
            <p>ACT DÉCO conçoit des espaces élégants et fonctionnels, pour les particuliers comme pour les professionnels, avec précision et exigence.</p>
            <a href="#projets" className="btn dark">En savoir plus</a>
          </Reveal>
          <div id="services" className="about-r">
            <Reveal><p className="kicker dark">Nos services</p></Reveal>
            <div className="sgrid">
              {SERVICES.map((s, i) => (
                <Reveal key={s.t} className="scard" delay={i * 90} as="article">
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d={s.i} /></svg>
                  <h3>{s.t}</h3>
                  <p>{s.d}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* PROJETS */}
        <section id="projets" className="projects">
          <Reveal className="sec-head">
            <p className="kicker dark">Réalisations</p>
            <h2>Nos projets</h2>
          </Reveal>
          <div className="carousel">
            <button className="arrow l" onClick={() => slide(-1)} aria-label="Précédent">‹</button>
            <div className="track" ref={track}>
              {PROJECTS.map((p) => (
                <article key={p.t} className="pcard">
                  <div className="pimg"><Img src={p.img} alt={p.t} /></div>
                  <div className="pbody">
                    <h3>{p.t}</h3>
                    <p>{p.c} · {p.y}</p>
                    <a href="#contact" className="more">En savoir plus ›</a>
                  </div>
                </article>
              ))}
            </div>
            <button className="arrow r" onClick={() => slide(1)} aria-label="Suivant">›</button>
          </div>
        </section>

        {/* PHILOSOPHIE */}
        <section className="statement">
          <Reveal className="st-txt">
            <h2>Créer des espaces de vie modernes</h2>
            <p>Une architecture d'intérieur contemporaine et sophistiquée, réalisée avec précision et soin.</p>
          </Reveal>
          <Reveal className="st-img"><Img src={IMG.intro} alt="Ambiance du studio" /></Reveal>
          <Reveal className="pillars">
            <div><span>01</span><h3>Lumière</h3><p>Nous partons de la clarté naturelle pour dessiner chaque pièce.</p></div>
            <div><span>02</span><h3>Matière</h3><p>Bois, lin, pierre et laiton : des textures sincères et durables.</p></div>
            <div><span>03</span><h3>Équilibre</h3><p>Des volumes calmes, des vides assumés, un détail précieux.</p></div>
          </Reveal>
        </section>

        {/* PROJET PHARE */}
        <section className="feat">
          <Img src={IMG.featured} alt="Projet à la une" className="feat-bg" />
          <div className="feat-veil" />
          <Reveal className="feat-card">
            <p className="kicker">Projet à la une</p>
            <h2>{PROJECTS[0].t}</h2>
            <p>Une résidence baignée de lumière, où le calme des teintes naturelles met en valeur chaque détail.</p>
            <a href="#contact" className="btn">Créer le vôtre</a>
          </Reveal>
        </section>

        {/* AVIS */}
        <section id="avis" className="reviews">
          <Reveal className="sec-head">
            <p className="kicker dark">Témoignages</p>
            <h2>Commentaires clients</h2>
            <p>Vous avez travaillé avec ACT DÉCO ? Partagez votre expérience.</p>
          </Reveal>
          <div className="rlayout">
            <Reveal className="rform-wrap">
              <h3>Laissez votre commentaire</h3>
              <form className="rform" onSubmit={submit}>
                <input placeholder="Votre nom" value={form.name} maxLength={60} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                <div className="rate" role="radiogroup" aria-label="Note">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button type="button" key={n} role="radio" aria-checked={n === form.rating} className={n <= form.rating ? "on" : ""} onClick={() => setForm({ ...form, rating: n })} aria-label={`${n} étoiles`}>★</button>
                  ))}
                </div>
                <textarea rows="5" placeholder="Votre commentaire" value={form.text} maxLength={600} onChange={(e) => setForm({ ...form, text: e.target.value })} required />
                <button className="btn dark" type="submit">Publier mon commentaire</button>
                {sent && <p className="ok" role="status">Merci, votre commentaire a été publié.</p>}
              </form>
            </Reveal>
            <div className="rlist" aria-live="polite">
              <p className="rcount">{reviews.length} commentaire{reviews.length > 1 ? "s" : ""} · note moyenne {avg}/5</p>
              {reviews.length === 0 && <p className="rcount">Soyez le premier à laisser un commentaire.</p>}
              {reviews.map((r) => (
                <figure key={r.id} className="rcard">
                  <div className="stars" aria-label={`${r.rating} sur 5`}>{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</div>
                  <blockquote>{r.text}</blockquote>
                  <figcaption>
                    {r.name}{r.date ? ` · ${r.date}` : ""}
                    {r.mine && <button className="del" onClick={() => remove(r.id)} aria-label="Supprimer mon commentaire">Supprimer</button>}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className="contact">
          <Reveal className="contact-in">
            <h2>Donnons vie à votre intérieur.</h2>
            <p>Parlons de votre projet : nous vous répondons avec plaisir.</p>
            <div className="clist">
              <a href={wa} target="_blank" rel="noreferrer"><b>WhatsApp</b><span>{CONTACT.whatsapp || "Ajoutez votre numéro"}</span></a>
              <a href={CONTACT.email ? `mailto:${CONTACT.email}` : "#contact"}><b>E-mail</b><span>{CONTACT.email || "Ajoutez votre e-mail"}</span></a>
              <a href={CONTACT.phone ? `tel:${CONTACT.phone.replace(/\s/g, "")}` : "#contact"}><b>Téléphone</b><span>{CONTACT.phone || "Ajoutez votre numéro"}</span></a>
            </div>
          </Reveal>
        </section>
      </main>

      <footer className="ftr">
        <a href="#top" className="logo"><span>ACT</span><i /><span>DÉCO</span></a>
        <p>© {new Date().getFullYear()} ACT DÉCO. Tous droits réservés.</p>
      </footer>
    </div>
  );
}