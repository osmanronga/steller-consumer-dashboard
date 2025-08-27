<template>
  <b-card-code>
    <!-- <div class="d-flex justify-content-between  flex-wrap"> -->

    <add-new
      :is-add-new-user-sidebar-active.sync="isAddNewSidebarActive"
      :dataSlider="sidebarData"
      :currentPage="currentPage"
      :partners="partners"
      @refreshData="refreshData"
    />

    <b-overlay :show="isLoading" rounded="sm">
      <b-button @click="addNewData" variant="primary" class="mb-2">
        إضافة
      </b-button>

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

        <!-- Column: Actions -->
        <template #cell(actions)="data">
          <b-button
            variant="flat-primary"
            class="btn-icon"
            @click="editData(data.item)"
          >
            <feather-icon icon="EditIcon" size="16" class="align-middle" />
          </b-button>
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
import AddNew from "./AddNew.vue";
// import companyData from './companyData'
import { ref, onUnmounted } from "@vue/composition-api";
import store from "@/store";
import { onMounted } from "vue";
import DataService from "./data/services";
import BCardCode from "@core/components/b-card-code/BCardCode.vue";
import axios from "axios";
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

    ValidationProvider,
    ValidationObserver,
  },

  data() {
    return {
      items: [],
      sidebarData: {},

      partners: [],

      isAddPasswordMode: false,

      isAddNewSidebarActive: false,
      isLoading: true,
      pagination_per_page: 25,
      pagination_total: 100,

      currentPage: 1,
      perPage: 1,
      rows: 200,
      searchQuery: "",

      tableColumns: [
        { key: "id", label: "id", sortable: true },
        { key: "partner.businessName", label: "partner", sortable: true },
        { key: "name", label: " name", sortable: true },
        { key: "email", label: "email", sortable: true },
        { key: "phone", label: "phone", sortable: true },
        { key: "position", label: "position", sortable: true },
        // { key: "status", label: "الحالة" },

        { key: "actions", label: " actions" },
      ],
    };
  },
  methods: {
    getData(page) {
      this.isLoading = true;

      DataService.getAll(page).then((response) => {
        this.isLoading = false;
        this.items = response.data.data;
        console.log("response.data.data.data", this.items);
        this.pagination_per_page = response.data.pageSize;
        this.pagination_total = response.data.count;
        this.currentPage = page;
      });
    },
    getPartners() {
      this.isLoading = true;
      DataService.getPartners().then((response) => {
        this.isLoading = false;
        this.partners = response.data.data;
      });
    },
    async deleteData(id) {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        this.isLoading = true;
        DataService.delete(id).then((response) => {
          this.isLoading = false;
          // this.items = response.data

          DataService.getAll(this.currentPage).then((response) => {
            // this.getUserCount()
            this.items = response.data.data;
          });

          this.$toast({
            component: ToastificationContent,
            props: {
              title: "Deleted successfully",
              icon: "BellIcon",
              text: "تم الحذف بنجاح",
              variant: "success",
            },
          });
        });
      }
    },

    addNewData() {
      this.isAddPasswordMode = true;
      this.sidebarData = {};
      this.toggleDataSidebar(true);
    },
    editData(data) {
      // console.log(data)
      this.isAddPasswordMode = false;
      this.sidebarData = data;
      this.toggleDataSidebar(true);
    },
    toggleDataSidebar(val = false) {
      this.isAddNewSidebarActive = val;
    },
    refreshData(newData) {
      this.items = newData;
    },
  },
  mounted() {
    this.getData(this.currentPage);
    this.getPartners();
  },
};
</script>
