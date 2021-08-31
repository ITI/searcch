<template>
  <v-layout column justify-center align-center>
    <v-flex xs12 sm8 md6>
      <LazyHydrate never>
        <div>
          <div class="text-center">
            <logo />
          </div>
          <v-card class="mx-auto" max-width="800">
            <v-card-title class="primary white--text">
              <span class="text-h6">Frequently Asked Questions</span>
            </v-card-title>
            <v-card-text class="py-0">
              <v-timeline align-top dense>
                <v-timeline-item
                  v-for="(faq, index) in faqs"
                  :key="`faq${index}`"
                  small
                  fill-dot
                  icon="mdi-help"
                >
                  <v-card color="primary" dark>
                    <v-card-title class="text-h6" v-text="faq.q">
                      Lorem Ipsum Dolor
                    </v-card-title>
                    <v-card-text class="white text--primary" v-html="faq.a">
                    </v-card-text>
                  </v-card>
                </v-timeline-item>
              </v-timeline>
            </v-card-text>
          </v-card>
        </div>
      </LazyHydrate>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  components: {
    Logo: () => import('@/components/Logo'),
    LazyHydrate: () => import('vue-lazy-hydration')
  },
  data() {
    return {
      faqs: [
        {
          q: 'What is the SEARCCH Hub?',
          a:
            'The SEARCCH hub is a cybersecurity research artifact sharing portal. It maintains an index of cybersecurity research artifacts, such as data sets and code, that are distributed across the internet and facilitates a community around these artifacts. It allows researchers to share the location of their artifacts with the community and their experience with certain artifacts. It helps researchers rapidly find relevant artifacts that will help with their ongoing research efforts.'
        },
        {
          q: 'How is SEARCCH funded?',
          a:
            'SEARCCH is funded under cooperative grants from the National Science Foundation. Grant numbers are CNS-1925773, CNS-1925616, CNS-1925588, and CNS-1925564.'
        },
        {
          q: 'Who is behind SEARCCH?',
          a:
            'SEARCCH is being developed under a collaboration between the University of Southern California Information Sciences Institute (USC-ISI), the University of Utah (Utah), the University of Illinois Urbana-Champaign (UIUC), and SRI International (SRI).'
        },
        {
          q: 'Is there any cost to use the hub?',
          a:
            'There is no cost to use the SEARCCH Hub. It is open to all researchers in the cybersecurity community.'
        },
        {
          q: 'What is an artifact?',
          a:
            'An artifact is a tangible output from scientific research. Artifacts include publications, datasets, code, etc. The SEARCCH project focuses less on publications, which can be found through a variety of existing sources, and more on datasets, code, testbeds, and the like, which can be more difficult to find.'
        },
        {
          q: 'How can I get an account on the SEARCCH hub?',
          a:
            'SEARCCH currently leverages single sign-on from GitHub.com. Anyone who has a GitHub account can use the SEARCCH hub right now. If you do not have a GitHub account, please visit <a href="https://github.com/signup" target="_blank" rel="noopener">https://github.com/signup</a> to sign up for an account.  Click on “LOGIN” in the upper right hand corner of the SEARCCH hub to log in using your GitHub account.'
        },
        {
          q: 'Do I have to share data in order to use the hub?',
          a:
            'No. Researchers are free to browse the SEARCCH hub contents to find and access useful artifacts in support of their own research. It is our hope that, over time, researchers will generate artifacts that have broader use, make them freely available on the Internet, and index them in the hub so others can quickly find and reuse them.'
        },
        {
          q: 'How can I submit my data or code to the hub?',
          a:
            'Use the SEARCCH importer service to import artifacts into the SEARCCH hub. Please note that SEARCCH is a database of artifact metadata and does not store artifacts for you. Artifacts must be published on the internet with a valid URL to be imported into the hub. SEARCCH supports assisted import and fully manual import.  Artifacts published on github, ACM digital library, ieeexplore, usenix web site publication, arxiv, paperswithcode, Zenodo, and generic git repos reachable from https can be imported using the assisted import function (the default). The import assistant will scan artifacts in these repositories and automatically populate the import web form for user review. The user can accept the field contents as is or make any modifications desired. Artifacts located in other online locations such as on personal websites can be manually imported by the user entering all the fields required. Entered data may be saved iteratively by clicking SAVE. Please see the <a href="https://searcch.cyberexperimentation.org/best-practices">best practices and considerations for SEARCCH hub curation</a> and then visit <a href="https://hub.cyberexperimentation.org/importer">https://hub.cyberexperimentation.org/importer</a> to start importing your work.'
        },
        {
          q: 'I have code, data, and other artifacts that are all from the same research. How should I submit those to the hub?',
          a:
            'Generally, code and data should be packaged and submitted separately into logical components. The hub supports the ability to link artifacts that are related. Please see the <a href="https://searcch.cyberexperimentation.org/best-practices">best practices and considerations for SEARCCH hub curation</a> for more information.'
        },
        {
          q: 'How do I add multiple authors for my artifact?',
          a: 'When importing an artifact, click on the + under Roles and enter the author organization, name and email address. Click "Add". Repeat for each author.'
        }.
        {
          q: 'My artifact is already in the hub, but I didn’t put it there. How can I take ownership of it?',
          a:
            'This feature is not yet implemented in the hub. To take ownership, please use the feedback feature to initiate discussion with the SEARCCH team.'
        },
        {
          q: 'The metadata for my artifact is incorrect. How can I update it?',
          a:
            'During the import process you can choose to edit any of the automatically generated metadata. Any changes you make will be saved and reflected in the artifact once you’ve published it.<br/><br/> If your artifact is already published, please use the feedback feature to initiate discussion with the SEARCCH team.'
        },
        {
          q: 'I need to withdraw my artifact. How can I do that?',
          a:
            'This feature is not yet implemented in the hub. If you need to withdraw your artifact, please use the feedback feature to initiate discussion with the SEARCCH team.'
        },
        {
          q:
            'I found a tool in the Hub, but the tool doesn’t work or works incorrectly. How do I get help or submit feedback?',
          a:
            'Please do not submit feedback to the hub if you are having issues with using a tool. The SEARCCH team does not have direct experience with most of the artifacts that are in the system and will be unable to help you. <br/><br/> It is always best to first contact the author and try to work out any issues or misunderstandings. Use the SEARCCH entry to identify the tool’s owner/author, and contact the owner directly for tool support. If you still have issues with the tool after reaching out for support, you can try asking a question using the review tool and leaving your contact info there. <br/><br/>You can also share your experience with the tool by leaving a review of the artifact in the hub. Please try to be constructive, understanding that most tools are not products; they are typically shared for use “as is”. If the tool is not maintained, leaving a review that says so and giving the artifact a low rating can help others. We also encourage sharing positive experiences.'
        },
        {
          q:
            'I found a dataset in the Hub, but the data is wrong, malformed, or mislabeled. How do I get help or submit feedback?',
          a:
            'Please do not submit feedback to the hub if you are having issues with a dataset. The SEARCCH team does not have direct experience with most of the artifacts that are in the system and will be unable to help you. <br/><br/> It is always best to first contact the author and try to work out any issues or misunderstandings. Use the SEARCCH entry to identify the dataset’s owner/author, and contact the owner directly for support. If you still have issues with the dataset after reaching out for support, you can try asking a question using the review feature. Be sure to leave your contact information so folks can reach out to you. <br/><br/> You can also share your experience using the data by leaving a review of the artifact in the hub. Please try to be constructive in your comments. E.g., if you found a way to fix broken labeling and were then able to use the dataset, share how to do that. We also encourage sharing positive experiences.'
        },
        {
          q: 'How do I add a profile picture?',
          a:
            'Direct profile picture upload is not yet implemented in the hub. The hub automatically uses your GitHub avatar, if it is set. If GitHub does not return an avatar for your account, the hub queries gravatar.com for profile pictures associated with your registered SEARCCH email address. <br/><br/> If you would like your profile picture to show up in the SEARCCH hub, either set an avatar image on GitHub.com by visiting <a href="https://github.com/settings/profile" target="_blank" rel="noopener">https://github.com/settings/profile</a> or go to <a href="https://gravatar.com" target="_blank" rel="noopener">https://gravatar.com</a> and register (or add) the email address you used for SEARCCH.'
        }
      ]
    }
  },
  async mounted() {}
}
</script>
