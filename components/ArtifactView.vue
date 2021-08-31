<template>
  <v-container fill-height fluid>
    <v-row justify="center">
      <v-col cols="12" md="4" v-if="localuser">
        <LazyHydrate never>
          <material-card class="v-card-profile">
            <v-avatar
              slot="offset"
              class="mx-auto d-block elevation-6"
              size="130"
            >
              <v-img :src="profileImage(localuser.email)"></v-img>
            </v-avatar>
            <v-card-text class="text-center">
              <h6 class="overline mb-3">
                {{ localuser.name }}
              </h6>
              <h6
                class="overline mb-3"
                v-if="userAffiliation"
                v-for="affil in userAffiliation"
              >
                <div v-if="affil.org">{{ affil.org.name }}</div>
              </h6>

              <p class="font-weight-light">
                {{ localuser.email }}
              </p>
            </v-card-text>
          </material-card>
        </LazyHydrate>
      </v-col>

      <v-col cols="12" md="8">
        <material-card
          color="primary"
          title="Edit Profile"
          text="Complete your profile"
        >
          <v-form>
            <v-container class="py-0">
              <v-row v-if="localuser">
                <v-col cols="12" md="8">
                  <v-text-field
                    label="Name"
                    class="primary-input"
                    v-model="localuser.name"
                  />
                </v-col>

                <v-col cols="12" md="4">
                  <v-text-field
                    label="Email Address"
                    class="primary-input"
                    v-model="localuser.email"
                    readonly
                    disabled
                  />
                </v-col>

                <v-col cols="12" md="12">
                  <v-text-field
                    label="Website"
                    class="primary-input"
                    v-model="localuser.website"
                  />
                </v-col>
                <v-col cols="12" md="12">
                  <v-combobox
                    v-if="localuser"
                    label="Interests"
                    multiple
                    small-chips
                    deletable-chips
                    persistent-hint
                    :items="hardcodedInterests"
                    v-model="researchInterests"
                    hint="Select applicable items from the list or type in your own"
                    :search-input.sync="interestSearch"
                    return-object
                  >
                    <template v-slot:no-data>
                      <v-list-item>
                        <v-list-item-content>
                          <v-list-item-title>
                            No results matching "<strong>{{
                              interestSearch
                            }}</strong
                            >". Press <kbd>tab</kbd> to create a new one item.
                          </v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                    </template>
                  </v-combobox>
                </v-col>

                <v-col cols="12" md="12">
                  <v-combobox
                    label="Affiliation"
                    multiple
                    small-chips
                    deletable-chips
                    persistent-hint
                    :items="orgNames"
                    v-model="userAffiliation"
                    hint="Select applicable organization from the list or type in your own"
                    :search-input.sync="orgSearch"
                    item-text="org.name"
                    item-value="org.name"
                    return-object
                  >
                    <template v-slot:no-data>
                      <v-list-item>
                        <v-list-item-content>
                          <v-list-item-title>
                            No results matching "<strong>{{ orgSearch }}</strong
                            >". Press <kbd>tab</kbd> to create a new one
                          </v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                    </template>
                  </v-combobox>
                </v-col>

                <v-col cols="12" class="text-right">
                  <v-btn color="success" @click="updateProfile">
                    Update Profile
                  </v-btn>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </material-card>
      </v-col>
    </v-row>
  </v-container>
</template>
