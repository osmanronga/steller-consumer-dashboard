<template>
  <div class="auth-wrapper auth-v1 px-2">
    <div class="auth-inner py-2">
      <!-- Forgot Password v1 -->
      <b-card class="mb-0">
        <b-link class="brand-logo">
          <!-- logo -->
          <vuexy-logo />

          <h2 class="brand-text text-primary ml-1">
            {{ appName }}
          </h2>
        </b-link>

        <b-card-title class="mb-1"> هل نسيت كلمة السر؟ 🔒 </b-card-title>
        <b-card-text class="mb-2">
          أدخل بريدك الإلكتروني وسنرسل لك تعليمات لإعادة تعيين كلمة المرور
          الخاصة بك
        </b-card-text>

        <!-- form -->
        <validation-observer ref="simpleRules">
          <b-form
            class="auth-forgot-password-form mt-2"
            @submit.prevent="validationForm"
          >
            <!-- email -->
            <b-form-group label="الإيميل" label-for="forgot-password-email">
              <validation-provider
                #default="{ errors }"
                name="Email"
                rules="required|email"
              >
                <b-form-input
                  id="forgot-password-email"
                  v-model="userEmail"
                  :state="errors.length > 0 ? false : null"
                  name="forgot-password-email"
                  placeholder="john@example.com"
                />
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>

            <!-- submit button -->
            <b-button variant="primary" block type="submit">
              إرسال رابط إعادة التعيين
            </b-button>
          </b-form>
        </validation-observer>

        <b-card-text class="text-center mt-2">
          <b-link :to="{ name: 'login' }">
            <feather-icon icon="ChevronLeftIcon" /> الرجوع إلى تسجيل الدخول
          </b-link>
        </b-card-text>
      </b-card>
      <!-- /Forgot Password v1 -->
    </div>
  </div>
</template>

<script>
import { ValidationProvider, ValidationObserver } from "vee-validate";
import VuexyLogo from "@core/layouts/components/Logo.vue";
import {
  BCard,
  BLink,
  BCardText,
  BCardTitle,
  BFormGroup,
  BFormInput,
  BForm,
  BButton,
} from "bootstrap-vue";
import { required, email } from "@validations";
import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";

export default {
  components: {
    VuexyLogo,
    BCard,
    BLink,
    BCardText,
    BCardTitle,
    BFormGroup,
    BFormInput,
    BButton,
    BForm,
    ValidationProvider,
    ValidationObserver,
    ToastificationContent,
  },
  data() {
    return {
      userEmail: "",
      // validation
      required,
      email,
      appName: process.env.VUE_APP_NAME,
    };
  },
  methods: {
    validationForm() {
      this.$refs.simpleRules.validate().then((success) => {
        if (success) {
          this.forgotPassword();
        }
      });
    },

    forgotPassword() {
      this.loading = true;

      console.log(this.userEmail);

      axios
        .post(`/Account/ForgotPassword?email=${this.userEmail}`)
        .then((response) => {
          this.loading = false;
          let responseCode = response.data.responseCode;

          this.$toast({
            component: ToastificationContent,
            props: {
              title: "success",
              icon: "EditIcon",
              variant: "success",
              text: "تم اﻹرسال بنجاح",
            },
          });

          this.$router.push("/login");
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
};
</script>

<style lang="scss">
@import "@core/scss/vue/pages/page-auth.scss";
</style>
