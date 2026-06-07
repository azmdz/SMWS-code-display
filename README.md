# SMWS Decoder JP

SMWS JPのサイト上で蒸留所名を表示するための非公式拡張機能です。  
本拡張機能に関するお問い合わせは、SMWS Japan様ではなく開発者までお願いいたします。

---

## 機能

- **蒸留所名の自動表示** — 商品一覧・商品詳細・お気に入り・マイページ・注文詳細のコードに蒸留所名を表示
- **検索ボックスの改善** — 蒸留所コードの絞り込みでの蒸留所名表示、およびクリアボタンの追加

## インストール

### リリース版（推奨）

1. [Releases](../../releases) から最新の `smws-extension.zip` をダウンロード
2. Chrome で `chrome://extensions` を開く
3. 右上の「デベロッパーモード」を有効にする
4. 「パッケージ化されていない拡張機能を読み込む」から解凍したフォルダを選択

### ソースからビルド

```bash
git clone https://github.com/azmdz/SMWS-code-display.git
cd SMWS-code-display
yarn install --ignore-engines
yarn zip   # dist/smws-extension.zip が生成される
```

## 開発

```bash
yarn dev   # Vite 開発サーバー起動（ファイル変更を自動反映）
```

初回は Chrome の拡張機能管理画面で `dist/` フォルダを Unpacked extension として読み込んでください。  
以降はファイルを保存するたびに自動でリロードされます。

## テスト

```bash
yarn test                              # ビルド → Playwright テスト実行
SMWS_ORDER_ID=xxxxxxx yarn test        # 注文詳細テストを含める場合
yarn test:reset-auth                   # ログイン情報をリセット
```

初回実行時はブラウザが開くのでログインしてください。  
以降はログイン状態が保持され、自動的にテストが実行されます。

## リリース

```bash
yarn version --patch   # バージョンを上げる（例: 1.0.0 → 1.0.1）
git add -A && git commit -m "release v1.0.1"
git tag v1.0.1
git push origin main --tags
```

タグをプッシュすると GitHub Actions が自動でビルド・zip 生成・リリース作成を行います。

## 対応ページ

| ページ     | URL                               |
| ---------- | --------------------------------- |
| 商品一覧   | `/product/list`                   |
| 商品詳細   | `/*/product/*`                    |
| お気に入り | `/account/favorite/list`          |
| マイページ | `/account/top`                    |
| 注文詳細   | `/account/order-history/detail/*` |
