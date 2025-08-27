<template>
  <div>
    <b-overlay :show="isLoading" rounded="sm">
      <section id="wallet">
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
                      {{ walletData.availableBalance.toFixed(4) }}
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
                      {{ totalDeposits.toFixed(4) }}
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
                      {{ totalWithdrawals.toFixed(4) }}
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

        <!-- Wallet Info and Actions -->
        <b-row class="match-height">
          <b-col lg="8" md="12">
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
                      data.item.amount > 0 ? 'text-success' : 'text-danger'
                    "
                  >
                    {{ data.item.amount > 0 ? "+" : ""
                    }}{{ Math.abs(data.item.amount).toFixed(4) }}
                  </span>
                </template>

                <!-- Date Column -->
                <template #cell(date)="data">
                  {{ formatDate(data.item.createdAt) }}
                </template>

                <!-- Status Column -->
                <template #cell(status)="data">
                  <b-badge
                    :variant="
                      data.item.status === 'completed' ? 'success' : 'warning'
                    "
                    pill
                  >
                    {{ data.item.status }}
                  </b-badge>
                </template>
              </b-table>
            </b-card>
          </b-col>

          <b-col lg="4" md="12">
            <b-card title="Wallet Information">
              <div class="wallet-info">
                <div class="wallet-info-item">
                  <span class="text-muted">Wallet Number</span>
                  <h5>{{ walletData.walletNumber }}</h5>
                </div>
                <div class="wallet-info-item">
                  <span class="text-muted">Business Name</span>
                  <h5>
                    {{ walletData.partner && walletData.partner.businessName }}
                  </h5>
                </div>
                <div class="wallet-info-item">
                  <span class="text-muted">Registration Number</span>
                  <h5>
                    {{
                      walletData.partner &&
                      walletData.partner.registrationNumber
                    }}
                  </h5>
                </div>
                <div class="wallet-info-item">
                  <span class="text-muted">Created At</span>
                  <h5>{{ formatDate(walletData.createdAt) }}</h5>
                </div>
              </div>

              <div class="wallet-actions mt-2">
                <b-button
                  variant="primary"
                  block
                  class="mb-1"
                  @click="showAddFundsModal = true"
                >
                  <feather-icon icon="PlusIcon" class="mr-50" />
                  Add Funds
                </b-button>
                <b-button
                  variant="outline-primary"
                  block
                  @click="showWithdrawModal = true"
                >
                  <feather-icon icon="MinusIcon" class="mr-50" />
                  Withdraw
                </b-button>
              </div>
            </b-card>
          </b-col>
        </b-row>

        <!-- Add Funds Modal -->
        <b-modal
          v-model="showAddFundsModal"
          title="Add Funds"
          centered
          @ok="handleAddFunds"
        >
          <b-form-group label="Amount" label-for="amount-input">
            <b-form-input
              id="amount-input"
              v-model="amount"
              type="number"
              min="0"
              step="0.0001"
              placeholder="Enter amount"
            />
          </b-form-group>
        </b-modal>

        <!-- Withdraw Modal -->
        <b-modal
          v-model="showWithdrawModal"
          title="Withdraw Funds"
          centered
          @ok="handleWithdraw"
        >
          <b-form-group label="Amount" label-for="withdraw-amount-input">
            <b-form-input
              id="withdraw-amount-input"
              v-model="amount"
              type="number"
              min="0"
              step="0.0001"
              placeholder="Enter amount"
            />
          </b-form-group>
        </b-modal>
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
  BButton,
  BTable,
  BBadge,
  BModal,
  BFormGroup,
  BFormInput,
  BAvatar,
  BOverlay,
} from "bootstrap-vue";
import WalletService from "./data/services";

export default {
  name: "Wallet",
  components: {
    BRow,
    BCol,
    BCard,
    BCardBody,
    BCardText,
    BButton,
    BTable,
    BBadge,
    BModal,
    BFormGroup,
    BFormInput,
    BAvatar,
    BOverlay,
  },
  data() {
    return {
      isLoading: false,
      walletData: {
        availableBalance: 0,
        walletNumber: "",
        partner: {},
        createdAt: "",
      },
      walletHistory: [],
      showAddFundsModal: false,
      showWithdrawModal: false,
      amount: 0,
      fields: [
        { key: "date", label: "Date" },
        { key: "description", label: "Description" },
        { key: "amount", label: "Amount" },
        { key: "status", label: "Status" },
      ],
    };
  },
  computed: {
    totalDeposits() {
      return this.walletHistory
        .filter((transaction) => transaction.amount > 0)
        .reduce((sum, transaction) => sum + transaction.amount, 0);
    },
    totalWithdrawals() {
      return Math.abs(
        this.walletHistory
          .filter((transaction) => transaction.amount < 0)
          .reduce((sum, transaction) => sum + transaction.amount, 0)
      );
    },
  },
  methods: {
    async fetchWalletData() {
      try {
        this.isLoading = true;
        const [walletData, walletHistory] = await Promise.all([
          WalletService.getWalletData(),
          WalletService.getWalletHistory(),
        ]);
        this.walletData = walletData;
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
    async handleAddFunds() {
      try {
        if (this.amount <= 0) {
          this.$bvToast.toast("Please enter a valid amount", {
            title: "Error",
            variant: "danger",
            solid: true,
          });
          return;
        }
        await WalletService.addFunds(this.amount);
        this.showAddFundsModal = false;
        this.amount = 0;
        await this.fetchWalletData();
        this.$bvToast.toast("Funds added successfully", {
          title: "Success",
          variant: "success",
          solid: true,
        });
      } catch (error) {
        console.error("Error adding funds:", error);
        this.$bvToast.toast(error.message || "Error adding funds", {
          title: "Error",
          variant: "danger",
          solid: true,
        });
      }
    },
    async handleWithdraw() {
      try {
        if (this.amount <= 0) {
          this.$bvToast.toast("Please enter a valid amount", {
            title: "Error",
            variant: "danger",
            solid: true,
          });
          return;
        }
        if (this.amount > this.walletData.availableBalance) {
          this.$bvToast.toast("Insufficient balance", {
            title: "Error",
            variant: "danger",
            solid: true,
          });
          return;
        }
        await WalletService.withdrawFunds(this.amount);
        this.showWithdrawModal = false;
        this.amount = 0;
        await this.fetchWalletData();
        this.$bvToast.toast("Withdrawal successful", {
          title: "Success",
          variant: "success",
          solid: true,
        });
      } catch (error) {
        console.error("Error withdrawing funds:", error);
        this.$bvToast.toast(error.message || "Error withdrawing funds", {
          title: "Error",
          variant: "danger",
          solid: true,
        });
      }
    },
  },
  mounted() {
    this.fetchWalletData();
  },
};
</script>

<style lang="scss" scoped>
#wallet {
  padding: 1rem;
}

.card-statistics {
  .avatar {
    width: 48px;
    height: 48px;
  }
}

.wallet-info {
  .wallet-info-item {
    margin-bottom: 1.5rem;

    span {
      font-size: 0.875rem;
    }

    h5 {
      margin-top: 0.25rem;
      margin-bottom: 0;
      font-size: 1.25rem;
    }
  }
}

.wallet-actions {
  .btn {
    padding: 0.75rem;
  }
}
</style>
