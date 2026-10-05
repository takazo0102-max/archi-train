/* 電車で合格：オフライン用サービスワーカー
 * 方針：同一オリジンの GET は「キャッシュ優先、なければネットワーク→キャッシュに保存」。
 * ビルドごとにハッシュ付きアセット名が変わるため、新バージョンの index.html を取得した時点で
 * 古いキャッシュを捨てる（CACHE 名をビルド時刻で更新）。 */
const BASE = '/archi-train/'; // 公開先のパス（ビルド時に置換）
const CACHE = 'archi-train-' + '1791200286743';
const SHELL = [BASE, BASE + 'index.html', BASE + 'manifest.webmanifest', BASE + 'icon-192.png', BASE + 'icon-512.png', BASE + 'favicon.svg'];
// 概念図（SVG・軽い）はビルド時に一覧を埋め込み、インストール時にまとめてキャッシュ（オフラインでも図が出る）
const DIAGRAMS = ["/archi-train/diagrams/env-absorption-insulation.svg","/archi-train/diagrams/env-color-mixing.svg","/archi-train/diagrams/env-color-systems.svg","/archi-train/diagrams/env-condensation.svg","/archi-train/diagrams/env-daylight-assessment.svg","/archi-train/diagrams/env-detectors.svg","/archi-train/diagrams/env-drainage-vent.svg","/archi-train/diagrams/env-electrical-power.svg","/archi-train/diagrams/env-electrical.svg","/archi-train/diagrams/env-elevator-planning.svg","/archi-train/diagrams/env-energy-index.svg","/archi-train/diagrams/env-escalator.svg","/archi-train/diagrams/env-fire-equipment-misc.svg","/archi-train/diagrams/env-fire-extinguishing.svg","/archi-train/diagrams/env-fire-smoke-numbers.svg","/archi-train/diagrams/env-heat-transmission.svg","/archi-train/diagrams/env-hot-water.svg","/archi-train/diagrams/env-hvac-essentials.svg","/archi-train/diagrams/env-hvac-systems.svg","/archi-train/diagrams/env-light-color-temp.svg","/archi-train/diagrams/env-lumen-method.svg","/archi-train/diagrams/env-photometry.svg","/archi-train/diagrams/env-reverberation.svg","/archi-train/diagrams/env-solar-heat-gain.svg","/archi-train/diagrams/env-sound-distance.svg","/archi-train/diagrams/env-sound-level-sum.svg","/archi-train/diagrams/env-sun-altitude.svg","/archi-train/diagrams/env-terms-misc.svg","/archi-train/diagrams/env-thermal-indices.svg","/archi-train/diagrams/env-thermal-six.svg","/archi-train/diagrams/env-trap.svg","/archi-train/diagrams/env-vav.svg","/archi-train/diagrams/env-ventilation-practice.svg","/archi-train/diagrams/env-ventilation-rate.svg","/archi-train/diagrams/env-ventilation-types.svg","/archi-train/diagrams/env-visible-spectrum.svg","/archi-train/diagrams/env-water-supply-tank.svg","/archi-train/diagrams/env-water-supply.svg","/archi-train/diagrams/env-zeb.svg","/archi-train/diagrams/law-agreements-misc.svg","/archi-train/diagrams/law-allowable-stress.svg","/archi-train/diagrams/law-architect-duties.svg","/archi-train/diagrams/law-architect-office.svg","/archi-train/diagrams/law-architect-scope.svg","/archi-train/diagrams/law-barrier-free-numbers.svg","/archi-train/diagrams/law-building-coverage-relax.svg","/archi-train/diagrams/law-ceiling-height.svg","/archi-train/diagrams/law-change-of-use.svg","/archi-train/diagrams/law-city-planning.svg","/archi-train/diagrams/law-confirmation-flow.svg","/archi-train/diagrams/law-daylighting-rooms.svg","/archi-train/diagrams/law-definitions.svg","/archi-train/diagrams/law-direct-stairs.svg","/archi-train/diagrams/law-emergency-entry.svg","/archi-train/diagrams/law-emergency-lighting.svg","/archi-train/diagrams/law-energy-related-acts.svg","/archi-train/diagrams/law-evacuation-stairs.svg","/archi-train/diagrams/law-fire-compartment.svg","/archi-train/diagrams/law-fire-resistance-rules.svg","/archi-train/diagrams/law-fire-service-equipment.svg","/archi-train/diagrams/law-fire-spread.svg","/archi-train/diagrams/law-fire-zones.svg","/archi-train/diagrams/law-floor-area-garage.svg","/archi-train/diagrams/law-handrail-balcony.svg","/archi-train/diagrams/law-height-storey-area.svg","/archi-train/diagrams/law-interior-finish.svg","/archi-train/diagrams/law-low-rise-zone.svg","/archi-train/diagrams/law-main-structural-parts.svg","/archi-train/diagrams/law-misc-rules2.svg","/archi-train/diagrams/law-rc-steel-specs.svg","/archi-train/diagrams/law-related-acts.svg","/archi-train/diagrams/law-road-access.svg","/archi-train/diagrams/law-road-site.svg","/archi-train/diagrams/law-room-requirements.svg","/archi-train/diagrams/law-shadow.svg","/archi-train/diagrams/law-smoke-exhaust.svg","/archi-train/diagrams/law-stairs-dimensions.svg","/archi-train/diagrams/law-structure-misc-rules.svg","/archi-train/diagrams/law-use-zoning-table.svg","/archi-train/diagrams/law-ventilation-opening.svg","/archi-train/diagrams/law-volume-ratio.svg","/archi-train/diagrams/plan-barrier-free-numbers.svg","/archi-train/diagrams/plan-basic-terms.svg","/archi-train/diagrams/plan-construction-cost.svg","/archi-train/diagrams/plan-conversion.svg","/archi-train/diagrams/plan-daylighting.svg","/archi-train/diagrams/plan-design-process.svg","/archi-train/diagrams/plan-dimensions.svg","/archi-train/diagrams/plan-environment-indices.svg","/archi-train/diagrams/plan-exterior-details.svg","/archi-train/diagrams/plan-facilities-ethics.svg","/archi-train/diagrams/plan-hospital-ward.svg","/archi-train/diagrams/plan-housing-policy.svg","/archi-train/diagrams/plan-housing-terms2.svg","/archi-train/diagrams/plan-housing-types.svg","/archi-train/diagrams/plan-jp-history-terms.svg","/archi-train/diagrams/plan-library.svg","/archi-train/diagrams/plan-medical-welfare.svg","/archi-train/diagrams/plan-misc-terms2.svg","/archi-train/diagrams/plan-modern-houses-jp.svg","/archi-train/diagrams/plan-nursery-rules.svg","/archi-train/diagrams/plan-nursing-unit.svg","/archi-train/diagrams/plan-office-core.svg","/archi-train/diagrams/plan-parking.svg","/archi-train/diagrams/plan-procurement.svg","/archi-train/diagrams/plan-project-terms.svg","/archi-train/diagrams/plan-quantity-survey.svg","/archi-train/diagrams/plan-school-types.svg","/archi-train/diagrams/plan-theater-seating.svg","/archi-train/diagrams/plan-urban-systems.svg","/archi-train/diagrams/plan-urban-terms.svg","/archi-train/diagrams/plan-urban-theories.svg","/archi-train/diagrams/plan-western-history.svg","/archi-train/diagrams/plan-wheelchair-dims.svg","/archi-train/diagrams/plan-wood-eco-disaster.svg","/archi-train/diagrams/seko-concrete-acceptance.svg","/archi-train/diagrams/seko-concrete-curing.svg","/archi-train/diagrams/seko-concrete-mix-numbers.svg","/archi-train/diagrams/seko-concrete-placing.svg","/archi-train/diagrams/seko-concrete-strength.svg","/archi-train/diagrams/seko-contract-supervision.svg","/archi-train/diagrams/seko-earth-retaining.svg","/archi-train/diagrams/seko-excavation.svg","/archi-train/diagrams/seko-exterior-numbers.svg","/archi-train/diagrams/seko-finish-substrate.svg","/archi-train/diagrams/seko-formwork-pressure.svg","/archi-train/diagrams/seko-formwork-removal.svg","/archi-train/diagrams/seko-gas-weld-misc-numbers.svg","/archi-train/diagrams/seko-glass-clearance.svg","/archi-train/diagrams/seko-glass-numbers.svg","/archi-train/diagrams/seko-heaving-boiling.svg","/archi-train/diagrams/seko-htb-order.svg","/archi-train/diagrams/seko-interior-boards.svg","/archi-train/diagrams/seko-kiomote.svg","/archi-train/diagrams/seko-material-storage.svg","/archi-train/diagrams/seko-mep-numbers.svg","/archi-train/diagrams/seko-network.svg","/archi-train/diagrams/seko-notifications.svg","/archi-train/diagrams/seko-pile-methods.svg","/archi-train/diagrams/seko-pile-precast.svg","/archi-train/diagrams/seko-rebar-cover.svg","/archi-train/diagrams/seko-scaffold.svg","/archi-train/diagrams/seko-sealing.svg","/archi-train/diagrams/seko-seismic-retrofit.svg","/archi-train/diagrams/seko-site-management-numbers.svg","/archi-train/diagrams/seko-spt.svg","/archi-train/diagrams/seko-steel-bolt-numbers.svg","/archi-train/diagrams/seko-steel-erection.svg","/archi-train/diagrams/seko-stone-repair-numbers.svg","/archi-train/diagrams/seko-submission-table.svg","/archi-train/diagrams/seko-supervision-contract.svg","/archi-train/diagrams/seko-terms-contract.svg","/archi-train/diagrams/seko-tile-table.svg","/archi-train/diagrams/seko-waterproofing.svg","/archi-train/diagrams/seko-welding-terms.svg","/archi-train/diagrams/seko-wood-temporary.svg","/archi-train/diagrams/struct-base-isolation.svg","/archi-train/diagrams/struct-buckling-length.svg","/archi-train/diagrams/struct-calc-route.svg","/archi-train/diagrams/struct-cft.svg","/archi-train/diagrams/struct-column-base.svg","/archi-train/diagrams/struct-composite-src-pc.svg","/archi-train/diagrams/struct-deflection-stiffness.svg","/archi-train/diagrams/struct-eccentricity.svg","/archi-train/diagrams/struct-foundation-soil.svg","/archi-train/diagrams/struct-htb-friction.svg","/archi-train/diagrams/struct-liquefaction.svg","/archi-train/diagrams/struct-load-order.svg","/archi-train/diagrams/struct-load-vibration.svg","/archi-train/diagrams/struct-loads.svg","/archi-train/diagrams/struct-material-props.svg","/archi-train/diagrams/struct-pile-friction.svg","/archi-train/diagrams/struct-planning-essentials.svg","/archi-train/diagrams/struct-rc-min-dims.svg","/archi-train/diagrams/struct-rc-misc-points.svg","/archi-train/diagrams/struct-rc-section-buckling.svg","/archi-train/diagrams/struct-rc-shear-factors.svg","/archi-train/diagrams/struct-rc-youngs.svg","/archi-train/diagrams/struct-rebar-anchorage.svg","/archi-train/diagrams/struct-seismic-coef.svg","/archi-train/diagrams/struct-shear-bending.svg","/archi-train/diagrams/struct-soil-wood-rules.svg","/archi-train/diagrams/struct-steel-grades.svg","/archi-train/diagrams/struct-steel-lateral-buckling.svg","/archi-train/diagrams/struct-stress-strain.svg","/archi-train/diagrams/struct-wall-balance.svg","/archi-train/diagrams/struct-wood-connectors.svg","/archi-train/diagrams/struct-wood-strength.svg","/archi-train/diagrams/struct-wood-wall-amount.svg","/archi-train/diagrams/work-ronchamp.svg","/archi-train/diagrams/work-savoye.svg","/archi-train/diagrams/work-taian.svg","/archi-train/diagrams/work-unite.svg"];
// 写真（JPEG・重い）は見たものだけキャッシュし、ビルドをまたいでも保持する。まとめて保存はアプリからのメッセージで行う
const PHOTOS = ["/archi-train/diagrams/photo-3331.jpg","/archi-train/diagrams/photo-aachen-chapel.jpg","/archi-train/diagrams/photo-aore-nagaoka.jpg","/archi-train/diagrams/photo-artplaza-oita.jpg","/archi-train/diagrams/photo-asbestos.jpg","/archi-train/diagrams/photo-aspen-art-museum.jpg","/archi-train/diagrams/photo-barragan-house.jpg","/archi-train/diagrams/photo-berlin-fu-library.jpg","/archi-train/diagrams/photo-big-sight.jpg","/archi-train/diagrams/photo-bnf.jpg","/archi-train/diagrams/photo-bored-pile.jpg","/archi-train/diagrams/photo-byodoin.jpg","/archi-train/diagrams/photo-campidoglio.jpg","/archi-train/diagrams/photo-castelvecchio.jpg","/archi-train/diagrams/photo-chandigarh.jpg","/archi-train/diagrams/photo-chiba-art-museum.jpg","/archi-train/diagrams/photo-clt.jpg","/archi-train/diagrams/photo-concrete-pour.jpg","/archi-train/diagrams/photo-cordoba-mosque.jpg","/archi-train/diagrams/photo-curitiba-brt.jpg","/archi-train/diagrams/photo-demolition.jpg","/archi-train/diagrams/photo-docklands.jpg","/archi-train/diagrams/photo-dogo-onsen.jpg","/archi-train/diagrams/photo-engakuji-shariden.jpg","/archi-train/diagrams/photo-farnsworth.jpg","/archi-train/diagrams/photo-ford-foundation.jpg","/archi-train/diagrams/photo-formwork.jpg","/archi-train/diagrams/photo-fort-worth-modern.jpg","/archi-train/diagrams/photo-fukushima-big-palette.jpg","/archi-train/diagrams/photo-gifu-media-cosmos.jpg","/archi-train/diagrams/photo-glass-house.jpg","/archi-train/diagrams/photo-green-roof.jpg","/archi-train/diagrams/photo-hagia-sophia.jpg","/archi-train/diagrams/photo-hakata-es.jpg","/archi-train/diagrams/photo-hakogi-house.jpg","/archi-train/diagrams/photo-highline.jpg","/archi-train/diagrams/photo-hillside-terrace.jpg","/archi-train/diagrams/photo-hiunkaku.jpg","/archi-train/diagrams/photo-hoheikan.jpg","/archi-train/diagrams/photo-intl-childrens-library.jpg","/archi-train/diagrams/photo-inujima.jpg","/archi-train/diagrams/photo-ise-naiku.jpg","/archi-train/diagrams/photo-ishiyamadera-tahoto.jpg","/archi-train/diagrams/photo-iwamizawa-station.jpg","/archi-train/diagrams/photo-izumo-dome.jpg","/archi-train/diagrams/photo-izumo-taisha.jpg","/archi-train/diagrams/photo-johnson-wax.jpg","/archi-train/diagrams/photo-kagawa-pref-office.jpg","/archi-train/diagrams/photo-kaichi-school.jpg","/archi-train/diagrams/photo-kanazawa-geijutsumura.jpg","/archi-train/diagrams/photo-kasuga-taisha.jpg","/archi-train/diagrams/photo-kinkaku.jpg","/archi-train/diagrams/photo-kurashiki-ivy.jpg","/archi-train/diagrams/photo-kyocera-museum.jpg","/archi-train/diagrams/photo-kyoto-station.jpg","/archi-train/diagrams/photo-letchworth.jpg","/archi-train/diagrams/photo-lingotto.jpg","/archi-train/diagrams/photo-liquefaction.jpg","/archi-train/diagrams/photo-maekawa-house.jpg","/archi-train/diagrams/photo-magariya.jpg","/archi-train/diagrams/photo-makuhari-messe.jpg","/archi-train/diagrams/photo-marunouchi-bldg.jpg","/archi-train/diagrams/photo-millennium-dome.jpg","/archi-train/diagrams/photo-moca-la.jpg","/archi-train/diagrams/photo-mojiko-retro.jpg","/archi-train/diagrams/photo-moma.jpg","/archi-train/diagrams/photo-motomachi-apt.jpg","/archi-train/diagrams/photo-nageiredo.jpg","/archi-train/diagrams/photo-nigatsudo.jpg","/archi-train/diagrams/photo-notre-dame-paris.jpg","/archi-train/diagrams/photo-obuse.jpg","/archi-train/diagrams/photo-ota-library.jpg","/archi-train/diagrams/photo-ota-ward-office.jpg","/archi-train/diagrams/photo-ougi-daruki.jpg","/archi-train/diagrams/photo-pacifico.jpg","/archi-train/diagrams/photo-pantheon.jpg","/archi-train/diagrams/photo-parthenon.jpg","/archi-train/diagrams/photo-pola-museum.jpg","/archi-train/diagrams/photo-potsdamer-platz.jpg","/archi-train/diagrams/photo-precast-panel.jpg","/archi-train/diagrams/photo-pruitt-igoe.jpg","/archi-train/diagrams/photo-rebar-cage.jpg","/archi-train/diagrams/photo-rinshunkaku.jpg","/archi-train/diagrams/photo-ritsumeikan-oic.jpg","/archi-train/diagrams/photo-rohm-theatre.jpg","/archi-train/diagrams/photo-royal-library-copenhagen.jpg","/archi-train/diagrams/photo-ryujahei.jpg","/archi-train/diagrams/photo-san-carlo.jpg","/archi-train/diagrams/photo-san-marco.jpg","/archi-train/diagrams/photo-scaffolding.jpg","/archi-train/diagrams/photo-schroder-house.jpg","/archi-train/diagrams/photo-seattle-library.jpg","/archi-train/diagrams/photo-senboku-nt.jpg","/archi-train/diagrams/photo-senri-nt.jpg","/archi-train/diagrams/photo-sheet-pile.jpg","/archi-train/diagrams/photo-speyer.jpg","/archi-train/diagrams/photo-st-peters.jpg","/archi-train/diagrams/photo-steel-frame-erection.jpg","/archi-train/diagrams/photo-stockholm-library.jpg","/archi-train/diagrams/photo-sumita-town-hall.jpg","/archi-train/diagrams/photo-sumiyoshi.jpg","/archi-train/diagrams/photo-tamagawa-library.jpg","/archi-train/diagrams/photo-teshima.jpg","/archi-train/diagrams/photo-togudo.jpg","/archi-train/diagrams/photo-tokyo-station.jpg","/archi-train/diagrams/photo-tomihiro-museum.jpg","/archi-train/diagrams/photo-tomioka-silk.jpg","/archi-train/diagrams/photo-toranomon-hills.jpg","/archi-train/diagrams/photo-toshogu.jpg","/archi-train/diagrams/photo-tower-crane.jpg","/archi-train/diagrams/photo-toyama-lrt.jpg","/archi-train/diagrams/photo-tsuijibei.jpg","/archi-train/diagrams/photo-udatsu.jpg","/archi-train/diagrams/photo-umi-museum.jpg","/archi-train/diagrams/photo-usa-jingu.jpg","/archi-train/diagrams/photo-waju.jpg","/archi-train/diagrams/photo-welding-steel.jpg","/archi-train/diagrams/photo-westminster.jpg","/archi-train/diagrams/photo-wood-brace.jpg","/archi-train/diagrams/photo-yakushiji-pagoda.jpg","/archi-train/diagrams/photo-yokohama-minato-mirai.jpg"];
const PHOTO_CACHE = 'archi-train-photos';
const isPhoto = (pathname) => /\/diagrams\/photo-[^/]+\.(jpe?g|png)$/.test(pathname);
// Google Fonts（BIZ UDPゴシック）はキャッシュ優先で保持し、オフラインでも同じ書体にする
const FONT_HOSTS = ['fonts.googleapis.com', 'fonts.gstatic.com'];
// ハッシュ付きアセット（/assets/名前-ハッシュ.js|css）は中身が変わると名前も変わるので、ビルドをまたいで保持する。
// 問題データ（約4MB）が変わっていない更新では、スマホが再ダウンロードしなくて済む。
// 古いものは activate で、新しい index.html が参照していないものを消す（読めなければ消さない）
const ASSET_CACHE = 'archi-train-assets';
// 作り置きの読み上げ音声（別リポジトリ archi-train-audio）。音声はハッシュ名なので一度保存したものはずっと使える
const VOICE_CACHE = 'archi-train-voice';
const isVoiceClip = (pathname) => /\/archi-train-audio\/a\/[0-9a-f]+\.m4a$/.test(pathname);
const isVoiceManifest = (pathname) => /\/archi-train-audio\/manifest\.json$/.test(pathname);
const isAsset = (pathname) => /\/assets\/[^/]+-[\w-]{6,}\.(js|css)$/.test(pathname);

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then(async (c) => {
      await c.addAll(SHELL);
      // 図は失敗しても起動を止めない
      await Promise.all(DIAGRAMS.map((u) => c.add(u).catch(() => {})));
    }).then(() => self.skipWaiting())
  );
});
async function pruneAssets() {
  try {
    const html = await (await fetch(BASE + 'index.html', { cache: 'no-store' })).text();
    const used = new Set([...html.matchAll(/assets\/[^"'\s>]+\.(?:js|css)/g)].map((m) => m[0].split('/').pop()));
    if (used.size === 0) return;
    const c = await caches.open(ASSET_CACHE);
    for (const k of await c.keys()) {
      if (!used.has(new URL(k.url).pathname.split('/').pop())) await c.delete(k);
    }
  } catch { /* オフライン等：次回に回す */ }
}
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE && k !== CACHE + '-fonts' && k !== PHOTO_CACHE && k !== ASSET_CACHE && k !== VOICE_CACHE).map((k) => caches.delete(k))))
      .then(pruneAssets)
      .then(() => self.clients.claim())
  );
});
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (FONT_HOSTS.includes(url.hostname)) {
    e.respondWith(
      caches.match(req).then((hit) => hit || fetch(req).then((res) => {
        caches.open(CACHE + '-fonts').then((c) => c.put(req, res.clone()));
        return res;
      }))
    );
    return;
  }
  if (url.origin !== self.location.origin) return;
  if (isVoiceClip(url.pathname)) {
    e.respondWith(
      caches.open(VOICE_CACHE).then((c) => c.match(req).then((hit) => hit || fetch(req).then((res) => {
        if (res.ok) c.put(req, res.clone());
        return res;
      })))
    );
    return;
  }
  // 音声の一覧は新しいものを優先（追加された科目を拾う）。オフラインなら保存済みのもの
  if (isVoiceManifest(url.pathname)) {
    e.respondWith(
      fetch(req).then((res) => { if (res.ok) caches.open(VOICE_CACHE).then((c) => c.put(req, res.clone())); return res; })
        .catch(() => caches.open(VOICE_CACHE).then((c) => c.match(req)))
    );
    return;
  }
  if (isPhoto(url.pathname)) {
    e.respondWith(
      caches.open(PHOTO_CACHE).then((c) => c.match(req).then((hit) => hit || fetch(req).then((res) => {
        if (res.ok) c.put(req, res.clone());
        return res;
      })))
    );
    return;
  }
  if (isAsset(url.pathname)) {
    e.respondWith(
      caches.open(ASSET_CACHE).then((c) => c.match(req).then((hit) => hit || fetch(req).then((res) => {
        if (res.ok) c.put(req, res.clone());
        return res;
      })))
    );
    return;
  }
  // ナビゲーションはネットワーク優先（更新を拾う）、失敗時はキャッシュの index.html
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).then((res) => { caches.open(CACHE).then((c) => c.put(BASE + 'index.html', res.clone())); return res; })
      .catch(() => caches.match(BASE + 'index.html')));
    return;
  }
  e.respondWith(
    caches.match(req).then((hit) => hit || fetch(req).then((res) => {
      if (res.ok) caches.open(CACHE).then((c) => c.put(req, res.clone()));
      return res;
    }))
  );
});

