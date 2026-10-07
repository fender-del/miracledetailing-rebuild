# Homepage Miracle Detail · kế hoạch tối ưu trên nền v0.5

Ngày lập: 2026-10-02 · Trạng thái: **đã build homepage v2 (02/10) trong `site/`, chờ Fender xem. Chưa deploy, chưa đóng gói.** Vòng góp ý 02/10 đã đổi: hero thành video, gộp tuyên ngôn + Paul + Fifth Gear + 5 ô số thành khối Story ghim 3 nhịp, bỏ studio mới, Projects thành chồng thẻ, Coverage còn 1 dải, bỏ nút play/pause/scroll và hiệu ứng nút lắc. Chi tiết, số đo và mục chờ xác minh: `site/README.md`.
Kế hoạch này **thay cho mục 6 của `PLAN.md`** (12 block làm mới) và thay luôn bản `site/index.html` dựng hôm 01/10.

---

## 1. Nguyên tắc 80/20

**80% giữ nguyên của v0.5** (phần Ed và Paul đã dựng):
- Câu chữ, thứ tự block, số liệu.
- Bộ ảnh thật đang dùng: nền Elementor lấy từ `uploads/2026/08/download*.jpg`.
- Màu đen, vàng, trắng.
- Nhịp bố cục.

Người đã xem v0.5 phải nhận ra ngay đây là trang của mình, chỉ mượt hơn và chạy tốt hơn.

**20% thay đổi:**
- **Theo bộ chuẩn DMI:**
  - Thêm H1 thật, meta, schema; dùng một CTA duy nhất.
  - Sửa lỗi nội dung.
  - Thêm form 3 bước và thanh liên hệ dính đáy trên điện thoại.
- **Phần sáng tạo thêm:**
  - Hệ chuyển động và tương tác.
  - Gom gọn phần câu chuyện Paul, việc này Ed đã đồng ý.

**Font:** dùng Saira (phương án C, đã chốt). Đây là thay đổi về hình dễ thấy nhất so với v0.5, mọi thứ khác giữ nguyên.

---

## 2. Từng block: v0.5 → bản tối ưu

| # | Block v0.5 (giữ chữ) | Sửa 20% | Chuyển động và tương tác |
|---|---|---|---|
| 1 | **Header**: wordmark MIRACLE DETAIL, menu | Thêm nút "Book a consultation"; dùng lại slug của site cũ | Ẩn khi cuộn xuống, hiện lại khi cuộn lên. Menu điện thoại mở toàn màn hình kiểu mặt nạ trượt, các mục hiện lần lượt. |
| 2 | **Hero**: "Paul Dalton · Feynlab's Only Global Ambassador · As Seen on Fifth Gear · Est. 1994" / **There is only one standard. Perfection.** / đoạn "Over 30 years…" / 2 nút | Thêm **H1 nhỏ "Car detailing in Surrey"** phía trên slogan, giống cách đã làm ở DMI. "Reserve Your Appointment" đổi thành "Book a consultation", "The Miracle Detail Story" giữ làm link phụ. | Chữ hiện theo từng dòng. Chữ "Perfection." có một vệt sáng quét qua như lúc đánh bóng. Nền có **vệt đèn light tunnel chạy theo chuột**, như ánh đèn soi lỗi sơn. Ảnh nền trôi chậm hơn khi cuộn. Có gợi ý cuộn xuống. |
| 3 | **Dải số**: Years in the trade · Year established · Cars detailed by hand · National newspapers · TV appearances | **Số thật nằm sẵn trong HTML** (30+, 1994, 10,000+, 7, 4). Hiện tại các ô này đang hiện "0" khi script không chạy. | Đếm lên một lần khi cuộn tới. Các ô dạng kính nổi trên đáy hero. |
| 4 | **Dải địa danh**: London · Surrey · Hong Kong · Monaco · Portugal… / "Detailing from Surrey to the world" | Giữ | Chạy ngang, **nhanh hay chậm theo tốc độ cuộn**, đổi chiều theo hướng cuộn. Dừng khi rê chuột, có nút dừng. |
| 5 | **Tuyên ngôn**: "Most detailers clean cars. Paul Dalton corrects and protects them…" | Giữ | Từng chữ sáng dần theo nhịp cuộn (giống phần chữ mở đầu của Forge). |
| 6–8 | **Paul · Featured On · Fifth Gear MC12** (3 block) | **Gộp thành một chương "The man behind the work":** giữ đoạn "since 1988", cắt còn 2–3 câu, link "The Full Story" sang About. Fifth Gear, Motorheads, RTL, Nippon TV và 7 tờ báo thành một dải. Thẻ MC12 có **số thật 61 stages · 64 hours · £5,000** (hiện cũng đang hiện "0"). | Ảnh Paul trôi bên trong khung. Dải báo đài hiện lần lượt. Ba số của MC12 đếm lên. |
| 9 | **The next chapter**: studio mới ở Lingfield, tháng 7/2026 | Giữ | Ảnh studio mở ra bằng một khung cắt (như mở cửa xưởng). 4 tiện ích hiện lần lượt. |
| 10 | **Dịch vụ**: "Find what your car needs", 4 dịch vụ chính + 8 dịch vụ khác | Sửa lỗi gõ "ineeds" và "5 LEVELS -ENHANCEMENT". Ô Leather đang mang nhầm mô tả của Tint. Thêm "From £X + VAT". | **Thẻ dịch vụ tương tác:** nghiêng 3D theo chuột có lò xo, vệt bóng như ánh đèn trên sơn chạy theo con trỏ, ảnh bên trong trôi. 8 dịch vụ phụ dạng danh sách: rê vào dòng nào thì ảnh nổi lên bám theo chuột. |
| 11–13 | **Coverage + danh sách thị trấn** (Surrey, Kent, Sussex & Hampshire, London & beyond; hiện mỗi danh sách bị lặp 2 lần) | Gộp thành block **"Visiting the studio"**: các tab theo vùng, mỗi vùng một danh sách thị trấn, bỏ phần lặp. Google Maps thật tông tối và nút "Get directions", giống cách đã làm ở DMI. | Đổi tab có trượt mượt. Bản đồ chỉ tải khi cuộn gần tới. |
| 14 | **Google Reviews**: 5.0, 140+, 6 review | Thống nhất một con số: GBP đang ghi 139. Sửa các tiêu đề "Google Reviews" bị gắn nhầm ở block gallery và coverage. | Thẻ kiểu Google (chữ G, sao vàng, avatar màu) chạy vòng. **Kéo được bằng chuột, có quán tính**, dừng khi rê, có nút dừng. |
| 15 | **"The studio sees everything from classics to daily drivers"** (đang là danh sách tên xe) | Giữ câu và danh sách. Thêm ảnh thật cho các xe đã có trang dự án ở gallery cũ. | **Băng thẻ ảnh kéo ngang, có quán tính.** Con trỏ hiện chữ "Drag". Mỗi thẻ mở trang dự án. |
| 16 | **Kết: "The studio is ready. Is your car?"** + số điện thoại + địa chỉ | **Thay đoạn lorem ipsum.** Thêm form 3 bước và "What happens next". "See the Results" trỏ sang Projects. Giữ một địa chỉ duy nhất (chờ Paul xác nhận). | Các bước của form trượt sang nhau. Nút từ tính. |
| 17 | **Footer** | Đủ dịch vụ, địa chỉ và số điện thoại (một bản duy nhất) | Trên điện thoại có thanh dính đáy: **Call · WhatsApp · Book**. |

