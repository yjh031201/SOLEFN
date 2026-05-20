# 작업 폴더로 이동 및 클론
> git clone https://github.com/yjh031201/SOLEFN.git .   
> git config user.name "홍길동"   
> git config user.email "your-email@example.com"   
## 클론 직후 프론트 및 백 의존성 설치   
> npm install   
> 백엔드의 .env파일 생성후 .env.example 양식대로 작성   
 
### remote 변경   
>git remote set-url origin https://github.com/yjh031201/SOLEFN.git   

# 깃에 올리는 법
> git add .   
> git commit -m "메시지"   (commit은 세이브 포인트)   
> git push origin 브랜치 이름 (master에 직접 푸시 x)     

# 깃에서 받아오는 법 << 작업 하기전 꼭 실행
>git checkout master   
>git pull origin master   
>git checkout 브랜치 이름   
>git merge master   
> ESC누르고 :wq


# 새 브랜치 만드는 법
>git checkout -b 새브랜치



서버끌떄 컨트롤 c
# 프론트, 백, 도커 실행
>solefn -> npm install   
>solefn -> npm run dev:all

# DB확인
>PowerShell에서 solefn 경로로 이동   
>docker ps로 컨테이너 생성 확인   
>docker exec -it solefn-mysql mysql -u root -p1234 solefn_db mysql 접속   
>use solefn_db로 데이터베이스 연결   
>show tables //테이블 목록확인
>select * from 테이블이름 // 테이블 확인


