<template>
  <b-card-code>
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
                name: 'catalog-details',
                params: { id: data.item.internalId },
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
        { key: "partnerId", label: "Id", sortable: true },
        { key: "partner.businessName", label: "businessName", sortable: true },
        { key: "partner.phone", label: "phone", sortable: true },
        { key: "availableBalance", label: "availableBalance", sortable: true },
        { key: "currency", label: "currency", sortable: true },

        { key: "actions", label: "Actions" },
      ],
    };
  },

  methods: {
    getData(page) {
      this.isLoading = true;

      DataService.getAll(page).then((response) => {
        console.log(response.data.data);
        this.isLoading = false;
        this.items = response.data.data;
        this.pagination_per_page = response.data.pageSize;
        this.pagination_total = response.data.count;
        this.currentPage = page;
      });
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
