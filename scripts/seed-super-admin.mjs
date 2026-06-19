import { createClient } from '@supabase/supabase-js'
import ws from 'ws'

const supabaseUrl = process.env.VITE_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const adminEmail = process.env.ADMIN_EMAIL
const adminPassword = process.env.ADMIN_PASSWORD

if (!supabaseUrl || !serviceRoleKey || !adminEmail || !adminPassword) {
  console.error(
    'Faltan variables: VITE_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, ADMIN_EMAIL, ADMIN_PASSWORD',
  )
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
  realtime: { transport: ws },
})

const { data: listData, error: listError } = await supabase.auth.admin.listUsers()

if (listError) {
  console.error('Error al listar usuarios:', listError.message)
  process.exit(1)
}

const existingUser = listData.users.find((user) => user.email === adminEmail)
let userId = existingUser?.id

if (!existingUser) {
  const { data, error } = await supabase.auth.admin.createUser({
    email: adminEmail,
    password: adminPassword,
    email_confirm: true,
    user_metadata: {
      full_name: 'Super Administrador',
      role: 'SUPER_ADMIN',
    },
  })

  if (error) {
    console.error('Error al crear superadmin:', error.message)
    process.exit(1)
  }

  userId = data.user.id
  console.log('Usuario superadmin creado:', adminEmail)
} else {
  const { error } = await supabase.auth.admin.updateUserById(existingUser.id, {
    password: adminPassword,
    user_metadata: {
      full_name: 'Super Administrador',
      role: 'SUPER_ADMIN',
    },
  })

  if (error) {
    console.error('Error al actualizar superadmin:', error.message)
    process.exit(1)
  }

  console.log('Usuario superadmin ya existía, credenciales actualizadas:', adminEmail)
}

const { error: profileError } = await supabase
  .from('profiles')
  .update({
    full_name: 'Super Administrador',
    role: 'SUPER_ADMIN',
  })
  .eq('id', userId)

if (profileError) {
  console.error('Error al actualizar perfil:', profileError.message)
  process.exit(1)
}

console.log('Perfil SUPER_ADMIN configurado correctamente.')
