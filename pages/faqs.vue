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
            'The SEARCCH hub is a cybersecurity research artifact portal that builds and maintains a catalog of cybersecurity research artifacts housed in different places on the internet. The search engine enables researchers rapidly find relevant artifacts that will help with their own research through the use of cybersecurity domain-specific metadata about artifacts, including relationships to other related artifacts. The portal also facilitates a community around these artifacts, allowing researchers to share the location of their artifacts with the community and their experience with different artifacts.'
        },
        {
          q: 'What is an artifact?',
          a:
            'An artifact is a tangible output from scientific research. Artifacts include datasets, code, publications, experimental methodologies, etc. While SEARCCH does catalog publications, its emphasis is on non-publication artifacts that can be more difficult to find and on their relationships to existing publications.'
        },
	{
	  q: 'How do artifacts get into the hub?',
	  a: 'While SEARCCH is a catalog and search engine for artifacts stored in disparate locations across the Internet, it does not automatically crawl the Internet as do other search engines. Artifacts must be submitted to the hub for import. The SEARCCH team pre-populated the catalog with many artifacts. The working model, however, is for researchers to submit their own artifacts for cataloging. Researchers should first check to see if older artifacts are in the hub and then submit if they are not found.'
	},
        {
          q: 'How can I submit my data or code to the SEARCCH catalog?',
          a:
            'Use the SEARCCH importer service to create and import artifact metadata into the SEARCCH catalog. Please note that SEARCCH does not store the actual artifacts. Artifacts must be published on the internet with a valid URL to be imported into the hub.<br/><br/>SEARCCH supports assisted import and fully manual import.  Artifacts published on github, ACM digital library, ieeexplore, usenix web site publication, arxiv, paperswithcode, Zenodo, and generic git repositories reachable from https can be imported using the assisted import function (the default). The import assistant will scan artifacts in these repositories and automatically populate the import web form for user review. The user can accept the field contents as is or make any modifications desired. Artifacts located in other online locations such as on personal websites can be manually imported by the user by entering all the fields required. Entered data may be saved iteratively by clicking SAVE.<br/><br/>Please see the <a href="https://searcch.cyberexperimentation.org/best-practices">best practices and considerations for SEARCCH hub curation</a>, and then visit <a href="https://hub.cyberexperimentation.org/importer">https://hub.cyberexperimentation.org/importer</a> to start importing your work.'
        },
        {
          q: 'Do I have to share artifacts in order to use the hub?',
          a:
            'No. Researchers are free to browse the SEARCCH hub contents to find and access useful artifacts in support of their own research. It is our hope that, over time, researchers will generate artifacts that have broader use, make them freely available on the Internet, and index them in the hub so others can quickly find and reuse them.'
        },
	{
          q: 'Is there any cost to use the hub?',
          a:
            'There is no cost to use SEARCCH. It is open to all researchers in the cybersecurity community.'
        },
        {
          q: 'Do I need an account to use SEARCCH?',
          a:
            'A SEARCCH account is not required to browse the catalog and search for artifacts. Accounts are required to submit artifacts to the SEARCCH catalog and to rate and comment on existing artifacts.',
        },
        {
          q: 'How can I get an account on the SEARCCH hub?',
          a:
            'SEARCCH currently leverages single sign-on from GitHub.com. To sign in, click on “LOGIN” in the upper right hand corner of the SEARCCH hub and log in using your GitHub account. If you do not have a GitHub account, please visit <a href="https://github.com/signup" target="_blank" rel="noopener">https://github.com/signup</a> to sign up for an account.  SEARCCH may, in the future, use additional single sign-on sources.'
        },
        {
          q: 'I have code, data, and other artifacts that are all from the same research. How should I submit those to the hub?',
          a:
            'Generally, code and data are different logcial components and should be submitted separately. SEARCCH supports the ability to link related artifacts with a set of pre-defined relationships. Please see the <a href="https://searcch.cyberexperimentation.org/best-practices">best practices and considerations for SEARCCH hub curation</a> for more information.'
        },
        {
          q:
            'My artifact is already in the hub, but I didn’t put it there. How can I take ownership of it?',
          a:
            'This feature is not yet implemented in the hub. To take ownership, please contact the SEARCCH team using the feedback form.'
        },
        {
          q: 'The metadata for my artifact is incorrect. How can I update it?',
          a:
            'During the import process you can choose to edit any of the automatically generated metadata. Any changes you make will be saved and reflected in the artifact once you’ve published it.<br/><br/> If your artifact is already published and needs revision, please contact the SEARCCH team using the feedback form.'
        },
        {
          q: 'I need to withdraw my artifact. How can I do that?',
          a:
            'This feature is not yet implemented in the hub. If you need to withdraw your artifact, please contact the SEARCCH team using the feedback form.'
        },
        {
          q:
            'I found a tool in the Hub, but the tool doesn’t work or works incorrectly. How do I get help or submit feedback?',
          a:
            'Please do not submit feedback if you are having issues with using a tool. The SEARCCH team does not have direct experience with most of the artifacts that are in the system and will be unable to help you. <br/><br/> It is always best to first contact the author and try to work out any issues or misunderstandings. Use the SEARCCH entry to identify the tool’s owner/author, and contact the owner directly for tool support. If you still have issues with the tool after reaching out for support, you can try asking a question using the review tool and leaving your contact info there. <br/><br/>You can also share your experience with the tool by leaving a review of the artifact in the hub. Please try to be constructive, understanding that most tools are not products; they are typically shared for use “as is”. If the tool is not maintained, leaving a review that says so and giving the artifact a low rating can help others. We also encourage sharing positive experiences.'
        },
        {
          q:
            'I found a dataset in the Hub, but the data is wrong, malformed, or mislabeled. How do I get help or submit feedback?',
          a:
            'Please do not submit feedback if you are having issues with a dataset. The SEARCCH team does not have direct experience with most of the artifacts that are in the system and will be unable to help you. <br/><br/> It is always best to first contact the author and try to work out any issues or misunderstandings. Use the SEARCCH entry to identify the dataset’s owner/author, and contact the owner directly for support. If you still have issues with the dataset after reaching out for support, you can try asking a question using the review feature. Be sure to leave your contact information so folks can reach out to you. <br/><br/> You can also share your experience using the data by leaving a review of the artifact in the hub. Please try to be constructive in your comments. E.g., if you found a way to fix broken labeling and were then able to use the dataset, share how to do that. We also encourage sharing positive experiences.'
        },
        {
          q: 'How do I add a profile picture?',
          a:
            'Direct profile picture upload is not yet implemented in the hub. The hub automatically uses your GitHub avatar, if it is set. If GitHub does not return an avatar for your account, the hub queries gravatar.com for profile pictures associated with your registered SEARCCH email address. <br/><br/> If you would like your profile picture to show up in the SEARCCH hub, either set an avatar image on GitHub.com by visiting <a href="https://github.com/settings/profile" target="_blank" rel="noopener">https://github.com/settings/profile</a> or go to <a href="https://gravatar.com" target="_blank" rel="noopener">https://gravatar.com</a> and register (or add) the email address you used for SEARCCH.'
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
        }
      ]
    }
  },
  async mounted() {}
}
</script>
