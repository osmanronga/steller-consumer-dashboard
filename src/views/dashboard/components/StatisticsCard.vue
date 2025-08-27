<template>
  <b-card class="statistics-card">
    <div class="d-flex justify-content-between align-items-center">
      <div>
        <h2 class="font-weight-bolder mb-0">{{ formattedValue }}</h2>
        <span class="text-muted">{{ title }}</span>
      </div>
      <b-avatar :variant="variant" class="rounded p-50">
        <feather-icon :icon="icon" size="24" />
      </b-avatar>
    </div>
  </b-card>
</template>

<script>
import { BCard, BAvatar } from "bootstrap-vue";

export default {
  name: "StatisticsCard",
  components: {
    BCard,
    BAvatar,
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    value: {
      type: [Number, String],
      required: true,
      default: 0,
      validator: function (value) {
        return value !== undefined && value !== null;
      },
    },
    icon: {
      type: String,
      required: true,
    },
    variant: {
      type: String,
      default: "primary",
    },
  },
  computed: {
    formattedValue() {
      if (typeof this.value === "number") {
        if (this.title.toLowerCase().includes("revenue")) {
          return `$${this.value.toFixed(2)}`;
        }
        return this.value.toLocaleString();
      }
      return this.value;
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
