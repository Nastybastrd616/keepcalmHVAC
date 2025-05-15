<template>
  <div class="knowledge-base">
    <div class="kb-header">
      <h2>HVAC Knowledge Base</h2>
      <div class="search-container">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Search for HVAC tips and solutions..."
          @input="searchArticles"
        />
      </div>
    </div>

    <div class="kb-tabs">
      <button 
        v-for="category in categories" 
        :key="category"
        @click="activeCategory = category"
        :class="{ active: activeCategory === category }"
        class="tab-btn"
      >
        {{ category }}
      </button>
    </div>

    <div class="articles-container">
      <div v-if="filteredArticles.length" class="articles-grid">
        <div 
          v-for="article in filteredArticles" 
          :key="article.id"
          class="article-card"
          @click="selectedArticle = article"
        >
          <div class="article-icon" :class="article.category.toLowerCase()">
            <span v-if="article.category === 'Seasonal'">🌡️</span>
            <span v-else-if="article.category === 'Maintenance'">🔧</span>
            <span v-else-if="article.category === 'Troubleshooting'">❓</span>
            <span v-else-if="article.category === 'Energy Saving'">💡</span>
          </div>
          <div class="article-preview">
            <h3>{{ article.title }}</h3>
            <p class="article-excerpt">{{ article.excerpt }}</p>
            <div class="article-meta">
              <span class="article-category">{{ article.category }}</span>
              <span class="article-difficulty" :class="article.difficulty.toLowerCase()">
                {{ article.difficulty }}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="no-results">
        <p>No articles found matching your search criteria.</p>
      </div>
    </div>

    <!-- Article Modal -->
    <div v-if="selectedArticle" class="article-modal-backdrop" @click.self="selectedArticle = null">
      <div class="article-modal">
        <button class="close-btn" @click="selectedArticle = null">&times;</button>
        
        <h2>{{ selectedArticle.title }}</h2>
        
        <div class="article-info">
          <span class="article-category">{{ selectedArticle.category }}</span>
          <span class="article-difficulty" :class="selectedArticle.difficulty.toLowerCase()">
            {{ selectedArticle.difficulty }}
          </span>
        </div>
        
        <div class="article-content" v-html="selectedArticle.content"></div>
        
        <div class="article-footer">
          <p><strong>Was this article helpful?</strong></p>
          <div class="feedback-buttons">
            <button @click="provideFeedback(true)">👍 Yes</button>
            <button @click="provideFeedback(false)">👎 No</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const searchQuery = ref('');
const activeCategory = ref('All');
const selectedArticle = ref(null);

const categories = ['All', 'Seasonal', 'Maintenance', 'Troubleshooting', 'Energy Saving'];

