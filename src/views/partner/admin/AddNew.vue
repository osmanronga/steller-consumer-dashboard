<template>
  <b-sidebar
    id="add-new-user-sidebar"
    :visible="isAddNewUserSidebarActive"
    bg-variant="white"
    sidebar-class="sidebar-lg"
    shadow
    backdrop
    no-header
    right
    @change="(val) => $emit('update:is-add-new-user-sidebar-active', val)"
  >
    <template #default="{ hide }">
      <!-- Header -->
      <div
        class="d-flex justify-content-between align-items-center content-sidebar-header px-2 py-1"
      >
        <h5 class="mb-0">
          {{ Object.keys(dataSlider).length ? "Update Admin" : "Add Admin" }}
        </h5>

        <feather-icon
          class="ml-1 cursor-pointer"
          icon="XIcon"
          size="16"
          @click="hide"
        />
      </div>

      <!-- BODY -->
      <validation-observer ref="refFormObserver" #default="{ handleSubmit }">
        <b-form
          class="p-2"
          @submit.prevent="handleSubmit(onSubmit)"
          @reset.prevent="resetForm"
        >
          <!-- Name -->
          <validation-provider
            #default="validationContext"
            name="Name"
            rules="required"
          >
            <b-form-group label="Name" label-for="name">
              <b-form-input
                id="name"
                v-model="formData.name"
                :state="getValidationState(validationContext)"
                trim
                placeholder="John Doe"
              />
              <b-form-invalid-feedback>
                {{ validationContext.errors[0] }}
              </b-form-invalid-feedback>
            </b-form-group>
          </validation-provider>

          <!-- Email -->
          <validation-provider
            #default="validationContext"
            name="Email"
            rules="required|email"
          >
            <b-form-group label="Email" label-for="email">
              <b-form-input
                id="email"
                v-model="formData.email"
                :state="getValidationState(validationContext)"
                trim
                placeholder="john@example.com"
              />
              <b-form-invalid-feedback>
                {{ validationContext.errors[0] }}
              </b-form-invalid-feedback>
            </b-form-group>
          </validation-provider>

          <!-- Phone -->
          <validation-provider
            #default="validationContext"
            name="Phone"
            rules="required"
          >
            <b-form-group label="Phone" label-for="phone">
              <b-form-input
                id="phone"
                v-model="formData.phone"
                :state="getValidationState(validationContext)"
                trim
                placeholder="+1234567890"
              />
              <b-form-invalid-feedback>
                {{ validationContext.errors[0] }}
              </b-form-invalid-feedback>
            </b-form-group>
          </validation-provider>

          <!-- address -->
          <validation-provider
            #default="validationContext"
            name="address"
            :rules="Object.keys(dataSlider).length ? '' : 'required|min:6'"
          >
            <b-form-group label="address" label-for="address">
              <b-form-input
                id="address"
                v-model="formData.address"
                :state="getValidationState(validationContext)"
                trim
                placeholder="admin"
              />
              <b-form-invalid-feedback>
                {{ validationContext.errors[0] }}
              </b-form-invalid-feedback>
            </b-form-group>
          </validation-provider>

          <!-- Password -->
          <validation-provider
            v-if="!Object.keys(dataSlider).length"
            #default="validationContext"
            name="Password"
            rules="required|min:6"
          >
            <b-form-group label="Password" label-for="password">
              <b-form-input
                id="password"
                v-model="formData.password"
                :state="getValidationState(validationContext)"
                type="password"
                trim
                placeholder="············"
              />
              <b-form-invalid-feedback>
                {{ validationContext.errors[0] }}
              </b-form-invalid-feedback>
            </b-form-group>
          </validation-provider>

          <!-- Form Actions -->
          <div class="d-flex mt-2">
            <b-button
              v-ripple.400="'rgba(255, 255, 255, 0.15)'"
              variant="primary"
              class="mr-2"
              type="submit"
            >
              {{ Object.keys(dataSlider).length ? "Update" : "Save" }}
            </b-button>
            <b-button
              v-ripple.400="'rgba(186, 191, 199, 0.15)'"
              type="reset"
              variant="outline-secondary"
            >
              Reset
            </b-button>
          </div>
        </b-form>
      </validation-observer>
    </template>
  </b-sidebar>
</template>

<script>
import {
  BSidebar,
  BForm,
  BFormGroup,
  BFormInput,
  BFormInvalidFeedback,
  BButton,
} from "bootstrap-vue";
import { ValidationProvider, ValidationObserver } from "vee-validate";
import { required, email } from "@validations";
import Ripple from "vue-ripple-directive";
import DataService from "./data/services";
import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";

export default {
  components: {
    BSidebar,
    BForm,
    BFormGroup,
    BFormInput,
    BFormInvalidFeedback,
    BButton,
    ValidationProvider,
    ValidationObserver,
  },

  directives: {
    Ripple,
  },

  props: {
    isAddNewUserSidebarActive: {
      type: Boolean,
      required: true,
    },
    dataSlider: {
      type: Object,
      required: true,
    },
    partnerId: {
      type: [String, Number],
      required: true,
    },
    currentPage: {
      type: Number,
      required: true,
    },
  },

  data() {
    return {
      required,
      email,
      formData: {
        name: "",
        email: "",
        phone: "",
        password: "",
        address: "",
        roleId: 0,
        partnerId: this.partnerId,
      },
    };
  },

  watch: {
    dataSlider(val) {
      if (Object.keys(val).length) {
        this.formData = { ...this.formData, ...val };
      }
    },
  },

  methods: {
    resetForm() {
      this.formData = {
        name: "",
        email: "",
        phone: "",
        address: "",
        roleId: 0,
        password: "",
        partnerId: this.partnerId,
      };
      this.$refs.refFormObserver.reset();
    },

    getValidationState({ dirty, validated, valid = null }) {
      return dirty || validated ? valid : null;
    },

    async onSubmit() {
      try {
        if (Object.keys(this.dataSlider).length) {
          // Update

          var user = {
            id: this.formData.id,
            name: this.formData.name,
            phone: this.formData.phone,
            email: this.formData.email,
            address: this.formData.address,
            roleId: 0,
          };
          await DataService.update(this.formData.id, user);
          this.$toast({
            component: ToastificationContent,
            props: {
              title: "Updated!",
              icon: "CheckIcon",
              text: "Admin updated successfully.",
              variant: "success",
            },
          });
        } else {
          // Create
          await DataService.create(this.formData);
          this.$toast({
            component: ToastificationContent,
            props: {
              title: "Created!",
              icon: "CheckIcon",
              text: "Admin created successfully.",
              variant: "success",
            },
          });
        }

        this.$emit("update:is-add-new-user-sidebar-active", false);
        this.$emit("refreshData");
        this.resetForm();
      } catch (error) {
        this.$toast({
          component: ToastificationContent,
          props: {
            title: "Error!",
            icon: "AlertTriangleIcon",
            text: "Something went wrong! Please try again.",
            variant: "danger",
          },
        });
      }
    },
  },
};
</script>

<style lang="scss">
@import "@core/scss/vue/libs/vue-select.scss";
</style>