---

## 3. Hệ chuyển động

Cùng bộ công cụ với Forge và HB Body:
- **GSAP 3.13** gồm ScrollTrigger, SplitText, Draggable, InertiaPlugin, tất cả đều miễn phí.
- **Lenis** cho cuộn mượt.
- Không cần React.

**Toàn trang:**
1. **Cuộn trôi** bằng Lenis (lerp khoảng 0.09), đồng bộ với ScrollTrigger. Bấm link neo thì trang trôi tới chỗ cần đến.
2. **Con trỏ riêng:** một chấm nhỏ và một vòng tròn đi trễ có quán tính, đổi trạng thái theo vị trí:
   - trên link: to ra
   - trên ảnh dự án: hiện "View"
   - trên băng kéo: hiện "Drag"
   - trên video: hiện "Play"
3. **Nút từ tính:** nút hút nhẹ về phía con trỏ, bật lại bằng lò xo khi chuột rời đi.
4. **Thẻ tương tác:** nghiêng 3D tối đa ±6° có giảm chấn, vệt bóng như đèn soi sơn chạy theo con trỏ, thẻ nâng lên kèm bóng đổ.
5. **Chữ:** tiêu đề hiện theo dòng bằng mặt nạ; vạch vàng của eyebrow tự kẻ ra.
6. **Ảnh:**
   - Lazy load: ảnh mờ rồi rõ dần khi tải xong.
   - Ảnh trôi chậm hơn khung chứa nó.
   - Ảnh lớn mở ra bằng khung cắt.
7. **Theo vận tốc cuộn:** dải địa danh và dải logo chạy nhanh hay chậm theo tốc độ cuộn.
8. **Kéo có quán tính:** reviews và băng xe, thả tay thì còn trôi tiếp rồi chậm dần như vật thật.
9. **Nền chuyển màu mượt** giữa các block (đen ↔ than chì) khi cuộn qua.
10. **Đếm số** một lần khi block vào khung hình.
11. **Màn mở đầu dưới 1 giây:** wordmark hiện ra kèm một vệt sáng, chỉ ở lần mở đầu tiên trong phiên, không chặn nội dung.

