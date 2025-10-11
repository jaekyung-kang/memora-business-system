import { readFileSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const packagePath = join(__dirname, '../package.json')

// package.json 읽기
const packageJson = JSON.parse(readFileSync(packagePath, 'utf8'))

// 버전 증가 (patch 버전)
const [major, minor, patch] = packageJson.version.split('.').map(Number)
const newVersion = `${major}.${minor}.${patch + 1}`

// package.json 업데이트
packageJson.version = newVersion
writeFileSync(packagePath, JSON.stringify(packageJson, null, 2) + '\n')

// version.ts 생성
const versionTs = `// 자동 생성된 버전 파일 - 수정하지 마세요
export const APP_VERSION = '${newVersion}'
export const BUILD_DATE = '${new Date().toISOString()}'
export const APP_NAME = 'MEMORA'

// 버전 로그 출력
console.log(\`
╔════════════════════════════════════════╗
║   \${APP_NAME} - 통신 가입 관리 시스템   ║
╠════════════════════════════════════════╣
║   Version: \${APP_VERSION}                    ║
║   Build: \${BUILD_DATE.split('T')[0]}          ║
╚════════════════════════════════════════╝
\`)
`

const versionPath = join(__dirname, '../src/config/version.ts')
writeFileSync(versionPath, versionTs)

console.log(`✅ Version bumped: ${packageJson.version} → ${newVersion}`)
console.log(`📝 Build date: ${new Date().toISOString().split('T')[0]}`)

