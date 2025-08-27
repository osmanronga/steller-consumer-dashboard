<template>
  <b-row class="match-height">
    <b-col xl="3" md="6">
      <b-card class="statistics-card">
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <h2 class="font-weight-bolder mb-0">{{ stats.totalOrders }}</h2>
            <span class="text-muted">Total Orders</span>
          </div>
          <b-avatar variant="primary" class="rounded p-50">
            <feather-icon icon="ShoppingCartIcon" size="24" />
          </b-avatar>
        </div>
      </b-card>
    </b-col>

    <b-col xl="3" md="6">
      <b-card class="statistics-card">
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <h2 class="font-weight-bolder mb-0 text-success">
              {{ stats.succeededOrders }}
            </h2>
            <span class="text-muted">Succeeded Orders</span>
          </div>
          <b-avatar variant="success" class="rounded p-50">
            <feather-icon icon="CheckCircleIcon" size="24" />
          </b-avatar>
        </div>
      </b-card>
    </b-col>

    <b-col xl="3" md="6">
      <b-card class="statistics-card">
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <h2 class="font-weight-bolder mb-0 text-warning">
              {{ stats.pendingOrders }}
            </h2>
            <span class="text-muted">Pending Orders</span>
          </div>
          <b-avatar variant="warning" class="rounded p-50">
            <feather-icon icon="ClockIcon" size="24" />
          </b-avatar>
        </div>
      </b-card>
    </b-col>

    <!-- <b-col xl="3" md="6">
      <b-card class="statistics-card">
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <h2 class="font-weight-bolder mb-0 text-info">
              {{ formatCurrency(stats.totalRevenue) }}
            </h2>
            <span class="text-muted">Total Revenue</span>
          </div>
          <b-avatar variant="info" class="rounded p-50">
            <feather-icon icon="DollarSignIcon" size="24" />
          </b-avatar>
        </div>
      </b-card>
    </b-col> -->
  </b-row>
</template>

<script>
import { BCard, BAvatar, BRow, BCol } from "bootstrap-vue";

export default {
  name: "OrderStats",
  components: {
    BCard,
    BAvatar,
    BRow,
    BCol,
  },
  props: {
    stats: {
      type: Object,
      default: () => ({
        totalOrders: 0,
        succeededOrders: 0,
        pendingOrders: 0,
        totalRevenue: 0,
      }),
    },
  },
  methods: {
    formatCurrency(amount) {
      if (!amount) return "$0.00";
      return `$${parseFloat(amount).toFixed(2)}`;
    },
  },
};
</script>

<style lang="scss" scoped>
.statistics-card {
  height: 100%;

  .card-body {
    padding: 1.5rem;
  }

  h2 {
    font-size: 1.5rem;
  }
}
</style>
