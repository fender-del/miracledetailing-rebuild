# Miracle Detail · Phương án build Phase 1 (bản Netlify)

Ngày lập: 2026-10-01 · Người đặt: Ed (DMI) · Khách: Paul Dalton, Miracle Detail (Lingfield, Surrey, UK)
Trạng thái: **mới là phương án, chưa build.** Bước build đầu tiên là homepage để Ed xem.

---

## 0. Tóm tắt

- **Đích:** reskin toàn site Miracle Detail thành một site dịch vụ (không phải portfolio), chạy trên Netlify trong **7–8 ngày làm việc**. Homepage làm trước, gửi Ed xem rồi mới làm tiếp.
- **Cách dựng:** site tĩnh ghép từ block, dùng lại bộ khung DMI-2026 (`build.js`, `src/blocks`, `src/pages`, `site.js`). Mỗi URL giữ đúng slug của site cũ, để sau này chuyển sang theme WordPress riêng mà không phải đổi URL.
- **Sơ đồ:** 21 trang lõi + 153 trang dự án (nhập từ gallery cũ). 9 trang hạt và 3 trang trùng ý định được gộp và 301 về trang tương ứng.
- **Giao diện mới hoàn toàn:** giữ màu của v0.5 (đen, vàng, trắng), đổi chữ sang font automotive vừa mạnh vừa sang. Ảnh và clip thật là chính, không dùng video AI ở Phase 1.
- **Motion Phase 1:** nhẹ và gọn, dùng cuộn trang thật, không cướp cuộn. Mỗi block có sẵn chỗ để Phase 2 (khoảng 6 tháng nữa) gắn motion lên mà không phải sửa lại cấu trúc.
- **Chuyển đổi:** một nút duy nhất "Book a consultation" mở form 3 bước, phụ là Call / WhatsApp, kèm thanh dính đáy trên điện thoại.

---

## 1. Order và bối cảnh (từ `links ref, etc.txt`)

**Paul muốn:**
- Làm xong và đưa site hiện tại lên sóng trước, giữ toàn bộ công SEO đã làm.
- Biến web thành kho lưu trữ lâu dài các dự án (McLaren F1, Veyron, Zonda Tricolore, Koenigsegg, LaFerrari...).
- Mọi thứ xoay quanh Miracle Detail, Paul Dalton và hơn 30 năm lịch sử.
- Mobile phải tốt ngang desktop, vì phần lớn khách đến từ Instagram và Facebook.
- Khoảng 6 tháng nữa nâng lên bản motion "kiểu Lando Norris / Lamborghini", nhưng không làm motion cho có: xe, tay nghề và ảnh vẫn là chính.
- Trong lúc chờ, cần có thêm việc và lượt hỏi giá.

**Fender đã góp ý với Ed:**
- Video siêu thực tốn nhiều thời gian và tiền.
- Homepage đọc giống hồ sơ sự nghiệp của Paul hơn là site dịch vụ.
- Các trang khác quá nhiều chữ.

**Ed đồng ý:** giữ các thông tin chính, chuyển câu chuyện của Paul sang trang About.

**Bộ chuẩn DMI** (Drive, `DMI_Car_Detailing_Website_AI_Master_Standard.md`):
- Áp dụng có chọn lọc. Bộ chuẩn viết cho khách Mỹ, còn Miracle là khách VIP nên được phép lệch.
- Dùng tiếng Anh UK chứ không dùng tiếng Anh Mỹ.
- CTA đổi thành "Book a consultation" thay cho "Get a free quote".
- Giữ nguyên: mỗi trang một mục đích và một H1, có bằng chứng trước khi xin niềm tin, không bịa dữ kiện, mục nào chưa chắc thì ghi "Verification Required", và rà checklist Do Not Ship 30 điểm.

---

## 2. Hiện trạng sau khi crawl

Dữ liệu crawl nằm ở `crawl/`:
- `old/seo-inventory.csv`: 33 URL của site cũ
- `old/gallery-inventory.csv`: 153 trang dự án
- `v05/seo-inventory.csv`: 18 URL của v0.5
- `pages/*.md`: nội dung từng trang
- `netlify-v1-home.html`: homepage v1

