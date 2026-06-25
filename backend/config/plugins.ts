import type { Core } from '@strapi/strapi';

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Plugin => ({
  'users-permissions': {
    config: {
      register: {
        // Demo 預設關閉公開註冊（依賴 seed 的 demo user 登入）。
        // 實際關閉由 bootstrap.ts 的 disablePublicRegistration() 處理：
        //   - 移除 Public role 的 `plugin::users-permissions.auth.register` 權限
        // 若要開放 POST /api/auth/local/register，設 ENABLE_PUBLIC_REGISTER=true
        allowedFields: env('ENABLE_PUBLIC_REGISTER', 'false') === 'true'
          ? ['username', 'email', 'password']
          : [],
      },
    },
  },
});

export default config;
