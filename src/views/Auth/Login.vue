<template>
  <div class="auth-wrapper auth-v2">
    <b-row class="auth-inner m-0">
      <!-- Brand logo-->
      <b-link class="brand-logo">
        <!-- <vuexy-logo /> -->
        <h2 class="brand-text text-primary ml-1">{{ appName }} Dashboard</h2>
      </b-link>
      <!-- /Brand logo-->

      <!-- Left Text-->
      <b-col lg="8" class="d-none d-lg-flex align-items-center p-5">
        <div
          class="w-100 d-lg-flex align-items-center justify-content-center px-5"
        >
          <b-img fluid :src="imgUrl" alt="Login V2" />
        </div>
      </b-col>
      <!-- /Left Text-->

      <!-- Login-->
      <b-col lg="4" class="d-flex align-items-center auth-bg px-2 p-lg-5">
        <b-col sm="8" md="6" lg="12" class="px-xl-2 mx-auto">
          <b-card-title title-tag="h2" class="font-weight-bold mb-1">
            Welcome to StellerConsumer 👋
          </b-card-title>
          <!-- <b-card-text class="mb-2">
            Please sign-in to your account and start the adventure
          </b-card-text> -->

          <!-- form -->
          <validation-observer ref="loginValidation">
            <b-form class="auth-login-form mt-2" @submit.prevent>
              <!-- email -->
              <b-form-group label="Email" label-for="login-email">
                <validation-provider
                  #default="{ errors }"
                  name="Email"
                  rules="required|email"
                >
                  <b-form-input
                    id="login-email"
                    v-model="email"
                    :state="errors.length > 0 ? false : null"
                    name="login-email"
                    placeholder="john@example.com"
                  />
                  <small class="text-danger text-sm" v-if="allerrors.email">{{
                    allerrors.email[0]
                  }}</small>
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>

              <!-- forgot password -->
              <b-form-group>
                <div class="d-flex justify-content-between">
                  <label for="login-password">Password</label>
                  <!-- <b-link :to="{name:'forgot-password'}"> -->
                  <b-link :to="{ name: 'forgot-password' }">
                    <small> Forget Password?</small>
                  </b-link>
                </div>
                <validation-provider
                  #default="{ errors }"
                  name="Password"
                  rules="required"
                >
                  <b-input-group
                    class="input-group-merge"
                    :class="errors.length > 0 ? 'is-invalid' : null"
                  >
                    <b-form-input
                      id="login-password"
                      v-model="password"
                      :state="errors.length > 0 ? false : null"
                      class="form-control-merge"
                      :type="passwordFieldType"
                      name="login-password"
                      placeholder="············"
                    />
                    <b-input-group-append is-text>
                      <feather-icon
                        class="cursor-pointer"
                        :icon="passwordToggleIcon"
                        @click="togglePasswordVisibility"
                      />
                    </b-input-group-append>
                  </b-input-group>
                  <small
                    class="text-danger text-sm"
                    v-if="allerrors.password"
                    >{{ allerrors.password[0] }}</small
                  >
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>

              <!-- checkbox -->
              <b-form-group>
                <b-form-checkbox
                  id="remember-me"
                  v-model="status"
                  name="checkbox-1"
                >
                  Remember me
                </b-form-checkbox>
              </b-form-group>

              <!-- submit buttons -->
              <b-button
                type="submit"
                variant="primary"
                block
                @click="validationForm"
                v-if="!loading"
              >
                Login
              </b-button>
              <b-button
                v-if="loading"
                variant="primary"
                disabled
                block
                class="mr-1"
              >
                <b-spinner small type="grow" />
                Loading...
              </b-button>
            </b-form>
          </validation-observer>
        </b-col>
      </b-col>
      <!-- /Login-->
    </b-row>
  </div>
</template>

<script>
/* eslint-disable global-require */
import { ValidationProvider, ValidationObserver } from "vee-validate";
import VuexyLogo from "@core/layouts/components/Logo.vue";
import {
  BRow,
  BCol,
  BLink,
  BFormGroup,
  BFormInput,
  BInputGroupAppend,
  BInputGroup,
  BFormCheckbox,
  BCardText,
  BCardTitle,
  BImg,
  BForm,
  BButton,
} from "bootstrap-vue";
import { required, email } from "@validations";
import { togglePasswordVisibility } from "@core/mixins/ui/forms";
import store from "@/store/index";
import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";
import { BSpinner } from "bootstrap-vue";
import md5 from "js-md5";

export default {
  components: {
    BRow,
    BCol,
    BLink,
    BFormGroup,
    BFormInput,
    BInputGroupAppend,
    BInputGroup,
    BFormCheckbox,
    BCardText,
    BCardTitle,
    BImg,
    BForm,
    BButton,
    VuexyLogo,
    ValidationProvider,
    ValidationObserver,
    BSpinner,
    ToastificationContent,
  },
  mixins: [togglePasswordVisibility],
  data() {
    return {
      status: "",
      password: "",
      email: "",
      sideImg: require("@/assets/images/pages/login-v2.svg"),
      // sideImg: require("@/assets/images/logo/op.jpeg"),

      // validation rulesimport store from '@/store/index'
      required,
      email,
      loading: false,
      allerrors: "",
      appName: process.env.VUE_APP_NAME,
    };
  },
  computed: {
    passwordToggleIcon() {
      return this.passwordFieldType === "password" ? "EyeIcon" : "EyeOffIcon";
    },
    imgUrl() {
      if (store.state.appConfig.layout.skin === "dark") {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.sideImg = require("@/assets/images/pages/login-v2-dark.svg");
        // this.sideImg = require("@/assets/images/logo/op.jpeg");
        return this.sideImg;
      }
      return this.sideImg;
    },
  },
  methods: {
    validationForm() {
      this.$refs.loginValidation.validate().then((success) => {
        if (success) {
          this.login();
        }
      });
    },

    login() {
      this.loading = true;
      let data = {
        email: this.email, //userEmail
        password: this.password,
      };

      axios
        .post("/Account/Login", data)
        .then((response) => {
          this.loading = false;
          let responseCode = response.data.data.responseCode;
          // if(responseCode == 100){
          this.$toast({
            component: ToastificationContent,
            props: {
              title: "success",
              icon: "EditIcon",
              variant: "success",
              text: "Login Successfully",
            },
          });

          $cookies.set(this.appName + "_AUTH_TOKEN", response.data.data.token);
          $cookies.set(this.appName + "_Name", response.data.data.user.name);

          this.$router.push("/");
        })
        .catch((error) => {
          console.log(error);
          this.loading = false;

          let message = Error;
          message = error.response.data.data.message;

          this.$toast({
            component: ToastificationContent,
            props: {
              title: "Error",
              icon: "BellIcon",
              text: message,
              variant: "danger",
            },
          });
        });
    },
  },
};
</script>

<style lang="scss">
@import "@core/scss/vue/pages/page-auth.scss";
</style>