const articles = ref([
  {
    id: 1,
    title: 'How to Prepare Your HVAC System for Summer',
    excerpt: 'Steps to ensure your AC runs efficiently during the hot months.',
    category: 'Seasonal',
    difficulty: 'Easy',
    content: `
      <p>As summer approaches, it's important to make sure your air conditioning system is ready for the heat. Here are some steps to prepare your HVAC system:</p>
      
      <h3>1. Replace or Clean Air Filters</h3>
      <p>Dirty filters restrict airflow, reducing your system's efficiency. Replace disposable filters or clean reusable ones every 1-3 months.</p>
      
      <h3>2. Clear Debris Around Outdoor Units</h3>
      <p>Remove leaves, twigs, and other debris from around your outdoor condenser unit. Trim plants to maintain at least 2 feet of clearance on all sides.</p>
      
      <h3>3. Check and Clean Vents and Registers</h3>
      <p>Make sure all supply and return vents are open and unblocked by furniture, rugs, or drapes.</p>
      
      <h3>4. Test Your System</h3>
      <p>Turn on your AC before the hot weather arrives to ensure it's working properly. Listen for unusual noises and check that cool air is flowing through all vents.</p>
      
      <h3>5. Schedule Professional Maintenance</h3>
      <p>Have a professional technician perform a tune-up to catch potential problems before they become serious issues.</p>
    `
  },
  {
    id: 2,
    title: 'Troubleshooting Common AC Problems',
    excerpt: 'Solutions for issues like poor cooling, strange noises, and high electricity bills.',
    category: 'Troubleshooting',
    difficulty: 'Medium',
    content: `
      <p>Before calling a technician, try these troubleshooting steps for common air conditioning problems:</p>
      
      <h3>AC Not Cooling Properly</h3>
      <ul>
        <li>Check thermostat settings and batteries</li>
        <li>Replace dirty air filters</li>
        <li>Clear debris from outdoor unit</li>
        <li>Ensure all vents are open and unblocked</li>
      </ul>
      
      <h3>Strange Noises</h3>
      <ul>
        <li>Squealing: May indicate a belt problem or motor bearing issue</li>
        <li>Grinding: Could be motor bearings</li>
        <li>Rattling: Look for loose parts or debris</li>
        <li>Clicking: Normal at startup/shutdown, but persistent clicking may indicate a relay problem</li>
      </ul>
      
      <h3>High Electricity Bills</h3>
      <ul>
        <li>Replace dirty filters</li>
        <li>Use a programmable thermostat</li>
        <li>Check for leaks in ductwork</li>
        <li>Keep blinds closed during peak sun hours</li>
        <li>Consider upgrading to a more efficient system if yours is over 10 years old</li>
      </ul>
    `
  },
  {
    id: 3,
    title: '10 Energy-Saving HVAC Tips',
    excerpt: 'Simple ways to reduce your heating and cooling costs year-round.',
    category: 'Energy Saving',
    difficulty: 'Easy',
    content: `
      <p>Follow these tips to maximize your HVAC system's efficiency and reduce your energy bills:</p>
      
      <h3>1. Install a Programmable Thermostat</h3>
      <p>Save up to 10% annually by setting your thermostat back 7-10°F for 8 hours a day.</p>
      
      <h3>2. Regular Maintenance</h3>
      <p>Keep your system running efficiently with annual professional tune-ups.</p>
      
      <h3>3. Change Air Filters Regularly</h3>
      <p>Clean or replace filters every 1-3 months to maintain airflow and efficiency.</p>
      
      <h3>4. Seal Ductwork</h3>
      <p>Seal and insulate ducts to prevent up to 30% energy loss.</p>
      
      <h3>5. Use Ceiling Fans</h3>
      <p>Circulate air to feel cooler in summer and warmer in winter.</p>
      
      <h3>6. Proper Insulation</h3>
      <p>Insulate your attic, walls, and floors to reduce heating and cooling needs.</p>
      
      <h3>7. Weatherstrip Doors and Windows</h3>
      <p>Prevent air leaks that make your system work harder.</p>
      
      <h3>8. Install Window Treatments</h3>
      <p>Use blinds, shades, or curtains to block solar heat in summer and retain heat in winter.</p>
      
      <h3>9. Use Smart Vents</h3>
      <p>Direct conditioned air to rooms being used and reduce flow to empty rooms.</p>
      
      <h3>10. Consider Upgrading to a High-Efficiency System</h3>
      <p>Modern ENERGY STAR systems use up to 50% less energy than older models.</p>
    `
  },
  {
    id: 4,
    title: 'DIY HVAC Maintenance Checklist',
    excerpt: 'Monthly and seasonal maintenance tasks you can do yourself.',
    category: 'Maintenance',
    difficulty: 'Medium',
    content: `
      <p>Regular maintenance helps extend the life of your HVAC system. Here's what you can do yourself:</p>
      
      <h3>Monthly Tasks</h3>
      <ul>
        <li>Inspect and replace air filters if dirty</li>
        <li>Clear debris from around outdoor units</li>
        <li>Check for unusual noises or odors during operation</li>
        <li>Ensure all vents and registers are clean and unblocked</li>
      </ul>
      
      <h3>Seasonal Tasks (Spring)</h3>
      <ul>
        <li>Clean outdoor condenser coils with a hose (turn off power first)</li>
        <li>Check refrigerant lines for insulation damage</li>
        <li>Test AC operation before hot weather arrives</li>
        <li>Consider a professional maintenance visit</li>
      </ul>
      
      <h3>Seasonal Tasks (Fall)</h3>
      <ul>
        <li>Test heating system before cold weather arrives</li>
        <li>Replace batteries in carbon monoxide detectors</li>
        <li>Check for drafts around windows and doors</li>
        <li>Schedule a professional heating system tune-up</li>
      </ul>
      
      <h3>When to Call a Professional</h3>
      <p>Some tasks should only be performed by licensed technicians:</p>
      <ul>
        <li>Refrigerant handling</li>
        <li>Electrical component repairs</li>
        <li>Gas or oil furnace internal adjustments</li>
        <li>Compressor maintenance</li>
      </ul>
    `
  },
]);

