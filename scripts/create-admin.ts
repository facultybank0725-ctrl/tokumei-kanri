import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const MONGODB_URI = process.env.MONGODB_URI!

async function main() {
  await mongoose.connect(MONGODB_URI)

  const UserSchema = new mongoose.Schema({
    email: String,
    password: String,
    role: String,
    name: String,
  })

  const User = mongoose.models.User || mongoose.model('User', UserSchema)

  const email = 'admin@example.com'
  const password = 'admin123456'
  const name = '管理者'

  const existing = await User.findOne({ email })
  if (existing) {
    console.log('管理者アカウントは既に存在します')
    await mongoose.disconnect()
    return
  }

  const hashed = await bcrypt.hash(password, 12)
  await User.create({ email, password: hashed, role: 'admin', name })

  console.log('管理者アカウントを作成しました')
  console.log(`  メール: ${email}`)
  console.log(`  パスワード: ${password}`)

  await mongoose.disconnect()
}

main().catch(console.error)
