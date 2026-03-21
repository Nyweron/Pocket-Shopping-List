/**
 * Generates PNG + ICO fallbacks from graphics/icon_background_foreground.svg
 * for browsers without SVG favicon support. Run after changing the source SVG:
 *   npm run icons
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const pngToIco = require('png-to-ico'); // v2: accepts array of PNG buffers

const root = path.join(__dirname, '..');
const svgPath = path.join(root, 'graphics', 'icon_background_foreground.svg');
const publicDir = path.join(root, 'public');

async function main() {
  if (!fs.existsSync(svgPath)) {
    console.error('Missing:', svgPath);
    process.exit(1);
  }
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const input = fs.readFileSync(svgPath);

  const png16 = await sharp(input).resize(16, 16).png().toBuffer();
  const png32 = await sharp(input).resize(32, 32).png().toBuffer();
  const png48 = await sharp(input).resize(48, 48).png().toBuffer();

  fs.writeFileSync(path.join(publicDir, 'favicon-16x16.png'), png16);
  fs.writeFileSync(path.join(publicDir, 'favicon-32x32.png'), png32);

  const ico = await pngToIco([png16, png32, png48]);
  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), Buffer.from(ico));

  console.log('Wrote public/favicon-16x16.png, favicon-32x32.png, favicon.ico');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
