<template>
  <v-container fill-height fluid>
    <v-row justify="center">
      <v-col cols="12" md="8">
        <material-card
          color="primary"
          title="Edit Profile"
          text="Complete your profile"
        >
          <v-form>
            <v-container class="py-0">
              <v-row>
                <v-col cols="12" md="4">
                  <v-text-field label="Company (disabled)" disabled />
                </v-col>

                <v-col cols="12" md="4">
                  <v-text-field class="primary-input" label="User Name" />
                </v-col>

                <v-col cols="12" md="4">
                  <v-text-field label="Email Address" class="primary-input" />
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field label="First Name" class="primary-input" />
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field label="Last Name" class="primary-input" />
                </v-col>

                <v-col cols="12">
                  <v-text-field label="Adress" class="primary-input" />
                </v-col>

                <v-col cols="12" md="4">
                  <v-text-field label="City" class="primary-input" />
                </v-col>

                <v-col cols="12" md="4">
                  <v-text-field label="Country" class="primary-input" />
                </v-col>

                <v-col cols="12" md="4">
                  <v-text-field
                    class="primary-input"
                    label="Postal Code"
                    type="number"
                  />
                </v-col>

                <v-col cols="12">
                  <v-textarea
                    class="primary-input"
                    label="About Me"
                    value="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
                  />
                </v-col>

                <v-col cols="12" class="text-right">
                  <v-btn color="success">
                    Update Profile
                  </v-btn>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </material-card>
      </v-col>
      <v-col cols="12" md="4">
        <material-card class="v-card-profile">
          <v-avatar
            slot="offset"
            class="mx-auto d-block elevation-6"
            size="130"
          >
            <v-img
              src="https://demos.creative-tim.com/vue-material-dashboard/img/marc.aba54d65.jpg"
            />
          </v-avatar>
          <v-card-text class="text-center">
            <h6 class="overline mb-3">
              {{ user.function }}
            </h6>

            <h4 class="font-weight-light">
              {{ fullname }}
            </h4>

            <p class="font-weight-light">
              {{ user.description }}
            </p>

            <v-btn color="success">
              Follow
            </v-btn>
          </v-card-text>
        </material-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  layout: 'dashboard',
  computed: {
    ...mapGetters({
      user: 'user/getUser',
      fullname: 'user/getFullname'
    })
  }
}
</script>