| Nguồn | Tình trạng | Ý nghĩa cho bản build |
|---|---|---|
| **Site cũ** miracledetail.co.uk | WordPress + Elementor (GeneratePress child), SEOPress Pro, Gravity Forms, LiteSpeed + Cloudflare. Có 33 URL trong sitemap, gồm 9 trang hạt gần như giống hệt nhau (~530–580 chữ). H1 nhồi từ khoá. Homepage dài khoảng 15.500px, màn đầu trên điện thoại chỉ toàn chữ. Form liên hệ khoảng 30 ô kèm CAPTCHA, không có lựa chọn Instagram. robots.txt chặn bot của các công cụ AI. | Phải giữ URL và tín hiệu SEO đang có. Kết quả Google UK ngày 01/10: homepage đứng **#6** cho "car detailing surrey", trang dry ice **#4** cho "dry ice cleaning surrey", trang **ceramic** lại đứng #5 cho "paint correction surrey" (hai trang đang tranh từ khoá của nhau). |
| **153 trang `/gallery/[xe]/`** (ẩn, không có trong sitemap) | 6.696 ảnh gốc, trung bình 8 chữ mỗi trang. Có McLaren F1 (115 ảnh), CCX-R (78), Zonda F Clubsport (57), 5 chiếc Veyron, 2 LaFerrari, Enzo, F40 Monaco, 288 GTO, 2 Carrera GT, SLR, xen lẫn xe thường. `/gallery/before-and-afters/` có 17 ảnh 50/50 thật. `/vehiclemake/ferrari/` là trang theo hãng có sẵn. | Đây là phần móng của kho Projects mà Paul muốn. |
| **v0.5** (staging) | WordPress 7.1 + Elementor (Astra), 17 trang. Không có H1, meta description hay schema nào. Còn "From £???", lorem ipsum ở homepage, một đoạn luật dán phim cách nhiệt lạc vào trang Ceramic, một ảnh ChatGPT ở Ceramic. Các ô số hiện "0" khi script không chạy. 11 slug khác site cũ. **Đang cho Google index.** | **Nguồn nội dung chính:** copy tốt, có giá thật và đủ dòng thời gian của Paul. Không dùng giao diện hay slug của nó. |
| **Homepage v1** (Netlify, người khác dựng) | HTML/CSS/JS thuần. Video hero 28 MB, tổng khoảng 79 MB video, 4 thẻ H1. | Fender chọn làm mới hoàn toàn, không dùng lại. |
| **Drive "High res pics for Ed"** | Khoảng 90 ảnh thật và 9 thư mục: bodyshop, dent removal, gloss meter, interior, leather before/after, mobile van, Paul đánh bóng BMW M3 Touring, transportation, wheel before/after. | Nguồn ảnh cho hero, các trang dịch vụ và block "Paul". |
| **Google Business Profile** | Địa chỉ ghi "Unit 10, Jesmor Trading Estate", danh mục là "Valeting service", có dòng "Own this business?" (có thể chưa xác minh). Điểm 5.0 với 139 review. | **Địa chỉ không khớp:** site cũ và v1 ghi "Unit 8–9 Jesmor Farm", còn v0.5 và GBP ghi "Unit 10". Paul phải xác nhận. |

---

## 3. Nghiên cứu: những nguyên tắc rút ra

Nguồn: 5 nhánh nghiên cứu ngày 01/10, đã đối chiếu NN/g, Baymard, Google Search Central, W3C, WebKit, Awwwards và Codrops, kèm kết quả tìm kiếm thật trên google.co.uk.

1. **"Kiểu Lando Norris / Lamborghini" là gì, cụ thể:**
   - **landonorris.com** (OFF+BRAND, Awwwards Site of the Year 2025) chạy Webflow + Lenis + một lớp WebGL, tải khoảng 6,4 MB trước lần cuộn đầu. Giám khảo vẫn chấm thấp ở accessibility (7.0) và SEO (7.4).
   - **Lamborghini** dùng video điện ảnh, nhiều khoảng đen, chữ to và gallery vuốt ngang, không dùng 3D.
   - Bài học cho Miracle: điểm ấn tượng nằm ở **ảnh, chữ và nhịp**, không nằm ở việc nhồi hiệu ứng.
2. **Không cướp cuộn (scrolljacking).** NN/g ghi nhận đa số người dùng bị mất phương hướng, nặng nhất trên điện thoại. Fade khi cuộn nên ở 100–400ms. Video tự chạy phải có nút dừng (WCAG 2.2.2).
3. **SEO không cần tường chữ.** Google không có số chữ tối thiểu. Nội dung để trong accordion vẫn được tính, miễn là nằm sẵn trong HTML. Vì vậy phần kỹ thuật dài của v0.5 **được chuyển vào accordion chứ không bị xoá.**
4. **Mỗi trang một ý định tìm kiếm, không phải mỗi từ khoá một trang.** Các trang theo vùng chỉ thay tên vùng bị Google coi là doorway. Một 301 không được đổ về homepage không liên quan.
5. **Khách từ Instagram vào bằng trình duyệt nhúng trong app** (WebKit). Video tự chạy không được đảm bảo, Low Power Mode chặn autoplay. Ô nhập phải ≥16px để iPhone khỏi zoom. Dùng đơn vị `svh` thay cho `100vh`.
6. **Chuyển đổi:**
   - Nên hiện giá "from" và giữ form ngắn.
   - Coachline (Weybridge) là mẫu UK tốt nhất: có rating ngay ở hero, giá kèm thời gian làm, before/after ghi chú số micron đã gỡ.
   - Mẫu kho dự án: ESOTERIC (lọc theo hãng và dịch vụ).
   - Mẫu cách kể một dự án: Thornley Kelham.
