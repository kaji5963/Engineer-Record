![ezgif com-gif-maker (3)](https://user-images.githubusercontent.com/109277443/196737522-b04bec4b-ffee-4dd2-8ed8-77a1eea3c103.gif)
<br>

![ezgif com-gif-maker (6)](https://user-images.githubusercontent.com/109277443/196737550-b35cc472-f9c7-4292-ae4a-17f255ccce73.gif)
<br>

# アプリケーション名
## Engineer Record 
<br>

# 概要
#### プログラミング学習における学習記録を積み上げるSNSアプリケーションです。プログラミング学習者とのコミュニケーションを図ることができ、自分の積み上げてきた経緯を見ることができるため、自身の学習のモチベーション維持に役立てることができます。
<br>

# 開発背景
#### プログラミングを学ぶ上で大事なことは学習を継続することだと考えております。自身が完全未経験から学習を開始し、その際にSNSで学習の積み上げをしてきた経験から、自分の学習成果を残すこと、他の方の学習の成果を見ることは学習を続けていくことへのモチベーションとなりました。この経験を踏まえ、今後プログラミング学習を開始する方や、現在も学習を継続している方に学習の積み上げをしてほしいという想いからアプリケーションを開発しました。
<br>

# URL
https://engineer-record.vercel.app/
<br>
<br>
# アプリケーション利用方法

### １　サインアップ（新規登録）/ サインイン（ログイン）
<br>

- サインアップ（新規登録）<br>Avator、displayName、メールアドレス、パスワードを設定し新規登録します。(Avatorについては任意設定)
<br>

- サインイン（ログイン）<br>登録済みのアカウントでログインします。
<br>
<br>

#### テスト用アカウント(デモユーザーとしてサインイン可能)
- メールアドレス : test1@test1.com
- パスワード : test111
<br>
<br>

![picture 6](images/3a8f1c2922cd3bd4985cb6be42743c37e4cc8788192450ffd23d794ab7943095.png) 
<br>

![picture 1](images/4e386634a9001ae1d2b459adcded05adb1a3052d76e9358eb4a9826c0fae1385.png)  
<br>
<br>

### ２　Topページのフォーム欄から学習の積み上げを投稿
<br>

#### ヘッダーから自身の積み上げ投稿、Goodした投稿、Bookmarkした投稿を確認することができます。<br>投稿には、Edit/Delete/Comment/Good/Good List/Bookmarkボタンがあります。(Edit/Deleteは、投稿者のみが使用可能)
<br>
<br>

![picture 3](images/7931ae78369b5af755daeb6d6f164c151002f041789596d2b75e95f7ed66961c.png)  
<br>
<br>

### ３　投稿に対しコメント
<br>

#### CommentボタンよりCommentページに遷移し、投稿に対しコメントができます。
<br>
<br>

![picture 5](images/f683f31c2844fc00d8471fc3d1bac1926be51fd2e73d4100ad8d1ebaf6522e65.png)  
<br>
<br>

# アプリケーション機能

- 認証（サインアップ/サインイン/ログアウト）
- ユーザー編集（Abator/displayName編集可能）
- 学習記録投稿/リスト表示/編集/削除
- コメント投稿/編集/削除
- Good（いいね）追加/リスト表示/削除
- Good（いいね）しているユーザーのリスト閲覧
- Bookmark追加/リスト表示/削除
<br><br>

# 実装予定機能
- フォロー/フォロワー機能
- ユーザーprofile閲覧機能
<br><br>

# 開発技術
### フロントエンド
- HTML
- CSS
- TypeScript
- React(v18.2.0)
- Next.js(v12.3.0)
- recoil
- material-ui
<br>

### バックエンド
- firebase(v9.9.4)
<br>
<br>

# ローカル環境下での動作方法
### １　git clone https://github.com/kaji5963/Engineer-Record.git
### ２　cd Engineer-Record
### ３　yarn
### ４　yarn dev
<br><br>

# 工夫した点
- プロフィール編集機能を実装しており、プロフィールの編集時に自身が投稿した過去の投稿の内容も修正されるようにfirebaseのデータ構造を工夫し実装しました。
<br>

- 自身の学習の積み上げ、どの投稿に対しGood（いいね）やBookmarkをしたかがわかるようにリスト表示するページを実装したことで、ユーザーの情報を管理しやすくしました。
<br>
<br>

# 苦労した点
- firebaseからのデータ取得のタイミングや、取得後の表示に苦労しました。特にGood(いいね)機能の実装は、firebaseのデータ構造をよく考えデータの管理をしました。データ取得後の画面表示は条件分岐を工夫しユーザーのGoodの有無や、他のユーザーが押しているかなどを考え実装しました。
<br>

- プロフィール編集後のユーザーの名前や画像の表示に苦労しました。過去の投稿に対してどのように表示を変えたらいいのか悩み苦慮しましたが、firebaseのデータ構造を考え、データ取得後に名前や画像を変数に格納し管理することで実現しました。
