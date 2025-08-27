<template>
  <div class="p-6 text-start">
    <b-card no-body>
      <b-card-header class="d-flex align-items-start justify-content-between">
        <div class="d-flex align-items-start">
          <div>
            <h3 class="mb-0">Order Details</h3>
            <small class="text-muted">
              Request ID: {{ details.requestId }}
            </small>
          </div>
        </div>
        <div class="d-flex align-items-center">
          <b-button
            variant="outline-secondary"
            @click="$router.go(-1)"
            class="mr-2"
          >
            <feather-icon icon="ArrowLeftIcon" size="16" class="mr-1" />
            Back
          </b-button>
        </div>
      </b-card-header>

      <b-card-body>
        <b-overlay :show="isLoading" rounded="sm">
          <!-- Order Summary -->
          <b-row class="mb-4">
            <b-col md="6">
              <h5>Order Information</h5>
              <b-table-simple borderless>
                <tbody>
                  <tr>
                    <td class="font-weight-bold">Order ID:</td>
                    <td>
                      <span
                        v-if="details.orderId > 0"
                        class="text-primary font-weight-bold"
                      >
                        #{{ details.orderId }}
                      </span>
                      <span v-else class="text-muted">-</span>
                    </td>
                  </tr>
                  <tr>
                    <td class="font-weight-bold">Request ID:</td>
                    <td>
                      <code>{{ details.requestId }}</code>
                    </td>
                  </tr>
                  <tr>
                    <td class="font-weight-bold">Status:</td>
                    <td>
                      <b-badge
                        :variant="getStatusVariant(details.status)"
                        class="text-capitalize"
                      >
                        {{ details.status || "Pending" }}
                      </b-badge>
                    </td>
                  </tr>
                  <tr>
                    <td class="font-weight-bold">Order Type:</td>
                    <td>{{ details.orderType || "-" }}</td>
                  </tr>
                  <tr>
                    <td class="font-weight-bold">Created Date:</td>
                    <td>{{ formatDate(details.createdDate) }}</td>
                  </tr>
                </tbody>
              </b-table-simple>
            </b-col>
            <b-col md="6">
              <h5>Financial Information</h5>
              <b-table-simple borderless>
                <tbody>
                  <tr>
                    <td class="font-weight-bold">Total Amount:</td>
                    <td class="text-success font-weight-bold">
                      {{ formatCurrency(details.total, details.currency) }}
                    </td>
                  </tr>
                  <tr>
                    <td class="font-weight-bold">Currency:</td>
                    <td>{{ details.currency || "-" }}</td>
                  </tr>
                  <tr v-if="details.errorMessage">
                    <td class="font-weight-bold text-danger">Error Message:</td>
                    <td class="text-danger">{{ details.errorMessage }}</td>
                  </tr>
                </tbody>
              </b-table-simple>
            </b-col>
          </b-row>

          <!-- Order Items -->
          <div class="mb-4">
            <h5>Order Items</h5>
            <b-table
              :items="details.items || []"
              :fields="itemFields"
              responsive
              bordered
              class="text-start"
            >
              <template #cell(productId)="data">
                <span class="font-weight-bold">{{ data.value }}</span>
              </template>

              <template #cell(productFaceValue)="data">
                {{ formatCurrency(data.value, data.item.currencyCode) }}
              </template>

              <template #cell(status)="data">
                <b-badge
                  :variant="getItemStatusVariant(data.value)"
                  class="text-capitalize"
                >
                  {{ data.value }}
                </b-badge>
              </template>

              <template #cell(countryCode)="data">
                <span v-if="data.value">{{ data.value }}</span>
                <span v-else class="text-muted">-</span>
              </template>

              <template #cell(currencyCode)="data">
                <span v-if="data.value">{{ data.value }}</span>
                <span v-else class="text-muted">-</span>
              </template>
            </b-table>
          </div>

          <!-- Cards Information -->
          <div v-if="hasCards" class="mb-4">
            <h5>Cards Information</h5>
            <div v-for="item in details.items" :key="item.productId">
              <div v-if="item.cards && item.cards.length > 0" class="mb-3">
                <!-- <h6 class="text-primary">
                  Product Name: {{ item.product.name }}
                </h6> -->
                <b-table
                  :items="item.cards"
                  :fields="cardFields"
                  responsive
                  bordered
                  small
                  class="text-start"
                >
                  <template #cell(id)="data">
                    <span class="font-weight-bold">{{ data.value }}</span>
                  </template>

                  <template #cell(serialNumber)="data">
                    <code class="text-info">{{ data.value }}</code>
                  </template>

                  <template #cell(cardCode)="data">
                    <code class="text-success">{{ data.value }}</code>
                  </template>

                  <template #cell(pin)="data">
                    <span class="font-weight-bold text-warning">{{
                      data.value
                    }}</span>
                  </template>

                  <template #cell(status)="data">
                    <b-badge
                      :variant="getCardStatusVariant(data.value)"
                      class="text-capitalize"
                    >
                      {{ data.value }}
                    </b-badge>
                  </template>

                  <template #cell(expirationDate)="data">
                    {{ formatDate(data.value) }}
                  </template>

                  <!-- <template #cell(actions)="data">
                    <b-button
                      size="sm"
                      variant="outline-primary"
                      @click="copyToClipboard(data.item.cardCode, 'Card Code')"
                    >
                      <feather-icon icon="CopyIcon" size="14" />
                    </b-button>
                    <b-button
                      size="sm"
                      variant="outline-warning"
                      @click="copyToClipboard(data.item.pin, 'PIN')"
                      class="ml-1"
                    >
                      <feather-icon icon="CopyIcon" size="14" />
                    </b-button>
                  </template> -->
                </b-table>
              </div>
            </div>
          </div>

          <!-- No Cards Message -->
          <div v-else class="text-center py-4">
            <feather-icon
              icon="CreditCardIcon"
              size="48"
              class="text-muted mb-2"
            />
            <p class="text-muted">No cards available for this order</p>
          </div>
        </b-overlay>
      </b-card-body>
    </b-card>
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
  BCol,
  BRow,
  BCardHeader,
  BTableSimple,
} from "bootstrap-vue";
import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";
import DataService from "./data/services";
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
    BPagination,
    BForm,
    BFormInput,
    BFormGroup,
    BCol,
    BRow,
    BCardHeader,
    BTableSimple,
  },

  data() {
    return {
      details: {},
      isLoading: true,

      itemFields: [
        { key: "product.name", label: "Product Name" },
        { key: "productFaceValue", label: "Face Value" },
        { key: "quantity", label: "Quantity" },
        { key: "status", label: "Status" },
        { key: "countryCode", label: "Country" },
        { key: "currencyCode", label: "Currency" },
      ],

      cardFields: [
        { key: "id", label: "Card ID" },
        { key: "serialNumber", label: "Serial Number" },
        { key: "cardCode", label: "Card Code" },
        { key: "pin", label: "PIN" },
        { key: "status", label: "Status" },
        { key: "expirationDate", label: "Expiration Date" },
        // { key: "actions", label: "Actions" },
      ],
    };
  },

  computed: {
    hasCards() {
      return (
        this.details.items &&
        this.details.items.some((item) => item.cards && item.cards.length > 0)
      );
    },
  },

  methods: {
    getData() {
      this.isLoading = true;
      DataService.getByRequestId(this.$route.params.requestId)
        .then((response) => {
          this.isLoading = false;
          if (response.data.status) {
            this.details = response.data.data;
          } else {
            this.$toast({
              component: ToastificationContent,
              props: {
                title: "Error",
                icon: "AlertTriangleIcon",
                text: "Order not found",
                variant: "danger",
              },
            });
            this.$router.push({ name: "order-report" });
          }
        })
        .catch((error) => {
          this.isLoading = false;
          console.error("Error fetching order details:", error);
          this.$toast({
            component: ToastificationContent,
            props: {
              title: "Error",
              icon: "AlertTriangleIcon",
              text: "Failed to load order details",
              variant: "danger",
            },
          });
        });
    },

    downloadOrder() {
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

    copyToClipboard(text, label) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          this.$toast({
            component: ToastificationContent,
            props: {
              title: "Copied!",
              icon: "CheckIcon",
              text: `${label} copied to clipboard`,
              variant: "success",
            },
          });
        })
        .catch(() => {
          this.$toast({
            component: ToastificationContent,
            props: {
              title: "Error",
              icon: "AlertTriangleIcon",
              text: "Failed to copy to clipboard",
              variant: "danger",
            },
          });
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

    getCardStatusVariant(status) {
      switch (status) {
        case "Sold":
          return "success";
        case "Available":
          return "info";
        case "Expired":
          return "danger";
        default:
          return "secondary";
      }
    },

    formatCurrency(amount, currency) {
      if (!amount) return "-";
      const currencySymbol =
        currency === "USD" ? "$" : currency === "AED" ? "AED" : currency;
      // return `${currencySymbol} ${parseFloat(amount).toFixed(2)}`;
      return `${parseFloat(amount).toFixed(2)}`;
    },

    formatDate(dateString) {
      if (!dateString || dateString === "0001-01-01T00:00:00") return "-";
      return moment(dateString).format("YYYY-MM-DD HH:mm:ss");
    },
  },

  mounted() {
    this.getData();
  },
};
</script>

<style scoped>
h5 {
  margin-top: 1rem;
  margin-bottom: 1rem;
  color: #5e5873;
  font-weight: 600;
}

h6 {
  color: #5e5873;
  font-weight: 600;
}

.table td {
  vertical-align: middle;
}
</style>
