<template>
  <div class="p-6">
    <!-- Scroll Button -->
    <div
      class="scroll-button"
      v-show="showScrollButton"
      @click="handleScroll"
      :class="{ 'scroll-up': !isAtTop }"
    >
      <feather-icon
        :icon="isAtTop ? 'ArrowDownIcon' : 'ArrowUpIcon'"
        size="24"
      />
    </div>

    <!-- Loading Overlay -->
    <transition name="fade">
      <div v-if="loading" class="loading-overlay">
        <div class="loading-content">
          <b-spinner variant="primary" class="spinner" />
          <p class="loading-text">Loading products...</p>
        </div>
      </div>
    </transition>

    <!-- Product Selection Section -->
    <transition name="slide-up">
      <b-card no-body class="mb-4" v-if="!showPricingForm">
        <div class="search-header">
          <b-row class="align-items-center">
            <b-col md="6">
              <h4 class="mb-0">Select Products</h4>
              <small class="text-muted">
                {{ filteredProducts.length }} products available
              </small>
            </b-col>
            <b-col md="6" class="d-flex justify-content-end align-items-center">
              <b-form-input
                v-model="searchQuery"
                placeholder="Search products..."
                class="mr-3 search-input"
                @input="handleSearch"
              />
              <b-button
                variant="primary"
                :disabled="!selectedProducts.length"
                @click="showPricingConfiguration"
              >
                Configure Pricing
                <b-badge variant="light" class="ml-2">
                  {{ selectedProducts.length }}
                </b-badge>
              </b-button>
            </b-col>
          </b-row>
        </div>

        <b-card-body>
          <!-- Products Grid -->
          <b-row>
            <b-col
              v-for="product in displayedProducts"
              :key="product.id"
              cols="12"
              md="6"
              lg="4"
              xl="3"
              class="mb-4"
            >
              <div
                class="product-card"
                :class="{ selected: isProductSelected(product.id) }"
                @click="toggleProductSelection(product)"
              >
                <div class="product-content">
                  <div class="product-header">
                    <b-avatar
                      :src="product.logoUrl"
                      size="48"
                      class="mr-2"
                      variant="light-primary"
                    />
                    <h5 class="product-name" :title="product.name">
                      {{ product.name }}
                    </h5>
                    <b-form-checkbox
                      v-model="selectedProducts"
                      :value="product"
                      class="product-checkbox"
                      @click.stop
                    />
                  </div>
                  <div class="product-info">
                    <b-badge variant="light-primary" class="product-id">
                      <feather-icon icon="HashIcon" size="14" class="mr-1" />
                      {{ product.id }}
                    </b-badge>
                  </div>
                </div>
              </div>
            </b-col>
          </b-row>

          <!-- Pagination -->
          <div v-if="totalItems > 0" class="pagination-wrapper">
            <b-row align-v="center">
              <!-- Items per page selector -->
              <b-col
                cols="12"
                md="4"
                class="d-flex align-items-center mb-2 mb-md-0"
              >
                <div class="d-flex align-items-center">
                  <label class="mr-2 mb-0">Show:</label>
                  <b-form-select
                    v-model="pageSize"
                    :options="pageSizes"
                    class="pagination-select mr-2"
                  />
                  <span class="text-muted">entries</span>
                </div>
              </b-col>

              <!-- Pagination controls -->
              <b-col
                cols="12"
                md="4"
                class="d-flex align-items-center justify-content-center mb-2 mb-md-0"
              >
                <div class="d-flex align-items-center">
                  <b-pagination
                    v-model="currentPage"
                    :total-rows="totalItems"
                    :per-page="pageSize"
                    :limit="5"
                    class="mb-0 pagination-nav"
                    first-number
                    last-number
                    first-text="<i class='fas fa-angle-double-left'></i>"
                    last-text="<i class='fas fa-angle-double-right'></i>"
                    prev-text="<i class='fas fa-angle-left'></i>"
                    next-text="<i class='fas fa-angle-right'></i>"
                    @change="handlePageChange"
                  >
                    <template #first-text>
                      <feather-icon icon="ChevronsLeftIcon" size="18" />
                    </template>
                    <template #prev-text>
                      <feather-icon icon="ChevronLeftIcon" size="18" />
                    </template>
                    <template #next-text>
                      <feather-icon icon="ChevronRightIcon" size="18" />
                    </template>
                    <template #last-text>
                      <feather-icon icon="ChevronsRightIcon" size="18" />
                    </template>
                  </b-pagination>
                </div>
              </b-col>

              <!-- Results summary -->
              <b-col
                cols="12"
                md="4"
                class="d-flex align-items-center justify-content-md-end mb-2 mb-md-0"
              >
                <div class="d-flex align-items-center">
                  <small class="text-muted mr-2">
                    Page {{ currentPage }} of {{ totalPages }}
                  </small>
                  <b-form-input
                    v-model.number="directPageInput"
                    type="number"
                    class="pagination-input mx-2"
                    min="1"
                    :max="totalPages"
                    @change="handleDirectPageInput"
                  />
                  <small class="text-muted">
                    ({{ (currentPage - 1) * pageSize + 1 }} -
                    {{ Math.min(currentPage * pageSize, totalItems) }}
                    of {{ totalItems }})
                  </small>
                </div>
              </b-col>
            </b-row>
          </div>

          <!-- Empty State -->
          <div v-if="!loading && totalItems === 0" class="text-center py-5">
            <h4 class="text-muted">No products found</h4>
            <p v-if="searchQuery">Try adjusting your search criteria</p>
            <p v-else>No products available</p>
          </div>
        </b-card-body>
      </b-card>
    </transition>

    <!-- Pricing Configuration Form -->
    <transition name="slide-up">
      <b-card v-if="showPricingForm" no-body class="pricing-form">
        <b-card-header
          class="d-flex justify-content-between align-items-center"
        >
          <h4 class="mb-0">Configure Product Pricing</h4>
          <b-button
            variant="outline-secondary"
            size="sm"
            @click="showPricingForm = false"
          >
            <i class="fas fa-arrow-left mr-1"></i> Back to Selection
          </b-button>
        </b-card-header>

        <b-card-body>
          <b-alert show variant="info" class="mb-4">
            Configuring pricing for {{ selectedProducts.length }} selected
            products
          </b-alert>

          <!-- Pricing Form -->
          <b-row
            v-for="(item, index) in partnerData.PartnerProductPricingData"
            :key="index"
            class="pricing-row mb-2"
          >
            <b-col cols="12">
              <div
                class="pricing-item"
                :class="{ 'has-error': hasItemErrors(index) }"
              >
                <div class="d-flex flex-wrap align-items-center">
                  <!-- Product Info -->
                  <div class="product-info-section mr-auto pr-2">
                    <div class="d-flex align-items-center">
                      <feather-icon icon="BoxIcon" size="16" class="mr-1" />
                      <h6 class="mb-0 mr-1">{{ item.productName }}</h6>
                      <b-badge
                        pill
                        variant="light-primary"
                        class="product-id-badge"
                      >
                        {{ item.ProductId }}
                      </b-badge>
                    </div>
                  </div>

                  <!-- Pricing Fields -->
                  <div
                    class="pricing-fields-section d-flex flex-wrap align-items-center"
                  >
                    <!-- Percentage Value -->
                    <div class="pricing-field mr-2">
                      <b-input-group size="sm">
                        <b-input-group-prepend>
                          <b-input-group-text class="field-label">
                            <feather-icon
                              icon="PercentIcon"
                              size="12"
                              class="mr-1"
                            />
                            Percentage
                          </b-input-group-text>
                        </b-input-group-prepend>
                        <b-form-input
                          v-model="item.PercentageValue"
                          type="number"
                          min="0"
                          max="100"
                          placeholder="0-100"
                          :state="isFieldValid(item.PercentageValue)"
                          @input="validateField(index, 'PercentageValue')"
                        />
                      </b-input-group>
                      <small
                        class="text-danger"
                        v-if="getFieldError(index, 'PercentageValue')"
                      >
                        {{ getFieldError(index, "PercentageValue") }}
                      </small>
                    </div>

                    <!-- Allow Rate -->
                    <div class="pricing-field mr-2">
                      <b-input-group size="sm">
                        <b-input-group-prepend>
                          <b-input-group-text class="field-label">
                            <feather-icon
                              icon="CheckCircleIcon"
                              size="12"
                              class="mr-1"
                            />
                            Allow
                          </b-input-group-text>
                        </b-input-group-prepend>
                        <b-form-input
                          v-model="item.AllowRateValue"
                          type="number"
                          min="0"
                          placeholder="Rate"
                          :state="isFieldValid(item.AllowRateValue)"
                          @input="validateField(index, 'AllowRateValue')"
                        />
                      </b-input-group>
                      <small
                        class="text-danger"
                        v-if="getFieldError(index, 'AllowRateValue')"
                      >
                        {{ getFieldError(index, "AllowRateValue") }}
                      </small>
                    </div>

                    <!-- Disable Rate -->
                    <div class="pricing-field mr-2">
                      <b-input-group size="sm">
                        <b-input-group-prepend>
                          <b-input-group-text class="field-label">
                            <feather-icon
                              icon="XCircleIcon"
                              size="12"
                              class="mr-1"
                            />
                            Disable
                          </b-input-group-text>
                        </b-input-group-prepend>
                        <b-form-input
                          v-model="item.DisableRateValue"
                          type="number"
                          min="0"
                          placeholder="Rate"
                          :state="isFieldValid(item.DisableRateValue)"
                          @input="validateField(index, 'DisableRateValue')"
                        />
                      </b-input-group>
                      <small
                        class="text-danger"
                        v-if="getFieldError(index, 'DisableRateValue')"
                      >
                        {{ getFieldError(index, "DisableRateValue") }}
                      </small>
                    </div>

                    <!-- Remove Button -->
                    <b-button
                      variant="text-danger"
                      class="btn-icon p-0"
                      @click="removeRow(index)"
                      v-b-tooltip.hover
                      title="Remove Product"
                    >
                      <feather-icon icon="TrashIcon" size="16" />
                    </b-button>
                  </div>
                </div>
              </div>
            </b-col>
          </b-row>

          <div class="mt-4 text-center">
            <b-button
              variant="success"
              size="lg"
              @click="submitForm"
              :disabled="loading"
              class="mr-2"
            >
              <i class="fas fa-save mr-1"></i>
              {{ loading ? "Saving..." : "Save Configuration" }}
            </b-button>
            <b-button
              variant="outline-secondary"
              size="lg"
              @click="showPricingForm = false"
              :disabled="loading"
            >
              Cancel
            </b-button>
          </div>
        </b-card-body>
      </b-card>
    </transition>
  </div>
