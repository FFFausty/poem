<template>
  <div class="create-poem">
    <NavBar />
    <div class="container">
      <h1>诗词创作</h1>
      
      <div class="creation-form">
        <div class="form-section">
          <label>诗词标题</label>
          <input v-model="poemForm.title" type="text" placeholder="请输入诗词标题" />
        </div>

        <div class="form-section">
          <label>作者</label>
          <input v-model="poemForm.author" type="text" placeholder="请输入作者名" />
        </div>

        <div class="form-section">
          <label>朝代</label>
          <select v-model="poemForm.dynasty">
            <option value="唐">唐</option>
            <option value="宋">宋</option>
            <option value="元">元</option>
            <option value="明">明</option>
            <option value="清">清</option>
            <option value="现代">现代</option>
          </select>
        </div>

        <div class="form-section">
          <label>诗词内容</label>
          <textarea 
            v-model="poemForm.content" 
            placeholder="请输入诗词内容，每句用逗号分隔"
            rows="6"
          ></textarea>
        </div>

        <div class="form-section">
          <label>标签</label>
          <input 
            v-model="tagInput" 
            type="text" 
            placeholder="输入标签后按回车添加"
            @keyup.enter="addTag"
          />
          <div class="tags-container">
            <span v-for="tag in poemForm.tags" :key="tag" class="tag">
              {{ tag }}
              <button @click="removeTag(tag)" class="tag-remove">×</button>
            </span>
          </div>
        </div>

        <div class="form-actions">
          <button class="btn btn-secondary" @click="saveDraft">保存草稿</button>
          <button class="btn btn-primary" @click="publishPoem">发布作品</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import NavBar from '@/components/NavBar.vue'

const router = useRouter()

const tagInput = ref('')
const poemForm = reactive({
  title: '',
  author: '',
  dynasty: '唐',
  content: '',
  tags: [] as string[]
})

const addTag = () => {
  if (tagInput.value.trim() && !poemForm.tags.includes(tagInput.value.trim())) {
    poemForm.tags.push(tagInput.value.trim())
    tagInput.value = ''
  }
}

const removeTag = (tag: string) => {
  poemForm.tags = poemForm.tags.filter(t => t !== tag)
}

const saveDraft = () => {
  if (validateForm()) {
    console.log('保存草稿:', poemForm)
    // 实际实现中会调用API保存草稿
  }
}

const publishPoem = () => {
  if (validateForm()) {
    console.log('发布作品:', poemForm)
    // 实际实现中会调用API发布作品
    router.push('/user')
  }
}

const validateForm = (): boolean => {
  if (!poemForm.title.trim()) {
    alert('请输入诗词标题')
    return false
  }
  if (!poemForm.content.trim()) {
    alert('请输入诗词内容')
    return false
  }
  return true
}
</script>

<style scoped>
.create-poem {
  min-height: 100vh;
  padding-top: 80px;
}

.create-poem h1 {
  text-align: center;
  color: var(--primary-color);
  margin-bottom: 40px;
  font-size: 2.5rem;
}

.creation-form {
  max-width: 600px;
  margin: 0 auto;
  background: white;
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.form-section {
  margin-bottom: 2rem;
}

.form-section label {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
  font-weight: 500;
}

.form-section input,
.form-section select,
.form-section textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.3s ease;
}

.form-section input:focus,
.form-section select:focus,
.form-section textarea:focus {
  outline: none;
  border-color: var(--primary-color);
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}

.tag {
  background: var(--bg-secondary);
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 4px;
}

.tag-remove {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  color: var(--text-secondary);
}

.tag-remove:hover {
  color: var(--error-color);
}

.form-actions {
  display: flex;
  gap: 15px;
  justify-content: flex-end;
  margin-top: 2rem;
}

@media (max-width: 768px) {
  .creation-form {
    padding: 20px;
  }
  
  .form-actions {
    flex-direction: column;
  }
}
</style>