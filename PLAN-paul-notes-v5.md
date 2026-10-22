# Paul notes v5: kế hoạch sửa theo ghi chú của Fender (22/10/2026)

Nguồn: `feedback paul tổng hợp.xlsx`, cột L và U (ô vàng + 9 ghi chú cột L không tô màu, vẫn tính). Code: branch `fix/paul-notes-v5` tạo từ 236b16f. Ảnh Drive của Paul: kiểm kê ở `side-session-notes/.../drive-inventory-2026-10-22.md`.

Đã chốt với Fender (22/10):
- Góp ý 23: chỉ bỏ dấu "—" trong 2 đoạn Paul thêm sau (dưới hero homepage); phần còn lại của site đã theo luật từ đầu.
- Ảnh Drive không có (Paul phủ ceramic, dán phim kính): gen close-up siêu thực trên Higgsfield, không lộ mặt, và xin Paul ảnh thật song song. Góp ý 85 dùng ảnh rửa xe thật IMG_2393.
- Mobile 68: về lại ảnh Koenigsegg ở London Concours.
- Gallery: tải lại toàn bộ ảnh từ web cũ; job nào thiếu thì xin Paul.

Chuẩn bị: ảnh nguồn của Brian không có trên máy (chỉ có bản đã build), nên `assets-src/` của worktree (gitignored) chỉ chứa ảnh mới. Build bằng `node tools/images.js --only=<id>`, không dùng `--force`.

## Thứ tự làm (mỗi trang: build → QA 360/390/768/1440 → Fender xem → mới sang trang kế)

### 1. Homepage (`src/pages/00-home.js`, `src/blocks/02-hero.html`, `09-coverage.*`, `motion/coverage.js`, `tools/images.js`)
| # | Paul | Brian | Fender | Cách sửa | Cần Paul |
|---|---|---|---|---|---|
| 1 | Hero xỉn, muốn Lambo STO / video 30s | Hero đã là STO, chờ Paul chốt video | Link Drive có bản STO 8K | Dựng lại `hero-sto` từ `Miracle_Detail_Lamborghini_STO_8K_FIXED 2.jpg` (8 MB), thêm cỡ 1920/2560 cho màn lớn, soi crop trên điện thoại | Video 30s: Drive không có file video nào |
| 5 | Thẻ Protect cần ảnh underside coating | Đã thay ảnh underside | không thấy rõ | Thay bằng ảnh mới Paul gửi 19/10 (5EBFF7A6: khung gầm vừa phủ đen trên cầu nâng, ảnh thật), crop cho thẻ 4:5 đọc được ngay | — |
| 6 | Thẻ Correct & restore cần ảnh PDR | Đã thay ảnh PDR Audi | không thấy rõ | Crop lại ảnh Audi: sát tay + que PDR + bảng đèn, bỏ phần nóc/cốp thừa; nếu vẫn khó đọc ở cỡ thẻ thì dùng ảnh E30 + bảng đèn | — |
| 21 | Muốn thêm xe thường | Thêm Golf R, M135i, Focus RS | thêm xe, nhớ check | Thêm 2–3 xe thường nữa từ gallery cũ (ảnh thật toàn xe), kiểm từng thẻ: link mở đúng job, số ảnh khớp, chữ đúng | — |
| 22 | Thẻ Clubsport link tới xe cũ | Chờ Paul | bỏ, thế xe khác | Bỏ thẻ Porsche Clubsport, thay bằng xe khác có job trong gallery (ưu tiên xe gần đây, ảnh toàn xe đẹp) | — |
| 23 | Thêm 2 đoạn dưới "Perfection." | Done | không dùng "—" | Thay "—" trong 2 đoạn đó bằng dấu phẩy/hai chấm, chữ giữ nguyên | — |
| 24 | Thêm khối Service areas | Done | Bản đồ lướt bị giật; câu "Distance is rarely…" nổi hơn; con trỏ trên tên địa điểm thành dạng bôi chữ | Đo hiệu năng khối ghim (scrub, đọc layout mỗi khung hình), sửa cho mượt; câu kết to hơn, màu vàng; tên địa điểm `cursor: default` + không chọn chữ | — |

