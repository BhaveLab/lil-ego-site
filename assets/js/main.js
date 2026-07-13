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

  // Stripe Payment Links — key matches the data-stripe attribute in books.html
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
      img: "/assets/img/shirt-dark-night.png",
      stripeLink: "https://buy.stripe.com/REPLACE_ME_DARK_NIGHT",
      sizes: { S: true, M: true, L: true, XL: true }
    },
    {
      id: "meditation-is-suspect",
      name: "Meditation Is Suspect",
      price: "$18",
      img: "/assets/img/shirt-meditation.png",
      stripeLink: "https://buy.stripe.com/REPLACE_ME_MEDITATION",
      sizes: { S: true, M: true, L: true, XL: true }
    },
    {
      id: "healing-now",
      name: "Healing Now",
      price: "$18",
      img: "/assets/img/shirt-healing-now.png",
      stripeLink: "https://buy.stripe.com/REPLACE_ME_HEALING_NOW",
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

// ---------- Wire up Stripe buttons on Books page ----------
document.querySelectorAll('[data-stripe]').forEach(function (el) {
  const key = el.getAttribute('data-stripe');
  const url = CONFIG.stripeLinks[key];
  if (url) el.setAttribute('href', url);
});

// ---------- Render shirt cards on Shirts page ----------
const shirtGrid = document.getElementById('shirt-grid');
if (shirtGrid) {
  shirtGrid.innerHTML = CONFIG.shirts.map(function (shirt) {
    const sizePills = Object.keys(shirt.sizes).map(function (size) {
      const inStock = shirt.sizes[size];
      return '<span class="size-pill' + (inStock ? '' : ' sold-out') + '">' + size + '</span>';
    }).join('');

    const allSoldOut = Object.values(shirt.sizes).every(function (v) { return v === false; });

    return (
      '<div class="shirt-card">' +
        '<div class="shirt-photo">' +
          '<img src="' + shirt.img + '" alt="' + shirt.name + ' shirt" onerror="this.style.display=\'none\'; this.nextElementSibling.style.display=\'flex\';">' +
          '<div class="photo-placeholder" style="display:flex; align-items:center;">drop ' + shirt.img.split('/').pop() + ' in /assets/img/</div>' +
        '</div>' +
        '<div class="shirt-body">' +
          '<h3>' + shirt.name + '</h3>' +
          '<p class="price">' + shirt.price + '</p>' +
          '<div class="size-row">' + sizePills + '</div>' +
          '<a href="' + (allSoldOut ? '#' : shirt.stripeLink) + '" class="btn' + (allSoldOut ? ' is-disabled' : '') + '">' +
            (allSoldOut ? 'Sold Out' : 'Buy — ' + shirt.price) +
          '</a>' +
        '</div>' +
      '</div>'
    );
  }).join('');
}

// ---------- Handwritten interruption — a different one on every reload ----------
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
