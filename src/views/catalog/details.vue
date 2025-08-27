<template>
  <div class="partner-details p-6">
    <!-- Error Alert -->

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
          <h4 class="mb-0">Available Products</h4>
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
  },
  data() {
    return {
      details: {},

      isLoading: false,

      productFields: [
        // { key: "id", label: "Id" },
        { key: "name", label: "Name" },
        { key: "description", label: "Description" },
        { key: "minFaceValue", label: "Min Face Value" },
        { key: "maxFaceValue", label: "Max Face Value" },
        { key: "count", label: "Count" },
        // { key: "price", label: "Price" },
      ],
    };
  },
  methods: {
    getData() {
      this.isLoading = true;
      var arr = [];
      DataService.get(this.$route.params.id)
        .then((response) => {
          //   console.log(response.data.id);

          this.isDataLoaded = true; // Set flag to true once data is loaded

          this.isLoading = false;
          this.details = response.data.data;
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          this.isDataLoaded = false; // Handle error
        });
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