7. **Điểm hơn đối thủ:** không ai trong vùng có 30 năm hypercar đứng tên người sáng lập, cũng không ai có một coating mang tên mình. Hai mảng "hypercar" và "concours preparation" trên Google UK hiện **chưa ai chiếm.**

---

## 4. Quyết định đã chốt (grill 4 lượt, 01/10)

| # | Chủ đề | Chốt |
|---|---|---|
| 1 | Đích | Lên tới **bản Netlify**, trong 7–8 ngày làm việc. Chuyển sang WordPress tính sau. |
| 2 | Duyệt | Build **homepage trước** cho Ed xem, rồi đề xuất bước tiếp. |
| 3 | Nền tảng | Site tĩnh như DMI-2026. Cấu trúc block và dữ liệu phải sẵn sàng để sau này đổi thành theme WordPress riêng (không Elementor), Projects là một loại bài riêng. |
| 4 | Giao diện | Làm mới hoàn toàn, không theo v1 hay v0.5. **Màu theo v0.5**, font automotive vừa mạnh vừa sang (mẫu font ở mục 7). |
| 5 | Media | Ảnh thật trên Drive và gallery cũ, cộng 4–6 clip iPhone thật của Paul (mỗi clip 5–10 giây). **Không dùng video AI.** |
| 6 | Sơ đồ trang | Duyệt sơ đồ gộp (mục 5). Giữ slug của site cũ. |
| 7 | Số liệu | Không có quyền Search Console / GA4 / GBP, nên làm theo nguyên tắc và 301 mọi URL cũ. |
| 8 | CTA | **Book a consultation** trên toàn site. Form 3 bước, phụ là Call / WhatsApp, thanh dính đáy trên điện thoại. |
| 9 | Giá | **"From £X + VAT"** theo ý Fender. Signature và hypercar để POA. Rủi ro đã nêu ở mục 11. |
| 10 | Homepage | Theo thứ tự 12 block ở mục 6. |
| 11 | Projects | Nhập cả 153 trang dự án, viết đầy đủ 8 case study. |

---

## 5. Sơ đồ trang, menu và 301

### 5.1 Trang có URL riêng (21 trang lõi)

| URL (giữ slug site cũ) | Vai trò, từ khoá chính | Nguồn nội dung |
|---|---|---|
| `/` | Car detailing + Surrey + Miracle Detail / Paul Dalton | v0.5 home, viết lại |
| `/car-care-services/` | Hub dịch vụ, chia theo nhu cầu: Correct / Protect / Clean | Mới |
| `/car-detailing-studio/` | Packages 5 cấp, từ Maintenance tới Signature, có giá. **Maintenance Detailing** là một mục H2 trong trang này | v0.5 `/packages/` |
| `/paint-correction-and-polishing/` | Paint correction | v0.5 |
| `/ceramic-coatings/` | Ceramic, gồm Ceramic by Paul Dalton và wheel ceramic | v0.5 (sửa lỗi) |
| `/paint-protection-film-ppf/` | PPF | v0.5 |
| `/dry-ice-blasting-and-laser-cleaning/` | Dry ice. **Underbody Cleaning & Protection** là một mục H2 (Feynlab Industrial V2) | v0.5 |
| `/new-car-protection/` | Gói bảo vệ xe mới (PPF + ceramic) | **Mới** |
| `/supercar-hypercar-detailing/` | Supercar và hypercar gộp làm một (6/8 kết quả tìm kiếm trùng nhau) | **Mới**, lấy từ timeline + Projects |
| `/classic-concours-detailing/` | Classic và concours preparation gộp làm một | **Mới** |
| `/leather-restoration/` | Leather | v0.5 |
| `/mobile-car-detailing/` | Mobile | v0.5 |
| `/window-tinting/` | Tint và phim chống đạn | v0.5 |
| `/wheel-refurbishment/` | Làm mới mâm | v0.5 |
| `/bodyshop-repair/` | Bodyshop và sơn | v0.5 |
| `/paintless-dent-removal/` | PDR | v0.5 |
| `/car-detail-gallery/` | **Trang tổng Projects**: lọc theo hãng, nhóm, đời và dịch vụ | Mới. `/gallery/` hiện chỉ 301 về trang chủ nên không dùng |
| `/gallery/[xe]/` × 153 | Trang dự án | Gallery cũ |
| `/vehiclemake/[hãng]/` | Trang theo hãng (đã có sẵn trên site cũ) | Sinh tự động từ tag |
| `/about-paul-dalton-car-detailing/` | Câu chuyện của Paul: timeline, báo chí, chứng nhận | v0.5 `/about-paul/` |
| `/contact-us/` | Book a consultation, địa chỉ, bản đồ, mục **"Visiting the studio"** (thời gian lái từ London, Kent, Sussex, Essex...) | Mới |
| `/journal/` + `/aftercare-washing-guide/` | Bài viết và hướng dẫn chăm sóc | v0.5 |

