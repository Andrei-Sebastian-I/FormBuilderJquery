<template>
    <div>
        <base-header class="header pb-8 pt-5 pt-lg-8 d-flex align-items-center"
                     style="min-height: 600px;  background-size: cover; background-position: center top;" :style="{ backgroundImage: `url('${photoURL}')` }">
            <!-- Mask -->
            <span class="mask bg-gradient-primary opacity-8"></span>
            <!-- Header container -->
            <div class="container-fluid d-flex align-items-center">
                <div class="row">
                    <div class="col-lg-12 col-md-10">
                        <h1 class="display-2 text-white">Hello, {{displayName}}</h1>
                    </div>
                </div>
            </div>
        </base-header>

        <div class="container-fluid mt--7">
            <div class="row justify-content-center">
                <div class="col-12 col-sm-6">
                    <card shadow type="secondary">
                        <div slot="header" class="bg-white border-0">
                            <div class="row align-items-center">
                                <div class="col-8">
                                    <h3 class="mb-0">My account</h3>
                                </div>
                            </div>
                        </div>
                        <template>
                            <form @submit.prevent>
                                <div class="pl-lg-4">
                                    <base-input alternative=""
                                                label="Display Name"
                                                placeholder="Username"
                                                input-classes="form-control-alternative"
                                                v-model="displayName"
                                    />
                                    <base-input alternative=""
                                                label="Email address"
                                                placeholder="jesse@example.com"
                                                input-classes="form-control-alternative"
                                                v-model="email"
                                    />
                                    <div class="form-group has-label">
                                        <label class="form-control-label" >Profile Picture</label>
                                        <div class="custom-file ">
                                            <input type="file" class="custom-file-input " id="files" name="file" ref="uploadInput" accept="image/*" :multiple="false" @change="detectFiles($event)">
                                            <label class="custom-file-label form-control-alternative" for="files">Select Image</label>
                                        </div>
                                    </div>

                                    <div class="form-group text-center">
                                        <div v-if="uploading && !uploadEnd" class="progress-wrapper">
                                            <div class="progress-info">
                                                <div class="progress-label">
                                                    <span >Status</span>
                                                </div>
                                                <div class="progress-percentage">
                                                    <span> {{progressUpload}}%</span>
                                                </div>
                                            </div>
                                            <div class="progress">
                                                <div class="progress-bar bg-success" role="progressbar" :aria-valuenow="progressUpload" :style="{'width': `${progressUpload}%`}"></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="form-group text-center">
                                        <base-button type="success" @click="update()">Update</base-button>
                                    </div>
                                </div>
                            </form>
                        </template>
                    </card>
                </div>
            </div>
        </div>
    </div>
</template>
<script>

  window.$ = window.jQuery = require('jquery');
  import firebase from '../config/db.js';
  import {firestorage} from '../config/db'
  import swal from 'sweetalert2'

  import { bus } from '../main'
  export default {
    name: 'user-profile',
      props: {
          pEmail: null,
          pDisplayName: null,
          pPhotoURL: null
      },
      data() {
          return {
              uploading: false,
              activeItem: 'dashboard',
              email: this.pEmail,
              displayName: this.pDisplayName,
              photoURL: this.pPhotoURL,

              progressUpload: 0,
              uploadTask: '',
              uploadEnd: false,
              downloadURL: '',
          }
      },
      created: function () {
          this.userData()
      },
      methods: {
          detectFiles(e) {
              let fileList = e.target.files || e.dataTransfer.files
              Array.from(Array(fileList.length).keys()).map(x => {
                  this.upload(fileList[x])
              })
          },
          logout: function () {
              firebase.auth().signOut().then(() => {
                  this.$router.replace('login')
              })
          },
          update: function () {

              var user = firebase.auth().currentUser;

              if (this.uploading == true) {
                  user.updateProfile({
                      displayName: this.displayName,
                      email: this.email,
                      photoURL: this.downloadURL
                  })
              } else {
                  user.updateProfile({
                      displayName: this.displayName,
                      email: this.email
                  })
              }


              swal.fire({
                  type: "success",
                  icon: "success",
                  title: "Success!",
                  text: "Your profile has been saved",
                  showConfirmButton: false,
                  timer: 1500
              })

              this.$router.push({name: 'dashboard'})

          },
          upload(file) {
              this.fileName = file.name
              this.uploading = true
              this.uploadTask = firestorage.ref('UserProfile/' + file.name).put(file)
          },
          userData: function () {
              var user = firebase.auth().currentUser;
              var name, email, photoUrl, uid;

              if (user != null) {
                  name = user.displayName;
                  email = user.email;
                  photoUrl = user.photoURL;
              }
              if (this.email == null) {
                  this.email = email;
                  this.displayName = name;
                  this.photoURL = photoUrl;
                  $('#backgroundImage').css('background-image', 'url("' + this.photoURL + '")');
              }


          }
      },
      watch: {
          uploadTask: function () {
              this.uploadTask.on('state_changed', sp => {
                      this.progressUpload = Math.floor(sp.bytesTransferred / sp.totalBytes * 100)
                  },
                  null,
                  () => {
                      this.uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
                          this.uploadEnd = true
                          this.downloadURL = downloadURL
                          this.$emit('downloadURL', downloadURL)
                      })
                  })
          }
      }
  };
</script>
<style></style>
