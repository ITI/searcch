<template>
  <div>
    <v-card tile class="mx-auto overflow-hidden" elevation="3">
      <v-row class="px-3">
        <v-col cols="10">
          <v-card-title class="align-start">
            <div>
              <span class="headline">Importer {{ importer.id }} ({{ importer.url }})</span>
            </div>
          </v-card-title>
          <v-card-text>
            <table>
              <tr>
                <td>Admin Status</td>
                <td>{{ importer.admin_status }} ({{ this.$moment.utc(importer.admin_status_time).fromNow() }})</td>
              </tr>
              <tr>
                <td>Status</td>
                <td>{{ importer.status }} ({{ this.$moment.utc(importer.status_time).fromNow() }})</td>
              </tr>
              <tr>
                <td>Max Tasks</td><td>{{ importer.max_tasks }}</td>
              </tr>
              <tr>
                <td>Scheduled Tasks</td><td>{{ importer.scheduled.length }}</td>
              </tr>
            </table>

            <v-data-table v-if="importer.scheduled.length"
              :headers="scheduled_headers"
              :items="scheduled_items"
              :items-per-page="100">
              <template v-slot:item.schedule_time="{ item }">
                {{ $moment.utc(item.schedule_time).fromNow() }}
              </template>
            </v-data-table>
          </v-card-text>
        </v-col>
      </v-row>
      <v-card-actions>
        <v-btn v-if="importer.admin_status === 'enabled'" text @click="disable()">
          Disable
        </v-btn>
        <v-btn v-if="importer.admin_status === 'disabled'" text @click="enable()">
          Enable
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  props: {
    importer: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      scheduled_headers: [
        {
          text: "Scheduled At",
          align: "start",
          sortable: true,
          value: "schedule_time"
        },
        { text: "Import ID", value: "artifact_import_id" },
        //{ text: "URL", value: "artifact_import.url" },
        { text: "Owner", value: "artifact_import.owner.person.email" },
        { text: "Status", value: "artifact_import.status" },
        { text: "Phase", value: "artifact_import.phase" },
        { text: "Artifact ID", value: "artifact_import.artifact_id" }
      ],
      scheduled_items: this.importer ? this.importer.scheduled : []
    }
  },
  methods: {
    async disable() {
      let response = await this.$importerEndpoint.put(
        this.importer.id, { admin_status: "disabled" })
    },
    async enable() {
      let response = await this.$importerEndpoint.put(
        this.importer.id, { admin_status: "enabled" })
    }
  }
}
</script>

<style scoped>
.v-card__title {
  word-break: normal;
}
</style>