</template>

<script>
import {
  BCard,
  BCardHeader,
  BCardBody,
  BRow,
  BCol,
  BFormInput,
  BButton,
  BSpinner,
  BPagination,
  BFormCheckbox,
  BFormSelect,
  BFormGroup,
  BBadge,
  BAlert,
  BAvatar,
} from "bootstrap-vue";

import { ValidationProvider, ValidationObserver } from "vee-validate";
import { required } from "@validations";
import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";
import DataService from "./data/services";
import FeatherIcon from "@core/components/feather-icon/FeatherIcon.vue";

export default {
  name: "AddPricing",
  components: {
    BCard,
    BCardHeader,
    BCardBody,
    BRow,
    BCol,
    BFormInput,
    BButton,
    BSpinner,
    BPagination,
    BFormCheckbox,
    BFormSelect,
    BFormGroup,
    BBadge,
    BAlert,
    BAvatar,
    ValidationProvider,
    ValidationObserver,
    ToastificationContent,
    FeatherIcon,
  },
  data() {
    return {
      partnerData: {
        PartnerId: this.$route.params.partner_id,
        PartnerProductPricingData: [],
      },
      allProducts: [],
      searchQuery: "",
      selectedProducts: [],
      loading: false,
      showPricingForm: false,
      currentPage: 1,
      totalItems: 0,
      pageSizes: [25, 50, 100, 200, 300, 400, 500],
      pageSize: 25,
      totalPages: 0,
      hasNextPage: false,
      hasPreviousPage: false,
      searchTimeout: null,
      directPageInput: 1,
      showScrollButton: false,
      isAtTop: true,
      fieldErrors: {},
      scrollThreshold: 300,
    };
  },
  computed: {
    filteredProducts() {
      return this.allProducts;
    },
    displayedProducts() {
      return this.allProducts;
    },
  },
  methods: {
    loadProducts(page = 1, search = "") {
      this.loading = true;
      DataService.getProducts(page, this.pageSize, search)
        .then((response) => {
          const { data, count, currentPage, totalPages, hasNext, hasPrevious } =
            response.data.data;
          this.allProducts = data;
          this.totalItems = count;
          this.currentPage = currentPage;
          this.totalPages = totalPages;
          this.hasNextPage = hasNext;
          this.hasPreviousPage = hasPrevious;
        })
        .catch((error) => {
          console.error("Error loading products:", error);
          this.$toast({
            component: ToastificationContent,
            props: {
              title: "Error",
              icon: "AlertCircleIcon",
              text: "Failed to load products",
              variant: "danger",
            },
          });
        })
        .finally(() => {
          this.loading = false;
        });
    },

    handleSearch() {
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout);
      }
      this.searchTimeout = setTimeout(() => {
        this.currentPage = 1;
        this.loadProducts(1, this.searchQuery);
      }, 300);
    },

    handlePageChange(page) {
      this.loadProducts(page, this.searchQuery);
    },

    handlePageSizeChange() {
      this.currentPage = 1;
      this.loadProducts(1, this.searchQuery);
    },

    toggleProductSelection(product) {
      const index = this.selectedProducts.findIndex((p) => p.id === product.id);
      if (index === -1) {
        this.selectedProducts.push(product);
      } else {
        this.selectedProducts.splice(index, 1);
      }
    },

    isProductSelected(id) {
      return this.selectedProducts.some((product) => product.id === id);
    },

    showPricingConfiguration() {
      this.partnerData.PartnerProductPricingData = this.selectedProducts.map(
        (product) => ({
          ProductId: product.id,
          productName: product.name,
          PercentageValue: null,
          AllowRateValue: null,
          DisableRateValue: null,
        })
      );
      this.showPricingForm = true;
    },

    removeRow(index) {
      this.partnerData.PartnerProductPricingData.splice(index, 1);
      this.selectedProducts.splice(index, 1);

      if (this.partnerData.PartnerProductPricingData.length === 0) {
        this.showPricingForm = false;
      }
    },

    submitForm() {
      if (!this.partnerData.PartnerProductPricingData.length) {
        this.$toast({
          component: ToastificationContent,
          props: {
            title: "Warning",
            icon: "AlertCircleIcon",
            text: "Please select at least one product",
            variant: "warning",
          },
        });
        return;
      }

      // Validate all fields before submission
      if (!this.validateAllFields()) {
        this.$toast({
          component: ToastificationContent,
          props: {
            title: "Validation Error",
            icon: "AlertCircleIcon",
            text: "Please fill in all required fields correctly",
            variant: "danger",
          },
        });
        return;
      }

      const payload = {
        PartnerId: this.partnerData.PartnerId,
        PartnerProductPricingData:
          this.partnerData.PartnerProductPricingData.map((item) => ({
            ProductId: item.ProductId,
            PercentageValue: item.PercentageValue,
            AllowRateValue: item.AllowRateValue,
            DisableRateValue: item.DisableRateValue,
          })),
      };

      this.loading = true;
      DataService.create(payload)
        .then((response) => {
          this.$toast({
            component: ToastificationContent,
            props: {
              title: "Success",
              icon: "CheckIcon",
              text: "Pricing configuration saved successfully",
              variant: "success",
            },
          });
          this.$router.push(`/partnercatalog/${this.partnerData.PartnerId}`);
        })
        .catch((error) => {
          console.error("Error submitting form:", error);
          this.handleBackendError(error);
        })
        .finally(() => {
          this.loading = false;
        });
    },

    handleDirectPageInput() {
      let page = parseInt(this.directPageInput);

      // Validate page number
      if (isNaN(page) || page < 1) {
        page = 1;
      } else if (page > this.totalPages) {
        page = this.totalPages;
      }

      this.directPageInput = page;
      if (page !== this.currentPage) {
        this.handlePageChange(page);
      }
    },

    // Scroll handling methods
    handleScroll() {
      if (this.isAtTop) {
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: "smooth",
        });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    },

    updateScrollButton() {
      const scrollPosition =
        window.pageYOffset || document.documentElement.scrollTop;
      this.showScrollButton = scrollPosition > this.scrollThreshold;
      this.isAtTop = scrollPosition < this.scrollThreshold;
    },

    // Validation methods
    validateField(index, field) {
      const item = this.partnerData.PartnerProductPricingData[index];
      const value = item[field];

      if (!this.fieldErrors[index]) {
        this.$set(this.fieldErrors, index, {});
      }

      // Clear previous error
      this.$set(this.fieldErrors[index], field, null);

      // Validate empty fields
      if (value === null || value === "") {
        this.$set(this.fieldErrors[index], field, "This field is required");
        return false;
      }

      // Validate percentage range
      if (field === "PercentageValue") {
        if (value < 0 || value > 100) {
          this.$set(
            this.fieldErrors[index],
            field,
            "Percentage must be between 0 and 100"
          );
          return false;
        }
      }

      // Validate rate values
      if (["AllowRateValue", "DisableRateValue"].includes(field)) {
        if (value < 0) {
          this.$set(this.fieldErrors[index], field, "Rate cannot be negative");
          return false;
        }
      }

      return true;
    },

    validateAllFields() {
      let isValid = true;
      this.fieldErrors = {};

      this.partnerData.PartnerProductPricingData.forEach((item, index) => {
        ["PercentageValue", "AllowRateValue", "DisableRateValue"].forEach(
          (field) => {
            if (!this.validateField(index, field)) {
              isValid = false;
            }
          }
        );
      });

      return isValid;
    },

    isFieldValid(value) {
      return value !== null && value !== "";
    },

    getFieldError(index, field) {
      return this.fieldErrors[index]?.[field];
    },

    hasItemErrors(index) {
      return (
        this.fieldErrors[index] &&
        Object.values(this.fieldErrors[index]).some((error) => error)
      );
    },

    handleBackendError(error) {
      let errorMessage = "An unexpected error occurred";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.errors) {
        errorMessage = Object.values(error.response.data.errors).join("\n");
      }

      this.$toast({
        component: ToastificationContent,
        props: {
          title: "Error",
          icon: "AlertCircleIcon",
          text: errorMessage,
          variant: "danger",
        },
      });
    },
  },
  mounted() {
    this.loadProducts();
    window.addEventListener("scroll", this.updateScrollButton);
    this.updateScrollButton();
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.updateScrollButton);
  },
  watch: {
    pageSize() {
      this.handlePageSizeChange();
    },
    currentPage: {
      handler(newPage) {
        this.directPageInput = newPage;
      },
      immediate: true,
    },
  },
};
</script>
<style lang="scss">
@import "@core/scss/vue/libs/vue-select.scss";

