<template>
  <div class="kana-table">
    <!-- 加载状态 -->
    <div v-if="loading" class="loading">加载中...</div>
    
    <!-- 错误状态 -->
    <div v-if="error" class="error">错误: {{ error }}</div>
    
    <!-- 数据表格 -->
    <template v-if="!loading && !error">
      <!-- 列标题 -->
      <div class="header-row">
        <div class="corner"></div>
        <TitleBlock 
          v-for="(colTitle, colIndex) in colTitles" 
          :key="'col-'+colIndex"
          :title="colTitle"
          color="#f5f5f5"
          class="header-cell"
        />
      </div>
      
      <!-- 数据行 -->
      <div class="data-row" v-for="(row, rowIndex) in rowData" :key="'row-'+rowIndex">
        <!-- 行标题 -->
        <TitleBlock 
          :title="rowTitles[rowIndex]" 
          class="row-title"
        />
        
        <!-- 单元格数据 -->
        <template v-for="(cell, cellIndex) in row">
          <!-- 仅渲染非空字符 -->
          <KanaBlock
            v-if="cell.character"
            :key="'cell-'+rowIndex+'-'+cellIndex"
            :character="cell.character"
            :pronunciation="cell.pronunciation"
            :audioUrl="getAudioUrl(cell.pronunciation)"
            class="data-cell"
          />
          <!-- 空字符占位符 -->
          <div v-else 
            :key="'empty-'+rowIndex+'-'+cellIndex" 
            class="empty-cell"
          ></div>
        </template>
      </div>
    </template>
  </div>
</template>

<script>
import KanaBlock from './TableKanaBlock.vue';
import TitleBlock from './TableTitleBlock.vue';

export default {
  name: 'KanaTable',
  components: { KanaBlock, TitleBlock },
  props: {
    datapath: {
      type: String,
      required: true,
      validator: value => value.endsWith('.json') // 确保是JSON文件
    }
  },
  data(){
    return{
      rowTitles: [],
      colTitles: [],
      rowData: [],
      loading: false,
      error: null
    }
  },
  async created(){
    this.loadData();
  },
  methods: {
    async loadData() {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await fetch(this.datapath);
        console.log(response);
        if (!response.ok) {
          throw new Error(`数据加载失败: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // 验证数据结构
        if (!this.validateData(data)) {
          throw new Error('无效的数据结构');
        }
        
        this.rowTitles = data.rowTitles;
        this.colTitles = data.colTitles;
        this.rowData = data.rowData;
      } catch (err) {
        console.error('数据加载错误:', err);
        this.error = err.message || '未知错误';
      } finally {
        this.loading = false;
      }
    },
    
    validateData(data) {
      return Array.isArray(data.rowTitles) && 
             Array.isArray(data.colTitles) && 
             Array.isArray(data.rowData);
    },
    
    getAudioUrl(pronunciation) {
      if (!pronunciation) return '';
      if (pronunciation=="wo") return `./audio/o.mp3`;
      // 使用相对路径确保部署灵活性
      return `./audio/${encodeURIComponent(pronunciation)}.mp3`;
    }
  }
}
</script>

<style scoped>
.kana-table {
  border: 1px solid #ddd;
  padding: 2em;
  border-radius: 16px;
  overflow: hidden;
  background-color: white;
  box-shadow: 0 4px 8px rgba(0,0,0,0.05);
  min-width: 500px;
  position: relative;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

.header-row, .data-row {
  display: flex;
  margin-bottom: 8px;
  justify-content: center;
}

.header-row:last-child, .data-row:last-child {
  margin-bottom: 0;
}

.corner, .row-title, .header-cell, .data-cell, .empty-cell {
  width: 60px;
  height: 60px;
  margin-right: 8px;
  flex-shrink: 0;
}

.corner:last-child,
.row-title:last-child,
.header-cell:last-child,
.data-cell:last-child,
.empty-cell:last-child {
  margin-right: 0;
}

.row-title {
  font-weight: bold;
}

.empty-cell {
  background-color: transparent;
  border: none;
  box-shadow: none;
  cursor: default;
}

@media (max-width: 600px) {
  .kana-table {
    min-width: 100%;
    padding: 4px;
  }
  
  .corner, .row-title, .header-cell, .data-cell, .empty-cell {
    width: 50px;
    height: 50px;
    margin-right: 4px;
  }
  
  .row-title {
    width: 70px;
  }
}

/* 保持原有的加载和错误样式 */
</style>