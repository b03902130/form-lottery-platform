# CNL Final Project

## 分工

### Prototype: 書文

### Home
#### 三種表單
- 已填有中獎、已填未中獎、未填(允中)

### Dashboard
- 排版已創建的表單(義均)
    - 刪除按鈕
    - 抽獎(越大越好)，後端抽獎後，前端更新顯示哪些人中獎
- 排版統計資料(長條圖or圓餅圖): 自己做data analysis(名純)
- 設計表單、受訪者填表單(德威)
    - 兩種題型: 簡答、選擇題(前端用寫死ABCDE, 題目標各選項是啥)

### Backend database: 實際Schema要存哪些資料要再溝通
- 進一步完成剩餘form routing: 彥綸


## 環境設定
### How to change environment
- server will run on `HOST`:`BACKEND_PORT`
- react will run on `HOST`:`FRONTEND_PORT`

#### HOST
- modify HOST in .env
- modify the **host** part of window.BACKEND in src/index.js

#### BACKEND_PORT
- change PORT in package.json (script: server and debug)
- modify the **port** part of window.BACKEND in src/index.js

#### FRONTEND_PORT
- change PORT in package.json (script: start)
- modify FRONTEND_PORT in .env

