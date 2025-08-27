<template>
  <div>
    <b-card class="card-statistics">
      <b-card-header>
        <b-card-title>إحصائيات المستخدمين</b-card-title>
      </b-card-header>

      <b-card-body class="statistics-body">
        <b-row>
          <!-- customer -->
          <b-col xl="4" sm="3" class="mb-2 mb-xl-0">
            <b-media no-body>
              <b-media-aside class="mr-2">
                <b-avatar size="48" variant="primary">
                  <feather-icon size="24" icon="UsersIcon" />
                </b-avatar>
              </b-media-aside>
              <b-media-body class="my-auto">
                <h4 class="font-weight-bolder mb-0">
                  {{ this.statisticsData[0].countCustomers }}
                </h4>
                <b-card-text class="font-small-3 mb-0"> العملاء </b-card-text>
              </b-media-body>
            </b-media>
          </b-col>

          <!-- workshop -->
          <b-col xl="4" sm="3" class="mb-2 mb-xl-0">
            <b-media no-body>
              <b-media-aside class="mr-2">
                <b-avatar size="48" variant="success">
                  <feather-icon size="24" icon="UserCheckIcon" />
                </b-avatar>
              </b-media-aside>
              <b-media-body class="my-auto">
                <h4 class="font-weight-bolder mb-0">
                  {{ this.statisticsData[0].countProviders }}
                </h4>
                <b-card-text class="font-small-3 mb-0">
                  مزودي الخدمات
                </b-card-text>
              </b-media-body>
            </b-media>
          </b-col>

          <!-- Admin -->
          <b-col xl="4" sm="3" class="mb-2 mb-xl-0">
            <b-media no-body>
              <b-media-aside class="mr-2">
                <b-avatar size="48" variant="info">
                  <feather-icon size="24" icon="UserIcon" />
                </b-avatar>
              </b-media-aside>
              <b-media-body class="my-auto">
                <h4 class="font-weight-bolder mb-0">
                  {{ this.statisticsData[0].countAdmins }}
                </h4>
                <b-card-text class="font-small-3 mb-0"> مدراء </b-card-text>
              </b-media-body>
            </b-media>
          </b-col>
        </b-row>
      </b-card-body>
    </b-card>

    <b-card class="card-statistics">
      <b-card-body>
        <b-card-header>
          <b-card-title>إحصائيات</b-card-title>
        </b-card-header>
        <b-row>
          <!-- product -->

          <b-col xl="4" sm="3" class="mb-2 mb-xl-0">
            <b-media no-body>
              <b-media-aside class="mr-2">
                <b-avatar size="48" variant="danger">
                  <feather-icon size="24" icon="BoxIcon" />
                </b-avatar>
              </b-media-aside>
              <b-media-body class="my-auto">
                <h4 class="font-weight-bolder mb-0">
                  {{ this.statisticsData[0].countServices }}
                </h4>
                <b-card-text class="font-small-3 mb-0"> الخدمات </b-card-text>
              </b-media-body>
            </b-media>
          </b-col>

          <!-- Order -->

          <b-col xl="4" sm="2" class="mb-2 mb-xl-0">
            <b-media no-body>
              <b-media-aside class="mr-2">
                <b-avatar size="48" variant="info">
                  <feather-icon size="24" icon="ShoppingCartIcon" />
                </b-avatar>
              </b-media-aside>
              <b-media-body class="my-auto">
                <h4 class="font-weight-bolder mb-0">
                  {{ this.statisticsData[0].countOrdersCompleted }}
                </h4>
                <b-card-text class="font-small-3 mb-0">
                  الطلبات المكتملة
                </b-card-text>
              </b-media-body>
            </b-media>
          </b-col>

          <!-- Order -->

          <b-col xl="4" sm="2" class="mb-2 mb-xl-0">
            <b-media no-body>
              <b-media-aside class="mr-2">
                <b-avatar size="48" variant="info">
                  <feather-icon size="24" icon="UserPlusIcon" />
                </b-avatar>
              </b-media-aside>
              <b-media-body class="my-auto">
                <h4 class="font-weight-bolder mb-0">
                  {{ this.statisticsData[0].countActiveProviders }}
                </h4>
                <b-card-text class="font-small-3 mb-0">
                  مزودي الخدمات المفعلين
                </b-card-text>
              </b-media-body>
            </b-media>
          </b-col>

          <!-- Order -->

          <b-col xl="4" sm="2" class="mb-2 mb-xl-0">
            <b-media no-body>
              <b-media-aside class="mr-2">
                <b-avatar size="48" variant="info">
                  <feather-icon size="24" icon="UserMinusIcon" />
                </b-avatar>
              </b-media-aside>
              <b-media-body class="my-auto">
                <h4 class="font-weight-bolder mb-0">
                  {{ this.statisticsData[0].countInactiveProviders }}
                </h4>
                <b-card-text class="font-small-3 mb-0">
                  مزودي الخدمات غير المفعلين
                </b-card-text>
              </b-media-body>
            </b-media>
          </b-col>
        </b-row>
      </b-card-body>
    </b-card>
  </div>
</template>

<script>
import {
  BCard,
  BCardHeader,
  BCardTitle,
  BCardText,
  BCardBody,
  BRow,
  BCol,
  BMedia,
  BMediaAside,
  BAvatar,
  BMediaBody,
  BDropdownItem,
  BDropdown,
} from "bootstrap-vue";

export default {
  components: {
    BRow,
    BCol,
    BCard,
    BCardHeader,
    BCardTitle,
    BCardText,
    BCardBody,
    BMedia,
    BAvatar,
    BMediaAside,
    BMediaBody,
    BDropdownItem,
    BDropdown,
  },
  props: {
    statisticsData: {
      type: Array,
      required: true,
      // default: () => [],
    },
  },
  // data() {
  //   return {
  //     data : this.statisticsData,
  //   }
  // },
  mounted() {
    // console.log("statisticsData");
    // console.log(this.statisticsData[0].countAdmins)
  },
};
</script>
