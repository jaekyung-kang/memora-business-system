# MEMORA Frontend (Vite + React)

이동통신 가입 접수 시스템 - 프론트엔드

## 🚀 개발 서버 실행

```bash
npm install
npm run dev
```

포트: http://localhost:5173

## 🔐 로그인 정보

**관리자:**
- Company Code: 01
- Username: admin
- Password: admin123!

**사용자:**
- Company Code: 08
- Username: user
- Password: user123!

## 🛠️ 기술 스택

- Vite 7
- React 19
- TypeScript
- Tailwind CSS 3
- React Router
- Axios
- React Hook Form
- Lucide Icons

## 📦 빌드

```bash
npm run build
```

빌드 결과: `dist/` 폴더

## 🌐 환경변수

`.env` 파일:
```
VITE_API_URL=http://localhost:3001/api
```

프로덕션:
```
VITE_API_URL=https://your-api-server.com/api
```

## 🚀 배포

Vercel/Netlify에 배포 가능

**Vercel:**
```bash
vercel --prod
```

**Netlify:**
```bash
netlify deploy --prod
```
