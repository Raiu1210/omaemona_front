<template>
  <v-row justify="center" align-content="center">
    <v-col cols="10">
      <v-card class="mx-auto pa-5">
        <v-row class="pa-5">
          <v-list-item-avatar color="grey darken-3">
            <v-img
              class="elevation-6 pa-5"
              alt=""
              :src="iconImagePath(userInfo['icon_image_path'])"
            ></v-img>
          </v-list-item-avatar>
          <v-card-title class="display-1 text--primary">
            {{userInfo['name']}}
          </v-card-title>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-card-text>
              Monacoinアドレス : {{userInfo['address']}}
            </v-card-text>
          </v-col>
        </v-row>

        <v-row
          align="center"
          justify="end"
        >
          <v-btn
            class="ma-2"
            color="success"
            @click="showEditView()"
            v-if="editable"
          >
            編集
            <template v-slot:loader>
              <span class="custom-loader">
                <v-icon light>mdi-cached</v-icon>
              </span>
            </template>
          </v-btn>
        </v-row>
      </v-card>
    </v-col>

    <ProfileEdit
      :name="userInfo['name']"
      :icon_image_path="iconImagePath(userInfo['icon_image_path'])"
      @closeEditView="closeEditView"
      @initView="initView"
      v-if="editMode" />
  </v-row>
</template>


<script>
import ProfileEdit from '~/components/ProfileEdit'
import generateIconImagePath from '~/myModules/generateIconImagePath'

export default {
  props:{
    'userInfo': Object, require: true,
    'editable': Boolean, require: true
  },
  data() {
    return {
      editMode: false,
    }
  },
  methods: {
    showEditView() {
      this.editMode = true
    },
    iconImagePath(path) {
      return generateIconImagePath(path)
    },
    closeEditView() {
      this.editMode = false
    },
    initView() {
      this.$emit('initView')
    }
  },
  components: {
    ProfileEdit
  }
}
</script>
