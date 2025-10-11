import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://jfyaqenlkqlmqmkxuhfz.supabase.co'
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || ''

if (!supabaseKey) {
  console.log('⚠️  Supabase key not found, skipping version bump')
  process.exit(0)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function bumpVersion() {
  try {
    // AppConfig 테이블에서 버전 조회
    const { data: config, error: fetchError } = await supabase
      .from('AppConfig')
      .select('*')
      .eq('key', 'version')
      .single()

    let newVersion = '1.0.3'

    if (fetchError || !config) {
      // 버전이 없으면 생성
      const { error: insertError } = await supabase
        .from('AppConfig')
        .insert({
          key: 'version',
          value: newVersion,
          description: 'Application version'
        })

      if (insertError) {
        console.error('❌ Failed to create version:', insertError)
        process.exit(0)
      }
      console.log(`✅ Version created: ${newVersion}`)
    } else {
      // 버전 증가
      const [major, minor, patch] = config.value.split('.').map(Number)
      newVersion = `${major}.${minor}.${patch + 1}`

      const { error: updateError } = await supabase
        .from('AppConfig')
        .update({
          value: newVersion,
          updatedAt: new Date().toISOString()
        })
        .eq('key', 'version')

      if (updateError) {
        console.error('❌ Failed to update version:', updateError)
        process.exit(0)
      }
      console.log(`✅ Version bumped: ${config.value} → ${newVersion}`)
    }

    // version.ts 생성
    const versionTs = `// 자동 생성된 버전 파일 - DB에서 조회
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

    await import('fs').then(fs => {
      fs.writeFileSync('./src/config/version.ts', versionTs)
    })

    console.log(`📝 Build date: ${new Date().toISOString().split('T')[0]}`)
  } catch (error) {
    console.error('❌ Version bump failed:', error)
    process.exit(0)
  }
}

bumpVersion()