.product-card {
  background: white;
  border-radius: 0.5rem;
  border: 2px solid transparent;
  transition: all 0.25s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  }

  &.selected {
    border-color: var(--primary);
    background-color: rgba(var(--primary), 0.04);

    .product-name {
      color: var(--primary);
    }

    &::before {
      content: "";
      position: absolute;
      top: 0;
      right: 0;
      border-style: solid;
      border-width: 0 2rem 2rem 0;
      border-color: transparent var(--primary) transparent transparent;
    }
  }

  .product-content {
    padding: 1.25rem;
  }

  .product-header {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 1rem;
    gap: 0.5rem;

    .product-name {
      flex: 1;
      font-size: 1rem;
      font-weight: 600;
      margin: 0;
      line-height: 1.4;
      height: 2.8em;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    .product-checkbox {
      margin: 0;
      flex-shrink: 0;
    }
  }

  .product-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .product-id {
    font-size: 0.875rem;
    display: flex;
    align-items: center;
  }

  .product-checkbox {
    margin: 0;
  }
}

.pricing-row {
  .pricing-item {
    background: white;
    border-radius: 0.5rem;
    padding: 0.75rem 1rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    border: 1px solid #ebe9f1;

    .product-info-section {
      h6 {
        font-weight: 600;
        color: #5e5873;
        font-size: 0.95rem;
      }

      .product-id-badge {
        font-size: 0.8rem;
        padding: 0.3em 0.8em;
      }
    }

    .pricing-fields-section {
      .pricing-field {
        min-width: 200px;
        margin-bottom: 0.5rem;

        @media (min-width: 992px) {
          margin-bottom: 0;
        }

        .field-label {
          background-color: #f8f8f8;
          border-color: #d8d6de;
          color: #6e6b7b;
          font-size: 0.85rem;
          padding: 0.3rem 0.7rem;
          display: flex;
          align-items: center;
          white-space: nowrap;
        }

        .form-control {
          height: calc(1.5em + 0.6rem + 2px);
          border-color: #d8d6de;
          font-size: 0.85rem;

          &:focus {
            border-color: var(--primary);
            box-shadow: 0 2px 4px 0 rgba(var(--primary), 0.1);
          }
        }
      }
    }

    .btn-icon {
      width: 28px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 0.3rem;
      transition: all 0.15s ease;

      &:hover {
        background-color: rgba(234, 84, 85, 0.12);
      }
    }
  }
}

