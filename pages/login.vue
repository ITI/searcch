<template>
  <v-app id="login">
    <v-main>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="6">
            <v-card class="elevation-12">
              <v-toolbar color="primary" dark flat>
                <v-toolbar-title>Login</v-toolbar-title>
              </v-toolbar>
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
  data() {
    return {
      login: {
        username: '',
        password: ''
      }
    }
  },
  head() {
    return {
      title: 'SEARCCH Login Screen',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'SEARCCH Login Screen'
        }
      ]
    }
  },

  methods: {
    async userLogin() {
      let response = await this.$auth.loginWith('github')
    }
  }
}
</script>
