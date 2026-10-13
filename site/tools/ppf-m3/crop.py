# crop.py img out x0 y0 x1 y1 [scale] [step] : a zoomed crop with a labelled pixel grid
import sys, cv2
a = sys.argv
img = cv2.imread(a[1]); x0, y0, x1, y1 = map(int, a[3:7])
sc = float(a[7]) if len(a) > 7 else 1.0
st = int(a[8]) if len(a) > 8 else 50
c = cv2.resize(img[y0:y1, x0:x1], None, fx=sc, fy=sc, interpolation=cv2.INTER_NEAREST if sc > 1 else cv2.INTER_AREA)
for x in range((x0 // st + 1) * st, x1, st):
    X = int((x - x0) * sc); cv2.line(c, (X, 0), (X, c.shape[0]), (0, 200, 200), 1)
    cv2.putText(c, str(x), (X + 2, 12), 0, 0.4, (0, 255, 255), 1)
for y in range((y0 // st + 1) * st, y1, st):
    Y = int((y - y0) * sc); cv2.line(c, (0, Y), (c.shape[1], Y), (0, 200, 200), 1)
    cv2.putText(c, str(y), (2, Y - 2), 0, 0.4, (0, 255, 255), 1)
cv2.imwrite(a[2], c)
