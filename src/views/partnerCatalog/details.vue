<template>
  <div class="partner-details p-6">
    <!-- Error Alert -->
    <b-alert v-model="showError" variant="danger" dismissible class="mb-4">
      <div class="d-flex align-items-center">
        <feather-icon icon="AlertCircleIcon" class="me-2" size="18" />
        <span>{{ errorMessage }}</span>
      </div>
      <small v-if="errorReferenceId" class="d-block mt-1">
        Reference ID: {{ errorReferenceId }}
      </small>
    </b-alert>

    <!-- Loading Overlay -->
    <b-overlay
      :show="isLoading"
      rounded="sm"
      spinner-variant="primary"
      spinner-type="grow"
      class="position-relative"
    >
      <!-- Header Card -->
      <b-card no-body class="mb-4">
        <b-card-header class="partner-header p-4">
          <div class="d-flex align-items-start">
            <b-avatar :src="details.logoUrl" size="80px" class="me-4" rounded />
            <div>
              <h2 class="mb-1">{{ details.name }}</h2>
              <div class="partner-meta">
                <span class="me-3">#{{ details.id }}</span>
                <span class="me-3">{{ details.countryCode }}</span>
                <span>{{ details.currencyCode }}</span>
              </div>
            </div>
          </div>
        </b-card-header>
      </b-card>

      <!-- Main Content Card -->
      <b-card no-body class="mb-4">
        <b-card-body class="p-4">
          <b-row>
            <b-col lg="6" class="mb-4">
              <div class="content-section">
                <h4 class="section-title">Description</h4>
                <div class="section-content" v-html="details.description"></div>
              </div>

              <div class="content-section">
                <h4 class="section-title">Redemption Instructions</h4>
                <div
                  class="section-content"
                  v-html="details.redemptionInstructions"
                ></div>
              </div>
            </b-col>

            <b-col lg="6" class="mb-4">
              <div class="content-section">
                <h4 class="section-title">Terms</h4>
                <div class="section-content" v-html="details.terms"></div>
              </div>

              <div class="content-section">
                <h4 class="section-title">Categories</h4>
                <div class="categories-list">
                  <div
                    v-for="cat in details.categories"
                    :key="cat.id"
                    class="category-item mb-3"
                  >
                    <h5 class="category-name">{{ cat.name }}</h5>
                    <div
                      v-if="cat.description"
                      class="category-description"
                      v-html="cat.description"
                    ></div>
                  </div>
                </div>
              </div>
            </b-col>
          </b-row>
        </b-card-body>
      </b-card>

      <!-- Products Table Card -->
      <b-card no-body>
        <b-card-header
          class="d-flex justify-content-between align-items-center p-4"
        >
          <h4 class="mb-0">Products</h4>
        </b-card-header>
        <b-card-body class="p-0">
          <b-table
            :items="details.products"
            :fields="productFields"
            responsive
            bordered
            striped
            hover
            class="text-start mb-0"
          >
            <template #cell(modifiedDate)="data">
              {{ data.value | moment("YY-MM-DD HH:mm:ss") }}
            </template>
          </b-table>
        </b-card-body>
      </b-card>
    </b-overlay>
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
  BAlert,
} from "bootstrap-vue";
import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";
import AddNew from "./AddNew.vue";
// import companyData from './companyData'
import { ref, onUnmounted } from "@vue/composition-api";
import store from "@/store";
import { onMounted } from "vue";
import DataService from "./data/services";
import BCardCode from "@core/components/b-card-code/BCardCode.vue";
import Swal from "sweetalert2";
import { ValidationProvider, ValidationObserver } from "vee-validate";
import { required, digits, length } from "@validations";
import axios from "axios";

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
    AddNew,
    BButton,
    BCardBody,
    ToastificationContent,
    BCardCode,
    BPagination,
    BForm,
    BFormInput,
    BFormGroup,

    BCol,
    BRow,
    BCardHeader,

    ValidationProvider,
    ValidationObserver,
    BAlert,
  },
  data() {
    return {
      details: {},

      productFields: [
        // { key: "id", label: "Id" },
        { key: "name", label: "Name" },
        { key: "description", label: "Description" },
        { key: "minFaceValue", label: "Min Face Value" },
        { key: "maxFaceValue", label: "Max Face Value" },
        { key: "count", label: "Count" },
        { key: "price", label: "Price" },
      ],
      isLoading: false,
      showError: false,
      errorMessage: "",
      errorReferenceId: "",
      isDataLoaded: false,
      showEditModal: false,
      editForm: {
        id: null,
        partnerId: null,
        productId: null,
        percentageValue: null,
        allowRateValue: null,
        disableRateValue: null,
      },
    };
  },
  methods: {
    getData() {
      this.isLoading = true;
      this.showError = false;
      this.errorMessage = "";
      this.errorReferenceId = "";

      const product_id = this.$route.params.product_id;

      DataService.get(product_id)
        .then((response) => {
          if (response.data.status === false) {
            throw {
              response: {
                data: response.data.data.data,
              },
            };
          }

          this.isDataLoaded = true;
          this.details = response.data.data.data;
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          this.isDataLoaded = false;

          const errorData = error.response?.data;

          this.showError = true;
          this.errorMessage =
            errorData?.Message ||
            "An error occurred while fetching the data. Please try again later.";

          if (errorData?.Errors?.referenceId) {
            this.errorReferenceId = errorData.Errors.referenceId;
          }

          // If no data is loaded, initialize empty details
          this.details = {};
        })
        .finally(() => {
          this.isLoading = false;
        });
    },

    // Add method to retry loading data
    retryLoad() {
      this.getData();
    },

    async openEditModal(product) {
      try {
        this.isLoading = true;
        // Fetch product details from API
        const response = await DataService.getPartnerProductDetailsById(
          product.id
        );
        console.log(response.data.data);

        if (response.data.status == true) {
          const productDetails = response.data.data;
          this.editForm = {
            id: product.id,
            partnerId: parseInt(this.$route.params.partner_id),
            productId: productDetails.productId,
            percentageValue: productDetails.percentageValue || 0,
            allowRateValue: productDetails.allowRateValue || 51,
            disableRateValue: productDetails.disableRateValue || 52,
          };
          this.showEditModal = true;
        } else {
          throw new Error(
            response.data.Message || "Failed to fetch product details"
          );
        }
      } catch (error) {
        this.$toast({
          component: ToastificationContent,
          props: {
            title: "Error",
            icon: "AlertCircleIcon",
            variant: "danger",
            text: error.message || "Failed to fetch product details",
          },
        });
      } finally {
        this.isLoading = false;
      }
    },

    resetEditForm() {
      this.editForm = {
        id: null,
        partnerId: null,
        productId: null,
        percentageValue: null,
        allowRateValue: null,
        disableRateValue: null,
      };
    },

    async handleUpdate() {
      try {
        this.isLoading = true;
        console.log("Update request data:", this.editForm);
        const response = await DataService.updateProductRates(
          this.editForm.id,
          this.editForm
        );

        if (response.data.status === true) {
          // Show success message
          this.$toast({
            component: ToastificationContent,
            props: {
              title: "Success",
              icon: "CheckIcon",
              variant: "success",
              text: "Product rates updated successfully",
            },
          });

          // Refresh the data
          this.getData();
        } else {
          throw new Error(
            response.data.Message || "Failed to update product rates"
          );
        }
      } catch (error) {
        // Show error message
        this.$toast({
          component: ToastificationContent,
          props: {
            title: "Error",
            icon: "AlertCircleIcon",
            variant: "danger",
            text: error.message || "Failed to update product rates",
          },
        });
      } finally {
        this.isLoading = false;
        this.showEditModal = false;
      }
    },

    async handleDelete(product) {
      try {
        const result = await Swal.fire({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes, delete it!",
          cancelButtonText: "No, cancel!",
          customClass: {
            confirmButton: "btn btn-primary",
            cancelButton: "btn btn-outline-danger ms-1",
          },
          buttonsStyling: false,
        });

        if (result.isConfirmed) {
          this.isLoading = true;
          const response = await DataService.deleteProduct(product.id);

          if (response.data.status === true) {
            this.$toast({
              component: ToastificationContent,
              props: {
                title: "Deleted!",
                icon: "CheckIcon",
                variant: "success",
                text: "Product has been deleted.",
              },
            });
            // Refresh the data
            this.getData();
          } else {
            throw new Error(
              response.data.Message || "Failed to delete product"
            );
          }
        }
      } catch (error) {
        this.$toast({
          component: ToastificationContent,
          props: {
            title: "Error",
            icon: "AlertCircleIcon",
            variant: "danger",
            text: error.message || "Failed to delete product",
          },
        });
      } finally {
        this.isLoading = false;
      }
    },
  },
  mounted() {
    this.getData();
  },
};
</script>

<style lang="scss" scoped>
.partner-details {
  .partner-header {
    background-color: #f8f9fa;
  }

  .partner-meta {
    color: #6c757d;
    font-size: 0.9rem;
  }

  .section-title {
    color: #2c3e50;
    margin-bottom: 1.25rem;
    font-weight: 600;
  }

  .content-section {
    margin-bottom: 2rem;

    &:last-child {
      margin-bottom: 0;
    }
  }

  .section-content {
    color: #4a5568;
    line-height: 1.6;
  }

  .categories-list {
    .category-item {
      background-color: #f8f9fa;
      border-radius: 8px;
      padding: 1rem;

      .category-name {
        color: #2c3e50;
        margin-bottom: 0.5rem;
        font-weight: 600;
      }

      .category-description {
        color: #4a5568;
        font-size: 0.9rem;
      }
    }
  }

  ::v-deep .table {
    th {
      background-color: #f8f9fa;
      font-weight: 600;
    }

    td {
      vertical-align: middle;
    }
  }

  .alert {
    border-left: 4px solid;

    &.alert-danger {
      border-left-color: #dc3545;
    }
  }
}
</style>
