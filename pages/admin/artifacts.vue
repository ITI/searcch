<template>
  <span>
    <v-layout column justify-left align-top>
      <v-row class="ml-1 mb-2">
        <h1>Artifacts</h1>
      </v-row>
      <v-divider></v-divider><br />
      <v-row align="center">
        <v-col cols="1">
          <h3>Filters:</h3>
        </v-col>
        <v-col cols="1">
          <v-subheader>
            Type
          </v-subheader>
        </v-col>
        <v-col cols="2">
          <v-select
            v-model="type_select"
            label="Type"
            :items="type_items"
            single-line
            @change="updateArtifacts()"
          ></v-select>
        </v-col>
        <v-col cols="1">
          <v-subheader>
            Published
          </v-subheader>
        </v-col>
        <v-col cols="1">
          <v-checkbox
            v-model="published"
            @change="updateArtifacts()"
          ></v-checkbox>
        </v-col>
        <v-col cols="2">
          <v-text-field
            v-model="owner_filter"
            hint="Case-insensitive substring of user name or email"
            label="Owner"
            @change="updateArtifacts()"
          ></v-text-field>
        </v-col>
        <v-col cols="2"></v-col>
        <v-col cols="1">
          <h3>Refresh:</h3>
        </v-col>
        <v-col cols="1">
          <v-btn icon @click="updateArtifacts()">
            <v-icon>mdi-refresh</v-icon>
          </v-btn>
        </v-col>
      </v-row>
      <v-divider></v-divider><br />
      <v-data-table
        :headers="headers"
        :items="items"
        :loading="loading"
        :options.sync="options"
        :server-items-length="total"
        :footer-props="{'items-per-page-options':[10, 20, 50, 100, -1]}">
        <template #item.id="{ item }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <a v-if="item.id" :href="`/artifact/${item.id}`">
                <v-icon v-on="on">mdi-database</v-icon>
              </a>
            </template>
            <span>View</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <a v-if="!item.publication" :href="`/artifact/${item.id}?edit=true`">
                <v-icon v-on="on">mdi-database-edit</v-icon>
              </a>
            </template>
            <span>Edit</span>
          </v-tooltip>
        </template>
        <template v-slot:item.ctime="{ item }">
          {{ $moment.utc(item.ctime).fromNow() }}
        </template>
        <template v-slot:item.mtime="{ item }">
          {{ item.mtime ? $moment.utc(item.mtime).fromNow() : "" }}
        </template>
        <template #item.url="{ item }">
          <a v-if="item.url" :href="`${item.url}`">{{ ellipsize(item.url,32) }}</a>
        </template>
        <template #item.publication="{ item }">
          <v-icon v-if="item.publication">mdi-check</v-icon>
        </template>
        <template #item.owner.person="{ item }">
          {{ item.owner.person.email }}{{ item.owner.person.name ? " (" + item.owner.person.name + ")" : "" }}
        </template>
      </v-data-table>
    </div>
    </v-layout>
  </span>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
      loadingMessage: 'Loading imports...',
      timeoutID: null,
      type_select: "",
      type_items: [
          "", "dataset", "executable", "methodology", "metrics",
          "priorwork", "publication", "hypothesis", "code", "domain",
          "supportinginfo" ],
      published: false,
      owner_filter: "",
      headers: [
        { text: "Artifact", value: "id", align: "start", sortable: true },
        { text: "Created", sortable: true, align: "start", value: "ctime", sortable: true },
        { text: "Modified", sortable: true, align: "start", value: "mtime", sortable: true },
        { text: "Type", value: "type", sortable: true },
        { text: "URL", value: "url", sortable: true },
        { text: "Title", value: "title", sortable: true },
        { text: "Published", value: "publication", sortable: true },
        { text: "Owner", value: "owner.person", sortable: false },
        //{ text: "Owner Email", value: "owner.person.email", sortable: false },
      ],
      loading: true,
      options: {
        itemsPerPage: 10,
        page: 1,
        sortDesc: [true]
      },
    }
  },
  async mounted() {
    this.$store.dispatch('user/fetchUser')
    this.loadingMessage = 'Loading artifacts...'
    this.updateArtifacts()
    this.timeoutID = setTimeout(() => {
      this.loadingMessage = 'No artifacts found'
    }, 5000)
  },
  computed: {
    ...mapState({
      user_is_admin: state => state.user.user_is_admin,
      items: state => state.system.artifacts.artifacts,
      //page: state => state.system.artifacts.page,
      //pages: state => state.system.artifacts.pages,
      total: state => state.system.artifacts.total
    }),
  },
  methods: {
    ellipsize(s,l) {
      if (s.length > l)
        return s.substring(0, l) + "...";
      else
        return s;
    },
    updateArtifacts() {
      if (this.user_is_admin) {
        this.loading = true
        var payload = {
          page: this.options.page, items_per_page: this.options.itemsPerPage,
          sort: this.options.sortBy, sort_desc: this.options.sortDesc[0] === true ? 1 : 0,
          allusers: 1, short_view_include: "owner,publication"
        }
        if (this.type_select)
          payload["type"] = this.type_select
        if (this.published)
          payload["published"] = 1
        if (this.owner_filter)
          payload["owner"] = this.owner_filter
        this.$store.dispatch('system/fetchArtifacts', payload)
      }
      clearTimeout(this.timeoutID)
    }
  },
  watch: {
    user_is_admin() {
      // had to make this because on refresh, user_is_admin doesn't update until after the mounted has already run,
      // but mounted needs to run when switching pages where the user_is_admin doesn't update
      console.log("watch updateArtifacts")
      this.updateArtifacts()
    },
    items() {
      this.loading = false
    },
    options: {
      handler () {
        this.updateArtifacts()
      },
      deep: true,
    }
  },
  beforeRouteLeave(to, from, next) {
    clearTimeout(this.timeoutID)
    next()
  }
}
</script>