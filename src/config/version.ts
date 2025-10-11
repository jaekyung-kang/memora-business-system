// 버전 정보
export const APP_VERSION = '1.0.0'
export const BUILD_DATE = new Date().toISOString()
export const APP_NAME = 'MEMORA'

// 버전 로그 출력
console.log(`
╔════════════════════════════════════════╗
║   ${APP_NAME} - 통신 가입 관리 시스템   ║
╠════════════════════════════════════════╣
║   Version: ${APP_VERSION}                    ║
║   Build: ${BUILD_DATE.split('T')[0]}          ║
╚════════════════════════════════════════╝
`)

