<template>
  <div class="p-6 text-start">
    <b-card no-body>
      <b-card-header class="d-flex align-items-start justify-content-start">
        <div class="d-flex align-items-start">
          <b-avatar :src="details.logoUrl" size="64px" class="me-3" />
          <div>
            <h3 class="mb-0">{{ details.name }}</h3>
            <small class=""
              >#{{ details.id }} | {{ details.countryCode }} |
              {{ details.currencyCode }}</small
            >
          </div>
        </div>
      </b-card-header>

      <b-card-body>
        <b-row>
          <b-col md="6">
            <h5>Description</h5>

            <div v-html="details.description"></div>

            <h5>Redemption Instructions</h5>
            <div v-html="details.redemptionInstructions"></div>

            <h5>Terms</h5>
            <div v-html="details.terms"></div>

            <h5>Categories</h5>
            <ul>
              <li v-for="cat in details.categories" :key="cat.id">
                <strong>{{ cat.name }}</strong>
                <!-- <p class="mb-2" v-if="cat.description">
                  {{ cat.description }}
                </p> -->
                <div
                  class="mb-2"
                  v-if="cat.description"
                  v-html="cat.description"
                ></div>
              </li>
            </ul>
          </b-col>

          <b-col md="6">
            <h5>Available Products</h5>
            <b-table
              :items="details.products"
              :fields="productFields"
              small
              responsive
              bordered
              class="text-start"
            >
              <template #cell(modifiedDate)="data">
                {{ data.value | moment("YY-MM-DD HH:mm:ss") }}
              </template>
            </b-table>
          </b-col>
        </b-row>
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

      productFields: [
        { key: "name", label: "Name" },
        { key: "count", label: "Count" },
        { key: "minFaceValue", label: "Min Face Value" },
        { key: "maxFaceValue", label: "Max Face Value" },
        { key: "price.min", label: "Price (Min)" },
        { key: "price.max", label: "Price (Max)" },
        { key: "price.currencyCode", label: "Currency Code" },
        { key: "modifiedDate", label: "Modified Date" },
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
          this.details = response.data;
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

<style scoped>
h5 {
  margin-top: 1rem;
}
</style>