function searchArticles() {
  // This would typically connect to a back-end search 
  // For now, we're just filtering the article list
}

function provideFeedback(isHelpful) {
  // This would typically send feedback to the server
  alert(isHelpful ? 'Thank you for your feedback!' : 'We\'ll work to improve this article. Thank you!');
  selectedArticle.value = null;
}

const filteredArticles = computed(() => {
  let filtered = articles.value;
  
  // Filter by category
  if (activeCategory.value !== 'All') {
    filtered = filtered.filter(article => article.category === activeCategory.value);
  }
  
  // Filter by search query
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(article => 
      article.title.toLowerCase().includes(query) || 
      article.excerpt.toLowerCase().includes(query)
    );
  }
  
  return filtered;
});
</script>

<style scoped>
.knowledge-base {
  max-width: 1200px;
  margin: 0 auto;
}

.kb-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.search-container {
  flex-grow: 1;
  max-width: 500px;
}

.search-container input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.kb-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  overflow-x: auto;
  border-bottom: 1px solid #eee;
}

.tab-btn {
  background: none;
  border: none;
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  font-weight: 500;
  color: #666;
  border-bottom: 3px solid transparent;
}

.tab-btn.active {
  color: #3b5998;
  border-bottom-color: #3b5998;
}

.articles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.article-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
  display: flex;
}

.article-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 20px rgba(0,0,0,0.15);
}

.article-icon {
  padding: 1.5rem;
  font-size: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f1f8fe;
}

.article-icon.seasonal {
  background: #FFF3E0;
}

.article-icon.maintenance {
  background: #E8F5E9;
}

.article-icon.troubleshooting {
  background: #F3E5F5;
}

.article-icon.energy {
  background: #E0F7FA;
}

.article-preview {
  padding: 1.5rem;
  flex-grow: 1;
}

.article-excerpt {
  color: #666;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
}

.article-category {
  background: #eee;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.article-difficulty {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-weight: 500;
}

.article-difficulty.easy {
  background: #E8F5E9;
  color: #2E7D32;
}

.article-difficulty.medium {
  background: #FFF3E0;
  color: #E65100;
}

.article-difficulty.hard {
  background: #FFEBEE;
  color: #C62828;
}

.no-results {
  text-align: center;
  padding: 3rem;
  background: #f9f9fb;
  border-radius: 8px;
}

/* Article Modal */
.article-modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 1rem;
}

.article-modal {
  background: #333333;
  border-radius: 8px;
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  padding: 2rem;
  position: relative;
  color: rgba(255, 255, 255, 0.87);
}

.close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
}

.article-info {
  margin: 1rem 0;
  display: flex;
  gap: 1rem;
}

.article-content {
  margin: 2rem 0;
}

.article-content h3 {
  margin-top: 2rem;
  margin-bottom: 1rem;
  color: #3b5998;
}

.article-content ul {
  padding-left: 1.5rem;
}

.article-content li {
  margin-bottom: 0.5rem;
}

.article-footer {
  border-top: 1px solid #eee;
  padding-top: 1.5rem;
  margin-top: 2rem;
}

.feedback-buttons {
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
}

.feedback-buttons button {
  background: #f1f1f1;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}
</style>
