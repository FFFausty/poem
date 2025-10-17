-- 创建诗词表
CREATE TABLE IF NOT EXISTS poems (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(100) NOT NULL,
  dynasty VARCHAR(50) NOT NULL,
  content TEXT NOT NULL,
  category VARCHAR(100) NOT NULL,
  tags TEXT[] DEFAULT '{}',
  analysis TEXT,
  likes INTEGER DEFAULT 0,
  favorites INTEGER DEFAULT 0,
  image VARCHAR(500),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建用户资料表
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username VARCHAR(100) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  avatar_url VARCHAR(500),
  level INTEGER DEFAULT 1,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建收藏表
CREATE TABLE IF NOT EXISTS favorites (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  poem_id BIGINT REFERENCES poems(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, poem_id)
);

-- 创建点赞表
CREATE TABLE IF NOT EXISTS likes (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  poem_id BIGINT REFERENCES poems(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, poem_id)
);

-- 创建评论表
CREATE TABLE IF NOT EXISTS comments (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  poem_id BIGINT REFERENCES poems(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_poems_dynasty ON poems(dynasty);
CREATE INDEX IF NOT EXISTS idx_poems_author ON poems(author);
CREATE INDEX IF NOT EXISTS idx_poems_category ON poems(category);
CREATE INDEX IF NOT EXISTS idx_poems_tags ON poems USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_poems_created_at ON poems(created_at);

CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_poem_id ON favorites(poem_id);
CREATE INDEX IF NOT EXISTS idx_likes_user_id ON likes(user_id);
CREATE INDEX IF NOT EXISTS idx_likes_poem_id ON likes(poem_id);
CREATE INDEX IF NOT EXISTS idx_comments_poem_id ON comments(poem_id);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at);

-- 创建更新时间的触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 为需要更新时间的表添加触发器
CREATE TRIGGER update_poems_updated_at BEFORE UPDATE ON poems FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 创建点赞和收藏计数的函数
CREATE OR REPLACE FUNCTION increment_likes(poem_id BIGINT)
RETURNS VOID AS $$
BEGIN
    UPDATE poems SET likes = likes + 1 WHERE id = poem_id;
END;
$$ language 'plpgsql';

CREATE OR REPLACE FUNCTION decrement_likes(poem_id BIGINT)
RETURNS VOID AS $$
BEGIN
    UPDATE poems SET likes = GREATEST(0, likes - 1) WHERE id = poem_id;
END;
$$ language 'plpgsql';

CREATE OR REPLACE FUNCTION increment_favorites(poem_id BIGINT)
RETURNS VOID AS $$
BEGIN
    UPDATE poems SET favorites = favorites + 1 WHERE id = poem_id;
END;
$$ language 'plpgsql';

CREATE OR REPLACE FUNCTION decrement_favorites(poem_id BIGINT)
RETURNS VOID AS $$
BEGIN
    UPDATE poems SET favorites = GREATEST(0, favorites - 1) WHERE id = poem_id;
END;
$$ language 'plpgsql';

-- 启用行级安全(RLS)
ALTER TABLE poems ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- 诗词表的RLS策略（所有人都可以读取）
CREATE POLICY "诗词公开读取" ON poems FOR SELECT USING (true);

-- 用户资料表的RLS策略
CREATE POLICY "用户可查看所有资料" ON profiles FOR SELECT USING (true);
CREATE POLICY "用户只能更新自己的资料" ON profiles FOR UPDATE USING (auth.uid() = id);

-- 收藏表的RLS策略
CREATE POLICY "用户可查看所有收藏" ON favorites FOR SELECT USING (true);
CREATE POLICY "用户只能管理自己的收藏" ON favorites FOR ALL USING (auth.uid() = user_id);

-- 点赞表的RLS策略
CREATE POLICY "用户可查看所有点赞" ON likes FOR SELECT USING (true);
CREATE POLICY "用户只能管理自己的点赞" ON likes FOR ALL USING (auth.uid() = user_id);

-- 评论表的RLS策略
CREATE POLICY "用户可查看所有评论" ON comments FOR SELECT USING (true);
CREATE POLICY "用户只能管理自己的评论" ON comments FOR ALL USING (auth.uid() = user_id);

-- 插入示例数据
INSERT INTO poems (title, author, dynasty, content, category, tags, analysis, likes, favorites, image) VALUES
('静夜思', '李白', '唐', '床前明月光，疑是地上霜。举头望明月，低头思故乡。', '唐诗', '{"思乡", "月亮", "夜晚"}', '这首诗通过描绘静夜中的月光，表达了诗人对故乡的深切思念之情。', 156, 89, '/images/poem1.jpg'),
('春晓', '孟浩然', '唐', '春眠不觉晓，处处闻啼鸟。夜来风雨声，花落知多少。', '唐诗', '{"春天", "自然", "生活"}', '描绘春天早晨的生机勃勃景象，表达了对大自然的热爱。', 203, 112, '/images/poem2.jpg'),
('登鹳雀楼', '王之涣', '唐', '白日依山尽，黄河入海流。欲穷千里目，更上一层楼。', '唐诗', '{"登高", "壮丽", "哲理"}', '通过登高望远的景象，表达了不断进取的人生态度。', 189, 95, '/images/poem3.jpg'),
('水调歌头·明月几时有', '苏轼', '宋', '明月几时有？把酒问青天。不知天上宫阙，今夕是何年。我欲乘风归去，又恐琼楼玉宇，高处不胜寒。起舞弄清影，何似在人间。', '宋词', '{"中秋", "思念", "人生"}', '中秋词中的千古绝唱，表达了对人生的深刻思考。', 278, 167, '/images/poem4.jpg'),
('声声慢·寻寻觅觅', '李清照', '宋', '寻寻觅觅，冷冷清清，凄凄惨惨戚戚。乍暖还寒时候，最难将息。三杯两盏淡酒，怎敌他、晚来风急？雁过也，正伤心，却是旧时相识。', '宋词', '{"忧伤", "思念", "女性"}', '婉约词的代表作，细腻地表达了深沉的哀愁。', 234, 143, '/images/poem5.jpg')
ON CONFLICT (title, author) DO NOTHING;