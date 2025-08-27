<template>
  <div>
    <!-- Statistics Cards -->
    <order-stats :stats="orderStats" class="mb-3" />

    <b-card-code>
      <b-overlay :show="isLoading" rounded="sm">
        <!-- Header with filters -->
        <!-- <b-row class="mb-3">
          <b-col md="6">
            <h4 class="mb-0">Order Report</h4>
            <small class="text-muted">Manage and view all orders</small>
          </b-col>
          <b-col md="6" class="text-right">
            <b-form-group label="Filter by Partner" label-for="partner-filter">
              <b-form-select
                id="partner-filter"
                v-model="selectedPartner"
                :options="partnerOptions"
                @change="filterByPartner"
              />
            </b-form-group>
          </b-col>
        </b-row> -->

        <!-- Search and filters -->
        <b-row class="mb-3">
          <b-col md="3">
            <b-form-group label="Status" label-for="status-filter">
              <b-form-select
                id="status-filter"
                v-model="statusFilter"
                :options="statusOptions"
                @change="onFilterChange"
              />
            </b-form-group>
          </b-col>
          <b-col md="3">
            <b-form-group label="Order Status" label-for="order-status-filter">
              <b-form-select
                id="order-status-filter"
                v-model="orderStatusIdFilter"
                :options="orderStatusOptions"
                @change="onFilterChange"
              />
            </b-form-group>
          </b-col>
          <b-col md="3">
            <b-form-group label="Start Date" label-for="start-date">
              <b-form-input
                id="start-date"
                type="date"
                v-model="startDate"
                @change="onFilterChange"
              />
            </b-form-group>
          </b-col>
          <b-col md="3">
            <b-form-group label="End Date" label-for="end-date">
              <b-form-input
                id="end-date"
                type="date"
                v-model="endDate"
                @change="onFilterChange"
              />
            </b-form-group>
          </b-col>
        </b-row>

        <!-- <b-row class="mb-3">
          <b-col md="6">
            <b-form-group label="Partner Name" label-for="partner-name-filter">
              <b-form-input
                id="partner-name-filter"
                v-model="partnerNameFilter"
                placeholder="Search by partner name..."
                @input="onSearch"
              />
            </b-form-group>
          </b-col>
        </b-row> -->

        <!-- Orders Table -->
        <b-table
          responsive
          :items="items"
          :fields="tableColumns"
          striped
          class="position-relative"
          hover
        >
          <template #cell(orderId)="data">
            <span v-if="data.value > 0" class="font-weight-bold text-primary">
              #{{ data.value }}
            </span>
            <span v-else class="text-muted">-</span>
          </template>

          <template #cell(index)="data">
            <span class="font-weight-bold text-muted">
              {{ (currentPage - 1) * pagination_per_page + data.index + 1 }}
            </span>
          </template>

          <template #cell(requestId)="data">
            <code class="text-info">{{ data.value }}</code>
          </template>

          <template #cell(partner)="data">
            <div v-if="data.value">
              <div class="font-weight-bold">{{ data.value.businessName }}</div>
              <small class="text-muted">{{ data.value.email }}</small>
            </div>
            <span v-else class="text-muted">-</span>
          </template>

          <template #cell(orderStatus)="data">
            <div v-if="data.value">
              <b-badge
                :variant="getOrderStatusVariant(data.value.name)"
                class="text-capitalize"
              >
                {{ data.value.name }}
              </b-badge>
            </div>
            <span v-else class="text-muted">-</span>
          </template>

          <template #cell(status)="data">
            <b-badge
              :variant="getStatusVariant(data.value)"
              class="text-capitalize"
            >
              {{ data.value || "Pending" }}
            </b-badge>
          </template>

          <template #cell(total)="data">
            <span class="font-weight-bold">
              {{ formatCurrency(data.value, data.item.currency) }}
            </span>
          </template>

          <template #cell(createdDate)="data">
            <span v-if="data.value && data.value !== '0001-01-01T00:00:00'">
              {{ formatDate(data.value) }}
            </span>
            <span v-else class="text-muted">-</span>
          </template>

          <!-- Column: Actions -->
          <template #cell(actions)="data">
            <b-button
              variant="flat-primary"
              size="sm"
              @click="viewOrderDetails(data.item.requestId)"
            >
              <feather-icon icon="FileTextIcon" class="mr-50" />
            </b-button>
          </template>
        </b-table>

        <!-- Pagination -->
        <div class="demo-spacing-0">
          <b-pagination
            :value="currentPage"
            :total-rows="pagination_total"
            :per-page="pagination_per_page"
            first-number
            last-number
            prev-class="prev-item"
            next-class="next-item"
            @input="(value) => getData(value)"
          >
            <template #prev-text>
              <feather-icon icon="ChevronLeftIcon" size="18" />
            </template>
            <template #next-text>
              <feather-icon icon="ChevronRightIcon" size="18" />
            </template>
          </b-pagination>
        </div>
      </b-overlay>
    </b-card-code>
  </div>
