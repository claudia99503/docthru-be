<div align=center>
	<span id="top">
	<h1>Docthru 백엔드 레포지토리</h1><br>

![image](https://github.com/user-attachments/assets/b7c9c7e6-64f2-46c7-a2a8-3864e6406a56)



<b>[Docthru-API 바로가기](https://docthru-be.vercel.app/api-docs/)</b> <br>
<b>[Docthru 바로가기](https://docthru.vercel.app/)</b> <br>

<br> 
</div>


## <span id="team">팀원</span>

| 강범준                                                                          | 김민수                                                                            | 김현우                                                               | 김효인                                                                |
| --------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| <img src="https://avatars.githubusercontent.com/u/172760948?v=4" width="200px"/>  | <img src="https://avatars.githubusercontent.com/u/118067539?v=4" width="200px"/>  | <img src="https://avatars.githubusercontent.com/u/158241915?v=4" width="200px"/>                           | <img src="https://avatars.githubusercontent.com/u/160555885?v=4" width="200px"/>                           |
| [kangbeomjoon](https://github.com/kangbeomjoon)                                               | [Minsugar98](https://github.com/Minsugar98)                                               | [Accreditus](https://github.com/Accreditus)                                   | [mozzi34](https://github.com/mozzi34)                                   |

<br><br>

## <span id="dev">기술 및 개발 환경</span>

### Backend
<img src="https://img.shields.io/badge/express-black?style=for-the-badge&logo=express&logoColor=white"> <img src="https://img.shields.io/badge/Node.js-black?style=for-the-badge&logo=Node.js&logoColor=white"> <img src="https://img.shields.io/badge/Postgre-black?style=for-the-badge&logo=postgreSQL&logoColor=white">

### Database
<img src="https://img.shields.io/badge/Prisma-black?style=for-the-badge&logo=Prisma&logoColor=white">

### 협업방식

![Git](https://img.shields.io/badge/git-%23F05033.svg?style=for-the-badge&logo=git&logoColor=white) <img src="https://img.shields.io/badge/github-181717?style=for-the-badge&logo=github&logoColor=white"> <img src="https://img.shields.io/badge/notion-000000?style=for-the-badge&logo=notion&logoColor=white"> <img src="https://img.shields.io/badge/discord-5865F2?style=for-the-badge&logo=discord&logoColor=white" width="100" height="28">


### 배포

![Vercel](https://img.shields.io/badge/vercel-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white)

<br>

## <span id="roles"> 역할 분담 </span>

### **강범준**
- [대댓글 명세서](https://docthru-be.vercel.app/api-docs/#/Reply)
### **김민수**
- [챌린지 명세서](https://docthru-be.vercel.app/api-docs/#/Challenge)
### **김현우**
- [유저 명세서](https://docthru-be.vercel.app/api-docs/#/User)
- [프로필 명세서](https://docthru-be.vercel.app/api-docs/#/Profile)
- [알림 명세서](https://docthru-be.vercel.app/api-docs/#/Notification)
### **김효인**
- [워크 명세서](https://docthru-be.vercel.app/api-docs/#/Work)
- [피드백 명세서](https://docthru-be.vercel.app/api-docs/#/Feedback)

<br>

## <span id="convention">컨벤션</span>
| Emoji | Code                          | 기능     | Description              |
| ----- | ----------------------------- | -------- | ------------------------ |
| ✨    | `:sparkles:`                  | Feat     | 새 기능                  |
| ♻️    | `:recycle:`                   | Refactor | 코드 리팩토링            |
| 📦    | `:wrench:`                    | Chore    | 리소스 수정/삭제         |
| 🐛    | `:bug:`                       | Fix      | 버그 수정                |
| 📝    | `:memo:`                      | Docs     | 문서 추가/수정           |
| 🎨    | `:art:`                       | Style    | UI/스타일 파일 추가/수정 |
| 🎉    | `:tada:`                      | Init     | 프로젝트 시작 / Init     |
| ✅    | `:white_check_mark:`          | Test     | 테스트 추가/수정         |
| ⏪    | `:rewind:`                    | Rewind   | 변경 사항 되돌리기       |
| 🔀    | `:twisted_rightwards_arrows:` | Merge    | 브랜치 합병              |
| 🗃     | `:card_file_box:`             | DB       | 데이터베이스 관련 수정   |
| 💡    | `:bulb:`                      | Comment  | 주석 추가/수정           |
| 🚀    | `:rocket:`                    | Deploy   | 배포                     |
<br>

<br>

## <span id="file"> 프로젝트 폴더 구조</span>
```
📦src
 ┣ 📂configs
 ┃ ┣ 📜config.js
 ┃ ┣ 📜database.js
 ┃ ┗ 📜swagger.js
 ┣ 📂controllers
 ┃ ┣ 📜applicationController.js
 ┃ ┣ 📜challengeController.js
 ┃ ┣ 📜feedbackController.js
 ┃ ┣ 📜notificationController.js
 ┃ ┣ 📜profileController.js
 ┃ ┣ 📜replyController.js
 ┃ ┣ 📜userController.js
 ┃ ┗ 📜workController.js
 ┣ 📂errors
 ┃ ┣ 📜commonException.js
 ┃ ┗ 📜customException.js
 ┣ 📂lib
 ┃ ┗ 📜prisma.js
 ┣ 📂middlewares
 ┃ ┣ 📜authMiddleware.js
 ┃ ┣ 📜errorHandler.js
 ┃ ┣ 📜jsonParser.js
 ┃ ┗ 📜rateLimiter.js
 ┣ 📂routes
 ┃ ┣ 📜applicationRoutes.js
 ┃ ┣ 📜challengeRoutes.js
 ┃ ┣ 📜feedbackRoutes.js
 ┃ ┣ 📜notificationRoutes.js
 ┃ ┣ 📜profileRoutes.js
 ┃ ┣ 📜replyRoutes.js
 ┃ ┣ 📜userRoutes.js
 ┃ ┗ 📜workRoutes.js
 ┣ 📂services
 ┃ ┣ 📜applicationService.js
 ┃ ┣ 📜challengeServices.js
 ┃ ┣ 📜feedbackService.js
 ┃ ┣ 📜notificationService.js
 ┃ ┣ 📜profileService.js
 ┃ ┣ 📜replyService.js
 ┃ ┣ 📜userServices.js
 ┃ ┗ 📜workServices.js
 ┣ 📂utils
 ┃ ┣ 📜authValidation.js
 ┃ ┗ 📜generate.js
 ┣ 📂validationSchemas
 ┃ ┗ 📜profileSchema.js
 ┗ 📜app.js
```
