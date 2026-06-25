import type { Core } from '@strapi/strapi';

const PUBLIC_PERMISSIONS: Array<{ action: string }> = [
  { action: 'api::article.article.find' },
  { action: 'api::article.article.findOne' },
  { action: 'api::category.category.find' },
  { action: 'api::category.category.findOne' },
];

const AUTHENTICATED_PERMISSIONS: Array<{ action: string }> = [
  { action: 'api::article.article.find' },
  { action: 'api::article.article.findOne' },
  { action: 'api::article.article.create' },
  { action: 'api::category.category.find' },
  { action: 'api::category.category.findOne' },
  { action: 'plugin::upload.content-api.upload' },
];

const seedCategories = async (strapi: Core.Strapi) => {
  const existing = await strapi.db.query('api::category.category').findMany();
  if (existing.length > 0) {
    return;
  }

  const categories = [
    { name: '科技', slug: 'tech', color: '#0071e3', publishedAt: new Date() },
    { name: '設計', slug: 'design', color: '#34c759', publishedAt: new Date() },
    { name: '生活', slug: 'life', color: '#ff9f0a', publishedAt: new Date() },
  ];

  for (const data of categories) {
    await strapi.db.query('api::category.category').create({ data });
  }

  strapi.log.info(`Seeded ${categories.length} categories`);
};

const seedDemoUser = async (strapi: Core.Strapi) => {
  const demoEmail = 'demo@strapi.local';
  const existing = await strapi.db
    .query('plugin::users-permissions.user')
    .findOne({ where: { email: demoEmail } });

  if (existing) {
    return;
  }

  const authRole = await strapi.db
    .query('plugin::users-permissions.role')
    .findOne({ where: { type: 'authenticated' } });

  if (!authRole) {
    return;
  }

  await strapi.plugins['users-permissions'].services.user.add({
    email: demoEmail,
    username: 'demo',
    password: 'Demo1234!',
    provider: 'local',
    confirmed: true,
    blocked: false,
    role: authRole.id,
  });

  strapi.log.info('Seeded demo user: demo@strapi.local / Demo1234!');
};

const setPublicPermissions = async (strapi: Core.Strapi) => {
  const publicRole = await strapi.db
    .query('plugin::users-permissions.role')
    .findOne({ where: { type: 'public' } });

  if (!publicRole) {
    return;
  }

  for (const { action } of PUBLIC_PERMISSIONS) {
    const exists = await strapi.db
      .query('plugin::users-permissions.permission')
      .findOne({ where: { action, role: publicRole.id } });

    if (!exists) {
      await strapi.db.query('plugin::users-permissions.permission').create({
        data: { action, role: publicRole.id },
      });
    }
  }
};

const setAuthenticatedPermissions = async (strapi: Core.Strapi) => {
  const authRole = await strapi.db
    .query('plugin::users-permissions.role')
    .findOne({ where: { type: 'authenticated' } });

  if (!authRole) {
    return;
  }

  for (const { action } of AUTHENTICATED_PERMISSIONS) {
    const exists = await strapi.db
      .query('plugin::users-permissions.permission')
      .findOne({ where: { action, role: authRole.id } });

    if (!exists) {
      await strapi.db.query('plugin::users-permissions.permission').create({
        data: { action, role: authRole.id },
      });
    }
  }
};

const seedArticles = async (strapi: Core.Strapi) => {
  const existing = await strapi.db.query('api::article.article').findMany();
  if (existing.length > 0) {
    return;
  }

  const categories = await strapi.db
    .query('api::category.category')
    .findMany({ where: { slug: { $in: ['tech', 'design', 'life'] } } });

  const bySlug = Object.fromEntries(categories.map((c: any) => [c.slug, c.id]));

  const articles = [
    {
      title: '為什麼 Apple Silicon 改變了一切',
      slug: 'why-apple-silicon-changed-everything',
      excerpt: '從 Intel 到自研晶片，Apple 如何重新定義效能與續航的平衡點。',
      content: '<h2>從 Intel 走進 ARM 時代</h2><p>Apple 在 2020 年宣布轉換至自研的 <strong>Apple Silicon</strong>，這不僅是一次硬體升級，更是一場典範轉移。</p><h2>統一記憶體架構（Unified Memory）</h2><p>CPU、GPU 與 Neural Engine 共享同一塊高效能記憶體，大幅降低資料搬運的能耗。</p><blockquote>這不是關於跑分，是關於體驗的重新定義。</blockquote><h2>未來展望</h2><p>從 MacBook 到 Mac Pro，Apple Silicon 已經全面接管 Mac 產品線。</p>',
      category: bySlug['tech'],
      publishedAt: new Date(),
    },
    {
      title: '少即是多：Apple 設計哲學的 5 個核心原則',
      slug: 'less-is-more-apple-design-philosophy',
      excerpt: 'Jony Ive 留下的設計遺產，以及它如何影響現代 UI/UX 設計思維。',
      content: '<h2>設計的 5 個核心原則</h2><ol><li><strong>簡約至上</strong>：移除一切不必要的元素</li><li><strong>材質真實</strong>：讓材料說話，避免過度裝飾</li><li><strong>細節執著</strong>：每一個轉角、每一道接縫都需精準</li><li><strong>人本直覺</strong>：使用者不需要學習手冊</li><li><strong>工藝極致</strong>：過程本身就是設計的一部分</li></ol><h2>影響至今</h2><p>從 iPhone 到 Vision Pro，這些原則仍是 Apple 設計團隊的指引。</p>',
      category: bySlug['design'],
      publishedAt: new Date(),
    },
    {
      title: '用 Mac 工作的一天：我的生產力工具清單',
      slug: 'my-mac-productivity-toolkit',
      excerpt: '分享我每天依賴的 macOS App 與快捷鍵，讓工作流更順暢。',
      content: '<h2>每日必備工具</h2><ul><li><strong>Raycast</strong>：啟動器與快捷指令中心</li><li><strong>Obsidian</strong>：Markdown 筆記與知識管理</li><li><strong>Linear</strong>：專案與任務追蹤</li><li><strong>Arc</strong>：現代瀏覽器</li><li><strong>CleanShot X</strong>：截圖與錄影</li></ul><h2>常用快捷鍵</h2><p><code>Cmd + Space</code> 啟動 Raycast、<code>Cmd + Shift + .</code> 顯示隱藏檔案。</p><p>更多請見 <a href="https://support.apple.com/zh-tw/guide/mac-help">macOS 使用手冊</a>。</p>',
      category: bySlug['life'],
      publishedAt: new Date(),
    },
  ];

  for (const data of articles) {
    if (!data.category) {
      strapi.log.warn(`Skipping article "${data.title}" — category not found`);
      continue;
    }
    await strapi.db.query('api::article.article').create({ data });
  }

  strapi.log.info(`Seeded ${articles.length} articles`);
};

export default {
  register() {},

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    try {
      await setPublicPermissions(strapi);
      await setAuthenticatedPermissions(strapi);
      await seedCategories(strapi);
      await seedArticles(strapi);
      await seedDemoUser(strapi);
      strapi.log.info('Roles permissions and seed data configured.');
    } catch (err) {
      strapi.log.error('Bootstrap configuration failed', err);
    }
  },
};
