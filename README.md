# 작업 폴더로 이동 및 클론
> git clone https://github.com/yjh031201/SOLEFN.git .   
> git config user.name "홍길동"   
> git config user.email "your-email@example.com"   
## 클론 직후 프론트 및 백 의존성 설치   
> npm install   
> 백엔드의 .env파일 생성후 .env.example 양식대로 작성
### solefn 경로에서 npm run dev치면 전체 실행   

# 깃에 올리는 법
> git add .   
> git commit -m "메시지"   (commit은 세이브 포인트)
> git push origin 브랜치 이름 (master에 직접 푸시 x)

# 깃에서 받아오는 법
>git checkout 브랜치   
>git pull origin master

# 새 브랜치 만드는 법
>git checkout -b 새브랜치
