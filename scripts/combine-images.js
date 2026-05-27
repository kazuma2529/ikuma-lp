const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

async function main() {
  const rootDir = process.cwd();
  const imagesDir = path.join(rootDir, "Images");
  const outputDir = path.join(rootDir, "public");
  const outputFile = path.join(outputDir, "lp-long.png");

  if (!fs.existsSync(imagesDir)) {
    console.error(`Images ディレクトリが見つかりませんでした: ${imagesDir}`);
    process.exit(1);
  }

  const files = fs
    .readdirSync(imagesDir)
    .filter((file) => /\.(png|jpe?g|webp)$/i.test(file))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  if (files.length === 0) {
    console.error("Images ディレクトリ内に画像ファイルが見つかりませんでした。");
    process.exit(1);
  }

  console.log("縦結合する画像ファイル一覧:");
  files.forEach((file, index) => {
    console.log(`${index + 1}. ${file}`);
  });

  const imageBuffers = [];
  const resizedMetas = [];

  // まず1枚目で基準幅を決める
  const firstImagePath = path.join(imagesDir, files[0]);
  const firstMeta = await sharp(firstImagePath).metadata();
  if (!firstMeta.width || !firstMeta.height) {
    console.error(`画像のメタデータ取得に失敗しました: ${files[0]}`);
    process.exit(1);
  }
  const targetWidth = firstMeta.width;

  for (const file of files) {
    const inputPath = path.join(imagesDir, file);
    const image = sharp(inputPath);
    const meta = await image.metadata();

    if (!meta.width || !meta.height) {
      console.error(`画像のメタデータ取得に失敗しました: ${file}`);
      process.exit(1);
    }

    const resizedBuffer = await image.resize(targetWidth).toBuffer();
    const resizedMeta = await sharp(resizedBuffer).metadata();

    if (!resizedMeta.width || !resizedMeta.height) {
      console.error(`リサイズ後のメタデータ取得に失敗しました: ${file}`);
      process.exit(1);
    }

    imageBuffers.push(resizedBuffer);
    resizedMetas.push(resizedMeta);
  }

  const totalHeight = resizedMetas.reduce((sum, meta) => sum + (meta.height || 0), 0);

  const composites = [];
  let currentTop = 0;
  for (let i = 0; i < imageBuffers.length; i++) {
    const meta = resizedMetas[i];
    composites.push({
      input: imageBuffers[i],
      top: currentTop,
      left: 0
    });
    currentTop += meta.height || 0;
  }

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  await sharp({
    create: {
      width: targetWidth,
      height: totalHeight,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 }
    }
  })
    .composite(composites)
    .png({ quality: 90 })
    .toFile(outputFile);

  console.log("------------------------------------------------------------");
  console.log(`結合完了: ${outputFile}`);
  console.log(`元画像枚数: ${files.length}`);
  console.log(`出力サイズ: ${targetWidth} x ${totalHeight}`);
}

main().catch((err) => {
  console.error("画像結合中にエラーが発生しました:", err);
  process.exit(1);
});