### 2. Services (`src/pages/23-services.js`, `tools/images*.js`)
| 25 | Hero: xe mới trong studio mới | Gallardo cam | Đổi sang Aston Martin DB11 xanh trong studio mới | Dùng ảnh DB11 F8613B6F (Drive), crop hero máy tính + điện thoại. Lưu ý: ảnh trông như đã dựng/chỉnh bằng AI, không có Paul; Fender xem khi duyệt | — |

### 3. Gallery (`tools/gallery.js`, `src/lib/gallery.json`, `covers.json`)
| 34, 35 | Gallery không đẹp như cũ; cần ảnh chính toàn xe | Chọn tay ảnh chính 133 job | Tải toàn bộ ảnh từ web cũ; thiếu thì xin Paul | Crawl lại https://miracledetail.co.uk/car-detail-gallery/ lấy ảnh gốc lớn nhất của mọi job, so với bản đang có, bổ sung ảnh thiếu, chọn lại ảnh chính toàn xe; lập danh sách job tải không được / chỉ có ảnh cận | Ảnh của các job thiếu |

### 4. PPF (`src/pages/11-ppf.js`, `assets-src/finishes/`)
| 38 | Bare quá xấu; before kém bóng hơn chút, PPF bóng hơn | Cặp LaFerrari nhẹ hơn, vẫn ảnh máy | fail, gen lại với Higgsfield | Gen lại cặp ảnh nắp capo LaFerrari trên Higgsfield (GPT Image): bản trước chỉ hơi đục/vỏ cam nhẹ, bản sau bóng sâu, cùng góc cùng ánh đèn để thanh kéo khớp; soi kỹ trước khi gửi | Ảnh PPF gloss thật (nếu có) |

### 5. Ceramic (`src/pages/12-ceramic.js`)
| 46 | Hero cần ảnh Paul phủ coating | (trống) | Thay ảnh khác Paul phủ ceramic | Gen close-up: tay đeo găng quét coating bằng miếng suede trên sơn của xe trong studio Paul, không lộ mặt | Ảnh thật Paul phủ coating |
| 51, 52 | Ảnh Why Feynlab không đổi / không tự nhiên | 4 ảnh thật (xước, giọt nước, STO, máy đo) | Bỏ hết, thay ảnh chung chung của Paul cùng sản phẩm, ảnh chưa dùng | Thay 4 ảnh bằng ảnh Paul đang làm việc chưa dùng ở trang nào (bộ Paul đánh bóng M3, ảnh studio có bảng Feynlab, chai Ceramic by Paul Dalton); Drive không có ảnh Paul cầm sản phẩm nào chưa dùng → ghi request | Ảnh Paul cầm/dùng sản phẩm Feynlab |

### 6. Tint (`src/pages/14-tint.js`)
| 57 | Hero khó hiểu | Range Rover đen | Ảnh thi công dán phim cách nhiệt lên xe | Gen close-up: gạt nước đẩy phim lên kính sườn, trong studio | Ảnh thật dán tint |
| 58 | Ảnh phim xấu | Ferrari 599 GTO xám | Ảnh thi công khác | Gen close-up thứ 2 (khò nhiệt co phim kính hậu hoặc cắt mép phim), khác góc với hero | (như trên) |
| 63 | Animation PPF phủ capo | Đã thêm (ý IV) | Vẽ lại capo, chưa khớp | Đo lại đa giác `F599.bonnet` theo đúng đường mép capo trên ảnh (khe nắp, mép đèn, hốc gió), kiểm bằng lớp phủ ở mọi cỡ | — |

### 7. Dry ice (`src/pages/10-dry-ice.js`, `tools/images-pages.js`)
| 65, 66 | Ảnh bị ChatGPT sửa; có ảnh mới trong Drive | Bỏ cặp steering rack, thêm BMW underbody | chưa thấy thay ảnh; thay toàn bộ ảnh từ Drive mới | Kiểm lại trang live có hiện cặp BMW chưa (có thể Fender xem bản cũ/cache). Thư mục "Dry ice page" chỉ có 1 ảnh mới (đã dùng); kiểm 2 cặp gearbox/transmission còn lại có dấu AI không, có thì bỏ; xin Paul thêm ảnh thật | Thêm cặp trước/sau thật, chưa qua AI |

