# Ý tưởng tương tác cho các trang có chất liệu (06/10/2026)

> **07/10: đã dựng phần "Cách trình bày khi cuộn" (§1–4) cho mọi trang, rồi sửa theo góp ý cùng ngày** (mỗi hiệu ứng 1 lần/trang; danh mục chính đi ngang có tiêu đề neo; Dry ice vẽ lại bằng canvas và ghim lại). Chi tiết ở `site/README.md` mục "Scroll kit". Bảng tương tác riêng từng trang ngay dưới đây **chưa dựng**, chờ Fender chọn.

Chưa build gì. Fender chỉ cần ý tưởng trước. Nguyên tắc:
- Tương tác chỉ trình bày lại chữ và số liệu của Paul trên v0.5, không thêm nội dung mới.
- Không dùng ảnh AI giả làm job thật.
- Build xong cả đợt rồi mới QA một lần.

| # | Trang | Tương tác | Chất liệu có sẵn | Công |
|---|---|---|---|---|
| 1 | Paint correction | Thanh kéo 5 cấp độ: kéo từ I tới V, ảnh sơn xước thật (ảnh 50/50 `pc-split`) sạch dần theo % lỗi được xử lý (65 → 100%). Con số % to chạy theo, thẻ cấp độ đổi theo. | 5 cấp độ kèm % "Defect removal" | Vừa |
| 2 | Ceramic | Thước độ bền 0–10 năm: 6 lớp phủ là 6 vạch dài theo số năm, chạm vào vạch thì mở thẻ. Có nút lọc "Self-healing" và "Không dành cho sơn" (Industrial). | Số năm, mô tả, danh sách của 6 lớp phủ | Vừa |
| 3 | Window tint | Thanh kéo độ tối VLT trên hình kính xe, hiện ngay kính nào hợp pháp (kính lái ≥75%, kính trước ≥70%, kính sau không giới hạn). Kèm hiệu ứng chameleon đổi màu theo chuột hoặc khi nghiêng điện thoại. | Danh sách VLT, 4 ý về chameleon | Vừa |
| 4 | PDR | Vạch đèn phản chiếu cong quanh vết móp, cuộn hoặc kéo thì thẳng dần ("The art of reading metal"). Vẽ bằng code, vì trang này không có ảnh nào. | 5 bước | Vừa |
| 5 | Leather | Thanh kéo trước/sau trên ảnh ghế thật của site cũ. Chỉ làm khi chắc cặp ảnh là cùng một ghế. | Ảnh job da trên site cũ | Nhỏ |
| 6 | Aftercare | Checklist rửa xe: tick từng bước, có thanh tiến độ, máy tự nhớ (localStorage). Có nút sao chép mã MIRACLE. | 6 quy tắc, 8 bước | Nhỏ |
| 7 | Wheels | Một bánh xe vẽ bằng code đổi finish: Diamond cut, Powder coat, và Colour change với các màu Paul liệt kê. | 4 dịch vụ, danh sách màu | Vừa–lớn |
| 8 | Packages | Thanh chọn Level 1–5: một thẻ đổi theo level, kèm thanh thời gian, thanh độ bền và giá. | Thời gian, độ bền, giá | Vừa |
| 9 | Bodyshop | Hành trình "One call" chạy theo cuộn: điện thoại, xe tải kín, bodyshop, studio, giao xe. | Câu chuyện khách và 4 bước | Vừa |
| 10 | About | Thanh năm dính bên cạnh timeline (1988 → 2026) để nhảy nhanh giữa 24 mốc. | Timeline | Nhỏ |
| 11 | Mobile | Bản đồ phủ sóng: Lingfield ở giữa, 9 khu vực sáng lên khi chạm. | Danh sách khu vực | Vừa–lớn |

**Không làm thêm:** Dry ice (đã có chuỗi −78,5°C), PPF (bản vẽ phủ film), Gallery (bộ lọc và lightbox), Services, Journal.

**Đề xuất đợt 1:** 1, 2, 3, 4, 6, 10. **Đợt sau:** 5, 7, 8, 9, 11.

## Cách trình bày khi cuộn (06/10, chỉ là ý tưởng)

Mục tiêu: phong phú và sáng tạo nhưng vẫn sang như homepage. Không trang nào giống hệt trang nào, nhưng cũng không phải làm từng trang từ đầu.

### 1. Một bộ chuyển động dùng chung, viết một lần

Viết sẵn 6 kiểu chuyển động. Mỗi trang chỉ cần chọn kiểu và cấu hình, không phải code lại:

| Kiểu | Hoạt động thế nào | Dùng cho |
|---|---|---|
| **Đèn soi** | Một vệt sáng như đèn kiểm tra sơn quét ngang khi chuyển section, lật nền section sau. | Nhóm Sơn |
| **Ray ngang ghim** | Cuộn dọc thì dải thẻ chạy ngang. Trên điện thoại đổi thành vuốt. | 5 cấp độ, 6 lớp phủ, 5 level |
| **Zoom từ cận cảnh** | Section mở bằng ảnh cực cận (vân da, mặt mâm, mép kính) rồi lùi ra thành ảnh toàn cảnh. | Nhóm Phục hồi |
| **Sân khấu ghim** | Hình đứng yên một bên, các bước cuộn qua bên kia, có vạch tiến độ. Đã có ở Dry ice. | Nhóm Quy trình |
| **Chồng thẻ dính** | Thẻ sau trượt lên đè thẻ trước như xếp bài. | Packages, Credentials |
| **Lắp ảnh trôi** | 2–3 ảnh trôi ở độ sâu khác nhau, chữ đứng giữa. | About, Mobile |

