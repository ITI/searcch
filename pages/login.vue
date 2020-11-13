<template>
  <v-app id="login">
    <v-main>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="4">
            <v-card class="elevation-12">
              <v-toolbar color="primary" dark flat>
                <v-toolbar-title>Login</v-toolbar-title>
              </v-toolbar>
              <v-card-text>
                <v-form @submit="userLogin">
                  <!--
                    <v-text-field
                    prepend-icon="mdi-account"
                    v-model="login.username"
                    autocomplete="username"
                    type="text"
                  />
                  <v-text-field
                    v-model="login.password"
                    prepend-icon="mdi-lock"
                    autocomplete="current-password"
                    type="password"
                  />
                  -->
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn color="primary" @click="userLogin">GitHub Login</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  props: {
    source: String
  },
  data() {
    return {
      login: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    async userLogin() {
      let response = await this.$auth.loginWith('github')
      console.log(response)

      // Github specific email extractor
      // The email in the original auth token does not get set if the user's Github profile has visibility for that email set to none
      // so you have to use a separate GET request to retrieve it from the Github user session -moved to backend
      // let emails = await this.$axios.$get("https://api.github.com/user/emails")
      // response.data.user.email = emails[0].email
      // this.$auth.setUser(response.data.user)

      // let payload = {
      //   api_key: ,
      //   strategy: 'github',
      //   token: response,
      // }
      // let login_response = await this.$loginEndpoint.create()
    }
  }
}
</script>
