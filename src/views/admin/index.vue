<template>
  <b-card-code>
    <!-- <div class="d-flex justify-content-between  flex-wrap"> -->

    <add-new
      :is-add-new-user-sidebar-active.sync="isAddNewSidebarActive"
      :dataSlider="sidebarData"
      :currentPage="currentPage"
      @refreshData="refreshData"
    />

    <b-overlay :show="isLoading" rounded="sm">
      <b-button @click="addNewData" variant="primary" class="mb-2">
        Add
      </b-button>

      <!-- <div class="d-flex align-items-center">
        <b-form-group>
          <label> Search for admin by name, phone, or email </label>
          <validation-provider
            #default="{ errors }"
            rules="required"
            name="Name, phone number, or email address"
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
            Search
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

        <template #cell(created_at)="data">
          {{ data.value | moment("YY-MM-DD HH:mm:ss") }}
        </template>

        <template #cell(type)="data">
          {{ data.value.name }}
        </template>

        <template #cell(accountType)="data">
          <b-badge
            :variant="accountType[1][data.value]"
            style="cursor: pointer"
          >
            {{ accountType[0][data.value] }}
          </b-badge>
        </template>

        <template #cell(created_by)="data">
          {{ data.value.name }}
        </template>

        <template #cell(status)="data">
          <b-badge
            @click="changeStatus(data.item.id, status[0][data.value])"
            :variant="status[1][data.value]"
            style="cursor: pointer"
          >
            {{ status[0][data.value] }}
          </b-badge>
        </template>

        <!-- Column: Actions -->
        <template #cell(actions)="data">
          <b-button
            variant="flat-primary"
            class="btn-icon"
            @click="editData(data.item)"
          >
            <feather-icon icon="EditIcon" size="16" />
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
        { key: "id", label: "ID", sortable: true },
        { key: "name", label: "Name", sortable: true },
        { key: "email", label: "Email", sortable: true },
        { key: "phone", label: "Phone Number", sortable: true },
        { key: "address", label: "Address", sortable: true },
        // { key: "status", label: "الحالة" },

        { key: "actions", label: "Actions" },
      ],
    };
  },
  methods: {
    getData(page) {
      this.isLoading = true;

      const query = this.searchQuery;
      DataService.getAll(page).then((response) => {
        this.isLoading = false;
        this.items = response.data.data.data;
        this.pagination_per_page = response.data.pageSize;
        this.pagination_total = response.data.count;
        this.currentPage = page;
      });
    },
    getUserCount() {
      DataService.getUserCount().then((response) => {
        this.pagination_per_page = response.data.pageSize;
        // this.pagination_total = 40;
        this.pagination_total = response.data.items;
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

          DataService.getAll(this.currentPage).then((response) => {
            // this.getUserCount()
            this.items = response.data.data;
          });

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
    changePassword(id) {
      this.isLoading = true;
      DataService.changePassword(id).then((response) => {
        this.isLoading = false;
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

          DataService.getAll(this.currentPage).then((response) => {
            // this.getUserCount()
            this.items = response.data.data;
          });

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
  },
};
</script>
