# MEMORA - 통신 가입 관리 시스템

통신사 가입 접수 및 관리를 위한 웹 애플리케이션

## 📦 프로젝트 구조

```
memora-monorepo/
├── frontend/          # Vite + React + TypeScript
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── services/
│   └── package.json
│
└── backend/           # Express + Prisma + TypeScript
    ├── src/
    │   ├── routes/
    │   └── server.ts
    ├── prisma/
    └── package.json
```

## 🚀 빠른 시작

### 프론트엔드
```bash
cd frontend
npm install
npm run dev
```

### 백엔드
```bash
cd backend
npm install
npm run dev
```

## 🔧 기술 스택

### Frontend
- Vite + React 18
- TypeScript
- React Router
- Axios
- Tailwind CSS (Utility Classes)

### Backend
- Express.js
- Prisma ORM
- PostgreSQL (Supabase)
- JWT Authentication
- TypeScript

## 📱 주요 기능

- ✅ JWT 기반 인증
- ✅ 유선/무선 가입 접수
- ✅ 관리자 대시보드
- ✅ 사용자 관리
- ✅ 사전 관리
- ✅ 감사 로그

## 🌐 배포

- Frontend: Vercel
- Backend: Railway
- Database: Supabase

## 📄 라이선스

Copyright © 2025 MEMORA

