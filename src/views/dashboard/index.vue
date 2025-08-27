<template>
  <div>
    <b-overlay :show="isLoading" rounded="sm">
      <section id="dashboard">
        <!-- Statistics Cards Row -->
        <b-row class="match-height">
          <b-col xl="3" md="6">
            <statistics-card
              title="Number Of Succeced Orders"
              :value="stats.numberOfSuccecedOrders"
              icon="TrendingUpIcon"
              variant="primary"
            />
          </b-col>

          <b-col xl="3" md="6">
            <statistics-card
              title="Total Orders"
              :value="stats.numberOfOrders"
              icon="ActivityIcon"
              variant="info"
            />
          </b-col>

          <b-col xl="3" md="6">
            <statistics-card
              title="Total Orders"
              :value="stats.totalOrders"
              icon="ShoppingCartIcon"
              variant="warning"
            />
          </b-col>

          <!-- <b-col xl="3" md="6">
            <statistics-card
              title="Total Revenue"
              :value="stats.totalRevenue"
              icon="DollarSignIcon"
              variant="info"
            />
          </b-col>

          <b-col xl="3" md="6">
            <statistics-card
              title="Total Partners"
              :value="stats.totalPartners"
              icon="UsersIcon"
              variant="success"
            />
          </b-col> -->
        </b-row>

        <!-- Charts Row -->
        <b-row class="match-height mt-2">
          <b-col xl="8" md="12">
            <sales-chart :data="salesData" />
          </b-col>
          <b-col xl="4" md="12">
            <user-stats-chart :data="userData" />
          </b-col>
        </b-row>

        <!-- Recent Activities Row -->
        <b-row class="mt-2">
          <b-col cols="12">
            <recent-activities :activities="activities" />
          </b-col>
        </b-row>
      </section>
    </b-overlay>
  </div>
</template>

<script>
import { BRow, BCol, BOverlay } from "bootstrap-vue";
import StatisticsCard from "./components/StatisticsCard.vue";
import SalesChart from "./components/SalesChart.vue";
import UserStatsChart from "./components/UserStatsChart.vue";
import RecentActivities from "./components/RecentActivities.vue";
import DashboardService from "./data/services";

export default {
  name: "Dashboard",
  components: {
    BRow,
    BCol,
    BOverlay,
    StatisticsCard,
    SalesChart,
    UserStatsChart,
    RecentActivities,
  },
  data() {
    return {
      isLoading: false,
      stats: {
        numberOfSuccecedOrders: 0,
        numberOfOrders: 0,
        totalPartners: 0,
        totalOrders: 0,
        totalRevenue: 0.0,
      },
      salesData: [],
      userData: [],
      activities: [],
    };
  },
  methods: {
    async fetchDashboardData() {
      try {
        this.isLoading = true;

        // Fetch all dashboard data in parallel
        const [stats, sales, users, activities] = await Promise.all([
          DashboardService.getDashboardStats(),
          DashboardService.getSalesStats(),
          DashboardService.getUserStats(),
          DashboardService.getRecentActivities(),
        ]);

        // Update component data
        this.stats = stats;
        this.salesData = sales;
        this.userData = users;
        this.activities = activities;
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        this.$bvToast.toast("Error loading dashboard data", {
          title: "Error",
          variant: "danger",
          solid: true,
        });
      } finally {
        this.isLoading = false;
      }
    },
  },
  mounted() {
    this.fetchDashboardData();
  },
};
</script>

<style lang="scss" scoped>
#dashboard {
  padding: 1rem;
}
</style>