// アプリからの依頼：写真をまとめて保存（進捗を返す）／保存状況の問い合わせ
self.addEventListener('message', (e) => {
  const port = e.ports && e.ports[0];
  const reply = (m) => { if (port) port.postMessage(m); };
  if (e.data?.type === 'photos-status') {
    caches.open(PHOTO_CACHE).then(async (c) => {
      const keys = await c.keys();
      const have = new Set(keys.map((r) => new URL(r.url).pathname));
      reply({ total: PHOTOS.length, cached: PHOTOS.filter((u) => have.has(u)).length });
    });
  } else if (e.data?.type === 'voice-status') {
    // 読み上げ音声：渡された一覧のうち保存済みの数
    const urls = e.data.urls || [];
    caches.open(VOICE_CACHE).then(async (c) => {
      const have = new Set((await c.keys()).map((r) => r.url));
      reply({ total: urls.length, cached: urls.filter((u) => have.has(u)).length });
    });
  } else if (e.data?.type === 'cache-voice') {
    // 読み上げ音声をまとめて保存（未保存のものだけ。数本ずつ並行で取る）
    const urls = e.data.urls || [];
    caches.open(VOICE_CACHE).then(async (c) => {
      const have = new Set((await c.keys()).map((r) => r.url));
      const todo = urls.filter((u) => !have.has(u));
      let done = urls.length - todo.length;
      reply({ total: urls.length, cached: done });
      const worker = async () => {
        while (todo.length) {
          const u = todo.shift();
          try { await c.add(u); } catch { /* 失敗しても続行 */ }
          done++;
          if (done % 20 === 0) reply({ total: urls.length, cached: done });
        }
      };
      await Promise.all([worker(), worker(), worker(), worker()]);
      reply({ total: urls.length, cached: done, done: true });
    });
  } else if (e.data?.type === 'cache-photos') {
    caches.open(PHOTO_CACHE).then(async (c) => {
      let done = 0;
      for (const u of PHOTOS) {
        if (!(await c.match(u))) {
          try { await c.add(u); } catch { /* 失敗しても続行 */ }
        }
        done++;
        if (done % 5 === 0 || done === PHOTOS.length) reply({ total: PHOTOS.length, cached: done, done: done === PHOTOS.length });
      }
    });
  }
});
