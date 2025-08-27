<template>
  <b-card-code>
    <!-- <div class="d-flex justify-content-between  flex-wrap"> -->

    <add-new
      :is-add-new-user-sidebar-active.sync="isAddNewSidebarActive"
      :dataSlider="sidebarData"
      :adminType="adminType"
      :currentPage="currentPage"
      @refreshData="refreshData"
    />

    <b-overlay :show="isLoading" rounded="sm">
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
          <!-- @click="changeStatus(data.item.id)" -->
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

        <template #cell(walletNumber)="data">
          <span
            v-if="
              data.item.wallets &&
              data.item.wallets.length > 0 &&
              data.item.wallets[0].walletNumber
            "
            class="font-weight-bold"
          >
            {{ data.item.wallets[0].walletNumber }}
          </span>
          <span v-else class="text-muted"> No Wallet </span>
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
        <!-- <template #cell(actions)="data">
          <b-dropdown variant="link" no-caret>
            <template #button-content>
              <feather-icon
                icon="MoreVerticalIcon"
                size="16"
                class="align-middle text-body"
              />
            </template>
            <b-dropdown-item
              :to="{ name: 'partnercatalog', params: { id: data.item.id } }"
            >
              <feather-icon icon="FileTextIcon" />
              <span class="align-middle ml-50">Partner Catalog</span>
            </b-dropdown-item>

            <b-dropdown-item
              :to="{
                name: 'partner-person-contact-indexByPartner',
                params: { id: data.item.id },
              }"
            >
              <feather-icon icon="FileTextIcon" />
              <span class="align-middle ml-50">Partner Contact</span>
            </b-dropdown-item>

            <b-dropdown-item
              :to="{
                name: 'partner-admins',
                params: { partnerId: data.item.id },
              }"
            >
              <feather-icon icon="UsersIcon" />
              <span class="align-middle ml-50">Partner Admins</span>
            </b-dropdown-item>

            <b-dropdown-item
              v-if="data.item.wallets && data.item.wallets.length > 0"
              :to="{
                name: 'wallet-history',
                params: { walletNumber: data.item.wallets[0].walletNumber },
              }"
            >
              <feather-icon icon="CreditCardIcon" />
              <span class="align-middle ml-50">Wallet History</span>
            </b-dropdown-item>

            <b-dropdown-item v-else @click="showNoWalletMessage">
              <feather-icon icon="CreditCardIcon" />
              <span class="align-middle ml-50">Wallet History</span>
            </b-dropdown-item>

            <b-dropdown-item @click="editData(data.item)">
              <feather-icon icon="EditIcon" />
              <span class="align-middle ml-50">Update</span>
            </b-dropdown-item>

          </b-dropdown>
        </template> -->
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
      required,
      digits,
      length,

      items: [],
      sidebarData: {},
      isAddNewSidebarActive: false,
      isLoading: true,
      adminType: [],
      pagination_per_page: 20,
      pagination_total: 100,

      currentPage: 1,
      perPage: 1,
      rows: 200,
      searchQuery: "",

      tableColumns: [
        { key: "id", label: "الرقم", sortable: true },
        { key: "businessName", label: " اﻹسم", sortable: true },
        { key: "registrationNumber", label: " رقم السجل", sortable: true },
        { key: "email", label: "اﻹيميل", sortable: true },
        { key: "phone", label: "الهاتف" },
        { key: "address", label: "العنوان" },
        { key: "walletNumber", label: "رقم المحفظة" },
        { key: "actions", label: " اﻹجراءات" },
      ],
    };
  },

  methods: {
    getData(page) {
      this.isLoading = true;

      const query = this.searchQuery;

      if (query.length > 3) {
        DataService.getAll(page, query).then(async (response) => {
          this.isLoading = false;
          this.items = response.data.data.data;

          this.pagination_per_page = response.data.pageSize;
          this.pagination_total = response.data.count;
          this.currentPage = page;
        });
      } else {
        DataService.getAll(page).then(async (response) => {
          this.isLoading = false;
          this.items = response.data.data.data;

          this.pagination_per_page = response.data.pageSize;
          this.pagination_total = response.data.count;
          this.currentPage = page;
        });
      }
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

    addNewData() {
      this.sidebarData = {};
      this.toggleDataSidebar(true);
    },
    editData(data) {
      this.sidebarData = data;
      this.toggleDataSidebar(true);
    },
    toggleDataSidebar(val = false) {
      this.isAddNewSidebarActive = val;
    },
    refreshData(newData) {
      this.items = newData;
    },

    showNoWalletMessage() {
      this.$toast({
        component: ToastificationContent,
        props: {
          title: "No Wallet Found",
          icon: "AlertTriangleIcon",
          text: "This partner doesn't have a wallet associated",
          variant: "warning",
        },
      });
    },
  },
  mounted() {
    this.getData(this.currentPage);
    // this.getType()
  },
};
</script>