Ngoài ra có `/privacy/`, `/terms/` và trang 404.

### 5.2 Menu

**Services ▾ · Specialist cars ▾ · Packages · Projects · About Paul · [Book a consultation]**

Services ▾ có 3 nhóm:
- **Correct & restore:** Paint correction, Leather, Wheels, Bodyshop, PDR
- **Protect:** Ceramic, PPF, New car protection, Tint
- **Clean & preserve:** Dry ice & underbody, Maintenance, Mobile

Footer liệt kê đủ mọi dịch vụ, địa chỉ, giờ mở cửa và số điện thoại.

**Hai lớp riêng biệt:** URL phục vụ tìm kiếm, còn menu phục vụ người đọc. Một trang không cần có chỗ trên menu mới lên được Google; nó chỉ cần link từ hub, footer, breadcrumb và từ các trang dự án.

### 5.3 Bảng 301

Đưa vào `_redirects` trên Netlify; sau này dùng lại trong SEOPress hoặc Cloudflare.

```
/surrey-car-detailing/            /                          301
/sussex-car-detailing/            /contact-us/               301
/kent-car-detailing/              /contact-us/               301
/london-car-detailing/            /contact-us/               301
/essex-car-detailing/             /contact-us/               301
/hampshire-car-detailing/         /contact-us/               301
/hertfordshire-car-detailing/     /contact-us/               301
/oxfordshire-car-detailing/       /contact-us/               301
/buckinghamshire-car-detailing/   /contact-us/               301
/studio-car-valeting/             /car-detailing-studio/     301
/car-detail-faqs/                 /car-detailing-studio/     301
/after-care-with-feynlab/         /aftercare-washing-guide/  301
/videos/                          /car-detail-gallery/       301
/blog/                            /journal/                  301
/category/uncategorized/          /journal/                  301
/facebook-competition/            /journal/                  301
/new-product-launch/              /ceramic-coatings/         301
/car-audio-installation-fabrication-pssound/  /car-care-services/  301   (xác minh: dịch vụ còn không?)
```

**Slug của v0.5** (`/about-paul/`, `/packages/`, `/paint-correction/`, ...) được đổi về slug cũ ngay trong bản build. Riêng staging v0.5 đang cho index, nên Ed cần đặt noindex hoặc mật khẩu (xem mục 12).

---

## 6. Homepage: 12 block (bản đầu gửi Ed)

