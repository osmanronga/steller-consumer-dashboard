<template>
  <b-card title="Recent Activities">
    <app-collapse>
      <!-- Orders Group -->
      <app-collapse-item title="Orders">
        <template #title>
          <div class="d-flex justify-content-between align-items-center w-100">
            <div class="d-flex align-items-center">
              <feather-icon icon="ShoppingCartIcon" class="mr-75" size="18" />
              <h6 class="mb-0">Orders</h6>
            </div>
            <b-badge pill variant="primary">
              {{ orderActivities.length }}
            </b-badge>
          </div>
        </template>

        <!-- Orders List -->
        <div class="activities-list">
          <div
            v-for="(activity, index) in orderActivities"
            :key="'order-' + index"
            class="activity-item"
          >
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <h6 class="mb-25">{{ activity.description }}</h6>
                <small class="text-muted">{{ activity.timeAgo }}</small>
              </div>
              <b-badge :variant="getVariant(activity)" pill>
                {{ activity.status }}
              </b-badge>
            </div>
            <div class="details mt-1">
              <div class="detail-item">
                <span class="text-muted">Status:</span>
                <span>{{ activity.status }}</span>
              </div>
              <div class="detail-item">
                <span class="text-muted">Time:</span>
                <span>{{ activity.timeAgo }}</span>
              </div>
              <div class="detail-item">
                <span class="text-muted">Type:</span>
                <span>{{ activity.type }}</span>
              </div>
            </div>
          </div>
        </div>
      </app-collapse-item>
    </app-collapse>
  </b-card>
</template>

<script>
import { BCard, BBadge } from "bootstrap-vue";
import AppCollapse from "@core/components/app-collapse/AppCollapse.vue";
import AppCollapseItem from "@core/components/app-collapse/AppCollapseItem.vue";

export default {
  name: "RecentActivities",
  components: {
    BCard,
    BBadge,
    AppCollapse,
    AppCollapseItem,
  },
  props: {
    activities: {
      type: Array,
      required: true,
    },
  },
  computed: {
    orderActivities() {
      return this.activities.filter((activity) => activity.type === "order");
    },

    userActivities() {
      return this.activities.filter((activity) => activity.type === "user");
    },
  },
  methods: {
    getVariant(activity) {
      if (activity.status === "Approved") return "success";
      if (activity.status === "Pending") return "warning";
      if (activity.status === "Rejected") return "danger";
      return "primary";
    },
  },
};
</script>

<style lang="scss" scoped>
.activities-list {
  .activity-item {
    padding: 1rem;
    border-bottom: 1px solid #ebe9f1;

    &:last-child {
      border-bottom: none;
    }

    h6 {
      font-size: 0.875rem;
    }

    small {
      font-size: 0.75rem;
    }

    .details {
      .detail-item {
        display: flex;
        gap: 0.5rem;
        margin-bottom: 0.25rem;

        &:last-child {
          margin-bottom: 0;
        }

        .text-muted {
          min-width: 4rem;
        }
      }
    }
  }
}

// Badge styles
.badge {
  padding: 0.5rem 0.75rem;
}

.mb-25 {
  margin-bottom: 0.25rem;
}

.mr-75 {
  margin-right: 0.75rem;
}
</style>
