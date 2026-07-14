/* ============================================================
   LIL EGO — Site Config
   Edit the values below to update links and stock.
   No rebuild/deploy pipeline needed beyond a normal git push.
   ============================================================ */

const CONFIG = {
  // Gumroad product URLs — key matches the data-gumroad attribute in books.html
  gumroad: {
    "audacity-of-ascension": "https://gumroad.com/l/REPLACE_ME_AUDACITY",
    "dark-night-journal": "https://gumroad.com/l/REPLACE_ME_JOURNAL_DIGITAL"
  },

  // Stripe Payment Links for physical items sold outside the Shirts grid
  // (the journal's physical edition, self-fulfilled from held inventory)
  stripeLinks: {
    "dark-night-journal": "https://buy.stripe.com/REPLACE_ME_JOURNAL_PHYSICAL"
  },

  // Shirts — each item renders a card on shirts.html.
  // stripeLink: paste the Stripe Payment Link / Buy Button URL for that item.
  // sizes: set stock:true/false per size. false = shows crossed-out "sold out" pill.
  shirts: [
    {
      id: "dark-night",
      name: "Dark Night",
      price: "$18",
      stripeLink: "https://buy.stripe.com/REPLACE_ME_DARK_NIGHT",
      colors: [
        { name: "White", front: "/assets/img/shirt-dark-night-white-front.png", back: "/assets/img/shirt-dark-night-white-back.png" },
        { name: "Black", front: "/assets/img/shirt-dark-night-black-front.png", back: "/assets/img/shirt-dark-night-black-back.png" }
      ],
      sizes: { S: true, M: true, L: true, XL: true }
    },
    {
      id: "meditation-is-suspect",
      name: "Meditation Is Suspect",
      price: "$18",
      stripeLink: "https://buy.stripe.com/REPLACE_ME_MEDITATION",
      colors: [
        { name: "White", front: "/assets/img/shirt-meditation-white-front.png", back: "/assets/img/shirt-meditation-white-back.png" },
        { name: "Black", front: "/assets/img/shirt-meditation-black-front.png", back: "/assets/img/shirt-meditation-black-back.png" }
      ],
      sizes: { S: true, M: true, L: true, XL: true }
    },
    {
      id: "healing-now",
      name: "Healing Now",
      price: "$18",
      stripeLink: "https://buy.stripe.com/REPLACE_ME_HEALING_NOW",
      colors: [
        { name: "White", front: "/assets/img/shirt-healing-white-front.png", back: "/assets/img/shirt-healing-white-back.png" },
        { name: "Black", front: "/assets/img/shirt-healing-black-front.png", back: "/assets/img/shirt-healing-black-back.png" }
      ],
      sizes: { S: true, M: true, L: true, XL: true }
    }
  ]
};

// ---------- Wire up Gumroad buttons on Books page ----------
document.querySelectorAll('[data-gumroad]').forEach(function (el) {
  const key = el.getAttribute('data-gumroad');
  const url = CONFIG.gumroad[key];
  if (url) el.setAttribute('href', url);
});

// ---------- Wire up Stripe links for non-shirt physical items (e.g. journal) ----------
document.querySelectorAll('[data-stripe]').forEach(function (el) {
  const key = el.getAttribute('data-stripe');
  const url = CONFIG.stripeLinks[key];
  if (url) el.setAttribute('href', url);
});