| # | Block | Nội dung | Ghi chú dựng |
|---|---|---|---|
| 01 | **Hero** | **H1 "Car detailing in Surrey"**. Eyebrow "Paul Dalton's Miracle Detail · Lingfield". Thêm 35–70 chữ: paint correction, ceramic, PPF, từ xe hằng ngày tới hypercar, Paul tự tay làm từ 1994. Dải tin cậy: ★ 5.0 Google (139) · Est. 1994 · As seen on Fifth Gear. Nút [Book a consultation] và [WhatsApp]. | Ảnh tĩnh tải trước, `fetchpriority=high`. Clip thật của Paul (light tunnel) tắt tiếng, `playsinline`, có nút dừng; điện thoại dùng bản cắt dọc riêng. Khi người dùng bật reduced motion thì chỉ hiện ảnh poster. Chiều cao hero theo nội dung, không ép 100vh. |
| 02 | **Dải bằng chứng** | Fifth Gear · Feynlab's only global ambassador · Ceramic by Paul Dalton · PPF since 2006 · First UK dry-ice detailer (2014) · Concours record | Đứng yên trên máy tính, vuốt ngang trên điện thoại, không tự chạy. Mọi claim cần xác minh. |
| 03 | **Dịch vụ theo nhu cầu** | 3 nhóm Correct / Protect / Clean. Mỗi thẻ có tên, một dòng kết quả, "From £X + VAT" và link. 4 dịch vụ chính có ảnh. | Lưới thẻ dùng chung với trang hub. |
| 04 | **Hypercar wall** | McLaren F1, Veyron, LaFerrari, F40, Zonda F Clubsport, CCX-R, Carrera GT, Enzo, mỗi xe link tới trang dự án. Nút "See 150+ projects". | Hàng vuốt ngang trên điện thoại. Đây là điểm khác biệt chính. |
| 05 | **Before/after** | Một cặp 50/50 thật (lấy từ `/gallery/before-and-afters/`), ghi chú bằng số đo thật từ máy đo độ bóng và độ dày sơn của Paul. | Kéo hoặc chạm vào thanh đều đổi được (WCAG 2.5.7). Thanh kéo không tranh với cuộn trang. |
| 06 | **"When you call, you speak to Paul"** | Ảnh Paul đang làm (Drive), 3–4 câu và 4 bằng chứng: một người làm, dụng cụ đo, sản phẩm Paul cùng phát triển, tư vấn thật lòng kể cả khi gói thấp hơn là đủ. Link "Paul's story" sang About. | Một block duy nhất, không kể tiểu sử. |
| 07 | **Studio mới ở Lingfield** | Mở tháng 7/2026: kiểm soát nhiệt độ, light tunnel, khu correction và PPF, khu dry ice và phủ gầm. | Cần ảnh studio mới (xin Paul). |
| 08 | **Google reviews** | 6 review thật, có tên và xe, kèm điểm, số lượt và link sang Google. | Không tự chạy; nếu có chạy thì phải có nút dừng. |
| 09 | **Visiting the studio** | Thời gian lái từ London (~56 phút / 27 dặm), Surrey, Kent, Sussex, Essex. "Studio appointments only · Mon–Sat". Nhắc tới dịch vụ mobile. | Phần này thay cho 9 trang hạt. |
| 10 | **FAQ 6 câu** | Mất bao lâu? Có cần correction trước ceramic? Có đưa đón xe không? Có nhận xe thường không? Đặt lịch thế nào? Giá ra sao? | Dùng `<details>`, nội dung nằm sẵn trong HTML. |
| 11 | **Book a consultation** | Form 3 bước, kèm khung "What happens next": Paul xem thông tin → gọi hoặc WhatsApp tư vấn → chốt ngày. | Chỉ hứa thời gian phản hồi nếu Paul đồng ý. |
| 12 | **Footer** | Địa chỉ và số điện thoại (đúng một bản), giờ mở cửa, mọi dịch vụ, mạng xã hội (IG ~22k, FB ~23.5k, YouTube ~18.5k), link shop Feynlab. | Thanh dính đáy trên điện thoại: **Call · WhatsApp · Book**. |

---

## 7. Hệ thống thiết kế

**Màu (theo v0.5):**
- `--ink #111111`: nền chính
- `--graphite #1B1B1D`: nền khối
- `--gold #C9A84D`: điểm nhấn, eyebrow, nút
- `--gold-deep #9C7F2E`: chữ vàng trên nền sáng
- `--paper #F4F2EE`: khối đọc dài như giá và FAQ, nếu dùng
- `--white #FFFFFF`

Độ tương phản:
- Vàng trên `#111`: khoảng 8.3:1
- Trắng trên `#111`: khoảng 18.9:1
- Không dùng vàng cho đoạn văn dài, không dùng chữ nét mảnh trên nền đen.

**Font:** 3 cặp, có mẫu chữ thật trong trang xem trực quan.

| Phương án | Tiêu đề | Thân bài | Cảm giác |
|---|---|---|---|
| **A (đề xuất)** | **Archivo Expanded** (trục wdth 125, đậm 700–800, viết hoa, giãn chữ nhẹ) | Archivo (wdth 100, 400–500) | Mạnh, hiện đại, gần ngôn ngữ của Porsche Design và McLaren. Một họ font nên gọn và đồng bộ. Có tiếng Việt. |
| B | Michroma (dáng Eurostile, như đồng hồ xe thập niên 70) | Manrope | Motorsport cổ điển, hợp mảng classic và concours. Chỉ có một độ đậm. |
| C | Saira Expanded / Condensed | Saira | Chất đua xe, gắt nhất trong ba. Có tiếng Việt. |

**Chất riêng của Miracle:**
- Dùng nhãn số đo **thật** trên trang dự án: độ bóng (GU), độ dày sơn (µm), số giờ làm.
- Dùng vạch đèn của light tunnel làm đường kẻ phân cách.
- Ảnh luôn là ảnh thật, không dùng ảnh stock hay AI.

**Logo:**
- Trước mắt dùng wordmark chữ "MIRACLE DETAIL" đặt bằng font tiêu đề, như cách v0.5 đang làm.
- Logo tròn cũ đã lỗi thời. Logo chính thức để Ed hỏi Paul.

**Motion Phase 1:**
- Hiện dần bằng CSS trong 100–400ms.
- Chuyển cảnh theo cuộn nằm trong `@supports (animation-timeline: view())`.
- Hover chỉ áp dụng khi dùng chuột.
- Không Lenis, không ghim block, không cuộn ngang trên điện thoại.
- Mọi motion đặt trong `prefers-reduced-motion: no-preference`.

---

## 8. Template các trang