### 8. Mobile (`src/pages/15-mobile.js`)
| 68 | Ảnh Caddy cam + Ferrari | Caddy trông như AI | Không dùng Caddy cam, cân nhắc lại | Về lại ảnh `ab-11-1` (Paul rửa Koenigsegg ở London Concours, van mở phía sau) | Ảnh thật van + siêu xe |
| 75, 78 | (không có ghi chú Fender) | Chờ Paul | — | Giữ nguyên, chỉ đưa vào request | GT3 RS Portugal; có bỏ dịch vụ Mobile không |

### 9. Bodyshop (`src/pages/16-bodyshop.js`)
| 79, 80, 81 | Cần ảnh toàn xe trong booth; ảnh không phải bare metal | Ảnh xe trong booth bỏ crop; đổi nhãn "Primed" | can not find, please send / please request Paul | Không sửa code; đưa vào request. Giá "£???" vẫn chờ Paul | Ảnh toàn xe trong booth, ảnh bare metal |

### 10. Aftercare (`src/pages/22-aftercare.js`)
| 85 | Ảnh giọt nước không liên quan, cần cận cảnh mitt rửa xe | Chờ Paul | Ảnh khác liên quan rửa xe cũng được | Dùng ảnh thật IMG_2393 (GT3 RS đỏ phủ bọt tuyết, 5712×4284) cho khung trái của checklist | Cận cảnh mitt (không bắt buộc) |
| 92 | Đổi link Blo | Link bị cắt | request hỏi | Giữ link `/collections/blo` (đang chạy được), đưa vào request để Paul xác nhận | Link đầy đủ |

Không có ghi chú của Fender: Packages, About (29 chờ Paul), Correction (54 chờ Paul), PDR, Wheels, Leather. Các mục này vẫn có trong request.

Kết thúc: thêm cột "Fender v5 / Claude" vào Excel (đã sửa gì + trạng thái: Done / Chờ Paul / Cần Fender xem), quét lại toàn bộ trang công khai.

---

## Request for Paul (English, ready to send)

Hi Paul,

Thanks for all the notes. Most are done. To finish the rest properly we need a few real photos and a couple of answers from you:

**Photos**
1. **Homepage hero video:** you mentioned a 30-second clip from your archive. There are no video files in the shared Drive. If you'd like a video, could you upload the raw clips? For now the hero uses your new 8K Huracán STO photo.
2. **Ceramic coating:** a photo of you applying a coating (hands, applicator and panel are enough), plus any photos of you with the Feynlab / Ceramic by Paul Dalton products. We've put a stand-in on the page until yours arrive.
3. **Window tinting:** one or two photos of tint being fitted in the studio (squeegee on the glass, heat-shrinking a rear screen). Stand-ins are on the page for now.
4. **Dry ice:** more real before/after pairs, straight from the phone with no AI editing. The new BMW underbody pair is on the page.
5. **Bodyshop:** a full view of a car inside the paint booth (for Full Respray and Full Restoration), and a car taken back to bare metal (the Mercedes 600 is in primer, so it's labelled "Primed" for now).
6. **About:** the photo of you polishing the Ferrari 599 or the Bugatti in Kuwait. It isn't in the Drive.
7. **Paint correction:** a photo of you claying a car (step 02, decontamination).
8. **Mobile detailing:** the white GT3 RS from the Portugal trip, and a real photo of the van with a supercar on location.
9. **Gallery:** we're re-downloading every photo from your old gallery. A few older jobs only have close-ups or small images. We'll send you that list, and if you have the originals (especially full-car shots), please add them to the Drive.
10. **Aftercare (optional):** a close-up of a wash mitt or pad on paint. For now we use your snow-foamed GT3 RS.

**Questions**
11. **Blo Air Dryer link:** your note was cut off at `https://www.cleanandshiny.co.uk/collections/blo`. Is that the full link, or is there a specific product page?
12. **Mobile detailing:** you said you mainly work in the studio. Should we remove the Mobile Detailing page completely, or keep it?
13. **Prices:** Bodyshop and Paint Correction still show "From £???". What starting prices should we show?
