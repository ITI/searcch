<template>
  <v-container>
    <v-row justify="start" align="start">
      <v-col cols="12">
        <v-row align="start" class="mb-n12">
          <v-col cols="2">
            <v-select density="compact" clearable v-model="type_select" label="Type" :items="type_items"
              variant="outlined" @update:model-value="updateArtifacts()"></v-select>
          </v-col>
          <v-col cols="2">
            <v-select density="compact" clearable v-model="publication_select" label="Publication Status"
              :items="publication_items" variant="outlined" @update:model-value="updateArtifacts()"></v-select>
          </v-col>
          <v-col cols="2">
            <v-checkbox density="compact" v-model="allversions" label="All Versions"
              @update:model-value="updateArtifacts()"></v-checkbox>
          </v-col>
          <v-col cols="2">
            <v-text-field density="compact" clearable v-model="owner_filter"
              hint="Case-insensitive substring of user name or email" variant="outlined" label="Owner"
              @change="updateArtifacts()"></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field density="compact" clearable v-model="artifact_group_id" hint="Integer artifact group ID"
              label="Artifact Group ID" variant="outlined" @change="updateArtifacts()"></v-text-field>
          </v-col>
          <v-spacer/>
          <v-col cols="1">
            <v-btn @click="updateArtifacts()" size="x-small" icon="mdi-refresh" variant="outlined" class="mt-1" />
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12">
        <v-data-table-server :headers="headers" :items="items" :search="search" :loading="loading"
          v-model:options="options" :footer-props="{ 'items-per-page-options': [10, 20, 50, 100, -1] }"
          :items-length="total" loading-text="Loading ..." v-model:expanded="expanded" dense>
          <template v-slot:top>
            <v-dialog v-model="dialogDelete" max-width="500px">
              <v-sheet class="px-7 pt-7 pb-4 mx-auto text-center d-inline-block" color="blue-grey-darken-3" theme="dark">
                <div class="text-grey-lighten-1 text-body-2 mb-4">
                  Are you sure you want to delete this item?
                </div>

                <v-btn variant="plain" color="success" @click="deleteItemConfirm">OK</v-btn>
                <v-btn variant="plain" color="error" @click="closeDelete">Cancel</v-btn>
              </v-sheet>
            </v-dialog>
          </template>

          <template v-slot:expanded-item="{ headers, item: { raw: item } }">
            <td :colspan="headers.length">
              <p>Created: {{ $moment.utc(item.ctime).fromNow() }}</p>
              <p>
                Modified:
                {{ item.mtime ? $moment.utc(item.mtime).fromNow() : '' }}
              </p>
            </td>
          </template>
          <template v-slot:item.id="{ item: { raw: item } }">
            <v-tooltip location="bottom">
              <template v-slot:activator>
                <a v-if="item.id" :href="`/artifact/${item.artifact_group_id}/${item.id}`" target="_blank" rel="noopener">
                  <v-icon size="small" color="info">mdi-database</v-icon>
                </a>
              </template>
              <span>View</span>
            </v-tooltip>
            <v-tooltip location="bottom">
              <template v-slot:activator>
                <a v-if="item.id && !item.publication" :href="`/artifact/${item.artifact_group_id}/${item.id}?edit=true`"
                  target="_blank" rel="noopener">
                  <v-icon size="small" color="green">mdi-database-edit</v-icon>
                </a>
              </template>
              <span>Edit</span>
            </v-tooltip>
            <a v-bind:item="item" @click="setArtifactGroupIdFilter(item.artifact_group_id)">{{ item.artifact_group_id
            }}</a>/{{ item.id }}
          </template>
          <template v-slot:item.ctime="{ item: { raw: item } }">
            {{ $moment.utc(item.ctime).fromNow() }}
          </template>
          <template v-slot:item.mtime="{ item: { raw: item } }">
            {{ item.mtime ? $moment.utc(item.mtime).fromNow() : '' }}
          </template>
          <template v-slot:item.url="{ item: { raw: item } }">
            <a v-if="item.url" :href="`${item.url}`" target="_blank" rel="noopener">{{ ellipsize(item.url, 32) }}</a>
          </template>
          <template v-slot:item.publication="{ item: { raw: item } }">
            <v-icon v-if="item.publication">mdi-check</v-icon>
          </template>
          <template v-slot:item.artifact_group.owner.person="{ item: { raw: item } }">
            <a :href="`/profile/${item.artifact_group.owner.id}`" target="_blank" rel="noopener">{{
              item.artifact_group.owner.person.email
            }}{{
  item.artifact_group.owner.person.name ? ' ' + item.artifact_group.owner.person.name + '' : ''
}}
            </a>
          </template>
          <template v-slot:item.type="{ item: { raw: item } }">
            <ArtifactChips :modelValue="[item.type]" :type="item.type" small></ArtifactChips>
          </template>
          <template v-slot:item.actions="{ item: { raw: item } }">
            <v-tooltip location="bottom">
              <template v-slot:activator>
                <v-icon v-if="item.id" size="small" color="error" @click="deleteItem(item, false)">
                  mdi-delete
                </v-icon>
              </template>
              <span>Delete Artifact Version {{ item.id }}</span>
            </v-tooltip>
            <v-tooltip location="bottom">
              <template v-slot:activator>
                <v-icon v-if="item.id" size="small" color="error" @click="deleteItem(item, true)">
                  mdi-delete-alert
                </v-icon>
              </template>
              <span>Delete Artifact Group {{ item.artifact_group_id }}</span>
            </v-tooltip>
          </template>
        </v-data-table-server>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { defineAsyncComponent } from 'vue'