**Trang dịch vụ (dạng nhiều lớp, ít chữ ở trên, chi tiết ở dưới):**
1. Hero: H1 "[Service] in Surrey", thẻ tóm tắt (sửa được gì, mất bao lâu, From £, nút Book)
2. Dải bằng chứng riêng của dịch vụ
3. Các gói hoặc lựa chọn, có giá "from"
4. **Một module giúp quyết định riêng cho từng dịch vụ:**
   - PPF: sơ đồ vùng phủ
   - Ceramic: so sánh độ bền 1–10 năm
   - Correction: các cấp độ
   - Dry ice: các vị trí áp dụng
   - Tint: ghi chú độ xuyên sáng (VLT) theo luật UK
5. Quy trình 4 bước
6. Before/after và các dự án gắn tag dịch vụ đó
7. Vì sao chọn Paul cho dịch vụ này (3 ý)
8. Giới hạn: dịch vụ không làm được gì
9. Review
10. FAQ
11. Book a consultation, điền sẵn tên dịch vụ

Phần kỹ thuật dài của v0.5 đưa vào accordion "The detail" (nằm sẵn trong HTML).

**Trang dự án** (`/gallery/[xe]/`):
- Tiêu đề "Năm Hãng Mẫu (màu)" và nhãn nhóm (Hypercar / Supercar / Classic & concours / Everyday)
- Yêu cầu của khách
- Tình trạng lúc nhận xe, kèm số đo
- Việc đã làm: dịch vụ, sản phẩm, số giờ
- 12–20 ảnh chọn lọc, xem toàn màn hình được
- Before/after và video nếu có
- Kết quả hoặc lời chủ xe, ghi chú của Paul
- Dự án trước và sau, các dịch vụ liên quan
- Nút "Book a consultation for a car like this"

145 trang còn lại ở dạng gọn: tên, nhãn, gallery và một câu giới thiệu chỉ dùng dữ kiện đã biết. Nâng cấp dần sau.

**8 case study viết kỹ:**
- McLaren F1 (115 ảnh)
- Bugatti Veyron Jet Black (42 ảnh)
- LaFerrari Monaco
- Ferrari F40 Monaco
- Pagani Zonda F Clubsport (57 ảnh)
- Koenigsegg CCX-R (78 ảnh)
- Maserati MC12 Fifth Gear (cần một trang mới và ảnh)
- Mercedes 600

Nếu MC12 hoặc Mercedes 600 thiếu ảnh thì thay bằng Porsche Carrera GT (28 ảnh).

**Trang tổng Projects** (`/car-detail-gallery/`):
- Lọc theo hãng, nhóm, đời (thập niên) và dịch vụ. Mọi thẻ nằm sẵn trong HTML để Google đọc được.
- Hypercar xếp lên đầu.
- Trang theo hãng dùng `/vehiclemake/[hãng]/`.

**About:**
- Lấy từ v0.5, gồm timeline 1988 → 2026, phần Fifth Gear MC12, 5 chứng nhận và phần "On price".
- Bỏ các ô số hiện "0".

**Contact:**
- Form 3 bước:
  1. Xe: hãng, mẫu, năm
  2. Việc cần làm: chọn bằng nút (có lựa chọn "not sure"), ghi chú, ảnh không bắt buộc
  3. Liên hệ: tên, cách liên hệ ưa thích, số điện thoại (nói rõ vì sao cần)
- Thêm Instagram vào câu "How did you hear?".
- Kèm "Visiting the studio" và bản đồ.

---

## 9. Kỹ thuật bản Netlify

- **Khung:**
  - Copy bộ khung DMI-2026 sang `site/`: `build.js`, `src/lib/render.js`, `schema.js`, `servicePage.js`.
  - Viết bộ block mới cho Miracle; tokens mới ở `00-tokens.css`.
  - `site.js` giữ NAP, menu và CTA ở **một chỗ duy nhất**.
- **Hợp đồng cho Phase 2:**
  - Mỗi block nằm trong `<section data-section="..." data-motion="...">`.
  - Media đặt trong khung có tỷ lệ cố định, ảnh poster có sẵn.
  - CSS và JS cho motion để riêng (`motion.css`, `motion/`).
  - Block HTML viết sao cho cắt thẳng thành `template-parts` của theme WordPress, dữ liệu trang chuyển thành trường ACF.
- **Ảnh:**
  - Ảnh hero và ảnh của 8 case study chép về repo, đổi sang AVIF/WebP.
  - Kho 6.696 ảnh dự án **không chép**: dùng Netlify Image CDN lấy trực tiếp từ `miracledetail.co.uk/wp-content` (khai báo `remote_images` trong `netlify.toml`), tự đổi kích thước và định dạng.
  - Mọi ảnh có alt; trang gallery cũ có 152/153 ảnh thiếu alt.
