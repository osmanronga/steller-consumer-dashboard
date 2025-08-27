<template>
  <div>
    <b-overlay :show="isLoading" rounded="sm">
      <section id="wallet">
        <!-- Stats Cards Row -->
        <b-row>
          <!-- <b-col lg="3" sm="6">
            <b-card class="card-statistics">
              <b-card-body>
                <div class="d-flex justify-content-between align-items-center">
                  <div>
                    <b-card-text class="text-muted mb-0"
                      >Total Wallets</b-card-text
                    >
                    <h3 class="font-weight-bolder mb-0">
                      {{ wallets.length }}
                    </h3>
                  </div>
                  <div class="avatar bg-light-primary p-50">
                    <b-avatar variant="primary">
                      <feather-icon icon="CreditCardIcon" />
                    </b-avatar>
                  </div>
                </div>
              </b-card-body>
            </b-card>
          </b-col> -->

          <b-col lg="3" sm="6">
            <b-card class="card-statistics">
              <b-card-body>
                <div class="d-flex justify-content-between align-items-center">
                  <div>
                    <b-card-text class="text-muted mb-0"
                      >Total Balance</b-card-text
                    >
                    <h3 class="font-weight-bolder mb-0">
                      {{ totalBalance.toFixed(4) }}
                    </h3>
                  </div>
                  <div class="avatar bg-light-info p-50">
                    <b-avatar variant="info">
                      <feather-icon icon="DollarSignIcon" />
                    </b-avatar>
                  </div>
                </div>
              </b-card-body>
            </b-card>
          </b-col>
        </b-row>

        <!-- Wallets Table -->
        <b-row class="mt-2">
          <b-col cols="12">
            <b-card title="Wallets">
              <b-table
                :items="wallets"
                :fields="fields"
                responsive
                striped
                hover
                :empty-text="'No wallets found'"
              >
                <!-- Balance Column -->
                <template #cell(availableBalance)="data">
                  <span class="font-weight-bolder">
                    {{ data.item.availableBalance.toFixed(4) }}
                  </span>
                </template>

                <!-- Actions Column -->
                <template #cell(actions)="data">
                  <b-button
                    variant="primary"
                    size="sm"
                    class="mr-1"
                    :to="{
                      name: 'wallet-history',
                      params: { walletNumber: data.item.walletNumber },
                    }"
                  >
                    <feather-icon icon="EyeIcon" class="mr-50" />
                    View History
                  </b-button>

                  <!-- <b-button
                    variant="warning"
                    size="sm"
                    @click="showWithdrawModal(data.item)"
                  >
                    <feather-icon icon="MinusIcon" class="mr-50" />
                    Withdraw
                  </b-button> -->
                </template>
              </b-table>
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

          <b-form-group label="Transaction ID" label-for="transaction-id-input">
            <div class="d-flex">
              <b-form-input
                id="transaction-id-input"
                v-model="originalTransactionId"
                type="text"
                placeholder="Transaction ID"
                class="mr-2"
              />
              <b-button
                variant="outline-primary"
                @click="generateNewTransactionId"
                size="sm"
              >
                Generate New
              </b-button>
            </div>
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
  BModal,
  BFormGroup,
  BFormInput,
  BAvatar,
  BOverlay,
} from "bootstrap-vue";
import WalletService from "./data/services";
import axios from "axios";

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
    BModal,
    BFormGroup,
    BFormInput,
    BAvatar,
    BOverlay,
  },
  data() {
    return {
      isLoading: false,
      wallets: [],
      showAddFundsModal: false,
      showWithdrawModal: false,
      amount: 0,
      selectedWallet: null,
      originalTransactionId: "",
      fields: [
        { key: "walletNumber", label: "Wallet Number", sortable: true },
        { key: "partner.businessName", label: "Business Name", sortable: true },
        { key: "partner.phone", label: "Phone", sortable: true },
        { key: "availableBalance", label: "Balance", sortable: true },
        { key: "currency", label: "Currency", sortable: true },
        { key: "actions", label: "Actions" },
      ],
    };
  },
  computed: {
    totalBalance() {
      return this.wallets.reduce(
        (sum, wallet) => sum + wallet.availableBalance,
        0
      );
    },
  },
  methods: {
    async fetchWallets() {
      try {
        this.isLoading = true;
        const wallets = await WalletService.getAllWallets();
        this.wallets = wallets;
      } catch (error) {
        console.error("Error fetching wallets:", error);
        this.$bvToast.toast("Error loading wallets", {
          title: "Error",
          variant: "danger",
          solid: true,
        });
      } finally {
        this.isLoading = false;
      }
    },
    generateGuid() {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function (c) {
          const r = (Math.random() * 16) | 0;
          const v = c === "x" ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        }
      );
    },
    generateNewTransactionId() {
      this.originalTransactionId = this.generateGuid();
    },
    openAddFundsModal(wallet) {
      this.selectedWallet = wallet;
      this.showAddFundsModal = true;
      this.amount = 0;
      this.originalTransactionId = this.generateGuid(); // Generate initial GUID
    },
    openWithdrawModal(wallet) {
      this.selectedWallet = wallet;
      this.showWithdrawModal = true;
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

        await WalletService.deposit(
          this.selectedWallet.id,
          this.amount,
          this.originalTransactionId
        );

        this.showAddFundsModal = false;
        this.amount = 0;
        this.originalTransactionId = "";
        this.selectedWallet = null;
        await this.fetchWallets();

        this.$bvToast.toast("Funds added successfully", {
          title: "Success",
          variant: "success",
          solid: true,
        });
      } catch (error) {
        console.error("Error adding funds:", error);
        this.$bvToast.toast(
          error.response?.data?.message || "Error adding funds",
          {
            title: "Error",
            variant: "danger",
            solid: true,
          }
        );
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
        if (this.amount > this.selectedWallet.availableBalance) {
          this.$bvToast.toast("Insufficient balance", {
            title: "Error",
            variant: "danger",
            solid: true,
          });
          return;
        }
        await WalletService.withdrawFunds(
          this.selectedWallet.walletNumber,
          this.amount
        );
        this.showWithdrawModal = false;
        this.amount = 0;
        this.selectedWallet = null;
        await this.fetchWallets();
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
    this.fetchWallets();
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
</style>
