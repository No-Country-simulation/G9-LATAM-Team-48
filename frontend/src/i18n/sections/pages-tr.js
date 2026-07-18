export const pagesTr = {
  "states": {
    "loading": "Yükleniyor...",
    "loadingConsumo": "Tüketim verileri yükleniyor...",
    "loadingHistorial": "Geçmiş yükleniyor...",
    "loadingRecomendaciones": "Öneriler yükleniyor...",
    "empty": "Gösterilecek veri yok.",
    "error": "Veriler yüklenemedi.",
    "retry": "Yeniden dene"
  },
  "dashboard": {
    "title": "EnergyAI Dashboard",
    "subtitle": "Hackathon ONE G9 - TEAM 48",
    "lastMonthUsage": "Son ay tüketimi",
    "lastMonthCost": "Son ay maliyeti",
    "monthlyAverage": "Aylık ortalama"
  },
  "consumos": {
    "title": "Enerji tüketimi",
    "subtitle": "kWh tüketimi ve tahmini maliyetin aylık dökümü.",
    "totalUsage": "Toplam tüketim",
    "totalCost": "Toplam maliyet",
    "monthlyAverage": "Aylık ortalama",
    "history": "Aylık geçmiş",
    "peak": "En yüksek tüketim",
    "month": "Ay",
    "usageKwh": "Tüketim (kWh)",
    "estimatedCost": "Tahmini maliyet",
    "status": "Durum",
    "aboveAverage": "Ortalamanın üstünde",
    "normal": "Normal"
  },
  "chart": {
    "title": "Aylık enerji tüketimi (kWh)",
    "actualVsPredicted": "Gerçek vs tahmin (kWh)",
    "actualVsPredictedHint": "Data Analysis için mock: ölçülen tüketimi model tahminiyle karşılaştır.",
    "peakVsOffPeak": "Yoğun vs sakin saat (kWh)",
    "peakVsOffPeakHint": "Data Analysis için mock: tüketimi yoğun ve sakin saatlere ayır.",
    "seriesActual": "Gerçek",
    "seriesPredicted": "Tahmin",
    "seriesPeak": "Yoğun",
    "seriesOffPeak": "Sakin",
    "axisMonth": "Ay",
    "axisKwh": "kWh",
    "confidence": "Model güveni",
    "categories": {
      "LOW_CONSUMPTION": "Düşük tüketim",
      "MEDIUM_CONSUMPTION": "Orta tüketim",
      "HIGH_CONSUMPTION": "Yüksek tüketim"
    }
  },
  "analysis": {
    "title": "Akıllı Yapay Zeka analizi",
    "subtitle": "Tesis türüne göre enerji tüketimi değerlendirmesi",
    "installationType": "Tesis türü",
    "types": {
      "casa": "Ev",
      "fabrica_mediana": "Orta fabrika",
      "fabrica_grande": "Büyük fabrika"
    },
    "typeHints": {
      "casa": "Kişi başı tüketim ve iklimlendirme için ev verileri.",
      "fabrica_mediana": "Makine, vardiya ve yoğunluk karşılaştırması için operasyon verileri.",
      "fabrica_grande": "Hat, kapasite ve izleme değerlendirmesi için tesis verileri."
    },
    "monthlyUsage": "Aylık tüketim (kWh)",
    "people": "Kişi sayısı",
    "devices": "Cihaz sayısı",
    "homeArea": "Konut alanı (m²)",
    "climateHours": "Günlük iklimlendirme saati",
    "peakUseHours": "Günlük yoğun kullanım saati",
    "shifts": "Günlük vardiya",
    "machines": "Makine sayısı",
    "area": "Tesis alanı (m²)",
    "hoursPerDay": "Günlük çalışma saati",
    "processIntensity": "Süreç yoğunluğu",
    "hasCompressedAir": "Basınçlı hava kullanıyor mu?",
    "lines": "Üretim hatları",
    "operatingDays": "Aylık çalışma günü",
    "capacityPct": "Kullanılan kapasite (%)",
    "hasMonitoring": "Enerji izleme / SCADA var mı?",
    "intensity": {
      "baja": "Düşük",
      "media": "Orta",
      "alta": "Yüksek"
    },
    "yesNo": {
      "yes": "Evet",
      "no": "Hayır"
    },
    "submit": "Tüketimi analiz et",
    "submitting": "Analiz ediliyor...",
    "panelHint": "Seçilen türün alanlarını doldurun ve analizi çalıştırın.",
    "result": "YZ sonucu",
    "level": "Seviye",
    "estimatedSavings": "Tahmini tasarruf",
    "tips": "Tüketimi iyileştirme önerileri",
    "confidence": "Model güveni",
    "sourceMl": "eğitilmiş model",
    "sourceLocal": "yerel kurallar",
    "failed": "Analiz tamamlanamadı.",
    "chart": {
      "title": "Tüketiminiz vs referans",
      "hint": "Referans, formdaki verilere göre ayarlanır.",
      "empty": "Grafiği görmek için aylık tüketimi girin.",
      "seriesYours": "Tüketiminiz",
      "seriesBenchmark": "Referans"
    },
    "levels": {
      "efficient": "Verimli",
      "moderate": "Orta",
      "inefficient": "Verimsiz"
    },
    "tipsList": {
      "led": "LED aydınlatma kullanın",
      "peak": "Yoğun saatlerde tüketimi azaltın",
      "appliances": "Cihaz kullanımını optimize edin",
      "ac": "Klima kullanımını azaltın",
      "replace": "Eski ekipmanı değiştirin",
      "night": "Gece tüketimini izleyin",
      "keep": "Mevcut alışkanlıkları koruyun",
      "monitor": "Tüketimi izlemeye devam edin",
      "insulation": "Konutun ısı yalıtımını iyileştirin",
      "standby": "Düşük kullanım saatlerinde beklemeyi kesin",
      "solar": "Pikleri karşılamak için güneş enerjisini değerlendirin",
      "shifts": "Yoğun süreçleri yoğun saat dışına alın",
      "motors": "Motor ve invertör verimliliğini kontrol edin",
      "compressedAir": "Sızıntıları bulun ve basınçlı havayı optimize edin",
      "processHeat": "Proses ısısını geri kazanın veya fırınları yalıtın",
      "loadBalancing": "Yükü makineler ve vardiyalar arasında dengeleyin",
      "idleLines": "Boş hatları kapatın veya beklemeye alın",
      "schedules": "Üretim programlarını talebe göre optimize edin",
      "predictive": "Kritik ekipmanda öngörücü bakım uygulayın",
      "scada": "Enerji izleme / SCADA kurun veya genişletin",
      "capacity": "Üretimi gerçek kullanılan kapasiteye göre ayarlayın"
    }
  },
  "recommendations": {
    "title": "YA önerileri",
    "subtitle": "Tüketimi optimize etmek için kişiselleştirilmiş öneriler.",
    "total": "Toplam öneri",
    "highPriority": "Yüksek öncelik",
    "potentialSavings": "Birikmiş potansiyel tasarruf",
    "estimatedSavings": "Tahmini tasarruf",
    "priority": {
      "high": "Yüksek",
      "medium": "Orta",
      "low": "Düşük"
    },
    "category": {
      "lighting": "Aydınlatma",
      "habits": "Alışkanlıklar",
      "climate": "İklimlendirme",
      "equipment": "Ekipman",
      "tech": "Teknoloji"
    },
    "items": {
      "1": {
        "title": "Geleneksel aydınlatmayı LED ile değiştirin",
        "description": "Akkor ampulleri değiştirmek aydınlatma tüketimini %80’e kadar azaltabilir."
      },
      "2": {
        "title": "Yoğun saatlerde tüketimi azaltın",
        "description": "Talebi düşürmek için cihazları 18:00–22:00 dışında çalıştırın."
      },
      "3": {
        "title": "Klima kullanımını optimize edin",
        "description": "Cihazı 24–26 °C arasında tutun ve geceleri eko modunu kullanın."
      },
      "4": {
        "title": "Eski yüksek tüketimli cihazları değerlendirin",
        "description": "10 yıldan eski buzdolabı, mikrodalga veya çamaşır makinelerini belirleyin."
      },
      "5": {
        "title": "Beklemedeki şarj cihazlarını çıkarın",
        "description": "Kullanılmayan adaptör ve cihazları kapatarak fantom tüketimi önleyin."
      },
      "6": {
        "title": "Akıllı termostat kurun",
        "description": "Isıtma ve soğutmayı doluluk saatlerine göre otomatikleştirin."
      }
    }
  },
  "months": {
    "january": "Ocak",
    "february": "Şubat",
    "march": "Mart",
    "april": "Nisan",
    "may": "Mayıs",
    "june": "Haziran"
  },
  "insights": {
    "title": "Tüketimin nasıl?",
    "subtitle": "Evde veya işte herkesin anlayacağı net bir özet.",
    "trend": {
      "up": "{month} ayında {prevMonth} ayına göre %{pct} daha fazla enerji kullandın ({kwh} kWh fazla).",
      "down": "{month} ayında {prevMonth} ayına göre %{pct} azaldı ({kwh} kWh tasarruf).",
      "flat": "{month} ayında tüketim {prevMonth} ile neredeyse aynı."
    },
    "peak": "{month} ayındaki enerjinin %{pct}’i yoğun saatlerde kullanıldı (genelde daha pahalı).",
    "bill": {
      "up": "{month} için tahmini fatura ${amount} (önceki aya göre yaklaşık ${diff} fazla).",
      "down": "{month} için tahmini fatura ${amount} (önceki aya göre yaklaşık ${diff} az).",
      "flat": "{month} için tahmini fatura ${amount} olarak kaldı."
    },
    "level": {
      "good": "Tüketimin düşük: iyi gidiyorsun.",
      "ok": "Tüketimin orta: küçük değişiklikler hâlâ yardımcı olabilir.",
      "high": "Tüketimin yüksek: alışkanlıkları ve çok harcayan cihazları kontrol et."
    },
    "tip": {
      "good": "İpucu: kullanmadığın cihazları kapatmaya devam et, klimayı 24–26 °C civarında tut.",
      "ok": "İpucu: çamaşır makinesini 18:00–22:00 dışında çalıştırarak daha az öde.",
      "high": "İpucu: klima ve eski cihazları gözden geçir; en büyük maliyet genelde orada."
    }
  }
}