- **Video Phase 1:**
  - Các clip iPhone xuất H.264 720p, kèm bản HEVC nếu cần.
  - Mỗi clip ≤3 MB, tắt tiếng, `playsinline`, lặp lại, có poster và nút dừng.
  - Không tải sẵn (preload).
- **SEO:**
  - Mỗi trang một H1, có title và meta riêng.
  - Schema:
    - `AutomotiveBusiness` / `LocalBusiness` (trang chủ, Contact)
    - `Person` (Paul, trang About)
    - `Service`
    - `BreadcrumbList`
    - `CreativeWork` + `ImageGallery` (trang dự án)
    - `VideoObject` (khi có video)
  - Có `sitemap.xml`, `robots.txt` và `_redirects` (mục 5.3).
  - **Bản demo trên Netlify chặn index** (`X-Robots-Tag: noindex` trong `netlify.toml`) để không trùng nội dung với site thật.
- **Form:**
  - Netlify Forms nhận form 3 bước; ảnh tải lên bị giới hạn dung lượng, gửi ảnh qua WhatsApp là đường dự phòng.
  - Khi chuyển sang WordPress thì dùng Gravity Forms có sẵn trên site cũ.
- **Mục tiêu đo:**
  - Core Web Vitals trên mobile: LCP ≤2.5s, INP ≤200ms, CLS ≤0.1.
  - Ở 390px: 0 lỗi console, 0 tràn ngang.
  - Rà checklist Do Not Ship 30 điểm của DMI.

---

## 10. Lịch 7–8 ngày làm việc

| Ngày | Việc | Kết quả |
|---|---|---|
| **1** | Dựng khung, tokens, chốt font (A/B/C), `site.js`. Chọn ảnh từ Drive và gallery cũ. Viết copy homepage. Gửi Ed danh sách clip và câu hỏi xác minh. | Nền chạy được |
| **2** | Dựng 12 block homepage cho máy tính và 390px. QA: console, tràn ngang, 1 H1, reduced motion, Lighthouse mobile. | **Chốt 1: gửi Ed homepage** kèm đề xuất bước tiếp |
| 3 | Sửa theo Ed. Dựng 3 template: dịch vụ, dự án, hub/packages. | Template |
| 4 | 8 trang dịch vụ lõi: Packages, Correction, Ceramic, PPF, Dry ice + Underbody, Leather, New car protection, Mobile. | Trang dịch vụ |
| 5 | Supercar & Hypercar, Classic & Concours, Tint, Wheels, Bodyshop, PDR, hub Services, About, Contact, Journal và Aftercare. | Đủ trang lõi |
| 6 | Script nhập 153 trang dự án, trang tổng có bộ lọc, viết 8 case study. | Projects |
| 7 | Title/meta, schema, sitemap, 301, noindex cho demo, ảnh OG. Tối ưu ảnh và video, rà accessibility. | SEO và tốc độ |
| 8 | QA toàn site ở 390 / 768 / 1024 / 1440. Fender thử trên iPhone thật: Safari, trong app Instagram và Facebook, Low Power Mode. Rà checklist Do Not Ship. | **Chốt 2: bản Netlify hoàn chỉnh.** Chỉ deploy khi Fender bảo; không đóng gói zip khi chưa được yêu cầu. |

Từ ngày 3 trở đi có thể thay đổi theo góp ý của Ed sau Chốt 1.

---

## 11. Rủi ro và cách xử lý

| Rủi ro | Xử lý |
|---|---|
| **Giá ghi "+ VAT"**: theo ASA CAP 3.18 và luật DMCC (CMA được phạt trực tiếp từ 4/2025), giá cho khách cá nhân phải gồm VAT | Đã báo, Fender chọn giữ "+ VAT". Ghi chú để Ed báo Paul. Đổi sang "inc. VAT" sau này chỉ cần sửa một chỗ trong `site.js` (tính ×1.2). |
| Địa chỉ không khớp giữa các nguồn | Tạm dùng một địa chỉ ở `site.js`, gắn cờ xác minh, không để mỗi trang một địa chỉ. |
| Claim chưa kiểm chứng | Giữ claim nhưng đánh dấu trong danh sách xác minh. Không bịa thêm claim mới. |
| Clip của Paul đến muộn | Hero vẫn đủ với ảnh tĩnh; clip là phần thêm vào sau. |
| Netlify Image CDN phụ thuộc site cũ | Chỉ áp cho kho ảnh dự án. Khi lên WordPress, ảnh vẫn nằm trong media library nên không gãy link. |
| Video trong app Instagram không tự chạy | Poster luôn đẹp và đủ ý, video chỉ là phần thêm. |
| Khối lượng chữ lớn (21 trang + 8 case study) | Claude viết theo nội dung v0.5 và bộ chuẩn DMI, Fender QA, Ed duyệt. |

---

## 12. Cần Paul hoặc Ed xác minh (Verification Required)

