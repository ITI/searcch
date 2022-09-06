<template>
  <div>
    <transition name="modal-fade">
          <OwnershipReviewModal
            v-show="isModalVisible"
            @close="closeModal"
            @closeAndReview="closeModalAndReview"
            v-bind:claimid="reviewClaimid"
            v-bind:justificationMessage="justificationMessage"
            v-bind:userDetails="userDetails"
            v-bind:artifactDetails="artifactDetails"
            v-bind:isReject="false"
            v-bind:rejectionMessage="''">
        </OwnershipReviewModal>
    </transition>

    <v-layout column justify-left align-top>
      <v-row align="center">
        <v-col cols="1">
          <h3>Filters:</h3>
        </v-col>
        <v-col cols="2">
          <v-text-field
            v-model="user_filter"
            hint="Case-insensitive substring of user name or email"
            label="User"
            @change="updateClaims()"
          ></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-text-field
            v-model="artifact_filter"
            hint="Case-insensitive substring of artifact name or id" 
            label="Artifact"
            @change="updateClaims()"
          ></v-text-field>
        </v-col>
        <v-col cols="2"></v-col>
        <v-col cols="1">
          <h3>Refresh:</h3>
        </v-col>
        <v-col cols="1">
          <v-btn icon @click="updateClaims()">
            <v-icon>mdi-refresh</v-icon>
          </v-btn>
        </v-col>
      </v-row>
      <v-divider></v-divider><br />
    </v-layout>
    <v-card>
      <v-card-title>
        Claims
        <v-spacer></v-spacer>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="items"
        :search="search"
        :loading="loading"
        :options.sync="options"
        :footer-props="{ 'items-per-page-options': [10, 20, 50, 100, -1] }"
        :server-items-length="total"
        dense
      >
      <template v-slot:item.artifact_title="{ item }">
        <a target="_blank" :href="`/artifact/${item.artifact_group_id}`">
          {{ item.artifact_title }}
        </a>
      </template>
        <template v-slot:item.actions="{ item }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-icon
                v-if="item.id"
                v-on="on"
                small
                color="warning"
                @click="reviewClaim(item)"
              >
                mdi-open-in-new
              </v-icon>
            </template>
            <span>Review Claim {{ item.id }} </span>
          </v-tooltip>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  components: {
    OwnershipReviewModal: () => import("@/components/AdminRoleReviewModal.vue")
  },
  data() {
    return {
      loadingMessage: 'Loading claims...',
      isModalVisible: false,
      timeoutID: null,
      is_ownership: false,
      user_filter: '',
      artifact_filter: '',
      headers: [
        { text: 'Claim ID', value: 'id', align: 'start', sortable: true },
        { text: 'User ID', value: 'user.id', sortable: true },
        { text: 'User', value: 'user.person.name', sortable: true },
        { text: 'Artifact ID', value: 'artifact_group_id', sortable: true },
        { text: 'Artifact', value: 'artifact_title', sortable: true },
        { text: 'Actions', value: 'actions', sortable: false }
      ],
      loading: true,
      options: {
        itemsPerPage: 20,
        page: 1
      },
      search: '',
      editedIndex: -1,
      items: [],
      userDetails: [],
      artifactDetails: [],
      reviewClaimid: null,
      justificationMessage: null
    }
  },
  async mounted() {
    this.$store.dispatch('user/fetchUser')
    this.loadingMessage = 'Loading claims...'
    this.updateClaims()
    this.timeoutID = setTimeout(() => {
      this.loadingMessage = 'No claims found'
    }, 5000)
  },
  computed: {
    ...mapState({
      user_is_admin: state => state.user.user_is_admin,
      claims: state => state.claims.claims.artifact_owner_requests,
      page: state => state.claims.claims.page,
      pages: state => state.claims.claims.pages,
      total: state => state.claims.claims.total
    })
  },
  methods: {
    updateClaims() {
      if (this.user_is_admin) {
        this.loading = true
        var payload = {
          page: this.options.page,
          items_per_page: this.options.itemsPerPage,
          sort: this.options.sortBy[0],
          sort_desc: this.options.sortDesc[0] === true ? 1 : 0,
          allusers: 1
        }
        if (this.user_filter) payload['user'] = this.user_filter
        if (this.artifact_filter) payload['artifact'] = this.artifact_filter
        this.$store.dispatch('claims/fetchClaims', payload)
      }
      clearTimeout(this.timeoutID)
    },
    reviewClaim(item) {
      this.editedIndex = this.items.indexOf(item)
      let content = this.items[this.editedIndex]
      this.userDetails = [ {
        id: content.user.id,
        name: content.user.person.name,
        email: content.user.person.email
      } ];
      this.artifactDetails = [ {
        id: content.artifact_group_id,
        name: content.artifact_title
      } ];
      this.reviewClaimid = content.id;
      this.justificationMessage = content.message;
      this.showModal();
    },
    async deleteClaim() {
      this.items.splice(this.editedIndex, 1)
    },
    showModal() {
      this.isModalVisible = true;
    },
    closeModal() {
      this.isModalVisible = false;
      this.editedIndex = -1;
    },
    async closeModalAndReview(approve) {
      var message, action;
      if(approve) {
        action = "approve";
        message = "Claim Request Approved";
      } else {
        action = "reject";
        message = "Claim Request Rejected";
      }
      try {
        await this.$adminArtifactClaimEndpoint.put({ 
          artifact_owner_request_id: this.reviewClaimid,
          action: action,
          message: message})
      } catch(ex) {
        console.error("Couldn't update claim")
      }
      this.deleteClaim();
      this.closeModal();
    }
  },
  watch: {
    user_is_ownership() {
      // had to make this because on refresh, user_is_ownership doesn't update until after the mounted has already run,
      // but mounted needs to run when switching pages where the user_is_ownership doesn't update
      this.updateClaims()
    },
    claims() {
      this.loading = false
      this.items = JSON.parse(JSON.stringify(this.claims))
    },
    options: {
      handler() {
        this.updateClaims()
      },
      deep: true
    }
  },
  beforeRouteLeave(to, from, next) {
    clearTimeout(this.timeoutID)
    next()
  }
}
</script>
