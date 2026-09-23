const SERVICES = {
  tiktok: {
    name: "🎵 TikTok",
    items: [
      { id: "tt-foll-10",   label: "10 Followers",  price: 1000 },
      { id: "tt-foll-20",   label: "20 Followers",  price: 2000 },
      { id: "tt-foll-30",   label: "30 Followers",  price: 3000 },
      { id: "tt-foll-40",   label: "40 Followers",  price: 4000 },
      { id: "tt-foll-50",   label: "50 Followers",  price: 5000 },
      { id: "tt-view-1000", label: "1.000 Views",   price: 1000 },
      { id: "tt-view-2000", label: "2.000 Views",   price: 2000 },
      { id: "tt-view-3000", label: "3.000 Views",   price: 3000 },
      { id: "tt-like-50",   label: "50 Likes",      price: 1000 },
      { id: "tt-like-100",  label: "100 Likes",     price: 2000 },
      { id: "tt-like-150",  label: "150 Likes",     price: 3000 },
    ]
  },
  instagram: {
    name: "📸 Instagram",
    items: [
      { id: "ig-foll-50",   label: "50 Followers",  price: 2000 },
      { id: "ig-foll-100",  label: "100 Followers", price: 4000 },
      { id: "ig-foll-150",  label: "150 Followers", price: 6000 },
      { id: "ig-like-50",   label: "50 Likes",      price: 500 },
      { id: "ig-like-100",  label: "100 Likes",     price: 1000 },
      { id: "ig-like-150",  label: "150 Likes",     price: 1500 },
      { id: "ig-view-1000", label: "1.000 Views",   price: 1000 },
      { id: "ig-view-2000", label: "2.000 Views",   price: 2000 },
    ]
  },
  whatsapp: {
    name: "💬 Channel WhatsApp",
    items: [
      { id: "wa-50",  label: "50 Pengikut",  price: 500 },
      { id: "wa-100", label: "100 Pengikut", price: 1000 },
      { id: "wa-200", label: "200 Pengikut", price: 2000 },
      { id: "wa-300", label: "300 Pengikut", price: 3000 },
      { id: "wa-400", label: "400 Pengikut", price: 4000 },
      { id: "wa-500", label: "500 Pengikut", price: 5000 },
    ]
  }
};

let selected = { platform: null, item: null };

document.querySelectorAll(".platform").forEach(btn => {
  btn.addEventListener("click", () => {
    selected.platform = btn.dataset.platform;
    renderServices();
    show("step2");
  });
});

function renderServices() {
  const list = document.getElementById("serviceList");
  list.innerHTML = "";
  SERVICES[selected.platform].items.forEach(it => {
    const b = document.createElement("button");
    b.className = "service-btn";
    b.innerHTML = `<span>${it.label}</span><span class="price">Rp ${it.price.toLocaleString("id-ID")}</span>`;
    b.onclick = () => {
      selected.item = it;
      document.getElementById("sumService").textContent =
        SERVICES[selected.platform].name + " — " + it.label;
      document.getElementById("sumQty").textContent = it.label;
      document.getElementById("sumPrice").textContent = "Rp " + it.price.toLocaleString("id-ID");
      show("step3");
    };
    list.appendChild(b);
  });
}

function show(id) {
  ["step1","step2","step3","step4"].forEach(s => document.getElementById(s).classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
}
function backToPlatform() { show("step1"); }
function backToService()  { show("step2"); }

document.querySelectorAll('input[name="pay"]').forEach(r => {
  r.addEventListener("change", () => {
    const val = document.querySelector('input[name="pay"]:checked').value;
    document.getElementById("qrisBox").classList.toggle("hidden", val !== "QRIS");
    document.getElementById("danaBox").classList.toggle("hidden", val !== "DANA");
  });
});

async function submitOrder() {
  const target = document.getElementById("target").value.trim();
  const buyer  = document.getElementById("buyer").value.trim();
  const pay    = document.querySelector('input[name="pay"]:checked').value;
  const file   = document.getElementById("proof").files[0];

  if (!target || !buyer || !file) {
    alert("Lengkapi semua data + upload bukti transfer dulu ya!");
    return;
  }

  const reader = new FileReader();
  reader.onload = async () => {
    const payload = {
      platform: SERVICES[selected.platform].name,
      layanan:  selected.item.label,
      harga:    selected.item.price,
      target, buyer, pay,
      bukti:    reader.result
    };

    const res = await fetch("/.netlify/functions/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await res.json();

    if (data.success) {
      document.getElementById("queueNumber").textContent = "#" + String(data.queue).padStart(3, "0");
      show("step4");
    } else {
      alert("Gagal kirim order. Coba lagi.");
    }
  };
  reader.readAsDataURL(file);
}