1. **Địa chỉ:** Unit 8–9 Jesmor Farm hay Unit 10 Jesmor Trading Estate? Studio mới ở địa chỉ nào? GBP đã xác minh chưa, danh mục có đổi được sang "Car detailing service" không?
2. **Giá:**
   - Các mục còn "From £???": Ceramic by Paul Dalton, Ultra V2, correction cấp 1–5, tint, bodyshop.
   - Giá New car protection.
   - Báo Paul về rủi ro "+ VAT".
3. **Claim:**
   - Feynlab "only global ambassador"
   - PPF từ 2006, "longest-serving UK installer"
   - Người đầu tiên ở UK dùng dry ice (2014)
   - Concours thắng 100%
   - 10.000+ xe, 7 báo quốc gia
   - "37 years" hay "30+ years" (bắt đầu 1988, thành lập 1994)
   - Tỷ lệ % lỗi được gỡ ở trang correction (bộ chuẩn DMI khuyên bỏ, trừ khi Paul duyệt)
4. **Dịch vụ còn làm không:** laser cleaning, underbody protection, car audio (PS Sound), bodyshop và PDR (tự làm hay qua đối tác?).
5. **Media:**
   - 4–6 clip iPhone: light tunnel, đánh bóng, dry ice, nước trên lớp ceramic, xe vào studio
   - Ảnh studio mới
   - Ảnh MC12 Fifth Gear
   - Số đo độ bóng và độ dày sơn thật
   - Quyền dùng ảnh (Andreas Jansson, GF Williams)
   - Biển số và mặt khách cần che
6. **Review:** 139 hay "140+"; có được dùng tên người review không.
7. Các trang gallery có vẻ trùng (AMV-8/AMV8, E39 M5/M5 E39, hai trang 997 Turbo Cab Basalt, Emira ×2, RS6 ×2): có phải cùng một xe không?
8. Số WhatsApp, giờ mở cửa, có đưa đón xe không (trên Drive có thư mục "Transportation page").

---

## 13. Đề xuất ngoài phạm vi build (gửi Ed, làm được ngay)

- **v0.5 đang cho Google index:** đặt "Discourage search engines" hoặc mật khẩu ngay, tránh trùng nội dung với site thật.
- **Sửa GBP:** địa chỉ, danh mục, xác minh, đăng ảnh dự án hằng tuần, nhờ khách ghi tên xe và dịch vụ trong review. Mở thêm Apple Business Connect.
- **Site cũ:** rút gọn form 30 ô, thêm Instagram vào "How did you hear?", thêm link WhatsApp có sẵn tin nhắn.
- **robots.txt:** cho phép OAI-SearchBot (ChatGPT search) và các bot tìm kiếm.
- **Ngày lên sóng thật:** xác minh Search Console bằng DNS, bật GA4 và Meta Pixel sau khi khách đồng ý cookie, đo lượt gửi form, gọi và WhatsApp theo nguồn.
- **Link trong bio Instagram:** trỏ về trang `/start` có gắn tracking.

---

## 14. Lộ trình Phase 2 (khoảng 6 tháng)

1. **Chuyển sang WordPress:**
   - Dựng theme riêng (PHP + ACF PRO + `theme.json`), **trên một bản sao của site THẬT, không dựng trên v0.5**, để giữ URL, dữ liệu SEOPress và Gravity Forms.
   - Projects là custom post type, kèm taxonomy hãng và dịch vụ.
   - Viết script WP-CLI để chuyển nội dung, chạy lại được nhiều lần.
2. **Lớp motion** gắn vào các thuộc tính `data-motion`, không đổi template hay URL.
   - Công cụ: GSAP + ScrollTrigger (miễn phí toàn bộ từ bản 3.13), CSS scroll-driven animations (Safari 26), View Transitions giữa thẻ dự án và hero của dự án đó.
   - Lenis chỉ bật trên máy tính.
   - WebGL chỉ chạy trên máy đủ mạnh, ảnh poster luôn là phương án dự phòng.
3. **Các pattern nên ưu tiên** (đều làm nổi tay nghề của Paul):
   - Phản chiếu light tunnel chạy trên sơn
   - Một lượt đánh bóng chạy theo cuộn
   - Video xe tách nền chạy xuyên qua các block
   - Bảng vinh danh hypercar dạng ghim
   - Khói dry ice chạy theo con trỏ hoặc ngón tay
   - Before/after dạng lau
4. **Buổi chụp của GF Williams:** soạn shot list phục vụ Phase 2 (ảnh tĩnh và clip lặp: light tunnel, xe vào studio, dry ice, dán PPF, nước trên lớp ceramic, Paul làm việc). Quay thật sẽ hơn dựng 3D hoặc dùng AI.
5. Video AI chỉ dùng khi Fender hoặc Ed duyệt chi phí credit.