**Cảm giác vật lý:**
- Mọi chuyển động đi theo con trỏ dùng `gsap.quickTo` có độ trễ và giảm chấn.
- Kéo dùng InertiaPlugin, vận tốc lấy từ chính cú vuốt.
- Không có chuyển động nào dừng phắt hay chạy tuyến tính.

---

## 4. Điện thoại, tốc độ, accessibility

- **Điện thoại (màn cảm ứng):**
  - Không có con trỏ riêng, không có hiệu ứng nghiêng thẻ.
  - Giữ chữ hiện dần, đếm số, dải chạy ngang và băng vuốt.
  - Cuộn dùng quán tính gốc của iOS (đã rất giống vật lý thật). Lenis chỉ bật trên máy tính (xem mục 6).
- **Reduced motion:** tắt toàn bộ chuyển động, nội dung vẫn hiện đủ.
- **Khi script không chạy:** mọi nội dung vẫn hiện, không phần nào phải chờ script mới thấy.
- **Ngân sách tốc độ:**
  - JS khoảng 80 KB gzip.
  - LCP trên điện thoại ≤2,5 giây.
  - Chỉ animate transform và opacity, giữ 60fps.
  - Ảnh AVIF/WebP có srcset; video chỉ tải khi cuộn gần tới.
- **Thử trên máy thật:** iPhone Safari, trong app Instagram và Facebook, bật Low Power Mode. Trên máy tính: Chrome và Safari.

---

## 5. Thứ tự làm (khoảng 2 ngày cho homepage)

1. **Khung:**
   - Dùng lại khung DMI-2026 (`build.js`, `render.js`, `site.js`).
   - Tokens màu v0.5 và font Saira.
   - Cài GSAP và Lenis.
   - Viết `motion.js` theo từng module: cursor, magnetic, tilt, split, reveal, counters, marquee, drag, parallax, header.
2. **Chuyển nội dung:**
   - Lấy copy và ảnh của v0.5 (homepage và CSS Elementor `post-20.css`) sang 14 block.
   - Áp các sửa đổi 20% ở mục 2.
3. **Gắn motion** cho từng block, kiểm tra tốc độ sau mỗi block.
4. **QA:** 390 / 768 / 1440, reduced motion, Lighthouse mobile, không lỗi console, không tràn ngang.
5. **Gửi Fender xem.** Chỉ deploy Netlify khi Fender bảo.

---

## 6. Fender đã chốt (02/10)

- **Dịch vụ:** giữ đúng vị trí như v0.5. Phần Paul gom gọn, nhờ vậy dịch vụ tự lên sớm hơn.
- **Hero:** Claude chọn một ảnh tốt hơn ảnh nền hiện tại của v0.5, lấy từ Drive. Vệt đèn theo chuột vẫn giữ.
- **Lenis:** chỉ bật trên máy tính. Điện thoại dùng quán tính cuộn gốc.
- **Ảnh Drive:** đã tải 20 ảnh từ "High res pics for Ed" vào `assets-src/drive/` (khoảng 140 MB ảnh gốc). Khi build, ảnh được nén sang AVIF/WebP có srcset.

## 7. Ảnh cho từng block

| Block | Ảnh (`assets-src/drive/`) | Ghi chú |
|---|---|---|
| Hero | `01-hero-red-supercar-spray.jpg` (7434×4956): LaFerrari trong màn nước, đèn studio, nền đen | Có thể là buổi chụp LaFerrari của GF Williams năm 2015. Trên máy tính xe lệch sang phải, chữ đặt bên trái; trên điện thoại cắt dọc lấy xe ở giữa. Cần xác nhận credit. |
| Hero dự phòng, nền block tối | `02-gfw-red-macro-dark.jpg` | Ảnh GF Williams |
| Ceramic (thẻ dịch vụ) | `03-gfw-water-beading.jpg`: nước bắn trên sơn đỏ | Ảnh GF Williams |
| Tuyên ngôn, studio | `04-gfw-red-detail.jpg` | Ảnh GF Williams |
| Paint correction | `06-paint-correction-pad.png`, `08-correction-tape-line.png` | |
| PPF | `07-ppf-squeegee.png`, `05-detail-gold-macro.png` | |
| Dry ice | `09-engine-bay.png`: dry ice trên khoang máy Ferrari | |
| Băng xe | `10-zonda-studio`, `11-koenigsegg-carbon`, `12-bugatti-studio`, `13-ferrari-enzo`, `14-ferrari-f40`, `15-mclaren-studio`, `19-porsche-classic`, `20-gfw-458-speciale`, cộng ảnh gallery cũ (McLaren F1, Veyron...) | |
| Studio mới | `16-studio-interior.png`, `15-mclaren-studio.png` | Vẫn cần ảnh studio mới thật từ Paul |
| Paul | `17-paul-with-client.png` (áo Miracle Detail), `18-paul-portrait.png` | Cần Ed xác nhận đây đúng là Paul |

Credit "Photography: GF Williams" ghi dưới các ảnh `gfw-*` và ở footer.
