# 中壢國民運動中心人流追蹤

![](https://i.imgur.com/0V8ku9w.png)

- 將運動中心的場館人數以圖形化來顯示
- 以 Airflow 來管理資料抓取的工作
- 用 docker compose 將所有服務都容器化

## 使用方法

1. 要先創建 database 和使用者  
   `docker compose up airflow-init`

2. 啟動 docker containers  
   `docker compose up --build`

網頁就會開在 [localhost:3000](http://localhost:3000)