</template>

<script>
import {
  BTable,
  BCard,
  BCardText,
  BAvatar,
  BOverlay,
  BBadge,
  BFormSelect,
  BDropdownItem,
  BDropdown,
  BButton,
  BCardBody,
  BPagination,
  BForm,
  BFormInput,
  BFormGroup,
  BRow,
  BCol,
} from "bootstrap-vue";
import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";
import DataService from "./data/services";
import BCardCode from "@core/components/b-card-code/BCardCode.vue";
import OrderStats from "./components/OrderStats.vue";
import moment from "moment";

export default {
  components: {
    BTable,
    BCard,
    BCardText,
    BAvatar,
    BOverlay,
    BBadge,
    BFormSelect,
    BDropdownItem,
    BDropdown,
    BButton,
    BCardBody,
    ToastificationContent,
    BCardCode,
    BPagination,
    BForm,
    BFormInput,
    BFormGroup,
    BRow,
    BCol,
    OrderStats,
  },

  data() {
    return {
      items: [],
      isLoading: true,
      pagination_per_page: 20,
      pagination_total: 100,
      currentPage: 1,
      selectedPartner: null,
      statusFilter: "",
      startDate: "",
      endDate: "",
      partnerNameFilter: "",
      orderStatusIdFilter: null,

      // Order statistics
      orderStats: {
        totalOrders: 0,
        succeededOrders: 0,
        pendingOrders: 0,
        totalRevenue: 0,
      },

      // Filter options
      partnerOptions: [{ value: null, text: "All Partners" }],

      statusOptions: [
        { value: "", text: "All Statuses" },
        { value: "Succeeded", text: "Succeeded" },
        { value: "Pending", text: "Pending" },
        { value: "Failed", text: "Failed" },
      ],

      orderStatusOptions: [
        { value: null, text: "All Order Statuses" },
        { value: 1, text: "Pending" },
        { value: 2, text: "Processing" },
        { value: 3, text: "Completed" },
        { value: 4, text: "Cancelled" },
      ],

      tableColumns: [
        { key: "index", label: "#", sortable: false },
        { key: "orderId", label: "Order ID", sortable: true },
        // { key: "requestId", label: "Request ID", sortable: true },
        // { key: "partner", label: "Partner", sortable: true },
        // { key: "orderStatus", label: "Order Status", sortable: true },
        { key: "status", label: "Status", sortable: true },
        { key: "total", label: "Total Amount", sortable: true },
        { key: "currency", label: "Currency", sortable: true },
        { key: "createdDate", label: "Created Date", sortable: true },
        { key: "actions", label: "Actions" },
      ],
    };
  },

  methods: {
    getData(page) {
      this.isLoading = true;
      this.currentPage = page;

      DataService.getOrders(
        page,
        this.selectedPartner,
        this.statusFilter,
        this.startDate,
        this.endDate,
        this.partnerNameFilter,
        this.orderStatusIdFilter
      )
        .then((response) => {
          this.isLoading = false;
          if (response.data.status) {
            this.items = response.data.data;
            this.pagination_total = response.data.data.length;
            this.calculateStats();
          } else {
            this.items = [];
            this.pagination_total = 0;
          }
        })
        .catch((error) => {
          this.isLoading = false;
          console.error("Error fetching orders:", error);
          this.$toast({
            component: ToastificationContent,
            props: {
              title: "Error",
              icon: "AlertTriangleIcon",
              text: "Failed to load orders",
              variant: "danger",
            },
          });
        });
    },

    calculateStats() {
      const stats = {
        totalOrders: this.items.length,
        succeededOrders: 0,
        pendingOrders: 0,
        totalRevenue: 0,
      };

      this.items.forEach((order) => {
        if (order.status === "Succeeded") {
          stats.succeededOrders++;
          stats.totalRevenue += parseFloat(order.total || 0);
        } else if (order.status === "Pending" || !order.status) {
          stats.pendingOrders++;
        }
      });

      this.orderStats = stats;
    },

    onSearch() {
      // Debounce search for partner name
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(() => {
        this.getData(1);
      }, 500);
    },

    onFilterChange() {
      this.getData(1);
    },

    filterByPartner() {
      // Reset to first page when filtering
      this.currentPage = 1;

      // If no partner is selected, get all orders
      if (!this.selectedPartner) {
        this.getData(1);
        return;
      }

      // Show loading state
      this.isLoading = true;

      // Call the service to get orders for the selected partner using new API
      DataService.getOrders(
        1,
        this.selectedPartner,
        this.statusFilter,
        this.startDate,
        this.endDate,
        this.partnerNameFilter,
        this.orderStatusIdFilter
      )
        .then((response) => {
          this.isLoading = false;
          if (response.data.status) {
            this.items = response.data.data;
            this.pagination_total = response.data.data.length;
            this.calculateStats();
          } else {
            this.items = [];
            this.pagination_total = 0;
          }
        })
        .catch((error) => {
          this.isLoading = false;
          console.error("Error fetching partner orders:", error);
          this.$toast({
            component: ToastificationContent,
            props: {
              title: "Error",
              icon: "AlertTriangleIcon",
              text: "Failed to load partner orders",
              variant: "danger",
            },
          });
        });
    },

    viewOrderDetails(requestId) {
      this.$router.push({
        name: "order-report-details",
        params: { requestId },
      });
    },

    downloadOrder(order) {
      // Implement download functionality
      this.$toast({
        component: ToastificationContent,
        props: {
          title: "Download",
          icon: "DownloadIcon",
          text: "Download functionality will be implemented",
          variant: "info",
        },
      });
    },

    getStatusVariant(status) {
      switch (status) {
        case "Succeeded":
          return "success";
        case "Pending":
          return "warning";
        case "Failed":
          return "danger";
        default:
          return "secondary";
      }
    },

    getItemStatusVariant(status) {
      switch (status) {
        case "Succeeded":
          return "success";
        case "Pending":
          return "warning";
        case "Failed":
          return "danger";
        default:
          return "secondary";
      }
    },

    getOrderStatusVariant(status) {
      switch (status) {
        case "Pending":
          return "warning";
        case "Processing":
          return "info";
        case "Completed":
          return "success";
        case "Cancelled":
          return "danger";
        default:
          return "secondary";
      }
    },

    formatCurrency(amount, currency) {
      if (!amount) return "-";
      const currencySymbol =
        currency === "USD" ? "$" : currency === "AED" ? "AED" : currency;
      return `${currencySymbol}${parseFloat(amount).toFixed(2)}`;
    },

    formatDate(dateString) {
      if (!dateString || dateString === "0001-01-01T00:00:00") return "-";
      return moment(dateString).format("YYYY-MM-DD HH:mm:ss");
    },
  },

  mounted() {
    this.getData(1);
  },
};
</script>

<style scoped>
.text-right {
  text-align: right;
}

@media (max-width: 768px) {
  .text-right {
    text-align: left;
  }
}
</style>
