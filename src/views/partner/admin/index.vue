<template>
  <b-card-code>
    <add-new
      :is-add-new-user-sidebar-active.sync="isAddNewSidebarActive"
      :dataSlider="sidebarData"
      :partnerId="partnerId"
      :currentPage="currentPage"
      @refreshData="refreshData"
    />

    <b-overlay :show="isLoading" rounded="sm">
      <div class="d-flex justify-content-between align-items-center mb-2">
        <h3>Partner Admins</h3>
        <b-button @click="addNewData" variant="primary"> Add Admin </b-button>
      </div>

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

        <template #cell(status)="data">
          <b-badge
            @click="changeStatus(data.item.id, status[0][data.value])"
            :variant="status[1][data.value]"
            style="cursor: pointer"
          >
            {{ status[0][data.value] }}
          </b-badge>
        </template>

        <template #cell(actions)="data">
          <div class="d-flex align-items-center">
            <b-button
              variant="flat-primary"
              class="btn-icon mr-1"
              @click="editData(data.item)"
            >
              <feather-icon icon="EditIcon" size="16" />
            </b-button>
            <b-button
              variant="flat-danger"
              class="btn-icon"
              @click="deleteData(data.item.id)"
            >
              <feather-icon icon="TrashIcon" size="16" />
            </b-button>
          </div>
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
  BButton,
  BCardBody,
  BPagination,
} from "bootstrap-vue";
import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";
import AddNew from "./AddNew.vue";
import BCardCode from "@core/components/b-card-code/BCardCode.vue";
import DataService from "./data/services";
import Swal from "sweetalert2";

export default {
  components: {
    BTable,
    BCard,
    BCardText,
    BAvatar,
    BOverlay,
    BBadge,
    BButton,
    BCardBody,
    ToastificationContent,
    BCardCode,
    BPagination,
    AddNew,
  },

  data() {
    return {
      items: [],
      sidebarData: {},
      isAddNewSidebarActive: false,
      isLoading: true,
      pagination_per_page: 25,
      pagination_total: 100,
      currentPage: 1,
      partnerId: this.$route.params.partnerId,

      status: {
        0: {
          0: "Active",
          1: "Inactive",
        },
        1: {
          0: "success",
          1: "danger",
        },
      },

      tableColumns: [
        { key: "id", label: "ID", sortable: true },
        { key: "name", label: "Name", sortable: true },
        { key: "email", label: "Email", sortable: true },
        { key: "phone", label: "Phone" },
        { key: "address", label: "Address" },
        // { key: "created_at", label: "Created At" },
        { key: "actions", label: "Actions" },
      ],
    };
  },

  methods: {
    getData(page) {
      this.isLoading = true;
      DataService.getAllByPartnerId(this.partnerId, page)
        .then((response) => {
          this.isLoading = false;
          this.items = response.data.data.data;
          this.pagination_per_page = response.data.data.pageSize;
          this.pagination_total = response.data.data.count;
          this.currentPage = page;
        })
        .catch((error) => {
          this.isLoading = false;
          console.error("Error fetching admins:", error);
        });
    },

    async changeStatus(id, status) {
      this.isLoading = true;
      try {
        await DataService.updateStatus(id, status === "Inactive" ? 1 : 0);
        this.getData(this.currentPage);
        this.$toast({
          component: ToastificationContent,
          props: {
            title: "Success",
            icon: "CheckIcon",
            text: "Admin status updated successfully",
            variant: "success",
          },
        });
      } catch (error) {
        console.error("Error updating status:", error);
        this.$toast({
          component: ToastificationContent,
          props: {
            title: "Error",
            icon: "AlertTriangleIcon",
            text: "Failed to update admin status",
            variant: "danger",
          },
        });
      } finally {
        this.isLoading = false;
      }
    },

    async deleteData(id) {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "Cancel",
        customClass: {
          confirmButton: "btn btn-primary",
          cancelButton: "btn btn-outline-danger ml-1",
        },
        buttonsStyling: false,
      });

      if (result.isConfirmed) {
        this.isLoading = true;
        try {
          await DataService.delete(id);
          this.getData(this.currentPage);
          this.$toast({
            component: ToastificationContent,
            props: {
              title: "Deleted!",
              icon: "CheckIcon",
              text: "Admin has been deleted.",
              variant: "success",
            },
          });
        } catch (error) {
          console.error("Error deleting admin:", error);
          this.$toast({
            component: ToastificationContent,
            props: {
              title: "Error",
              icon: "AlertTriangleIcon",
              text: "Failed to delete admin",
              variant: "danger",
            },
          });
        } finally {
          this.isLoading = false;
        }
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

    refreshData() {
      this.getData(this.currentPage);
    },
  },

  mounted() {
    this.getData(this.currentPage);
  },
};
</script>
