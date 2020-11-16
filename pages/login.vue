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
      let emails = await this.$axios.$get("https://api.github.com/user/emails")
      console.log(emails)
      let payload = {
        api_key: process.env.KG_API_KEY,
        strategy: 'github',
        token: this.$auth.getToken('github'),
      }
      let login_response = await this.$loginEndpoint.create(payload)
      if (login_response !== '200') {
        console.log(login_response)
      }
    }
  }
}
</script>