Các hiệu ứng đã có từ homepage dùng lại cho mọi trang: tiêu đề lật từng chữ, câu statement sáng dần, panel ngà nở ra, nền ảnh zoom, mở như rèm.

### 2. Khung chung, cụm nào cũng theo

Hero (ảnh + hàng số) → thanh mục lục → statement sáng dần → **1 khoảnh khắc "wow" của cụm** → các gói và lựa chọn → **1 tương tác riêng của trang** → ảnh job → reviews → book.

Ba luật nhịp:
- Xen kẽ nền tối, nền ngà và nền ảnh. Không để quá 2 section tối liền nhau.
- Mỗi trang tối đa 1 section ghim, để cuộn không bị kẹt và không mệt.
- Mỗi trang có đúng 1 khoảnh khắc "wow" và 1 tương tác. Phần còn lại chỉ hiện chữ nhẹ nhàng, để giữ vẻ sang.

### 3. Bốn cụm, mỗi cụm một chữ ký riêng

| Cụm | Trang | Chữ ký khi cuộn | Cách trang trong cụm khác nhau |
|---|---|---|---|
| **A. Sơn** | Correction, Ceramic, PPF | **Đèn soi:** hero thu nhỏ thành khung ảnh trong lúc statement sáng lên. Chuyển section bằng vệt đèn quét qua. Gói hoặc cấp độ chạy trên ray ngang ghim. | Correction: đèn quét từ trái. Ceramic: ánh nước loang (hydrophobic). PPF: giữ bản vẽ phủ film. |
| **B. Quy trình** | Dry ice, PDR, Bodyshop | **Sân khấu ghim:** một hình kể quá trình đứng yên, chữ cuộn qua. Chuyển section bằng một đường kẻ mảnh cắt ngang, gọn và kỹ thuật. | Dry ice: chuỗi −78,5°C (đã có). PDR: vạch phản chiếu thẳng dần. Bodyshop: hành trình "One call". |
| **C. Phục hồi** | Wheels, Leather, Tint | **Zoom từ cận cảnh** vào chất liệu. Thẻ dịch vụ hiện so le như mẫu vật liệu. Trước/sau chạy theo cuộn. | Wheels: mặt mâm xoay nhẹ theo cuộn. Leather: vân da lùi ra. Tint: kính tối dần theo cuộn, nối với thanh VLT. |
| **D. Câu chuyện** | About, Mobile, Packages | **Biên tập kiểu tạp chí:** lắp ảnh trôi, quote toàn khổ chia chương. | About: số năm cuộn như đồng hồ cạnh timeline. Mobile: ray ngang "Surrey → Portugal → Monaco". Packages: 5 level xếp chồng thẻ dính. |
| **E. Tiện ích** | Aftercare, Services, Gallery, Journal | Giữ tĩnh: chỉ hiện dần chữ. Aftercare có thanh tiến độ dính. | Ưu tiên đọc và thao tác, không thêm hiệu ứng. |

### 4. Thứ tự làm để tiết kiệm thời gian và token

1. **Viết bộ 6 kiểu chuyển động**, mỗi kiểu một module, có bản cho chế độ giảm chuyển động và bản điện thoại. Đây là phần tốn công nhất nhưng chỉ làm một lần.
2. **Cụm A (Sơn) trước**, vì đây là các trang bán chính. Làm Correction làm mẫu cho Fender duyệt, rồi áp sang Ceramic.
3. Cụm B, rồi cụm C. Mỗi trang chủ yếu chỉ cần cấu hình và tương tác riêng.
4. Cụm D.
5. Cụm E chỉnh nhẹ.
6. **QA một lần cuối:** 17 trang × 7 chế độ, test thao tác điện thoại, Lighthouse giữ trên 90.

**Giới hạn để vẫn sang và nhanh:**
- Trên điện thoại không ghim ngang, đổi thành vuốt.
- Mọi hiệu ứng đều tắt khi người dùng bật chế độ giảm chuyển động.
- Không dùng video mới.
- Mỗi trang thêm tối đa khoảng 15 KB JS.

## Việc đã sửa ngày 06/10, chưa QA

- Video homepage: phủ thêm một lớp tối nhẹ (`02-hero.css`).
- Chồng thẻ Projects nhận cú vuốt ngay, không phải chờ thẻ cũ bay hết (`deck.js`).
- Logo các hãng ở dải "In the studio" mở Gallery đã lọc theo hãng (`11-projects.html`, `loops.js`).
- Thẻ dịch vụ không còn nhảy khi rê chuột: đọc vị trí chuột trên ô `<li>` đứng yên, và lò xo không còn nảy quá đà (`pointer.js`, `08-services.css`).

**Bước tiếp theo:**
1. Fender chọn tương tác.
2. Build cả đợt.
3. QA một lần duy nhất: 17 trang × 7 chế độ, cộng test thao tác trên điện thoại và Lighthouse.
