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
    @hidden="initValues"
    @change="(val) => $emit('update:is-add-new-user-sidebar-active', val)"
  >
    <template #default="{ hide }">
      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center content-sidebar-header px-2 py-1">
        <h5 class="mb-0">
          {{headerType}} العملاء
        </h5>

        <feather-icon
          class="ml-1 cursor-pointer"
          icon="XIcon"
          size="16"
          @click="hide"
        />

      </div>

      <!-- BODY -->
      <validation-observer
        #default="{ handleSubmit }"
        ref="brnadForm"
      >
        <!-- Form -->
        <b-form
          class="p-2"
          @submit.prevent="handleSubmit(onSubmit)"
          @reset.prevent="initValues"
        >

          <!--  Name -->
          <validation-provider
            #default="validationContext"
            name="name"
            rules="required"
          >
            <b-form-group
              label="Name"
              label-for="name"
            >
              <b-form-input
                id="name"
                v-model="name"
                autofocus
                :state="getValidationState(validationContext)"
                trim
                placeholder="أكتب اﻹسم"
              />

              <b-form-invalid-feedback>
                {{ validationContext.errors[0] }}
              </b-form-invalid-feedback>
              <span class="text-danger text-sm" v-if="allerrors.name">{{ allerrors.name[0] }}</span>
            </b-form-group>
          </validation-provider>

         

           <!-- Phone -->
          <validation-provider
            #default="validationContext"
            name="Phone"
            rules="required|digits:10|integer"
          >
            <b-form-group
              label="phone"
              label-for="phone"
            >
              <b-form-input
                id="phone"
                v-model="phone"
                :state="getValidationState(validationContext)"
                trim
                placeholder="Enter Phone"
              />

              <b-form-invalid-feedback>
                {{ validationContext.errors[0] }}
              </b-form-invalid-feedback>

              <span class="text-danger text-sm" v-if="allerrors.phone">{{ allerrors.phone[0] }}</span>

            </b-form-group>
          </validation-provider>


           <!-- Email -->
          <validation-provider
            #default="validationContext"
            name="email"
            rules="required|email"
          >
            <b-form-group
              label="Email"
              label-for="email"
            >
              <b-form-input
                id="email"
                v-model="email"
                :state="getValidationState(validationContext)"
                trim
                placeholder="Enter Arabic Name"
              />

              <b-form-invalid-feedback>
                {{ validationContext.errors[0] }}
              </b-form-invalid-feedback>
               <span class="text-danger text-sm" v-if="allerrors.email">{{ allerrors.email[0] }}</span>
            </b-form-group>
          </validation-provider>


       
  
          <!-- Form Actions -->
          <div class="d-flex mt-2">
            <b-button
              v-ripple.400="'rgba(255, 255, 255, 0.15)'"
              variant="primary"
              class="mr-2"
              type="submit"
              v-if="!loading"
            >
              {{ headerType }}
            </b-button>
            <!-- spinner -->
            <b-button
              v-if="loading"
              variant="primary"
              disabled
              class="mr-1"
            >
              <b-spinner small />
              Loading...
            </b-button>
            <!-- end spinner -->
            <b-button
              v-ripple.400="'rgba(186, 191, 199, 0.15)'"
              type="button"
              variant="btn btn-danger"
              @click="hide"
            >
              إلغاء
            </b-button>
          </div>

        </b-form>
      </validation-observer>
    </template>
  </b-sidebar>
</template>

