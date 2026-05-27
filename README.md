# Ikuma LP（縦長画像版）

このリポジトリでは、`Images` フォルダ内の 9 枚の画像を 1 枚の縦長画像に自動結合し、その画像を使ったスクロール可能な LP を GitHub Pages で公開できます。

## セットアップ

```bash
npm install
```

## 画像の配置

- リポジトリ直下に `Images/` ディレクトリを作成します。
- 中に 9 枚の画像ファイルを配置します。
  - 対応拡張子: `.png`, `.jpg`, `.jpeg`, `.webp`
  - ファイル名は番号順にソートされる前提です（例: `1.png`〜`9.png`, `01.png`〜`09.png`, `page1.jpg`〜`page9.jpg` など）。

## 縦長画像の生成

```bash
npm run build:lp
```

- `Images/` 内の画像を読み込み、横幅を揃えたうえで縦方向に結合します。
- 出力先: `public/lp-long.png`

## ローカルでの表示確認

1. 上記の手順で `npm run build:lp` を実行しておきます。
2. `index.html` をブラウザで開きます。
   - 縦長の LP 画像が 1 枚表示され、縦スクロールで全体を閲覧できます。

## GitHub Pages での公開

もっともシンプルな構成として、以下を前提としています:

- `main` ブランチのルートを GitHub Pages の公開対象に設定する。
- ルート直下にある `index.html` / `styles.css` / `public/lp-long.png` がそのまま公開されます。

### 公開手順の例

1. ローカルで以下を実行:

   ```bash
   npm install
   npm run build:lp
   ```

2. 生成された `public/lp-long.png` を含めてコミット・プッシュします。
3. GitHub のリポジトリ設定から GitHub Pages を有効化し、Source を `main` / `root` に設定します。
4. 数分待つと、指定された URL で LP が公開されます。

### 既存構成と分けたい場合（docs ディレクトリ案）

既に他のファイル構成があり、公開領域を分けたい場合は、以下のような運用も可能です:

- `docs/` ディレクトリを作り、その中に `index.html` / `styles.css` / `public/lp-long.png` を配置する。
- GitHub Pages の公開対象を `main` / `/docs` に設定する。

この場合は、必要に応じてファイルのパスを書き換えてください。

## 画像を差し替える場合

1. `Images/` ディレクトリ内の 9 枚の画像を新しい画像に置き換えます。
2. 再度以下を実行します:

   ```bash
   npm run build:lp
   ```

3. `public/lp-long.png` が新しい内容で上書きされるので、コミット・プッシュすれば GitHub Pages 上の LP も更新されます。