// ---------- Render shirt cards on Shirts page ----------
const shirtGrid = document.getElementById('shirt-grid');
if (shirtGrid) {
  shirtGrid.innerHTML = CONFIG.shirts.map(function (shirt, shirtIndex) {
    const sizePills = Object.keys(shirt.sizes).map(function (size) {
      const inStock = shirt.sizes[size];
      return '<span class="size-pill' + (inStock ? '' : ' sold-out') + '">' + size + '</span>';
    }).join('');

    const allSoldOut = Object.values(shirt.sizes).every(function (v) { return v === false; });

    const swatches = shirt.colors.map(function (c, colorIndex) {
      return '<button type="button" class="color-swatch' + (colorIndex === 0 ? ' is-active' : '') +
        '" data-shirt="' + shirtIndex + '" data-color="' + colorIndex + '" ' +
        'style="background:' + (c.name === 'White' ? '#fff' : '#111') + ';" ' +
        'title="' + c.name + '"></button>';
    }).join('');

    return (
      '<div class="shirt-card" data-shirt-card="' + shirtIndex + '">' +
        '<div class="shirt-photo">' +
          '<img data-shirt-img="' + shirtIndex + '" src="' + shirt.colors[0].front + '" alt="' + shirt.name + ' shirt">' +
          '<button type="button" class="flip-btn" data-shirt-flip="' + shirtIndex + '" title="See back">↻ back</button>' +
        '</div>' +
        '<div class="shirt-body">' +
          '<h3>' + shirt.name + '</h3>' +
          '<p class="price">' + shirt.price + '</p>' +
          '<div class="swatch-row">' + swatches + '</div>' +
          '<div class="size-row">' + sizePills + '</div>' +
          '<a href="' + (allSoldOut ? '#' : shirt.stripeLink) + '" class="btn' + (allSoldOut ? ' is-disabled' : '') + '">' +
            (allSoldOut ? 'Sold Out' : 'Buy — ' + shirt.price) +
          '</a>' +
        '</div>' +
      '</div>'
    );
  }).join('');

  // Track current color + face (front/back) per shirt card
  const shirtState = CONFIG.shirts.map(function () { return { color: 0, face: 'front' }; });

  shirtGrid.addEventListener('click', function (e) {
    const swatchBtn = e.target.closest('.color-swatch');
    if (swatchBtn) {
      const shirtIdx = Number(swatchBtn.getAttribute('data-shirt'));
      const colorIdx = Number(swatchBtn.getAttribute('data-color'));
      shirtState[shirtIdx].color = colorIdx;
      updateShirtImg(shirtIdx);
      shirtGrid.querySelectorAll('[data-shirt-card="' + shirtIdx + '"] .color-swatch').forEach(function (b) {
        b.classList.toggle('is-active', Number(b.getAttribute('data-color')) === colorIdx);
      });
      return;
    }
    const flipBtn = e.target.closest('.flip-btn');
    if (flipBtn) {
      const shirtIdx = Number(flipBtn.getAttribute('data-shirt-flip'));
      shirtState[shirtIdx].face = shirtState[shirtIdx].face === 'front' ? 'back' : 'front';
      flipBtn.textContent = shirtState[shirtIdx].face === 'front' ? '↻ back' : '↻ front';
      updateShirtImg(shirtIdx);
    }
  });

  function updateShirtImg(shirtIdx) {
    const state = shirtState[shirtIdx];
    const color = CONFIG.shirts[shirtIdx].colors[state.color];
    const img = shirtGrid.querySelector('[data-shirt-img="' + shirtIdx + '"]');
    if (img) img.setAttribute('src', color[state.face]);
  }
}

// ---------- Mobile hamburger nav ----------
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', function () {
    const isOpen = navLinks.classList.toggle('is-open');
    navToggle.classList.toggle('is-open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
  // Close menu after tapping a link
  navLinks.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () {
      navLinks.classList.remove('is-open');
      navToggle.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}
const MARGIN_NOTES = [
  '"I did NOT do it."',
  '"tattling is rude, actually."',
  '"he started it (I finished it)"',
  '"I get a sticker for this, right?"',
  '"detention was HIS idea"',
  '"I\'m not yelling, you\'re yelling"',
  '"5 more minutes. please."',
  '"nobody saw that"'
];

const marginNoteEl = document.getElementById('margin-note');
if (marginNoteEl) {
  const pick = MARGIN_NOTES[Math.floor(Math.random() * MARGIN_NOTES.length)];
  marginNoteEl.textContent = pick;
}