.search-header {
  background-color: white;
  padding: 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 1.5rem;

  .search-input {
    max-width: 300px;
  }
}

.pagination-wrapper {
  background-color: white;
  padding: 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-top: 2rem;

  .pagination-select {
    min-width: 80px;
    width: auto;
  }

  .pagination-input {
    width: 60px;
    text-align: center;
    padding: 0.25rem;
    border-radius: 0.25rem;
  }

  .pagination-nav {
    margin: 0;

    .page-item {
      .page-link {
        padding: 0.5rem 0.75rem;
        border-radius: 0.25rem;
        margin: 0 2px;
        color: var(--primary);
        background-color: white;
        border: 1px solid #dee2e6;
        min-width: 35px;
        text-align: center;
        line-height: 1;
        display: flex;
        align-items: center;
        justify-content: center;

        svg {
          height: 18px;
          width: 18px;
          vertical-align: middle;
        }

        &:hover {
          background-color: #e9ecef;
          border-color: #dee2e6;
          color: var(--primary);
        }
      }

      &.active .page-link {
        background-color: var(--primary);
        border-color: var(--primary);
        color: white;
      }

      &.disabled .page-link {
        color: #6c757d;
        background-color: #f8f9fa;
        border-color: #dee2e6;
      }
    }
  }
}

