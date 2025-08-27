<template>
  <div>
    <b-overlay :show="isLoading" rounded="sm">
      <section id="wallet-history">
        <!-- Stats Cards Row -->
        <b-row>
          <b-col lg="3" sm="6">
            <b-card class="card-statistics">
              <b-card-body>
                <div class="d-flex justify-content-between align-items-center">
                  <div>
                    <b-card-text class="text-muted mb-0"
                      >Available Balance</b-card-text
                    >
                    <h3 class="font-weight-bolder mb-0">
                      {{ availableBalance }}
                    </h3>
                  </div>
                  <div class="avatar bg-light-primary p-50">
                    <b-avatar variant="primary">
                      <feather-icon icon="DollarSignIcon" />
                    </b-avatar>
                  </div>
                </div>
              </b-card-body>
            </b-card>
          </b-col>

          <b-col lg="3" sm="6">
            <b-card class="card-statistics">
              <b-card-body>
                <div class="d-flex justify-content-between align-items-center">
                  <div>
                    <b-card-text class="text-muted mb-0"
                      >Total Transactions</b-card-text
                    >
                    <h3 class="font-weight-bolder mb-0">
                      {{ walletHistory.length }}
                    </h3>
                  </div>
                  <div class="avatar bg-light-info p-50">
                    <b-avatar variant="info">
                      <feather-icon icon="CreditCardIcon" />
                    </b-avatar>
                  </div>
                </div>
              </b-card-body>
            </b-card>
          </b-col>

          <b-col lg="3" sm="6">
            <b-card class="card-statistics">
              <b-card-body>
                <div class="d-flex justify-content-between align-items-center">
                  <div>
                    <b-card-text class="text-muted mb-0"
                      >Total Deposits</b-card-text
                    >
                    <h3 class="font-weight-bolder mb-0">
                      {{ depositBalance }}
                    </h3>
                  </div>
                  <div class="avatar bg-light-success p-50">
                    <b-avatar variant="success">
                      <feather-icon icon="TrendingUpIcon" />
                    </b-avatar>
                  </div>
                </div>
              </b-card-body>
            </b-card>
          </b-col>

          <b-col lg="3" sm="6">
            <b-card class="card-statistics">
              <b-card-body>
                <div class="d-flex justify-content-between align-items-center">
                  <div>
                    <b-card-text class="text-muted mb-0"
                      >Total Withdrawals</b-card-text
                    >
                    <h3 class="font-weight-bolder mb-0">
                      {{ withdrawBalance }}
                    </h3>
                  </div>
                  <div class="avatar bg-light-danger p-50">
                    <b-avatar variant="danger">
                      <feather-icon icon="TrendingDownIcon" />
                    </b-avatar>
                  </div>
                </div>
              </b-card-body>
            </b-card>
          </b-col>
        </b-row>

        <!-- Transaction History -->
        <b-row class="mt-2">
          <b-col cols="12">
            <b-card title="Transaction History">
              <b-table
                :items="walletHistory"
                :fields="fields"
                responsive
                striped
                hover
                :empty-text="'No transactions found'"
              >
                <!-- Amount Column -->
                <template #cell(amount)="data">
                  <span
                    :class="
                      data.item.transactionTypeId == 1
                        ? 'text-success'
                        : 'text-danger'
                    "
                  >
                    {{ data.item.transactionTypeId == 1 ? "+" : "-"
                    }}{{ Math.abs(data.item.amount).toFixed(4) }}
                  </span>
                </template>

                <!-- Date Column -->
                <template #cell(date)="data">
                  {{ formatDate(data.item.createdAt) }}
                </template>
              </b-table>
            </b-card>
          </b-col>
        </b-row>
      </section>
    </b-overlay>
  </div>
</template>

<script>
import {
  BRow,
  BCol,
  BCard,
  BCardBody,
  BCardText,
  BTable,
  BBadge,
  BAvatar,
  BOverlay,
} from "bootstrap-vue";
import WalletService from "./data/services";

export default {
  name: "WalletHistory",
  components: {
    BRow,
    BCol,
    BCard,
    BCardBody,
    BCardText,
    BTable,
    BBadge,
    BAvatar,
    BOverlay,
  },
  data() {
    return {
      isLoading: false,
      availableBalance: 0,
      depositBalance: 0,
      withdrawBalance: 0,
      walletData: {
        walletNumber: "",
        partner: {},
        createdAt: "",
      },
      walletHistory: [],
      fields: [
        { key: "date", label: "Date", sortable: true },
        { key: "description", label: "Description" },
        { key: "amount", label: "Amount", sortable: true },
        { key: "originalTransactionId", label: "Transaction Id" },
      ],
    };
  },

  methods: {
    async fetchWalletData() {
      try {
        this.isLoading = true;
        const walletNumber = this.$route.params.walletNumber;

        const walletBalance = await WalletService.getWalletBalance(
          walletNumber
        );

        console.log("Wallet Balance:", walletBalance);

        this.availableBalance = walletBalance.availableBalance;
        this.depositBalance = walletBalance.totalDebits;
        this.withdrawBalance = walletBalance.totalCredits;

        // Get wallet info
        const walletInfo = await WalletService.getWalletInfo();
        this.walletData = walletInfo;

        // Get wallet history
        const walletHistory = await WalletService.getWalletHistory();
        this.walletHistory = walletHistory;
      } catch (error) {
        console.error("Error fetching wallet data:", error);
        this.$bvToast.toast("Error loading wallet data", {
          title: "Error",
          variant: "danger",
          solid: true,
        });
      } finally {
        this.isLoading = false;
      }
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    },
  },
  mounted() {
    this.fetchWalletData();
  },
};
</script>

<style lang="scss" scoped>
#wallet-history {
  padding: 1rem;
}

.card-statistics {
  .avatar {
    width: 48px;
    height: 48px;
  }
}
</style>