<script>
import {
  BSidebar, BForm, BFormGroup, BFormInput, BFormInvalidFeedback, BButton, BFormFile, BCardText, BMedia, BAvatar, BSpinner
} from 'bootstrap-vue'
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import { onMounted, ref } from '@vue/composition-api'
import { required, alphaNum, email } from '@validations'
import formValidation from '@core/comp-functions/forms/form-validation'
import Ripple from 'vue-ripple-directive'
import vSelect from 'vue-select'
import store from '@/store'
import { watch } from '@vue/composition-api'
import DataService from './data/services'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
export default {
  
  components: {
    BSidebar,
    BForm,
    BFormGroup,
    BFormInput,
    BFormInvalidFeedback,
    BButton,
    BFormFile,
    BCardText,
    BMedia,
    BAvatar,
    BSpinner,
    vSelect,
    // Form Validation
    ValidationProvider,
    ValidationObserver,
    ToastificationContent,
  },
  directives: {
    Ripple,
  },
  model: {
    prop: 'isAddNewUserSidebarActive',
    event: 'update:is-add-new-user-sidebar-active',
  },
  props: {
    isAddNewUserSidebarActive: {
      type: Boolean,
      required: true,
    },
    dataSlider: {
      type: Object,
      default: () => {}
    },
    adminType: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      required,
      alphaNum,
      email,
      headerType: '',
      name:'',
      username:'',
      email:'',
      phone:'',
      type:'',
      id: '',
      loading: false,
      allerrors: {},
    }
  },
  watch: {
    isAddNewUserSidebarActive(val) {
      if(!val) return
      if(Object.entries(this.dataSlider).length === 0) {
        this.headerType = 'إضافة'
        this.initValues()
      }else {        
        this.headerType = 'تعديل'
        this.id       = this.dataSlider.id
        this.name     = this.dataSlider.name
        this.email    = this.dataSlider.email
        this.phone    = this.dataSlider.phone

        // this.initValues()
      }
    }
  },
  methods: {
    initValues() {
      if(this.dataSlider.id) return
        this.id       = null
        this.name     = null
        this.phone    = null
        this.email    = null
        this.allerrors = {}
    },
    prepareData(){
      return {
        id: this.id, 
        name: this.name, 
        phone: this.phone,
        email: this.email,
      }
    },
    onSubmit(){
      if(!this.id){
        this.sendData()
      }else{
        this.editData();
      }
    },
      sendData(){
      this.loading = true;
      this.allerrors = []
     
      DataService.create(this.prepareData())
      .then(response => {
        this.loading = false
        let responseCode = response.status
        if(responseCode == 201){
          this.$toast({
            component: ToastificationContent,
            props: {
              title: "العملاء",
              icon: 'EditIcon',
              variant: 'success',
              text: "تم اﻹضافة بنجاح"
            },
          })
          this.$emit('update:is-add-new-user-sidebar-active', false)
            
          DataService.getAll(1)
          .then(response => {
            // this.getUserCount()
            this.items = response.data
            this.$emit('refreshData',this.items)
          })   

        }else if(responseCode === 101){
          console.log('error');
          this.allerrors = response.data.errors
          this.$toast({
            component: ToastificationContent,
            props: {
              title: 'Error',
              icon: 'BellIcon',
              text: response.data.responseDescription,
              variant: 'danger'
            },
          })
        }
        else if(responseCode == 102){
          this.$toast({
            component: ToastificationContent,
            props: {
              title: 'Error',
              icon: 'BellIcon',
              text: response.data.responseDescription,
              variant: 'danger'
            },
          })
        }
      })
      .catch(error => {
        console.log(error)
        this.loading = false
                
        if (error.response.data.responseCode == 102) {
          this.allerrors = error.response.data.error
        }
        let message = Error
        if (error.response !== undefined) {
          message = error.response.data.message;
        }
        
        this.$toast({
          component: ToastificationContent,
          props: {
            title: 'Error',
            icon: 'BellIcon',
            text: message,
            variant: 'danger'
          },
        })
      });
  },
    editData(){
      this.allerrors = []
      this.loading = true;
      
        DataService.update(this.id, this.prepareData())
        .then(response => {
          this.loading = false
          // let responseCode = response.data.responseCode
          let responseCode = response.status
          if(responseCode == 200){
            this.$toast({
              component: ToastificationContent,
              props: {
                title: "العملاء",
                icon: 'EditIcon',
                variant: 'success',
                text: "تم التعديل بنجاح"
              },
            })
            this.$emit('update:is-add-new-user-sidebar-active', false)

            DataService.getAll(1)
            .then(response => {
              // this.getUserCount()
              this.items = response.data
              this.$emit('refreshData',this.items)
            })
          }
          else if(responseCode == 101){
            this.allerrors = response.data.errors
            this.$toast({
              component: ToastificationContent,
              props: {
                title: 'Error',
                icon: 'BellIcon',
                text: response.data.responseDescription,
                variant: 'danger'
              },
            })
          }
          else if(responseCode == 102){
            this.$toast({
              component: ToastificationContent,
              props: {
                title: 'Error',
                icon: 'BellIcon',
                text: response.data.responseDescription,
                variant: 'danger'
              },
            })
          }
        })
        .catch(error => {
          console.log(error)
          this.loading = false
                  
          if (error.response.data.responseCode == 102) {
            this.allerrors = error.response.data.error
          }
          let message = Error
          if (error.response !== undefined) {
            message = error.response.data.message;
          }
          
          this.$toast({
            component: ToastificationContent,
            props: {
              title: 'Error',
              icon: 'BellIcon',
              text: message,
              variant: 'danger'
            },
          })
        });
    },
    
  },
  setup() {
   
    const {
      refFormObserver,
      getValidationState,
      resetForm,
    } = formValidation()
    return {
      // userData,
      // onSubmit,
      refFormObserver,
      getValidationState,
      resetForm,
      //  ? Demo - Update Image on click of update button

    }
  },
}
</script>

<style lang="scss">
@import '@core/scss/vue/libs/vue-select.scss';
#add-new-user-sidebar {
  .vs__dropdown-menu {
    max-height: 200px !important;
  }
}
</style>