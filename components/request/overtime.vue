<template>
  <section-block title="OverTime Request">
    <div>
      <section class="group-filter">
     
        <el-input
        :disabled="$authInfo.role() == 4"
          v-model="fullnameSearch"
          placeholder="Account"
          class="input-search"
          clearable
        />

        <el-input
        :disabled="$authInfo.role() == 4"
          v-model="projectSearch"
          placeholder="Project"
          class="input-search"
          clearable
        />
        <el-date-picker
          v-model="startDate"
          type="date"
          placeholder="Start date"
          format="dd-MM-yyyy"
          value-format="yyyy-MM-dd"
          class="date-picker"
        />

        <el-date-picker
          v-model="endDate"
          type="date"
          placeholder="End date"
          format="dd-MM-yyyy"
          value-format="yyyy-MM-dd"
          class="date-picker"
        />

        <el-button
          class="button-delete-multi"
          type="primary"
          @click="searchOtRequest()"
        >
          <i class="el-icon-search"></i>
        </el-button>

        <el-button
          class="button-delete-multi"
          type="primary"
          @click="getListOTRequest(page, size)"
        >
          <i class="el-icon-refresh"></i>
        </el-button>

        <div v-if="$authInfo.role() !== 3" class="gr-button">
          <el-button class="add-new" @click="handleCreate()">
            {{ $t('Add request') }}
          </el-button>
        </div>
      </section>

      <el-table
        ref="multipleTable"
        :data="tableData"
        border
        style="width: 100%"
        class="table-serenade"
        @selection-change="handleSelectionChange"
      >
        <!-- <el-table-column
          :selectable="canSelectRow"
          type="selection"
          class-name="text-center"
          width="60px"
        /> -->
        <!-- <el-table-column class-name="text-center" :label="$t('Date')">
          <template slot-scope="{ row }">
            {{
              row.created_at ? showDateTime(row.update_at, 'DD/MM/YYYY') : ''
            }}
          </template>
        </el-table-column> -->
        <el-table-column
          class-name="text-left"
          prop="title"
          sortable
          :label="$t('Title')"
        />
        <el-table-column
          class-name="text-left"
          prop="account_sent"
          :label="$t('Account')"
        />
        <el-table-column
          class-name="text-left"
          prop="project"
          :label="$t('Project')"
        />
        <el-table-column
          class-name="text-center"
          prop="date_ot"
          :label="$t('OverTime Date')"
        >
          <template slot-scope="{ row }">
            {{ row.date_ot ? showDateTime(row.date_ot, 'DD/MM/YYYY') : '' }}
          </template>
        </el-table-column>

        <el-table-column
          class-name="text-left"
          prop="status"
          sortable
          :label="$t('Status')"
        />

        <!-- <el-table-column
          class-name="text-left"
          prop="response_msg"
          :label="$t('Message')"
        /> -->
        <el-table-column
          class-name="text-center"
          prop="action"
          :label="$t('Action')"
          width="110px"
        >
          <template slot-scope="scope">
            <el-button
              v-if="
                scope.row.status == 'Pending' &&
                scope.row.account_sent !== user.username
              "
              class="button-action"
              type="warning"
              @click="handleAccept(scope.$index, scope.row)"
            >
              <i class="el-icon-check"></i>
            </el-button>
            <el-button
              v-if="
                scope.row.status == 'Pending' &&
                scope.row.account_sent !== user.username
              "
              class="button-action"
              type="danger"
              @click="handleReject(scope.$index, scope.row)"
            >
              <i class="el-icon-close"></i>
            </el-button>
            <el-button
              v-if="
                $authInfo.role() !== 3 &&
                scope.row.status == 'Pending' &&
                scope.row.account_sent === user.username
              "
              class="button-action"
              type="warning"
              @click="handleUpdate(scope.$index, scope.row)"
            >
              <i class="el-icon-edit-outline"></i>
            </el-button>

            <el-button
              v-if="
                $authInfo.role() !== 3 &&
                scope.row.status == 'Pending' &&
                scope.row.account_sent === user.username
              "
              class="button-action"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
            >
              <i class="el-icon-delete"></i>
            </el-button>

            <el-button
              class="button-action"
              type="primary"
              @click="handleInfo(scope.$index, scope.row)"
            >
              <i class="el-icon-user"></i>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <section>
        <el-dialog
          :title="titlePopup"
          :visible.sync="dialogFormWithInput"
          width="50%"
        >
          <div v-if="dialogMode === 'detail'">
            <div class="form-group row">
              <label class="col-sm-3 col-form-label">Title</label>
              <div class="col-sm-8 data-detail">
                {{ request.title }}
              </div>
            </div>
            <div class="form-group row">
              <label class="col-sm-3 col-form-label">Account</label>
              <div class="col-sm-8 data-detail">
                {{ request.account_sent }}
              </div>
            </div>
            <div class="form-group row">
              <label class="col-sm-3 col-form-label">Project</label>
              <div class="col-sm-8 data-detail">
                {{ request.project }}
              </div>
            </div>
            <div class="form-group row">
              <label class="col-sm-3 col-form-label">OverTime date</label>
              <div class="col-sm-8 data-detail">
                {{
                  request.date_ot
                    ? showDateTime(request.date_ot, 'DD/MM/YYYY')
                    : ''
                }}
              </div>
            </div>
            <!-- <div class="form-group row">
              <label class="col-sm-3 col-form-label">List Member</label>
              <div class="col-sm-8 data-detail">
                {{ request.listUsernameWithOt }}
              </div>
            </div> -->
            <div class="form-group row">
              <label class="col-sm-3 col-form-label">Status</label>
              <div class="col-sm-8 data-detail">
                {{ request.status }}
              </div>
            </div>
            <div class="form-group row">
              <label class="col-sm-3 col-form-label">List member</label>
              <div class="col-sm-8 data-detail">
                <div
                  v-for="username in request.listUsernameWithOt"
                  :key="username"
                >
                  {{ username + '' }}
                </div>
              </div>
            </div>
            <div class="form-group row">
              <label class="col-sm-3 col-form-label">Message</label>
              <div class="col-sm-8 data-detail">
                {{ request.response_msg }}
              </div>
            </div>
          </div>

          <el-form v-else ref="dataForm" :rules="rules" :model="request">
            <el-row :gutter="20">
              <el-col :span="24">
                <div class="form-group row">
                  <label class="col-sm-1 col-form-label titleForm">Title</label>
                  <el-form-item prop="title" class="col-sm-9">
                    <el-input v-model="request.title" />
                  </el-form-item>
                </div>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <div class="form-group row">
                  <label class="col-sm-3 col-form-label">Fullname</label>
                  <el-form-item prop="full_name" class="col-sm-6">
                    <el-input v-model="user.full_name" disabled />
                  </el-form-item>
                </div>

                <div class="form-group row">
                  <label class="col-sm-3 col-form-label">
                    Project <span>*</span>
                  </label>
                  <el-form-item prop="project" class="col-sm-6">
                    <el-select
                      v-model="request.project"
                      placeholder="Select project"
                      class="itemSelec"
                    >
                      <el-option
                        v-for="item in projects"
                        :key="item.value"
                        :label="item.label"
                        :value="item.label"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                </div>
                <div class="form-group row">
                  <label class="col-sm-3 col-form-label">List Member</label>
                  <el-form-item prop="checkedMembers" class="col-sm-6">
                    <el-checkbox-group
                      v-model="addMemberToGroup.checkedMembers"
                      class="list-member"
                    >
                      <el-checkbox
                        v-for="(member, index) in members"
                        :key="index"
                        :label="member.username"
                      >
                        {{ member.username }}
                      </el-checkbox>
                    </el-checkbox-group>
                  </el-form-item>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="form-group row">
                  <label class="col-sm-4 col-form-label">Group </label>
                  <el-form-item prop="groupCompanyName" class="col-sm-6">
                    <el-input v-model="user.groupCompanyName" disabled />
                  </el-form-item>
                </div>
                <div class="form-group row">
                  <label class="col-sm-4 col-form-label">
                    Receiver <span>*</span>
                  </label>
                  <el-form-item prop="account_receiver" class="col-sm-6">
                    <el-select
                      v-model="request.account_receiver"
                      placeholder="Account receiver"
                      class="itemSelec"
                    >
                      <el-option
                        v-for="(item, index) in account_receivers"
                        :key="index"
                        :label="item.username"
                        :value="item.username"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                </div>
                     <div class="form-group row">
                  <label class="col-sm-4 col-form-label">OT Date <span>*</span></label>
                  <el-form-item prop="date_ot" class="col-sm-6">
                    <el-date-picker
                      v-model="request.date_ot"
                      type="date"
                      placeholder="Pick a day"
                      format="dd-MM-yyyy"
                      value-format="yyyy-MM-dd"
                       class="itemSelec"
                    />
                  </el-form-item>
                </div>
              </el-col>
            </el-row>
          </el-form>
          <hr class="mb-0" />
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogFormWithInput = false">Close</el-button>
            <el-button
              v-if="dialogMode !== 'detail'"
              type="primary"
              @click="dialogMode === 'create' ? createData() : updateData()"
            >
              Submit
            </el-button>
          </span>
        </el-dialog>
      </section>

      <section>
        <el-dialog
          title="Message request"
          :visible.sync="showFormMessage"
          width="50%"
        >
          <el-form ref="dataFormMessage" :rules="rules" :model="message">
            <el-form-item label="Reason">
              <el-input
                v-model="message.response_msg"
                type="textarea"
              ></el-input>
            </el-form-item>
          </el-form>

          <hr class="mb-0" />
          <span slot="footer" class="dialog-footer">
            <el-button @click="showFormMessage = false">Close</el-button>
            <el-button type="primary" @click="rejectItem()"> Submit </el-button>
          </span>
        </el-dialog>
      </section>

      <div class="d-flex pagination">
        <SimplePagination
          v-if="!isEmpty(tableData) && totalPages > 1"
          v-model="page"
          :change-page="changePageData"
          :total-page="totalPages"
        />
      </div>
    </div>
  </section-block>