@media (max-width: 768px) {
  .pagination-wrapper {
    .pagination-nav {
      .page-link {
        padding: 0.4rem;
        min-width: 32px;
      }
    }
  }

  .pricing-row {
    .pricing-item {
      .product-info-section {
        margin-bottom: 1rem;
        width: 100%;
      }

      .pricing-fields-section {
        width: 100%;
        justify-content: space-between;

        .pricing-field {
          flex: 1;
          margin-right: 0.5rem;

          &:last-child {
            margin-right: 0;
          }
        }
      }
    }
  }
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;

  .loading-content {
    text-align: center;

    .spinner {
      margin-bottom: 1rem;
    }

    .loading-text {
      font-size: 1.1rem;
      color: var(--primary);
    }
  }
}

// Animation classes
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}
.slide-up-enter,
.slide-up-leave-to {
  transform: translateY(20px);
  opacity: 0;
}

.scroll-button {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 3rem;
  height: 3rem;
  background-color: var(--primary);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 1000;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }

  &.scroll-up {
    bottom: 2rem;
  }
}

.pricing-item.has-error {
  border-color: var(--danger);
  background-color: rgba(var(--danger), 0.02);
}

.pricing-field {
  .text-danger {
    font-size: 0.75rem;
    margin-top: 0.25rem;
    display: block;
  }
}

.form-control.is-invalid {
  border-color: var(--danger);

  &:focus {
    box-shadow: 0 0 0 0.2rem rgba(var(--danger), 0.25);
  }
}

.alert {
  ul {
    padding-left: 1.25rem;
  }
}
</style>

<!-- <style scoped>
.v-select {
  width: 100%;
}
</style> -->
