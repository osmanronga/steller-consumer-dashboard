<template>
  <b-card-code>
    <!-- <div class="d-flex justify-content-between  flex-wrap"> -->

    <router-link
      :to="{
        name: 'addpricingtoproduct',
        params: {
          partner_id: $route.params.id,
        },
      }"
    >
      <b-button variant="primary" class="m-2">إضافة تسعير للمنتجات</b-button>
    </router-link>

    <b-overlay :show="isLoading" rounded="sm">
      <!-- <div class="d-flex align-items-center">
        <b-form-group>
          <label> إبحث عن العميل باﻹسم أو الهاتف أو اﻹيميل </label>
          <validation-provider
            #default="{ errors }"
            rules="required"
            name="الاسم أو رقم الهاتف أو عنوان البريد الإلكتروني"
          >
            <b-form-input
              v-model="searchQuery"
              :state="errors.length > 0 ? false : null"
              placeholder="search"
              id="search-select"
            />
            <small class="text-danger">{{ errors[0] }}</small>
          </validation-provider>
        </b-form-group>

        <b-form-group>
          <b-button
            @click="getData(1)"
            variant="primary"
            class="mb-2"
            style="margin: 45px"
          >
            بحث
          </b-button>
        </b-form-group>
      </div> -->

      <b-table
        responsive
        :items="items"
        :fields="tableColumns"
        striped
        class="position-relative"
      >
        <template #cell(id)="data">
          {{ data.index + 1 }}
        </template>

        <template #cell(logoUrl)="data">
          <b-avatar :src="data.value" />
        </template>

        <!-- Column: Actions -->
        <template #cell(actions)="data">
          <b-dropdown variant="link" no-caret>
            <template #button-content>
              <feather-icon
                icon="MoreVerticalIcon"
                size="16"
                class="align-middle text-body"
              />
            </template>
            <b-dropdown-item
              :to="{
                name: 'partnerCatalogDetails',
                params: {
                  partner_id: $route.params.id,
                  product_id: data.item.internalId,
                },
              }"
            >
              <feather-icon icon="FileTextIcon" />
              <span class="align-middle ml-50">Details</span>
            </b-dropdown-item>
          </b-dropdown>
        </template>
      </b-table>

      <div class="demo-spacing-0">
        <b-pagination
          :value="1"
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
    <!-- </div> -->
  </b-card-code>
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
} from "bootstrap-vue";
import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";

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
    BButton,
    BCardBody,
    ToastificationContent,
    BCardCode,
    BPagination,
    BForm,
    BFormInput,
    BFormGroup,

    ValidationProvider,
    ValidationObserver,
  },

  data() {
    return {
      required,
      digits,
      length,

      items: [],
      sidebarData: {},
      isLoading: true,
      adminType: [],
      pagination_per_page: 20,
      pagination_total: 100,

      currentPage: 1,
      perPage: 1,
      rows: 200,
      searchQuery: "",

      tableColumns: [
        { key: "internalId", label: "Id", sortable: true },
        { key: "logoUrl", label: "Logo", sortable: true },
        { key: "name", label: "Name", sortable: true },
        { key: "currencyCode", label: "Currency", sortable: true },

        { key: "actions", label: "Actions" },
      ],
    };
  },

  methods: {
    getData(page) {
      this.isLoading = true;

      DataService.getAll(this.$route.params.id, page).then((response) => {
        this.isLoading = false;
        this.items = response.data.data.data;
        this.pagination_per_page = response.data.pageSize;
        this.pagination_total = response.data.count;
        this.currentPage = page;
      });
    },

    async changeStatus(id, status) {
      this.isLoading = true;
      if (status == "Inactive") {
        status = 1;
      } else if (status == "Active") {
        status = 0;
      }

      axios
        .put("/users/UpdateUserStatus", {
          id: id,
          status: status,
        })
        .then((response) => {
          this.isLoading = false;

          // this.items = response.data.data

          DataService.getAll(this.$route.params.id, this.currentPage).then(
            (response) => {
              this.items = response.data.data;
            }
          );

          this.$toast({
            component: ToastificationContent,
            props: {
              title: "successfully",
              icon: "BellIcon",
              text: "تم تغيير حالة المستخدم",
              variant: "success",
            },
          });
        })
        .catch((error) => {
          console.log(error);
        });
    },

    async deleteData(id) {
      const result = await Swal.fire({
        title: "هل أنت متأكد ؟",
        text: "لن تتمكن من التراجع عن هذا!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "نعم، احذفه!",
      });

      if (result.isConfirmed) {
        this.isLoading = true;
        DataService.delete(id).then((response) => {
          this.isLoading = false;
          // this.items = response.data

          DataService.getAll(this.$route.params.id, this.currentPage).then(
            (response) => {
              this.items = response.data.data;
            }
          );

          this.$toast({
            component: ToastificationContent,
            props: {
              title: "successfully",
              icon: "BellIcon",
              text: "تم الحذف بنجاح",
              variant: "success",
            },
          });
        });
      }
    },

    refreshData(newData) {
      this.items = newData;
    },
  },
  mounted() {
    this.getData(this.currentPage);
    // this.getType()
  },
};
</script>
