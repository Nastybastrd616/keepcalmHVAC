<template>
  <div class="tech-profile">
    <div class="profile-banner">
      <img v-if="technician.profileImage" :src="technician.profileImage" alt="Technician photo" class="profile-image" />
      <div v-else class="profile-image placeholder">
        <span>{{ getInitials(technician.name) }}</span>
      </div>
      <div class="status-badge" :class="technician.status.toLowerCase()">
        {{ technician.status }}
      </div>
      <div class="rating">
        <div class="stars">
          <span v-for="i in 5" :key="i" class="star">
            ★
          </span>
        </div>
        <div class="rating-value">{{ technician.rating }}</div>
        <div class="reviews">({{ technician.reviewCount }} reviews)</div>
      </div>
    </div>
    
    <div class="profile-content">
      <div class="name-section">
        <h3 class="technician-name">{{ technician.name }}</h3>
        <div class="tech-id">ID: {{ technician.id }}</div>
      </div>
      
      <div class="details">
        <div class="detail">
          <div class="detail-label">Specialties</div>
          <div class="specialties">
            <span 
              v-for="specialty in technician.specialties" 
              :key="specialty"
              class="specialty-badge"
            >
              {{ specialty }}
            </span>
          </div>
        </div>
        
        <div class="detail">
          <div class="detail-label">Experience</div>
          <div>{{ technician.yearsExperience }} years</div>
        </div>
        
        <div class="detail">
          <div class="detail-label">Certifications</div>
          <div class="certifications">
            <div 
              v-for="cert in technician.certifications" 
              :key="cert.name"
              class="certification"
            >
              <span class="cert-name">{{ cert.name }}</span>
              <span v-if="cert.year" class="cert-year">({{ cert.year }})</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="bio">
        {{ technician.bio }}
      </div>
      
      <div class="action-buttons">
        <button v-if="technician.status === 'Available'" @click="requestTech" class="request-btn">
          Request This Technician
        </button>
        <button v-else class="notify-btn">
          Notify When Available
        </button>
      </div>
      
      <div class="recent-reviews">
        <h4>Recent Reviews</h4>
        <div v-for="review in technician.recentReviews" :key="review.id" class="review">
          <div class="review-rating">
            <div class="review-stars">
              <span v-for="i in 5" :key="i" class="star" :class="{ filled: i <= review.rating }">
                ★
              </span>
            </div>
            <div class="review-date">{{ formatDate(review.date) }}</div>
          </div>
          <div class="review-content">
            {{ review.content }}
          </div>
          <div class="review-author">
            - {{ review.author }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  technician: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['request']);

function getInitials(name) {
  return name.split(' ')
    .map(word => word.charAt(0))
    .join('');
}

function formatDate(dateString) {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

function requestTech() {
  emit('request', props.technician);
}
</script>

<style scoped>
.tech-profile {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  max-width: 700px;
  margin: 0 auto;
}

.profile-banner {
  background: linear-gradient(to right, #3b5998, #6699cc);
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 1rem;
}

.profile-image {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid white;
  box-shadow: 0 2px 10px rgba(0,0,0,0.2);
}

.profile-image.placeholder {
  background: #f1f1f1;
  color: #3b5998;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  font-weight: bold;
}

.status-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  color: white;
  font-weight: 500;
  font-size: 0.875rem;
}

.status-badge.available {
  background-color: #4CAF50;
}

.status-badge.on-call {
  background-color: #FFC107;
}

.status-badge.unavailable {
  background-color: #F44336;
}

.rating {
  position: absolute;
  bottom: 1rem;
  display: flex;
  align-items: center;
  background: rgba(255,255,255,0.9);
  padding: 0.5rem 1rem;
  border-radius: 20px;
}

.stars {
  color: #FFC107;
  margin-right: 0.5rem;
}

.rating-value {
  font-weight: bold;
  margin-right: 0.5rem;
}

.reviews {
  font-size: 0.875rem;
  color: #666;
}

.profile-content {
  padding: 2rem;
}

.name-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.technician-name {
  margin: 0;
  font-size: 1.5rem;
  color: #3b5998;
}

.tech-id {
  font-size: 0.875rem;
  color: #666;
}

.details {
  margin-bottom: 1.5rem;
}

.detail {
  margin-bottom: 1rem;
}

.detail-label {
  font-weight: 500;
  color: #666;
  margin-bottom: 0.25rem;
}

.specialties {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.specialty-badge {
  background: #E3F2FD;
  color: #1976D2;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
}

.certifications {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.certification {
  background: #FAFAFA;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.875rem;
  border: 1px solid #eee;
}

.cert-year {
  color: #666;
}

.bio {
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.request-btn, .notify-btn {
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  border: none;
}

.request-btn {
  background: #3b5998;
  color: white;
}

.notify-btn {
  background: #f1f1f1;
  color: #333;
}

.recent-reviews {
  border-top: 1px solid #eee;
  padding-top: 1.5rem;
}

h4 {
  margin-top: 0;
  margin-bottom: 1rem;
  color: #3b5998;
}

.review {
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #eee;
}

.review:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.review-rating {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.review-stars .star {
  color: #e0e0e0;
}

.review-stars .star.filled {
  color: #FFC107;
}

.review-date {
  font-size: 0.875rem;
  color: #666;
}

.review-content {
  margin-bottom: 0.5rem;
  line-height: 1.5;
}

.review-author {
  text-align: right;
  font-style: italic;
  color: #666;
}
</style>
