<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" lg="4">
        <material-chart-card
          :data="dailySalesChart.data"
          :options="dailySalesChart.options"
          color="info"
          type="Line"
        >
          <h4 class="title font-weight-light">
            Artifact Activity
          </h4>

          <p class="category d-inline-flex font-weight-light">
            <v-icon color="primary" small>
              mdi-arrow-up
            </v-icon>
            <span class="primary--text">55%</span>
            &nbsp; increase in artifact interactions today
          </p>

          <template v-slot:actions>
            <v-icon class="mr-2" small>
              mdi-clock-outline
            </v-icon>
            <span class="caption grey--text font-weight-light">
              updated 4 minutes ago
            </span>
          </template>
        </material-chart-card>
      </v-col>
      <v-col cols="12" lg="4">
        <material-chart-card
          :data="emailsSubscriptionChart.data"
          :options="emailsSubscriptionChart.options"
          :responsive-options="emailsSubscriptionChart.responsiveOptions"
          color="red"
          type="Bar"
        >
          <h4 class="title font-weight-light">
            User Activity
          </h4>
          <p class="category d-inline-flex font-weight-light">
            Number of monthly searches
          </p>

          <template v-slot:actions>
            <v-icon class="mr-2" small>
              mdi-clock-outline
            </v-icon>
            <span class="caption grey--text font-weight-light">
              updated 10 minutes ago
            </span>
          </template>
        </material-chart-card>
      </v-col>

      <v-col cols="12" lg="4">
        <material-chart-card
          :data="dataCompletedTasksChart.data"
          :options="dataCompletedTasksChart.options"
          color="primary"
          type="Line"
        >
          <h3 class="title font-weight-light">
            Peak Activity
          </h3>
          <p class="category d-inline-flex font-weight-light">
            Daily Server Load Averages
          </p>

          <template v-slot:actions>
            <v-icon class="mr-2" small>
              mdi-clock-outline
            </v-icon>
            <span class="caption grey--text font-weight-light">
              updated 26 minutes ago
            </span>
          </template>
        </material-chart-card>
      </v-col>

      <v-col cols="12" sm="6" lg="3">
        <material-stats-card
          color="primary"
          icon="mdi-database"
          title="Total Artifacts"
          value="48,750"
          sub-icon="mdi-calendar"
          sub-text="Updated in Last 24 Hours"
        />
      </v-col>

      <v-col cols="12" sm="6" lg="3">
        <material-stats-card
          color="orange"
          icon="mdi-content-copy"
          title="Total API Calls"
          value="175,826"
          small-value="Calls"
          sub-icon="mdi-api"
          sub-icon-color="secondary"
          sub-text="Get Your Own API Key"
          sub-text-color="text-primary"
        />
      </v-col>

      <v-col cols="12" sm="6" lg="3">
        <material-stats-card
          color="red"
          icon="mdi-information-outline"
          title="Reported Issues"
          value="15"
          sub-icon="mdi-tag"
          sub-text="Tracked from Github"
        />
      </v-col>

      <v-col cols="12" sm="6" lg="3">
        <material-stats-card
          color="info"
          icon="mdi-twitter"
          title="SEARCCH Followers"
          value="+245"
          sub-icon="mdi-update"
          sub-text="Just Updated"
        />
      </v-col>

      <v-col cols="12" lg="6">
        <material-card
          color="orange"
          title="Artifact Stats"
          text="Artifacts with the Most Activity"
        >
          <v-data-table :headers="headers" :items="items" hide-default-footer />
        </material-card>
      </v-col>

      <v-col cols="12" lg="6">
        <material-card class="card-tabs" color="primary">
          <template v-slot:header>
            <v-tabs
              v-model="tabs"
              background-color="transparent"
              slider-color="white"
              class="ml-4"
            >
              <v-tab class="mr-3">
                <v-icon class="mr-2">
                  mdi-database
                </v-icon>
                Artifacts
              </v-tab>
              <v-tab class="mr-3">
                <v-icon class="mr-2">
                  mdi-comment
                </v-icon>
                Comments
              </v-tab>
              <v-tab>
                <v-icon class="mr-2">
                  mdi-heart
                </v-icon>
                Favorites
              </v-tab>
            </v-tabs>
          </template>

          <v-tabs-items v-model="tabs">
            <v-tab-item v-for="n in 3" :key="n">
              <v-list three-line class="py-0">
                <v-list-item @click="complete(0)">
                  <v-list-item-action class="align-self-center">
                    <v-checkbox :value="list[0]" color="primary" />
                  </v-list-item-action>

                  <v-list-item-title>
                    Machine Learning Dataset
                  </v-list-item-title>

                  <div class="d-flex">
                    <v-tooltip top content-class="top">
                      <template v-slot:activator="{ attrs, on }">
                        <v-btn
                          class="v-btn--simple"
                          color="primary"
                          icon
                          v-bind="attrs"
                          v-on="on"
                        >
                          <v-icon color="primary">
                            mdi-pencil
                          </v-icon>
                        </v-btn>
                      </template>
                      <span>Edit</span>
                    </v-tooltip>

                    <v-tooltip top content-class="top">
                      <template v-slot:activator="{ attrs, on }">
                        <v-btn
                          class="v-btn--simple"
                          color="danger"
                          icon
                          v-bind="attrs"
                          v-on="on"
                        >
                          <v-icon color="error">
                            mdi-close
                          </v-icon>
                        </v-btn>
                      </template>
                      <span>Close</span>
                    </v-tooltip>
                  </div>
                </v-list-item>

                <v-divider />

                <v-list-item @click="complete(1)">
                  <v-list-item-action class="align-self-center">
                    <v-checkbox :value="list[1]" color="primary" />
                  </v-list-item-action>

                  <v-list-item-title>
                    Machine Learning Dataset 2
                  </v-list-item-title>

                  <div class="d-flex">
                    <v-tooltip top content-class="top">
                      <template v-slot:activator="{ attrs, on }">
                        <v-btn
                          class="v-btn--simple"
                          color="primary"
                          icon
                          v-bind="attrs"
                          v-on="on"
                        >
                          <v-icon color="primary">
                            mdi-pencil
                          </v-icon>
                        </v-btn>
                      </template>
                      <span>Edit</span>
                    </v-tooltip>

                    <v-tooltip top content-class="top">
                      <template v-slot:activator="{ attrs, on }">
                        <v-btn
                          class="v-btn--simple"
                          color="danger"
                          icon
                          v-bind="attrs"
                          v-on="on"
                        >
                          <v-icon color="error">
                            mdi-close
                          </v-icon>
                        </v-btn>
                      </template>
                      <span>Close</span>
                    </v-tooltip>
                  </div>
                </v-list-item>

                <v-divider />

                <v-list-item @click="complete(2)">
                  <v-list-item-action class="align-self-center">
                    <v-checkbox :value="list[2]" color="primary" />
                  </v-list-item-action>

                  <v-list-item-title>
                    Machine Learning Paper
                  </v-list-item-title>

                  <div class="d-flex">
                    <v-tooltip top content-class="top">
                      <template v-slot:activator="{ attrs, on }">
                        <v-btn
                          class="v-btn--simple"
                          color="primary"
                          icon
                          v-bind="attrs"
                          v-on="on"
                        >
                          <v-icon color="primary">
                            mdi-pencil
                          </v-icon>
                        </v-btn>
                      </template>
                      <span>Edit</span>
                    </v-tooltip>

                    <v-tooltip top content-class="top">
                      <template v-slot:activator="{ attrs, on }">
                        <v-btn
                          class="v-btn--simple"
                          color="danger"
                          icon
                          v-bind="attrs"
                          v-on="on"
                        >
                          <v-icon color="error">
                            mdi-close
                          </v-icon>
                        </v-btn>
                      </template>
                      <span>Close</span>
                    </v-tooltip>
                  </div>
                </v-list-item>
              </v-list>
            </v-tab-item>
          </v-tabs-items>
        </material-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      dailySalesChart: {
        data: {
          labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
          series: [[12, 17, 7, 17, 23, 18, 38]]
        },
        options: {
          lineSmooth: this.$chartist.Interpolation.cardinal({
            tension: 0
          }),
          low: 0,
          high: 50, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
          chartPadding: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
          }
        }
      },
      dataCompletedTasksChart: {
        data: {
          labels: ['12p', '3p', '6p', '9p', '12a', '3a', '6a', '9a'],
          series: [[23, 75, 45, 30, 28, 24, 20, 19]]
        },
        options: {
          lineSmooth: this.$chartist.Interpolation.cardinal({
            tension: 0
          }),
          low: 0,
          high: 100, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
          chartPadding: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
          }
        }
      },
      emailsSubscriptionChart: {
        data: {
          labels: [
            'Ja',
            'Fe',
            'Ma',
            'Ap',
            'Mai',
            'Ju',
            'Jul',
            'Au',
            'Se',
            'Oc',
            'No',
            'De'
          ],
          series: [[542, 443, 320, 780, 553, 453, 326, 434, 568, 610, 756, 895]]
        },
        options: {
          axisX: {
            showGrid: false
          },
          low: 0,
          high: 1000,
          chartPadding: {
            top: 0,
            right: 5,
            bottom: 0,
            left: 0
          }
        },
        responsiveOptions: [
          [
            'screen and (max-width: 640px)',
            {
              seriesBarDistance: 5,
              axisX: {
                labelInterpolationFnc: function(value) {
                  return value[0]
                }
              }
            }
          ]
        ]
      },
      headers: [
        {
          sortable: false,
          text: 'Rank',
          value: 'id'
        },
        {
          sortable: false,
          text: 'Title',
          value: 'name'
        },
        {
          sortable: false,
          text: 'Rating',
          value: 'country',
          align: 'city'
        },
        {
          sortable: false,
          text: 'Views',
          value: 'city',
          align: 'right'
        },
        {
          sortable: false,
          text: 'Comments',
          value: 'salary',
          align: 'right'
        }
      ],
      items: [
        {
          id: 1,
          name: 'Cybersecuirty Paper',
          country: 5,
          city: '12,756',
          salary: '14'
        },
        {
          id: 2,
          name: 'Cybersecuirty Code',
          country: 4,
          city: '7,547',
          salary: '3'
        },
        {
          id: 3,
          name: 'Machine Learning Dataset',
          country: 4.5,
          city: '4,533',
          salary: '12'
        },
        {
          id: 4,
          name: 'Power Grid Paper',
          country: 5,
          city: '2,459',
          salary: '4'
        },
        {
          id: 5,
          name: 'Cybersecuirty Paper 2',
          country: 3,
          city: '564',
          salary: '1'
        },
      ],
      tabs: 0,
      list: {
        0: false,
        1: false,
        2: false
      }
    }
  },
  methods: {
    complete(index) {
      this.list[index] = !this.list[index]
    }
  }
}
</script>
