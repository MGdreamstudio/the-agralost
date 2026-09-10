/*
  Bu dosyadan site metinlerini, X bağlantısını, görevleri ve koleksiyon kartlarını
  değiştirebilirsin. Görselleri assets/ klasörüne koyup image alanına yolunu yaz.
*/
const SITE = {
  name: "THE AGRALOST",
  xUrl: "https://x.com/XARONSPACE",
  heroCopy: "Topla, keşfet ve bu küçük ama cesur pixel evreninin ilk yolcularından ol.",
  collection: [
    { id: "001", name: "Emerald Scout", image: "" }, { id: "002", name: "Night Bloom", image: "" },
    { id: "003", name: "Signal Bearer", image: "" }, { id: "004", name: "Moss Oracle", image: "" },
    { id: "005", name: "Void Sprite", image: "" }, { id: "006", name: "First Light", image: "" }
  ],
  quests: [
    { id: "follow", title: "X'te takip et", detail: "Yeni duyurulardan haberdar ol.", points: 75, action: "x" },
    { id: "signal", title: "Projeyi paylaş", detail: "QWEEN sinyalini arkadaşlarına gönder.", points: 50, action: "share" },
    { id: "explore", title: "Koleksiyonu keşfet", detail: "Arşivdeki ilk karakterlere göz at.", points: 75, action: "collection" }
  ]
};
