<template>
  <div class="about-page page-section">
    <h1>About CoolAir HVAC</h1>
    
    <ContentBox hover>
      <h2>Our History</h2>
      <p>CoolAir HVAC has been serving the community for over 20 years, providing reliable and affordable heating and cooling solutions for homes and businesses.</p>
      <p>Founded in 2003 by Jane Smith, our company has grown from a small family operation to one of the most trusted HVAC service providers in the region.</p>
    </ContentBox>
    
    <ContentBox hover>
      <h2>Meet Our Team</h2>
      <div class="team-grid">
        <div class="team-member">
          <div class="member-avatar">JS</div>
          <h3>Jane Smith</h3>
          <p>Owner & Lead Technician</p>
          <p class="certification">EPA Certified</p>
        </div>
        <div class="team-member">
          <div class="member-avatar">JD</div>
          <h3>John Doe</h3>
          <p>Senior Installer</p>
          <p class="certification">NATE Certified</p>
        </div>
        <div class="team-member">
          <div class="member-avatar">ML</div>
          <h3>Maria Lopez</h3>
          <p>Customer Service Manager</p>
          <p class="certification">10+ Years Experience</p>
        </div>
      </div>
    </ContentBox>
    
    <ContentBox>
      <h2>Licenses & Certifications</h2>
      <ul class="certification-list">
        <li><span class="cert-badge">✓</span> State HVAC License #123456</li>
        <li><span class="cert-badge">✓</span> EPA Section 608 Certification</li>
        <li><span class="cert-badge">✓</span> NATE Certified Technicians</li>
      </ul>
    </ContentBox>
  </div>
</template>

<script setup>
import ContentBox from '../components/ContentBox.vue';
</script>

<style scoped>
h1 {
  color: var(--primary-color);
  margin-bottom: 2rem;
}

.team-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.team-member {
  text-align: center;
}

.member-avatar {
  background: var(--primary-color);
  color: white;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0 auto 1rem;
}

.team-member h3 {
  margin: 0.5rem 0;
  color: var(--primary-color);
}

.team-member p {
  margin: 0.25rem 0;
}

.certification {
  color: var(--accent-color);
  font-weight: 500;
  margin-top: 0.5rem !important;
}

.certification-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.certification-list li {
  padding: 0.5rem 0;
  display: flex;
  align-items: center;
}

.cert-badge {
  background: var(--accent-color);
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.75rem;
  font-weight: bold;
}
</style>