</template>

<style lang="scss" scoped>
.el-select {
  width: 50%;
  padding-right: 0;
}
.el-date-editor {
  width: 50%;
}
.titleForm {
  margin-right: 31px;
}
.data-detail {
  line-height: 35px;
}
.itemSelec {
  width: 100%;
}
.content {
  margin: 70px 32px 20px;
  .title {
    margin: 30px 0 40px;
  }
}
.tabel-wrapper {
  width: 1200px;
  margin: 50px auto;
}
.el-table tr th {
  background-color: #f5f7fa;
}

.demo-input-label {
  display: inline-block;
  width: 45px;
  text-align: center;
}
label {
  text-align: center;
}
.demo-input-suffix .el-input {
  width: 80px;
}

.el-form-item__label {
  text-align: left;
}

.line {
  margin-top: -30px;
}

.group-filter {
  margin-bottom: 20px;
  .gr-button {
    float: right;
  }
  .searchAll {
    display: flex;
    margin-bottom: -40px;
    .gr-search {
      margin-right: 3px;
    }
    .gr-searchDate {
      margin-left: 3px;
    }
  }
}
.button-action {
  padding: 5px;
  margin-left: 0;
}
.pagination {
  margin-top: 30px;
}
.input-search {
  width: 150px;
}

.date-picker {
  width: 150px;
}
@media screen and (max-width: 1370px) {
  .input-search {
    width: 120px;
  }
  .date-picker {
    width: 140px;
  }
}
.list-member > .el-checkbox {
  display: flex;
  margin: 12px 0;
  align-items: center;
}
</style>

