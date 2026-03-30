# Discord コミュニティ用Bot (MVP)

毎朝7:30の投稿を通じて日々の行動（チャレンジ宣言、できたこと報告、ダジャレ）を促し、ユーザーごとにポイントを自動集計できるDiscord用Botアプリケーションです。

## 技術一覧
- **TypeScript & Node.js**
- **discord.js (v14)**: Discord API連携
- **SQLite & Prisma**: データ保存・集計
- **node-cron**: 毎朝の自動投稿

---

## 🚀 初期セットアップ手順（初心者向け完全ガイド）

以下を順番に進めることで、誰でも自分のDiscordサーバーにBotを導入して動かすことができます。

### Step 1: Discord Developer Portal でBotを作成する
1. [Discord Developer Portal](https://discord.com/developers/applications) にアクセスし、右上の **「New Application」** をクリックします。
2. 名前（例：`CommunityBot`）を入力して規約に同意し、**「Create」** を押します。
3. 左サイドメニューの **「Bot」** をクリックします。
4. 下にスクロールして **「Privileged Gateway Intents」** という項目を探し、以下のスイッチを**すべてON**にして「Save Changes」を押します。
   - `PRESENCE INTENT`
   - `SERVER MEMBERS INTENT`
   - `MESSAGE CONTENT INTENT`
5. このBotページ上部にある **Token** の **「Reset Token」** をクリックし、表示された文字列を必ずコピーして手元のメモ帳等に控えておきましょう。（※これが後で使用する `DISCORD_BOT_TOKEN` になります）

### Step 2: 自分のDiscordサーバーにBotを招待する
1. 同じくDeveloper Portal内の左サイドメニューから **「OAuth2」** をクリックし、その下の **「OAuth2 URL Generator」** を開きます（新UIの場合は、左の「OAuth2」を開いてページ中央付近を見ます）。
2. **「SCOPES」** の項目で、以下の**2つ**にチェックを入れます。
   - `bot`
   - `applications.commands`
3. するとすぐ下に **「BOT PERMISSIONS」** の項目が現れます。以下にチェックを入れます。
   - `Send Messages`
   - `Embed Links`
   - `Use Slash Commands`
   - ※必要なら `Administrator`（管理者権限）だけにチェックを入れても手っ取り早いです。
4. 一番下に表示された **「GENERATED URL」** をコピーします。
5. ブラウザの新しいタブを開いてそのURLにアクセスし、Botを招待したいご自身のサーバーを選択して「はい」を押します。これでBotがサーバーに参加しました。

---

### Step 3: 各種ID（クライアント・サーバー・チャンネル）を取得する
1. **クライアントID**: 
   - Developer Portalの左メニュー **「General Information」** を開き、**Application ID** の数値をコピーします。これが `DISCORD_CLIENT_ID` になります。
2. **Discordの開発者モードをONにする**:
   - DiscordのPCアプリ（またはWebアプリ）を開き、左下の歯車マーク（ユーザー設定）➔ **「詳細設定」** を選び、「開発者モード」をONにします。
3. **サーバーID（Guild ID）**:
   - 自分のサーバーのアイコンを右クリックし**「サーバーIDをコピー」**をクリックします。これが `DISCORD_GUILD_ID` になります。
4. **チャンネルID**:
   - 朝7:30に毎朝投稿してほしいチャンネル名（例：#general）を右クリックし**「チャンネルIDをコピー」**をクリックします。これが `TARGET_CHANNEL_ID` になります。

---

### Step 4: プロジェクトの環境構築＆設定ファイルの作成
1. このプロジェクトのディレクトリに移動します。
2. ライブラリをインストールします。
   ```bash
   npm install
   ```
3. 設定ファイルを作成します。
   ```bash
   cp .env.example .env
   ```
4. コピーしてできた `.env` ファイルをテキストエディタ（VSCodeなど）で開き、先ほど取得した各種情報を入力して保存してください。
   ```env
   DISCORD_BOT_TOKEN="Step1で控えたToken"
   DISCORD_CLIENT_ID="Step3で控えたApplication ID"
   DISCORD_GUILD_ID="Step3で控えたサーバーID"
   TARGET_CHANNEL_ID="Step3で控えたチャンネルID"
   TIMEZONE="Asia/Tokyo"
   DATABASE_URL="file:./dev.db"
   ```

### Step 5: データベースの初期化
以下のコマンドを実行して、SQLiteデータベースを構築しPrismaクライアントを生成します。
```bash
npx prisma db push
npx prisma generate
```

### Step 6: スラッシュコマンドを追加する
以下のコマンドを実行して、Botのコマンド（`/mypoint`, `/ranking`）をサーバーに登録します。
```bash
npm run deploy-commands
```
※コマンドを変更・追加した場合は、その都度このコマンドを実行してください。

### Step 7: Botを起動する
以下のいずれかのコマンドで起動します。

**開発用として起動する（変更を検知しない通常起動）**
```bash
npm run dev
```

**本番用としてビルドしてから起動する**
```bash
npm run build
npm start
```

コンソールに `🚀 Ready! Logged in as [Bot名]` と表示されれば成功です！

---

## 機能と使い方
- **定時タスク**: 毎朝 7:30 （`.env`で指定したタイムゾーン基準）に指定チャンネルへチャレンジボタン・できたことボタン・ダジャレボタンが表示されたメッセージが届きます。
- **ポイント付与**: 各ボタンからモーダル（フォーム）を開いて送信するだけでポイントが加算されます。付与ポイント数は `src/config/points.json` に設定されています。
- **`/mypoint` (スラッシュコマンド)**: 自分の累計ポイントを表示します。
- **`/ranking` (スラッシュコマンド)**: 参加者全体の上位10名のランキングを表示します。

🔥 これでMVPの実装・設定は完了です！
