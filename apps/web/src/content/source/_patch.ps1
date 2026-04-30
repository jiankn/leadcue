# Patch heroVisual in en source
$enPath = "c:\antigravity\leadcue\apps\web\src\content\source\site-ui.en.json"
$raw = [System.IO.File]::ReadAllText($enPath)
$insert = @'
      "firstLineLabel": "First line ready",
      "firstLineText": "I noticed Northstar explains the product clearly, but the demo path starts after the first scroll.",
      "firstLineMeta": "Copy-ready · Based on 3 website signals",
      "footerLeft"
'@
$raw = $raw -replace '"footerLeft"', $insert
[System.IO.File]::WriteAllText($enPath, $raw)
Write-Host "EN source patched"

# Patch heroVisual in generated locales
$locPath = "c:\antigravity\leadcue\apps\web\src\content\generated\site-ui.locales.json"
$loc = [System.IO.File]::ReadAllText($locPath)

$translations = @{
  '"footerLeft": "Website evidence"' = '"firstLineLabel": "First line ready", "firstLineText": "I noticed Northstar explains the product clearly, but the demo path starts after the first scroll.", "firstLineMeta": "Copy-ready · Based on 3 website signals", "footerLeft": "Website evidence"'
  '"footerLeft": "Preuve du site Web"' = '"firstLineLabel": "Première ligne prête", "firstLineText": "J''ai remarqué que Northstar explique clairement le produit, mais le chemin vers la démo ne commence qu''après le premier défilement.", "firstLineMeta": "Prêt à copier · Basé sur 3 signaux du site", "footerLeft": "Preuve du site Web"'
  '"footerLeft": "Websitebewijs"' = '"firstLineLabel": "Eerste regel klaar", "firstLineText": "Ik merkte op dat Northstar het product helder uitlegt, maar het demopad pas na de eerste scroll begint.", "firstLineMeta": "Kopieerklaar · Gebaseerd op 3 websitesignalen", "footerLeft": "Websitebewijs"'
  '"footerLeft": "Website-Beweise"' = '"firstLineLabel": "Erste Zeile bereit", "firstLineText": "Mir ist aufgefallen, dass Northstar das Produkt klar erklärt, aber der Demo-Pfad erst nach dem ersten Scrollen beginnt.", "firstLineMeta": "Kopierfertig · Basierend auf 3 Website-Signalen", "footerLeft": "Website-Beweise"'
}

foreach ($pair in $translations.GetEnumerator()) {
  $loc = $loc.Replace($pair.Key, $pair.Value)
}

# Handle CJK separately (unique footerLeft values)
# Chinese
$loc = $loc.Replace('"footerLeft": "网站证据"', '"firstLineLabel": "开场白已就绪", "firstLineText": "我注意到 Northstar 的产品介绍很清晰，但演示入口需要滚动才能看到。", "firstLineMeta": "可直接使用 · 基于 3 条网站信号", "footerLeft": "网站证据"')
# Japanese  
$loc = $loc.Replace('"footerLeft": "Webサイトの証拠"', '"firstLineLabel": "ファーストライン完成", "firstLineText": "Northstarの製品説明は明確ですが、デモへの導線が最初のスクロールの後に配置されていることに気づきました。", "firstLineMeta": "コピー可能 · 3つのWebサイトシグナルに基づく", "footerLeft": "Webサイトの証拠"')
# Korean
$loc = $loc.Replace('"footerLeft": "웹사이트 증거"', '"firstLineLabel": "첫 줄 준비 완료", "firstLineText": "Northstar의 제품 설명은 명확하지만, 데모 경로가 첫 번째 스크롤 이후에 시작되는 것을 발견했습니다.", "firstLineMeta": "바로 사용 가능 · 3개의 웹사이트 신호 기반", "footerLeft": "웹사이트 증거"')

[System.IO.File]::WriteAllText($locPath, $loc)
Write-Host "Locales patched"
