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
                Review Claim {{ claimid }}
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

          <div v-if="!isReject">
            <div>
              User
            </div>
            <div class="claimDetails">
              <template>
                <v-data-table
                  dense
                  :headers="userHeaders"
                  :items="userDetails"
                  item-key="id"
                  :hide-default-footer="true"
                ></v-data-table>
              </template>
            </div>
            <div>
              Artifact
            </div>
            <div class="claimDetails">
              <template>
                <v-data-table
                  dense
                  :headers="artifactHeaders"
                  :items="artifactDetails"
                  item-key="id"
                  :hide-default-footer="true"
                ></v-data-table>
              </template>
            </div>
              <div>
                  Justification
              </div>
              <div>
                  <div id="justificationTextarea">{{ justificationMessage }}</div>
              </div>
          </div>
          <div v-else>
              <div>
                  Rejection Reason
              </div>
              <div>
                <textarea v-model="rejectionMessage" placeholder="Enter your rejection reason" id="rejectionMessageTextArea"></textarea>
              </div>
          </div>
          
        </slot>
       </section>

      <footer class="modal-admin-footer">
        <div v-if="!isReject" class="review-btns"> 
          <v-btn
            color="secondary"
            class="claim-btn"
            @click="reviewRole(true)"
            aria-label="Close modal"
            >
            Approve
          </v-btn>
          <v-btn
            color="error"
            class="claim-btn"
            @click="openRejectDialog()"
            aria-label="Close modal"
            >
            Reject
          </v-btn>
        </div>
        <div v-else class="col-flex">
          <div class="footer-text row-flex">
           <div class="error-msg" v-if="isError">
                <img src="/images/exclamation-circle.svg"/>
                <span>{{ errorMessage }}</span>
           </div>
          </div>
          <div class="review-btns">
            <v-btn
            color="secondary"
            class="claim-btn"
            @click="closeRejectDialog()"
            aria-label="Close modal"
            >
            Back
          </v-btn>
          <v-btn
            color="error"
            class="claim-btn"
            @click="reviewRole(false)"
            aria-label="Close modal"
            >
            Reject
          </v-btn>
          </div>
        </div>
      </footer>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'AdminRoleReviewModal',
    props: ['claimid', 'justificationMessage', 'userDetails', 'artifactDetails', 'isReject', 'rejectionMessage'],
    methods: {
      close() {
        this.$emit('close');
      },
      openRejectDialog() {
        this.isReject = true;
        this.isError = false;
      },
      closeRejectDialog() {
        this.isReject = false;
        this.isError = false;
      },
      reviewRole(approve) {
        if(!approve) {
          this.rejectionMessage = this.rejectionMessage.trim();
          if(this.rejectionMessage == "") {
            this.isError = true;
            this.errorMessage = "Please enter a rejection reason";
            return;
          }
        }
        this.isError = false;
        this.$emit('closeAndReview', approve);
      }
    },
    data() {
        return {
            userHeaders: [
              {text: 'User ID', align: 'start', sortable: false, value: 'id'},
              {text: 'Name', sortable: false, value: 'name'},
              {text: 'Email', sortable: false, value: 'email'}
            ],
            artifactHeaders: [
              {text: 'Artifact ID', align: 'start', sortable: false, value: 'id'},
              {text: 'Artifact', sortable: false, value: 'name'}
            ],
            errorMessage: "",
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
    width: 500px;
  }

  .modal-header, .modal-admin-footer div {
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

  .modal-admin-footer .review-btns {
    padding: 15px;
    border-top: 1px solid #eeeeee;
    justify-content: space-around;
    flex-direction: row;
  }

  .modal-admin-footer .footer-text {
    margin-bottom: 20px;
    font-size: 12px;
    text-align: center;
    justify-content: space-around;
  }

  .col-flex {
    display: flex;
    flex-direction: column;
  }

  .row-flex {
    display: flex;
    flex-direction: row;
  }

  .modal-body {
    position: relative;
    padding: 15px;
  }

  .modal-body #justificationTextarea, .modal-body #rejectionMessageTextArea {
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

  .claim-btn {
    color: white;
    border-radius: 2px;
    width: 40%;
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
  }

  .error-msg img {
    margin-right: 5px;
    filter: invert(16%) sepia(74%) saturate(7346%) hue-rotate(356deg) brightness(118%) contrast(118%);
  }

  .claimDetails {
    padding-top: 10px;
    padding-bottom: 20px;
  }

</style>