import { mapState } from 'pinia'
import { userStore } from '~/stores/user'
import { systemStore } from '~/stores/system'

export default defineComponent({
  components: {
    ArtifactChips: defineAsyncComponent(() => import('@/components/ArtifactChips'))
  },
  data() {
    return {
      loadingMessage: 'Loading imports...',
      timeoutID: null,
      type_select: '',
      type_items: [
        '',
        'dataset',
        'presentation',
        'publication',
        'software',
        'other'
      ],
      publication_select: 'published',
      publication_items: [
        '',
        'published',
        'draft'
      ],
      allversions: false,
      owner_filter: '',
      artifact_group_id: null,
      headers: [
        { title: 'Artifact', key: 'id', align: 'start', sortable: true },
        { title: 'Type', key: 'type', sortable: true },
        { title: 'Title', key: 'title', sortable: true },
        { title: 'URL', key: 'url', sortable: true },
        { title: 'Published', key: 'publication', sortable: true },
        {
          title: 'Created',
          sortable: true,
          key: 'ctime'
        },
        {
          title: 'Modified',
          sortable: true,
          key: 'mtime'
        },
        { title: 'Owner', key: 'artifact_group.owner.person', sortable: false },
        { title: 'Views', key: 'view_count', sortable: false },
        { title: 'Actions', key: 'actions', sortable: false }

        // { text: '', value: 'data-table-expand' }
        //{ text: "Owner Email", value: "owner.person.email", sortable: false },
      ],
      loading: true,
      options: {
        itemsPerPage: 20,
        page: 1,
        // sortDesc: [true]
      },
      expanded: [],
      search: '',
      dialogDelete: false,
      editedIndex: -1,
      deleteAllVersions: false,
      items: []
    }
  },
  async mounted() {
    this.$userStore.fetchUser()
    this.loadingMessage = 'Loading artifacts...'
    this.updateArtifacts()
    this.timeoutID = setTimeout(() => {
      this.loadingMessage = 'No artifacts found'
    }, 5000)
  },
  computed: {
    ...mapState(systemStore, {
      artifacts: (state) => state.artifacts.artifacts,
      page: (state) => state.artifacts.page,
      pages: (state) => state.artifacts.pages,
      total: (state) => state.artifacts.total
    }),
    ...mapState(userStore, ['user_is_admin'])
  },
  methods: {
    ellipsize(s, l) {
      if (s.length > l) return s.substring(0, l) + '...'
      else return s
    },
    updateArtifacts() {
      if (this.user_is_admin) {
        this.loading = true
        var payload = {
          page: this.options.page,
          items_per_page: this.options.itemsPerPage,
          sort: this.options.sortBy,
          // sort_desc: this.options.sortDesc[0] === true ? 1 : 0,
          allusers: 1,
          short_view_include: 'artifact_group,owner,publication'
        }
        if (this.type_select) payload['type'] = this.type_select
        if (this.publication_select) {
          if (this.publication_select === "published") payload['published'] = 1
          if (this.publication_select === "draft") payload['published'] = 0
        }
        if (this.allversions) payload['allversions'] = 1
        if (this.owner_filter) payload['owner'] = this.owner_filter
        if (this.artifact_group_id) payload['artifact_group_id'] = this.artifact_group_id
        this.$systemStore.fetchArtifacts(payload)
      }
      clearTimeout(this.timeoutID)
    },
    setArtifactGroupIdFilter(id) {
      this.artifact_group_id = id
      this.updateArtifacts()
    },
    deleteItem(item, allversions) {
      this.editedIndex = this.items.indexOf(item)
      this.dialogDelete = true
      this.deleteAllVersions = true
    },
    async deleteItemConfirm() {
      if (this.deleteAllVersions) {
        await this.$artifactEndpoint.delete(
          this.items[this.editedIndex].artifact_group_id)
      }
      else {
        await this.$artifactEndpoint.delete(
          [this.items[this.editedIndex].artifact_group_id,
          this.items[this.editedIndex].id])
      }
      this.items.splice(this.editedIndex, 1)
      this.closeDelete()
      this.updateArtifacts()
    },
    closeDelete() {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedIndex = -1
        this.deleteAllVersions = true
      })
    }
  },
  watch: {
    user_is_admin() {
      // had to make this because on refresh, user_is_admin doesn't update until after the mounted has already run,
      // but mounted needs to run when switching pages where the user_is_admin doesn't update
      this.updateArtifacts()
    },
    artifacts() {
      this.loading = false
      this.items = JSON.parse(JSON.stringify(this.artifacts))
    },
    options: {
      handler() {
        this.updateArtifacts()
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
