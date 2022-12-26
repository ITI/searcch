<template>
    <div class="modal-backdrop">
      <div class="modal"
          role="dialog"
          aria-labelledby="modalTitle"
          aria-describedby="modalDescription">
  
        <header class="modal-header"
          id="modalTitle">
  
          <slot name="header">
              <div id="heading">
                  DUA Review
              </div>
          </slot>
          <button
            type="button"
            class="btn-close"
            @click="close()"
            aria-label="Close modal">
            &times;
          </button>
        </header>
  
        <section class="modal-body"
          id="modalDescription">
  
          <slot name="body">
            <!-- <div class="email-info">
              <div v-if="email">
                Ownership Claim Request updates will be sent to {{ email }} listed in your profile.
              </div>
              <div v-else>
                Please add an email address to your profile to receive updates on this claim.
              </div>
            </div> -->
              <!-- <div>
                  {{ isDisabled ? "Justification" : "Please justify your claim in the textbox below" }}
              </div>
              <div>
                  <textarea v-model="justificationMessage" placeholder="Enter your justification" id="justificationTextarea" :disabled="isDisabled"></textarea>
              </div> -->
              <div class="dua-content">
                <div v-html="duaHTML"></div>
              </div>
          </slot>
         </section>
  
        <footer class="modal-footer-claimrole">
          <div class="footer-text">
             <!-- {{ isDisabled ? "Email sent to " : "An email will be sent to " }} SEARCCH admins for approval
             <div class="error-msg" v-if="isError">
                  <img src="/images/information-outline.svg"/>
                  <span>{{ errorMessage }}</span>
             </div> -->
             Review the DUA and click the below button to sign and submit the DUA
          </div>
          <v-btn
            color="secondary"
            class="claim-btn"
            @click="submitRequest"
            aria-label="Close modal"
            :disabled="isDisabled"
          >
            Sign and Submit DUA
          </v-btn>
        </footer>
      </div>
    </div>
  </template>
  
  <script>
    export default {
      name: 'DUAReviewModal',
      props: ['duaHTML'],
      methods: {
        close() {
          this.$emit('close');
        },
        submitRequest() {
          this.$emit('submitRequest');
        }
        // async claimRole() {
        //   if(this.isJustificationMessageValid()) {
        //       this.isError = false;
        //       try {
        //         await this.$artifactClaimEndpoint.post(this.artifact_group_id, { message: this.justificationMessage })
        //         this.close(`Claim request successfully sent`);
        //       } catch(ex) {
        //         this.close(`An error occured in sending the claim request`)
        //       }
        //   } else {
        //       this.isError = true;
        //       this.errorMessage = "Kindly provide a valid justification";
        //   }
        // },
        // isJustificationMessageValid() {
        //   this.justificationMessage = this.justificationMessage.trim();
        //   return this.justificationMessage!="";
        // }
      },
      data() {
          return {
              isError: false
          }
      }
    };
  </script>
  
  <style>
    .modal-backdrop {
      position: fixed;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      background-color: rgba(0, 0, 0, 0.3);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 5
    }
  
    .modal {
      background: #FFFFFF;
      box-shadow: 2px 2px 20px 1px;
      overflow-x: auto;
      display: flex;
      flex-direction: column;
      width: 80%;
    }
  
    .modal-header, .modal-footer-claimrole {
      display: flex;
    }
  
    .modal-header {
      position: relative;
      border-bottom: 1px solid #eeeeee;
      font-weight: bold;
      justify-content: space-between;
      align-items: center;
    }
  
    .modal-header #heading {
      margin-left: 15px;
    }
  
    .modal-footer-claimrole {
      padding: 15px;
      border-top: 1px solid #eeeeee;
      flex-direction: column;
      justify-content: flex-end;
    }
  
    .modal-footer-claimrole .footer-text {
      margin-bottom: 20px;
      font-size: 12px;
      text-align: center;
    }
  
    .modal-body {
      position: relative;
      padding: 15px;
    }
  
    .modal-body #justificationTextarea {
      border: solid rgb(157, 157, 157);
      border-radius: 5px;
      padding: 10px;
      width: 100%;
      height: 200px;
      resize: none;
      margin: 20px 0px 10px 0px;
      font-size: 15px;
    }
  
    .btn-close {
      border: none;
      font-size: 20px;
      padding: 10px;
      cursor: pointer;
      font-weight: bold;
      background: transparent;
    }
  
    .modal-footer-claimrole .claim-btn {
      color: white;
      border-radius: 2px;
      width: 100%;
    }
  
    .modal-fade-enter, .modal-fade-leave-to {
      opacity: 0;
    }
  
    .modal-fade-enter-active, .modal-fade-leave-active {
      transition: opacity .5s ease;
    }
  
    .error-msg {
      display: flex;
      align-items: center;
      color: red;
      margin-top: 20px;
      justify-content: center;
      width: 100%;
    }
  
    .error-msg img {
      margin-right: 5px;
      max-height: 20px;
      filter: invert(16%) sepia(74%) saturate(7346%) hue-rotate(356deg) brightness(118%) contrast(118%);
    }
  
    .email-info {
      margin-bottom: 10px;
      font-weight: normal;
      background: #fff0bb;
      padding: 10px;
      border-radius: 5px;
      font-size: 13px;
  }

  .dua-content {
    max-height: 500px;
    overflow-y: auto;
  }
  
  </style>