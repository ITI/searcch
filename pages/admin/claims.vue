<template>
  <div>
    <transition name="modal-fade">
      <OwnershipReviewModal v-show="isModalVisible" @close="closeModal" @closeAndReview="closeModalAndReview"
        v-bind:claimid="reviewClaimid" v-bind:justificationMessage="justificationMessage" v-bind:userDetails="userDetails"
        v-bind:artifactDetails="artifactDetails" v-bind:isReject="false" v-bind:rejectionMessage="''">
      </OwnershipReviewModal>
    </transition>

    <v-container>
      <v-row justify="start" align="start">
        <v-col cols="12">
          <v-row align="start" class="mb-n12">
            <v-col cols="2">
              <v-text-field density="compact" variant="outlined" v-model="user_filter"
                hint="Case-insensitive substring of user name or email" label="User"
                @change="updateClaims()"></v-text-field>
            </v-col>
            <v-col cols="2">
              <v-text-field density="compact" variant="outlined" v-model="artifact_filter"
                hint="Case-insensitive substring of artifact name or id" label="Artifact"
                @change="updateClaims()"></v-text-field>
            </v-col>
            <v-spacer />
            <v-col cols="1">
              <v-btn @click="updateClaims()" size="x-small" icon="mdi-refresh" variant="outlined" class="mt-1" />
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12">
          <v-data-table-server :headers="headers" :items="items" :search="search" :loading="loading"
            v-model:options="options" :footer-props="{ 'items-per-page-options': [10, 20, 50, 100, -1] }"
            :items-length="total" dense>
            <template v-slot:item.artifact_title="{ item: { raw: item } }">
              <a target="_blank" :href="`/artifact/${item.artifact_group_id}`">
                {{ item.artifact_title }}
              </a>
            </template>
            <template v-slot:item.actions="{ item: { raw: item } }">
              <v-tooltip location="bottom">
                <template v-slot:activator="{ on }">
                  <v-icon v-if="item.id" v-on="on" size="small" color="warning" @click="reviewClaim(item)">
                    mdi-open-in-new
                  </v-icon>
                </template>
                <span>Review Claim {{ item.id }} </span>
              </v-tooltip>
            </template>
          </v-data-table-server>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { defineAsyncComponent } from 'vue'
import { mapState } from 'pinia'
import { userStore } from '~/stores/user'
import { systemStore } from '~/stores/system'

export default defineComponent({
  components: {
    OwnershipReviewModal: defineAsyncComponent(() => import("@/components/AdminRoleReviewModal.vue"))
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
        { title: 'Claim ID', key: 'id', align: 'start', sortable: true },
        { title: 'User ID', key: 'user.id', sortable: true },
        { title: 'User', key: 'user.person.name', sortable: true },
        { title: 'Artifact ID', key: 'artifact_group_id', sortable: true },
        { title: 'Artifact', key: 'artifact_title', sortable: true },
        { title: 'Actions', key: 'actions', sortable: false }
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
    this.$userStore.fetchUser()
    this.loadingMessage = 'Loading claims...'
    this.updateClaims()
    this.timeoutID = setTimeout(() => {
      this.loadingMessage = 'No claims found'
    }, 5000)
  },
  computed: {
    ...mapState(userStore, ['user_is_admin']),
    ...mapState(systemStore, {
      claims: (state) => state.claims.artifact_owner_requests,
      total: (state) => state.claims.total,
      page: (state) => state.claims.page,
      pages: (state) => state.claims.pages,
    }),
  },
  methods: {
    updateClaims() {
      if (this.user_is_admin) {
        this.loading = true
        var payload = {
          page: this.options.page,
          items_per_page: this.options.itemsPerPage,
          sort: this.options.sortBy[0],
          allusers: 1
        }
        if (this.user_filter) payload['user'] = this.user_filter
        if (this.artifact_filter) payload['artifact'] = this.artifact_filter
        this.$systemStore.fetchClaims(payload)
      }
      clearTimeout(this.timeoutID)
    },
    reviewClaim(item) {
      this.editedIndex = this.items.indexOf(item)
      let content = this.items[this.editedIndex]
      this.userDetails = [{
        id: content.user.id,
        name: content.user.person.name,
        email: content.user.person.email
      }];
      this.artifactDetails = [{
        id: content.artifact_group_id,
        name: content.artifact_title
      }];
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
    async closeModalAndReview(approve, msg = null) {
      var message, action;
      if (approve) {
        action = "approve";
        message = "Claim Request Approved";
      } else {
        action = "reject";
        message = msg;
      }
      try {
        await this.$adminArtifactClaimEndpoint.put({
          artifact_owner_request_id: this.reviewClaimid,
          action: action,
          message: message
        })
      } catch (ex) {
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
});
</script>
