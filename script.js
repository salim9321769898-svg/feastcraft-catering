// IMPORTANT: Replace this demo number with your own WhatsApp number.
const WHATSAPP_NUMBER = "919321769898"; // country code + number, digits only

document.getElementById("year").textContent = new Date().getFullYear();

const menuToggle = document.querySelector(".menu-toggle");
const nav = document.getElementById("nav");
menuToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});
nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
  nav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
}));

document.getElementById("booking-form").addEventListener("submit", event => {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const get = key => String(form.get(key) || "").trim();
  const message = [
    "Hello FeastCraft! I would like to enquire about catering.",
    "",
    `Name: ${get("name")}`,
    `Phone: ${get("phone")}`,
    `Event type: ${get("eventType")}`,
    `Event date: ${get("date") || "Not decided"}`,
    `Approx. guests: ${get("guests") || "Not decided"}`,
    `Location: ${get("location") || "Not decided"}`,
    `Food preferences / details: ${get("details") || "Please contact me to discuss"}`
  ].join("\\n");
  const status = document.getElementById("form-message");
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener,noreferrer");
  status.textContent = "WhatsApp opened with your enquiry. Please press Send in WhatsApp to submit it.";
});

// FeastCraft photo uploader: preview selected photos and add them to the gallery.
(() => {
  const input = document.getElementById("feastcraft-photo-input");
  const preview = document.getElementById("feastcraft-photo-preview");
  const addButton = document.getElementById("feastcraft-add-photos");
  const gallery = document.querySelector(".gallery-grid");

  if (!input || !preview || !addButton || !gallery) return;

  let selectedPhotos = [];

  input.addEventListener("change", () => {
    selectedPhotos.forEach(photo => URL.revokeObjectURL(photo.url));
    selectedPhotos = Array.from(input.files || [])
      .filter(file => file.type.startsWith("image/") || file.type.startsWith("video/"))
      .map(file => ({ file, url: URL.createObjectURL(file), type: file.type.startsWith("video/") ? "video" : "image" }));

    preview.replaceChildren();

    selectedPhotos.forEach(photo => {
      const figure = document.createElement("figure");
      const media = document.createElement(photo.type === "video" ? "video" : "img");
      const caption = document.createElement("figcaption");

      media.src = photo.url;
      media.style.width = "100%";
      media.style.height = "130px";
      media.style.objectFit = "cover";

      if (photo.type === "video") {
        media.controls = true;
        media.playsInline = true;
        media.preload = "metadata";
      } else {
        media.alt = photo.file.name;
      }

      caption.textContent = photo.file.name;
      figure.append(media, caption);
      preview.appendChild(figure);
    });

    addButton.disabled = selectedPhotos.length === 0;
    addButton.textContent = selectedPhotos.length
      ? `Add ${selectedPhotos.length} Photo(s) to Gallery`
      : "Add to Gallery";
  });

  addButton.disabled = true;

  addButton.addEventListener("click", () => {
    if (!selectedPhotos.length) return;

    selectedPhotos.forEach(photo => {
      const tile = document.createElement("div");
      tile.className = "gallery-tile uploaded-photo-tile";

      const media = document.createElement(photo.type === "video" ? "video" : "img");
      media.src = photo.url;
      media.alt = photo.type === "image" ? photo.file.name : "";
      media.style.width = "100%";
      media.style.height = "100%";
      media.style.objectFit = "cover";
      if (photo.type === "video") {
        media.controls = true;
        media.playsInline = true;
        media.preload = "metadata";
      }

      const caption = document.createElement("div");
      caption.className = "tile-caption";

      const label = document.createElement("span");
      label.textContent = "FEASTCRAFT GALLERY";

      const title = document.createElement("strong");
      title.textContent = photo.file.name;

      caption.append(label, title);
      tile.append(media, caption);
      gallery.appendChild(tile);
    });

    selectedPhotos = [];
    preview.replaceChildren();
    input.value = "";
    addButton.disabled = true;
    addButton.textContent = "Photos Added to Gallery";
  });
})();
