# Review sheets for keying: the paint mask at a threshold (tinted) and the
# panel gaps enhanced (black-hat), with a 100px coordinate grid.
import sys, cv2, numpy as np
src, out, T = sys.argv[1], sys.argv[2], int(sys.argv[3])
img = cv2.imread(src)
g = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
m = (g > T).astype(np.uint8)
bh = cv2.morphologyEx(g, cv2.MORPH_BLACKHAT, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (11, 11)))
vis = img.copy()
vis[m == 1] = (vis[m == 1] * 0.5 + np.array([60, 160, 230]) * 0.5).astype(np.uint8)
gap = np.clip(bh.astype(int) * 4, 0, 255).astype(np.uint8)
vis[gap > 60] = (0, 0, 255)
H, W = g.shape
for x in range(0, W, 100):
    cv2.line(vis, (x, 0), (x, H), (255, 255, 0) if x % 500 == 0 else (90, 90, 0), 1)
    cv2.putText(vis, str(x), (x + 2, 18), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 0), 1)
for y in range(0, H, 100):
    cv2.line(vis, (0, y), (W, y), (255, 255, 0) if y % 500 == 0 else (90, 90, 0), 1)
    cv2.putText(vis, str(y), (2, y - 3), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 0), 1)
cv2.imwrite(out, vis)
