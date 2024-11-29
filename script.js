// LocalStorage'da veri tutma ve okuma
const getData = (key) => JSON.parse(localStorage.getItem(key)) || [];
const setData = (key, data) => localStorage.setItem(key, JSON.stringify(data));

// Giriş İşlemi
document.getElementById("login-button").addEventListener("click", () => {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if (username === "admin" && password === "1234") {
    document.getElementById("login-panel").style.display = "none";
    document.getElementById("main-panel").style.display = "block";
  } else {
    alert("Yanlış kullanıcı adı veya şifre!");
  }
});

// Menüler Arası Geçiş
document.querySelectorAll(".menu-button").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".section").forEach(section => section.style.display = "none");
    document.getElementById(button.dataset.section).style.display = "block";
  });
});

// Sınıf Oluşturma
document.getElementById("sinif-olustur-button").addEventListener("click", () => {
  const sinifAd = document.getElementById("sinif-ad").value;
  if (sinifAd) {
    const siniflar = getData("siniflar");
    siniflar.push(sinifAd);
    setData("siniflar", siniflar);
    document.getElementById("sinif-ad").value = "";
    updateSiniflar();
    alert("Sınıf oluşturuldu!");
  }
});

// Öğrenci Ekleme
document.getElementById("ogrenci-ekle-button").addEventListener("click", () => {
  const ogrenciAd = document.getElementById("ogrenci-ad").value;
  const sinifSec = document.getElementById("sinif-sec").value;

  if (ogrenciAd && sinifSec) {
    const ogrenciler = getData("ogrenciler");
    ogrenciler.push({ ad: ogrenciAd, sinif: sinifSec });
    setData("ogrenciler", ogrenciler);
    document.getElementById("ogrenci-ad").value = "";
    updateOgrenciListesi();
    alert("Öğrenci eklendi!");
  }
});

// Fonksiyonlar: Güncellemeler
function updateSiniflar() {
  const siniflar = getData("siniflar");
  const sinifSec = document.getElementById("sinif-sec");
  const yoklamaSinifSec = document.getElementById("yoklama-sinif-sec");
  const sinifList = document.getElementById("sinif-list");

  sinifSec.innerHTML = "<option value=''>Sınıf Seç</option>";
  yoklamaSinifSec.innerHTML = "<option value=''>Sınıf Seç</option>";
  sinifList.innerHTML = "";

  siniflar.forEach(sinif => {
    sinifSec.innerHTML += `<option value="${sinif}">${sinif}</option>`;
    yoklamaSinifSec.innerHTML += `<option value="${sinif}">${sinif}</option>`;
    sinifList.innerHTML += `<li>${sinif} <button onclick="deleteSinif('${sinif}')">Sil</button></li>`;
  });
}

function updateOgrenciListesi() {
  const ogrenciler = getData("ogrenciler");
  const ogrenciList = document.getElementById("ogrenci-list");
  ogrenciList.innerHTML = "";

  ogrenciler.forEach((ogrenci, index) => {
    ogrenciList.innerHTML += `<li>${ogrenci.ad} (${ogrenci.sinif}) <button onclick="deleteOgrenci(${index})">Sil</button></li>`;
  });
}

// Silme İşlemleri
function deleteSinif(sinifAd) {
  const siniflar = getData("siniflar").filter(sinif => sinif !== sinifAd);
  setData("siniflar", siniflar);
  updateSiniflar();
}

function deleteOgrenci(index) {
  const ogrenciler = getData("ogrenciler");
  ogrenciler.splice(index, 1);
  setData("ogrenciler", ogrenciler);
  updateOgrenciListesi();
}
// Yoklama Alma: Sınıf seçildiğinde öğrencileri listele
document.getElementById("yoklama-sinif-sec").addEventListener("change", () => {
    const sinif = document.getElementById("yoklama-sinif-sec").value;
    const ogrenciler = getData("ogrenciler").filter(ogrenci => ogrenci.sinif === sinif);
    const yoklamaList = document.getElementById("yoklama-list");
    yoklamaList.innerHTML = "";
  
    if (ogrenciler.length === 0) {
      yoklamaList.innerHTML = `<p>Bu sınıfta öğrenci bulunmuyor.</p>`;
    } else {
      ogrenciler.forEach((ogrenci, index) => {
        yoklamaList.innerHTML += `
          <div>
            <input type="checkbox" id="yoklama-${index}" data-ad="${ogrenci.ad}">
            <label for="yoklama-${index}">${ogrenci.ad}</label>
          </div>
        `;
      });
    }
  });
  
  // Yoklamayı Kaydet
  document.getElementById("yoklama-kaydet-button").addEventListener("click", () => {
    const sinif = document.getElementById("yoklama-sinif-sec").value;
    if (!sinif) {
      alert("Lütfen yoklama alınacak bir sınıf seçin!");
      return;
    }
  
    const yoklamaList = document.querySelectorAll("#yoklama-list input[type='checkbox']");
    const yoklamaKaydi = { sinif, tarih: new Date().toLocaleDateString(), ogrenciler: [] };
  
    yoklamaList.forEach(input => {
      yoklamaKaydi.ogrenciler.push({
        ad: input.dataset.ad,
        var: input.checked // Checkbox seçiliyse true, değilse false
      });
    });
  
    const yoklamaKayitlari = getData("yoklamaKayitlari");
    yoklamaKayitlari.push(yoklamaKaydi);
    setData("yoklamaKayitlari", yoklamaKayitlari);
  
    alert("Yoklama kaydedildi!");
    updateYoklamaKayitlari();
  });
  
  // Yoklama Kayıtlarını Listele
  function updateYoklamaKayitlari() {
    const yoklamaKayitlari = getData("yoklamaKayitlari");
    const yoklamaKayitList = document.getElementById("yoklama-kayit-list");
    yoklamaKayitList.innerHTML = "";
  
    yoklamaKayitlari.forEach((kayit, index) => {
      const ogrenciListesi = kayit.ogrenciler.map(
        ogrenci => `<li>${ogrenci.ad} - ${ogrenci.var ? "Var" : "Yok"}</li>`
      ).join("");
  
      yoklamaKayitList.innerHTML += `
        <li>
          <strong>${kayit.sinif} (${kayit.tarih})</strong>
          <ul>${ogrenciListesi}</ul>
        </li>
      `;
    });
  }
  
  // İlk çalıştırmada yoklama kayıtlarını güncelle
updateYoklamaKayitlari();
updateSiniflar();
updateOgrenciListesi();
