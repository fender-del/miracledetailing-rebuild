# Label the white paint of the M3 photos into panels: bright paint, split by
# the dark panel gaps. Writes a colour map with component ids for review.
import sys, cv2, numpy as np
src, out, T = sys.argv[1], sys.argv[2], int(sys.argv[3])
img = cv2.imread(src)
g = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
m = (g > T).astype(np.uint8)
m = cv2.morphologyEx(m, cv2.MORPH_OPEN, np.ones((3, 3), np.uint8))
n, lab, st, cen = cv2.connectedComponentsWithStats(m, connectivity=4)
rng = np.random.default_rng(3)
col = rng.integers(60, 255, (n, 3)).astype(np.uint8); col[0] = 0
vis = (img * 0.35 + col[lab] * 0.65).astype(np.uint8)
vis[lab == 0] = (img[lab == 0] * 0.6).astype(np.uint8)
keep = [i for i in range(1, n) if st[i, 4] > 1500]
for i in keep:
    x, y = cen[i]
    cv2.putText(vis, str(i), (int(x) - 12, int(y) + 8), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 0, 0), 4)
    cv2.putText(vis, str(i), (int(x) - 12, int(y) + 8), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (255, 255, 255), 2)
cv2.imwrite(out, vis)
np.save(out + '.npy', lab)
print(n, [(i, int(st[i, 4])) for i in keep])
