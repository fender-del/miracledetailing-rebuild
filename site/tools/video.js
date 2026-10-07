/* ============================================================
   tools/video.js — the hero loop: a red Ferrari, 60 fps (Ed 05/10:
   "a red Ferrari or similar, more visible"; Fender picked the clip).

   Source: Pexels 5309351 "Video of a luxury sports car" by Taryn
   Elliott (real footage, free licence): one slow tracking shot along a
   red Ferrari Portofino in low evening sun, from the grille past the
   headlight to the front wheel. Pexels only serves it at 1280×720
   (its page lists 4K), so the 16:9 cut is scaled up once to 1920 with
   Lanczos and a firmer sharpen; there is no 2560 file (a bigger
   upscale adds bytes, not detail). The first 12 s: grille, badge and
   headlight, the part a visitor knows as a Ferrari at a glance.

   25 → 60 fps by motion interpolation (minterpolate, mci); the camera
   glides slowly, so the in-between frames are clean.

   16:9 for desktop, a 5:4 cut around the grille and headlight for
   phones and portrait tablets.

   The loop breathes through black for half a second at the join (a
   cross-dissolve of a moving shot would double the car). The poster is
   the first fully lit frame (0.5s), and the page starts the first play
   there.

   Writes assets/video/hero-1920.mp4 (16:9) and hero-1080.mp4 (5:4),
   plus their first frames to ../assets-src/video/ for tools/images.js.
   Interpolated masters are cached in ../assets-src/video/tmp/ (delete
   them to rebuild from the clip).
     node tools/video.js [wide|tall]
   ============================================================ */
'use strict';
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, '..', '..', 'assets-src', 'video');
const OUT = path.join(__dirname, '..', 'assets', 'video');
const TMP = path.join(SRC, 'tmp');
fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(TMP, { recursive: true });

const CLIP = path.join(SRC, 'pexels-5309351.mp4');
const T = 12;       // seconds interpolated (of the clip's 27.8s)
const XF = 1;       // (masters end with a dissolve; the loop stops before it)
const HOLD = 0.1;
const LOOP = T - XF; // seconds in the loop
const FADE = 0.5;    // dip to black at each end
const BG = '0x0a0a0a';

/* crop (in source pixels) then scale */
const CUTS = {
  wide: { crop: null, w: 1920, h: 1080 },
  tall: { crop: '900:720:200:0', w: 1080, h: 864 }   // 5:4, 16–86% of the source: grille and headlight
};

/* Slow part: crop, scale, sharpen, interpolate to 60 fps, then join the
   end back onto the first frame. */
function master(name, c) {
  const out = path.join(TMP, name + '-60.mp4');
  if (fs.existsSync(out)) return out;
  const f = [
    `[0:v]${c.crop ? `crop=${c.crop},` : ''}scale=${c.w}:${c.h}:flags=lanczos,unsharp=5:5:0.6:5:5:0,`
      + 'minterpolate=fps=60:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1,'
      + 'eq=contrast=1.04,format=yuv420p,setsar=1,split[m][f]',
    `[f]trim=end_frame=1,setpts=PTS-STARTPTS,tpad=stop_mode=clone:stop_duration=${XF + HOLD}[hold]`,
    `[m]trim=duration=${T},setpts=PTS-STARTPTS[main]`,
    `[main][hold]xfade=transition=fade:duration=${XF}:offset=${T - XF}[v]`
  ];
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-ss', '0', '-t', String(T + 0.1), '-i', CLIP,
    '-filter_complex', f.join(';'), '-map', '[v]', '-an', '-r', '60',
    '-c:v', 'libx264', '-preset', 'fast', '-crf', '8', '-pix_fmt', 'yuv420p', out], { stdio: 'inherit' });
  return out;
}

function encode(from, name, scale, crf) {
  const out = path.join(OUT, name);
  /* light denoise: the footage's grain costs ~40% of the file and is
     invisible at this size; the grille and badge stay as sharp */
  const vf = [`trim=duration=${LOOP}`, 'setpts=PTS-STARTPTS', 'hqdn3d=2:2:8:8',
    `fade=t=in:st=0:d=${FADE}:color=${BG}`, `fade=t=out:st=${LOOP - FADE}:d=${FADE}:color=${BG}`];
  if (scale) vf.push(`scale=${scale}:flags=lanczos`);
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', from, '-vf', vf.join(','), '-an',
    '-c:v', 'libx264', '-preset', 'slow', '-crf', String(crf), '-profile:v', 'high', '-level', '5.1',
    '-g', '120', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out], { stdio: 'inherit' });
  const poster = path.join(SRC, name.replace('.mp4', '-poster.png'));
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-ss', String(FADE), '-i', out, '-frames:v', '1', poster], { stdio: 'inherit' });
  console.log(`${name}: ${(fs.statSync(out).size / 1048576).toFixed(2)} MB`);
}

const only = process.argv[2];
if (!only || only === 'wide') {
  const m = master('wide', CUTS.wide);
  encode(m, 'hero-1920.mp4', null, 24);
}
if (!only || only === 'tall') {
  const m = master('tall', CUTS.tall);
  encode(m, 'hero-1080.mp4', null, 25);
}
