<template>
  <div class="auth-wrapper auth-v1 px-2">
    <div class="auth-inner py-2">
      <!-- Reset Password v1 -->
      <b-card class="mb-0">
        <!-- logo -->
        <b-link class="brand-logo">
          <vuexy-logo />

          <h2 class="brand-text text-primary ml-1">
            {{ appName }}
          </h2>
        </b-link>

        <b-card-title class="mb-1"> Reset Password 🔒 </b-card-title>
        <p class="mb-2">
          Your new password must be different from previously used passwords
        </p>

        <!-- form -->
        <validation-observer ref="simpleRules">
          <b-form
            method="POST"
            class="auth-reset-password-form mt-2"
            @submit.prevent="validationForm"
          >
            <!-- password -->
            <b-form-group label="New Password" label-for="reset-password-new">
              <validation-provider
                #default="{ errors }"
                name="Password"
                vid="Password"
                rules="required|password"
              >
                <b-input-group
                  class="input-group-merge"
                  :class="errors.length > 0 ? 'is-invalid' : null"
                >
                  <b-form-input
                    id="reset-password-new"
                    v-model="password"
                    :type="password1FieldType"
                    :state="errors.length > 0 ? false : null"
                    class="form-control-merge"
                    name="reset-password-new"
                    placeholder="············"
                  />
                  <b-input-group-append is-text>
                    <feather-icon
                      class="cursor-pointer"
                      :icon="password1ToggleIcon"
                      @click="togglePassword1Visibility"
                    />
                  </b-input-group-append>
                </b-input-group>
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>

            <!-- confirm password -->
            <b-form-group
              label="Confirm Password"
              label-for="reset-password-confirm"
            >
              <validation-provider
                #default="{ errors }"
                name="Confirm Password"
                rules="required|confirmed:Password"
              >
                <b-input-group
                  class="input-group-merge"
                  :class="errors.length > 0 ? 'is-invalid' : null"
                >
                  <b-form-input
                    id="reset-password-confirm"
                    v-model="cPassword"
                    :type="password2FieldType"
                    class="form-control-merge"
                    :state="errors.length > 0 ? false : null"
                    name="reset-password-confirm"
                    placeholder="············"
                  />
                  <b-input-group-append is-text>
                    <feather-icon
                      class="cursor-pointer"
                      :icon="password2ToggleIcon"
                      @click="togglePassword2Visibility"
                    />
                  </b-input-group-append>
                </b-input-group>
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>

            <!-- submit button -->
            <b-button block type="submit" variant="primary">
              Set New Password
            </b-button>
          </b-form>
        </validation-observer>

        <p class="text-center mt-2">
          <b-link :to="{ name: 'login' }">
            <feather-icon icon="ChevronLeftIcon" /> Back to Login
          </b-link>
        </p>
      </b-card>
      <!-- /Reset Password v1 -->
    </div>
  </div>
</template>

<script>
import { ValidationProvider, ValidationObserver } from "vee-validate";
import VuexyLogo from "@core/layouts/components/Logo.vue";
import {
  BCard,
  BCardTitle,
  BCardText,
  BForm,
  BFormGroup,
  BInputGroup,
  BInputGroupAppend,
  BLink,
  BFormInput,
  BButton,
} from "bootstrap-vue";
import { required } from "@validations";
import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";
import md5 from "js-md5";

export default {
  components: {
    VuexyLogo,
    BCard,
    BButton,
    BCardTitle,
    BCardText,
    BForm,
    BFormGroup,
    BInputGroup,
    BLink,
    BFormInput,
    BInputGroupAppend,
    ValidationProvider,
    ValidationObserver,
  },
  data() {
    return {
      userEmail: "",
      cPassword: "",
      password: "",
      // validation
      required,

      // Toggle Password
      password1FieldType: "password",
      password2FieldType: "password",
      appName: process.env.VUE_APP_NAME,
    };
  },
  computed: {
    password1ToggleIcon() {
      return this.password1FieldType === "password" ? "EyeIcon" : "EyeOffIcon";
    },
    password2ToggleIcon() {
      return this.password2FieldType === "password" ? "EyeIcon" : "EyeOffIcon";
    },
  },
  methods: {
    togglePassword1Visibility() {
      this.password1FieldType =
        this.password1FieldType === "password" ? "text" : "password";
    },
    togglePassword2Visibility() {
      this.password2FieldType =
        this.password2FieldType === "password" ? "text" : "password";
    },
    validationForm() {
      this.$refs.simpleRules.validate().then((success) => {
        if (success) {
          this.resetPassword();
        }
      });
    },
    resetPassword() {
      this.loading = true;

      // console.log(this.userEmail)
      // let data = {
      //   email: this.email, //userEmail
      //   password: md5(this.password),
      // }

      axios
        .post(
          `/Account/ResetPassword?password=${this.password}&token=${this.$route.query.token}`
        )
        .then((response) => {
          this.loading = false;
          let responseCode = response.data.responseCode;

          this.$toast({
            component: ToastificationContent,
            props: {
              title: "success",
              icon: "EditIcon",
              variant: "success",
              text: "Sent successfully",
            },
          });

          this.$router.push("/");
        })
        .catch((error) => {
          console.log("eror = " + error);
          console.log("eror = " + error.response.data.message);
          this.loading = false;

          let message = Error;
          if (error.response.data.code == 404) {
            message = error.response.data.message;
          }

          if (error.response.data.code == 400) {
            message = error.response.data.message;
          }

          if (error.response !== undefined) {
            message = error.response.message;
          }

          this.$toast({
            component: ToastificationContent,
            props: {
              title: "Error",
              icon: "BellIcon",
              text: error.response.data.message,
              variant: "danger",
            },
          });
        });
    },
  },
  mounted() {},
};
</script>

<style lang="scss">
@import "@core/scss/vue/pages/page-auth.scss";
</style>