<script>
import SimplePagination from '~/components/pagination/SimplePagination'
import validate from '@/helpers/custom-rules-validate'

export default {
  components: { SimplePagination },
  mixins: [validate],
  layout: 'admin',
  middleware: 'auth',
  data() {
    return {
      tableData: [],
      projectSearch: '',
      fullnameSearch: '',
      startDate: '',
      endDate: '',
      dialogFormWithInput: false,
      showFormMessage: false,
      titlePopup: '',
      dialogMode: '',
      groups: [],
      projects: [],
      listUsernameWithOt: [],
      account_receivers: [],
      members: [],
      addMemberToGroup: {
        checkedMembers: [],
      },
      message: {
        response_msg: '',
      },
      request: {
        id: '',
        title: '',
        account_sent: '',
        account_receiver: '',
        project: '',
        content: '',
        date_ot: '',
      },
      user: {
        account_sent: '',
        account_receiver: '',
        groupCompany: '',
      },
      rules: {
        title: this.validateRequired('title'),
        account_sent: this.validateRequired('account_sent'),
        account_receiver: this.validateRequired('account_receiver'),
        project: this.validateRequired('project'),
        date_ot: this.validateRequired('date_ot'),
      },
      rowSelected: null,
      multipleSelection: [],
      totalPages: 1,
      page: 1,
      size: undefined,
    }
  },
  created() {
    const query = this.$route.query
    if (query.page) {
      this.page = query.page
    }
    if (query.size) {
      this.size = query.size
    }
    this.getListOTRequest(this.page, this.size)
    this.listDataOtRequest()
    this.getUserInfo()
  },
  methods: {
    canSelectRow(row) {
      return row.account_sent === this.user.username && row.status == 'Pending'
    },
    async getListOTRequest(page, size) {
      let params = {
        page: page - 1,
        size: size,
      }
      await this.$services.request.getListOTRequest(
        params,
        (response) => {
          this.tableData = response.data
          this.totalPages = response.totalPages
        },
        (err) => {
          this.notifyError(err.error.error)
        }
      )
    },
    async listDataOtRequest() {
      await this.$services.request.listDataOtRequest(
        (response) => {
          this.projects = response.listAllProjectOfGroup.map((item) => {
            return { label: item.name, value: Number(item.project_id) }
          })
          this.account_receivers = response.listReceiver
          this.members = response.listAllMemberOfProject
        },
        (err) => this.notifyError(err.error.error)
      )
    },
    async getUserInfo() {
      await this.$services.common.getUserInfo(
        (response) => {
          this.user = response.data
        },
        (err) => this.notifyError(err.error.error)
      )
    },
    async searchOtRequest() {
      this.startLoading()
      await this.$services.request.searchOtRequest(
        {
          userName: this.fullnameSearch,
          projectName: this.projectSearch,
          startDate: this.startDate,
          endDate: this.endDate,
        },
        (response) => {
          if (response.data && response.data.length > 0) {
            this.tableData = response.data
            this.totalPages = response.totalPages
          } else {
            this.tableData = []
            this.totalPages = 0
          }
          this.endLoading()
        },
        (err) => {
          this.tableData = []
          this.totalPages = 0
          this.endLoading()
          this.notifyError(err.error.error)
        }
      )
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    changePageData(page) {
      this.getListOTRequest(page, this.size)
      this.page = page
      const roleValue = this.$authInfo.roleValue()
      this.$router.push({
        name: `${roleValue}-request-overtime`,
        query: { page, size: this.size },
      })
    },
    resetUserData() {
      this.request = {
        id: undefined,
        title: '',
        account_sent: '',
        account_receiver: '',
        project: '',
        content: '',
        date_ot: '',
        listUsernameWithOt: [],
      }
    },
    handleCreate() {
      this.addMemberToGroup.checkedMembers = []
      this.dialogMode = 'create'
      this.titlePopup = 'Create OverTime Request'
      this.dialogFormWithInput = true
      this.resetUserData()
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleUpdate(index, row) {
      this.request = Object.assign({}, row)
      this.dialogMode = 'update'
      this.titlePopup = 'Edit OverTime Request'
      this.dialogFormWithInput = true
      this.addMemberToGroup.checkedMembers = [...row.listUsernameWithOt]
      this.rowSelected = index + 1
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleInfo(index, row) {
      this.titlePopup = 'View OverTime Request'
      this.dialogMode = 'detail'
      this.dialogFormWithInput = true
      this.request = Object.assign({}, row)
      this.rowSelected = index + 1
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.$services.request.addOtRequest(
            {
              ...this.request,
              account_sent: this.$authInfo.username(),
              listUsernameWithOt: this.addMemberToGroup.checkedMembers,
            },
            (res) => {
              this.getListOTRequest(this.page, this.size)
              this.dialogFormWithInput = false
              this.addMemberToGroup.checkedMembers = []
              this.notifySuccess(res.message)
            },
            (err) => {
              this.notifyError(err.error.error)
            }
          )
        }
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.startLoading()
          this.$services.request.updateOtRequest(
            {
              ...this.request,
              listUsernameWithOt: this.addMemberToGroup.checkedMembers,
            },
            (res) => {
              this.getListOTRequest(this.page, this.size)
              this.dialogFormWithInput = false
              this.addMemberToGroup.checkedMembers = []
              this.notifySuccess(res.message)
              this.endLoading()
            },
            (err) => {
              this.endLoading()
              this.notifyError(err.error.error)
            }
          )
        }
      })
    },
    handleAccept(index, row) {
      const data = Object.assign({}, row)
      this.rowSelected = index + 1

      this.$services.request.acceptOvertime(
        data,
        (res) => {
          this.notifySuccess(res.message)
          this.getListOTRequest(this.page, this.size)
        },
        (err) => {
          this.notifyError(err.error.error)
        }
      )
    },
    handleReject(index, row) {
      const data = Object.assign({}, row)
      this.dataReject = data
      this.showFormMessage = true
      this.rowSelected = index + 1
    },
    rejectItem() {
      this.$services.request.rejectOvertime(
        { ...this.dataReject, response_msg: this.message.response_msg },
        (res) => {
          this.notifySuccess(res.message)
          this.getListOTRequest(this.page, this.size)
          this.showFormMessage = false
        },
        (err) => {
          this.notifyError(err.error.error)
        }
      )
    },
    handleDelete(index, row) {
      this.$confirm(
        this.$t('This will permanently delete the row data. Continue?'),
        this.$t('Confirm'),
        {
          confirmButtonText: this.$t('OK'),
          cancelButtonText: this.$t('Cancel'),
          type: 'warning',
        }
      ).then(() => {
        this.$services.request.deleteOtRequest(
          row.ot_id,
          (res) => {
            this.tableData.splice(index, 1)
            this.notifySuccess(res.message)
          },
          (err) => {
            this.notifyError(err.error.error)
          }
        )
      })
    },
    handleDeleteMulti() {
      this.$confirm(
        this.$t('This will delete all the row selected. Continue?'),
        this.$t('Confirm'),
        {
          confirmButtonText: this.$t('OK'),
          cancelButtonText: this.$t('Cancel'),
          type: 'warning',
        }
      ).then(() => {
        for (let index = 0; index < this.multipleSelection.length; index++) {
          const element = this.multipleSelection[index]
          this.$services.request.deleteOtRequest(
            element.ot_id,
            (res) => {
              const data = this.tableData.filter(
                (item) => item.ot_id !== element.ot_id
              )
              this.tableData = data
              this.notifySuccess(res.message)
            },
            (err) => {
              this.notifyError(err.error.error)
            }
          )
        }
      })
    },
  },
}
</script>
