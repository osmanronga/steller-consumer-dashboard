<template>
  <div class="p-6">
    <b-card no-body>
      <b-card-header>
        <h4 class="mb-0">Partner Product Pricing</h4>
      </b-card-header>

      <b-card-body>
        <b-row
          v-for="(item, index) in partnerData.PartnerProductPricingData"
          :key="index"
          class="align-items-end mb-4"
        >
          <!-- Product Search -->
          <!-- <b-col md="4">
            <label class="form-label">Product</label>
            <v-select
              v-model="item.ProductId"
              :options="productOptions"
              label="name"
              :reduce="(product) => product.id"
              placeholder="Search product"
              class="form-control"
            />
          </b-col> -->

          <b-col md="4">
            <label class="form-label">Product</label>
            <v-select
              v-model="item.ProductId"
              :filterable="false"
              :options="item.productOptions"
              :loading="item.loadingProducts"
              label="name"
              placeholder="Search product"
              @search="(search) => searchProducts(search, index)"
            />
          </b-col>

          <!-- Percentage Value -->
          <b-col md="2">
            <label class="form-label">Percentage Value (%)</label>
            <b-form-input
              v-model="item.PercentageValue"
              type="number"
              placeholder="Enter %"
            />
          </b-col>

          <!-- Allow Rate Value -->
          <b-col md="2">
            <label class="form-label">Allow Rate</label>
            <b-form-input
              v-model="item.AllowRateValue"
              type="number"
              placeholder="Enter allowed rate"
            />
          </b-col>

          <!-- Disable Rate Value -->
          <b-col md="2">
            <label class="form-label">Disable Rate</label>
            <b-form-input
              v-model="item.DisableRateValue"
              type="number"
              placeholder="Enter disable rate"
            />
          </b-col>

          <!-- Delete Button -->
          <b-col md="2">
            <b-button
              variant="danger"
              @click="removeRow(index)"
              block
              class="mt-2"
            >
              Remove
            </b-button>
          </b-col>
        </b-row>

        <b-button variant="primary" @click="addRow" block class="mt-3">
          Add Product Row
        </b-button>

        <div class="mt-4">
          <b-button variant="success" @click="submitForm"> Submit </b-button>
        </div>
      </b-card-body>
    </b-card>
  </div>
</template>

<script>
// import "vue-select/dist/vue-select.css";
import {
  BSidebar,
  BForm,
  BFormGroup,
  BFormInput,
  BFormInvalidFeedback,
  BButton,
  BFormFile,
  BCardText,
  BMedia,
  BAvatar,
  BSpinner,
  BCard,
  BOverlay,
  BBadge,
  BCol,
  BRow,
  BCardHeader,
  BCardBody,
} from "bootstrap-vue";
import { ValidationProvider, ValidationObserver } from "vee-validate";
import { onMounted, ref } from "@vue/composition-api";
import { required, alphaNum, email } from "@validations";
import formValidation from "@core/comp-functions/forms/form-validation";
import Ripple from "vue-ripple-directive";
import vSelect from "vue-select";
import store from "@/store";
import { watch } from "@vue/composition-api";
import DataService from "./data/services";
import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";
import md5 from "js-md5";

export default {
  components: {
    BSidebar,
    BForm,
    BFormGroup,
    BFormInput,
    BFormInvalidFeedback,
    BButton,
    BFormFile,
    BCardText,
    BMedia,
    BAvatar,
    BSpinner,
    vSelect,
    // Form Validation
    ValidationProvider,
    ValidationObserver,
    ToastificationContent,

    BCard,
    BOverlay,
    BBadge,
    BCol,
    BRow,
    BCardHeader,
    BCardBody,
  },
  // directives: {
  //   Ripple,
  // },

  data() {
    return {
      partnerData: {
        PartnerId: this.$route.params.partner_id,
        PartnerProductPricingData: [],
      },
      productOptions: [
        // { id: 1820141, name: "IMVU USA 25 USD" },
        // { id: 1820140, name: "IMVU USA 10 USD" },
        // { id: 1826851, name: "Amazon Gift Card 50 USD" },
        // { id: 1826852, name: "Netflix Subscription 1 Month" },
        // You can load more from your backend
      ],
    };
  },
  methods: {
    loadProducts() {
      DataService.getProducts()
        .then((response) => {
          //   console.log(response.data.id);

          this.isDataLoaded = true; // Set flag to true once data is loaded

          this.isLoading = false;
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          this.isDataLoaded = false; // Handle error
        });
    },
    // getProductOptions() {
    //   DataService.getProducts()
    //     .then((response) => {
    //       response.data.forEach((option) => {
    //         this.productOptions.push({
    //           id: option.id,
    //           name: option.name,
    //         });
    //       });
    //     })
    //     .catch((error) => {
    //       console.error("Failed to fetch products:", error);
    //     });
    // },

    searchProducts(search, index) {
      if (search.length < 3) {
        this.partnerData.PartnerProductPricingData[index].productOptions = [];
        return;
      }
      this.partnerData.PartnerProductPricingData[index].loadingProducts = true;
      DataService.searchProducts(search)
        .then((response) => {
          // console.log(response.data);
          this.partnerData.PartnerProductPricingData[index].productOptions =
            response.data.data.map((product) => ({
              id: product.id,
              name: product.name,
            }));

          // response.data.forEach((option) => {
          //   this.productOptions.push({
          //     id: option.id,
          //     name: option.name,
          //   });
          // });
        })
        .finally(() => {
          this.partnerData.PartnerProductPricingData[
            index
          ].loadingProducts = false;
        });
    },

    addRow() {
      this.partnerData.PartnerProductPricingData.push({
        ProductId: null,
        PercentageValue: null,
        AllowRateValue: null,
        DisableRateValue: null,
        productOptions: [],
        loadingProducts: false,
      });
    },
    removeRow(index) {
      this.partnerData.PartnerProductPricingData.splice(index, 1);
    },
    submitForm() {
      // console.log("Submitting:", this.partnerData);

      const payload = {
        PartnerId: this.partnerData.PartnerId,
        PartnerProductPricingData:
          this.partnerData.PartnerProductPricingData.map((item) => ({
            ProductId: item.ProductId?.id, // only id sent
            PercentageValue: item.PercentageValue,
            AllowRateValue: item.AllowRateValue,
            DisableRateValue: item.DisableRateValue,
          })),
      };

      this.loading = true;
      this.allerrors = [];

      DataService.create(payload)
        .then((response) => {
          this.loading = false;

          this.$toast({
            component: ToastificationContent,
            props: {
              title: "Service Providers",
              icon: "EditIcon",
              variant: "success",
              text: "Added successfully",
            },
          });

          this.$router.push(`/partnercatalog/${this.partnerData.PartnerId}`);

          // this.$router.push({
          //   name: "partnercatalog",
          //   params: { partner_id: this.partnerData.PartnerId },
          // });
        })
        .catch((error) => {
          console.log(error);
          this.loading = false;

          if (error.response.data.responseCode == 102) {
            this.allerrors = error.response.data.error;
          }
          let message = Error;
          if (error.response !== undefined) {
            message = error.response.data.message;
          }

          this.$toast({
            component: ToastificationContent,
            props: {
              title: "Error",
              icon: "BellIcon",
              text: message,
              variant: "danger",
            },
          });
        });

      console.log("Submitting:", payload);

      // You can call your API here to submit
    },
  },
  mounted() {
    // this.getProductOptions();
  },
};
</script>
<style lang="scss">
@import "@core/scss/vue/libs/vue-select.scss";
</style>

<!-- <style scoped>
.v-select {
  width: 100%;
}
</style> -->
